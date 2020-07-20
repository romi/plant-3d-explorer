import * as THREE from 'three'
import PointCloud from './pointCloud'

const vertexShader = `
  uniform float zoom;
  uniform float ratio;

  attribute float value;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vColor = customColor;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = ratio * zoom * clamp(1.0 * (200.0 / -mvPosition.z ), 0.8,
    500.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export default class SegmentedPointCloud extends PointCloud {
  constructor (geometry, segmentation, uniqueLabels, parent) {
    super(geometry, parent)

    const labelNumbers = segmentation.labels.map((d) => {
      return uniqueLabels.indexOf(d)
    })
    this.labelNumbers = labelNumbers
    this.uniqueLabels = uniqueLabels

    // Set default colors
    const defaultColors = uniqueLabels.map((_, i) => {
      return 'hsl(' + Math.round((360 / uniqueLabels.length) *
        i) + ', 100%, 50%)'
    })
    this.colors = defaultColors

    let color = new THREE.Color(0xffffff)
    this.colorsArray = new Float32Array(segmentation.labels.length * 3)
    labelNumbers.forEach((elem, i) => {
      color.set(defaultColors[elem])
      color.toArray(this.colorsArray, i * 3)
    })

    // Change material to use customColor
    this.object.material.setValues({ vertexShader: vertexShader })
    this.geometry.addAttribute('customColor',
      new THREE.BufferAttribute(this.colorsArray, 3))

    // Transform positions to vector 3 for practical reasons
    this.positions = []
    this.geometry.attributes.position.array.forEach(
      (d, i, array) => {
        if (i % 3 === 0) {
          this.positions.push(new THREE.Vector3(d, array[i + 1], array[i + 2]))
        }
      }
    )
  }

  getColors () {
    return this.colors
  }

  setColor (colors) {
    window.clearTimeout(this.timeoutFunction)
    if (colors && colors.length === this.colors.length) {
      this.colors = colors
      this.timeoutFunction = setTimeout(() => { this.refreshColors() }, 500)
    }
  }

  setLabels (label, points) {
    const number = this.uniqueLabels.indexOf(label)
    points.forEach((d) => {
      this.labelNumbers[d] = number
    })

    this.refreshColors()
  }

  selectSphere (point) {
  }

  selectSameLabel (point) {
    const num = this.labelNumbers[point]
    return this.labelNumbers.map((d, i) => {
      return d === num ? i : null
    })
  }

  selectByProximity (clickedPoint) {
    /* Recursive helper function that selects all points of the same label
        from a point by creating a sphere around it with only points of the
        same label inside of it. This process is repeated for the 6 points in
        the sphere that are the farthest from the center, until no point is
        added to the set. */
    const maxSphere = (point, set) => {
      let minDist = +Infinity
      let max = { x: 0, y: 0, z: 0 }
      let min = { x: +Infinity, y: +Infinity, z: +Infinity }
      let nextPointsMax = { x: 0, y: 0, z: 0 }
      let nextPointsMin = { x: 0, y: 0, z: 0 }
      const num = this.labelNumbers[point]
      this.positions.forEach((d, i, array) => {
        if (i !== point && this.labelNumbers[i] !== num) {
          const dist = array[point].distanceTo(d)
          if (dist < minDist) {
            minDist = dist
          }
        }
      })
      const oldLength = set.size
      this.positions.forEach((d, i, array) => {
        const dist = d.distanceTo(array[point])
        if (this.labelNumbers[i] === num && (dist < minDist)) {
          set.add(i)
          for (let key in max) {
            if (d[key] > max[key]) {
              max[key] = d[key]
              nextPointsMax[key] = i
            }

            if (d[key] < min[key]) {
              min[key] = d[key]
              nextPointsMin[key] = i
            }
          }
        }
      })
      if (oldLength !== set.size) {
        for (let key in nextPointsMax) {
          maxSphere(nextPointsMax[key], set)
          maxSphere(nextPointsMin[key], set)
        }
      }
    }
    let set = new Set()
    maxSphere(clickedPoint, set)
    return [...set]
  }

  refreshColors () {
    let color = new THREE.Color(0xffffff)
    this.colorsArray = new Float32Array(this.labelNumbers.length * 3)
    this.labelNumbers.forEach((elem, i) => {
      color.set(this.colors[elem])
      color.toArray(this.colorsArray, i * 3)
    })
    this.geometry.removeAttribute('customColor')
    this.geometry.addAttribute('customColor',
      new THREE.BufferAttribute(this.colorsArray, 3))
  }1
}
