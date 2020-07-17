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

  selectByProximity (point) {
    console.log('ok, got ', point)
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
