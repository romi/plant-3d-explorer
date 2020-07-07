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

    // Change material to use customColor
    this.object.material.setValues({ vertexShader: vertexShader })
  }
}
