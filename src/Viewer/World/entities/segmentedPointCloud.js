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
  constructor (geometry, parent, segmentation = null, uniqueLabels = null) {
    super(geometry, parent)

    const labelNumbers = segmentation.labels.map((d) => {
      return uniqueLabels.indexOf(d)
    })
    this.labelNumbers = labelNumbers
    this.uniqueLabels = uniqueLabels

    function hslToHex (h, s, l) {
      l /= 100
      const a = s * Math.min(l, 1 - l) / 100
      const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0') // convert to Hex and prefix "0" if needed
      }
      return `#${f(0)}${f(8)}${f(4)}`
    }

    // Set default colors
    var col = JSON.parse(window.localStorage.getItem('defaultSegmentedColors'))
    const defaultColors = uniqueLabels.map((_, i) => {
      if (col != null && col[i] != null) {
        return col[i]
      } else {
        return hslToHex(Math.round((360 / uniqueLabels.length) * i), 100, 50)
      }
    })
    this.selectionColor = new THREE.Color(0.7, 0.7, 1)
    this.colors = defaultColors

    let color = new THREE.Color(0xffffff)
    this.colorsArray = new Float32Array(segmentation.labels.length * 3)
    labelNumbers.forEach((elem, i) => {
      color.set(defaultColors[elem])
      color.toArray(this.colorsArray, i * 3)
    })

    // Change material to use customColor
    this.object.material.setValues({ vertexShader: vertexShader })
    const attr = new THREE.BufferAttribute(this.colorsArray, 3)
    this.geometry.setAttribute('customColor', attr)
    this.colorVectors = this.bufferToVector3(attr);

    this.colorVectors = this.bufferToVector3(this.geometry.getAttribute('customColor'))

  }

  setCloudResolution(sampleSize) {
    super.setCloudResolution(sampleSize)
    this.object.material.setValues({ vertexShader: vertexShader })
  }

  colorSelectedPoints (selection) {
    selection.forEach((d) => {
      this.selectionColor.toArray(this.colorsArray, d * 3)
    })
    this.geometry.removeAttribute('customColor')
    this.geometry.addAttribute('customColor',
      new THREE.BufferAttribute(this.colorsArray, 3))
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

  getPointPos (point) {
    return this.object.localToWorld(this.vertices[point].clone())
  }

  selectBySphere (base, point) {
    const origin = this.vertices[base]
    const dist = origin.distanceTo(this.vertices[point])
    let result = []
    this.vertices.forEach((d, i) => {
      if (d.distanceTo(origin) <= dist) {
        result.push(i)
      }
    })
    return result
  }

  selectSameLabel (point) {
    const num = this.labelNumbers[point]
    const res = this.labelNumbers.map((d, i) => {
      return d === num ? i : null
    })
    return res
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
      this.vertices.forEach((d, i, array) => {
        if (i !== point && this.labelNumbers[i] !== num) {
          const dist = array[point].distanceTo(d)
          if (dist < minDist) {
            minDist = dist
          }
        }
      })
      const oldLength = set.size
      this.vertices.forEach((d, i, array) => {
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
    const res = [...set]
    return res
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
