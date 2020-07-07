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
  constructor (geometry, segmentation, parent) {
    super(geometry, parent)

    const uniqueLabels = segmentation.labels.filter(
      (value, index, self) => self.indexOf(value) === index
    )

    const labelNumbers = segmentation.labels.map((d) => {
      return uniqueLabels.indexOf(d)
    })

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
}
