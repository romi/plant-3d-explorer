import * as THREE from 'three'

const vertexShader = `
  uniform vec3 color;
  uniform float zoom;

  attribute float value;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = zoom * clamp(1.0 * ( 500.0 / -mvPosition.z ), 0.8, 500.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`
const fragmentShader = `
  varying vec3 vColor;

  void main() {
    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
    gl_FragColor = vec4( vColor, 0.5 );
  }
`

export default class Mesh {
  constructor (geometry, parent) {
    this.geometry = geometry
    this.geometry.computeVertexNormals()

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: { type: 'c', value: new THREE.Color(0x00A960) },
        zoom: { type: 'f', value: 1 }
      },
      vertexShader,
      fragmentShader
    })

    this.object = new THREE.Points(this.geometry, this.material)
    this.object.renderOrder = -1

    if (parent) parent.add(this.object)
    return this
  }

  setPosition (x = 0, y = 0, z = 0) {
    this.object.position.x = x
    this.object.position.y = y
    this.object.position.z = z

    return this
  }

  setVisible (boolean) {
    this.object.visible = boolean
  }

  setZoomLevel (zoomLevel) {
    this.material.uniforms.zoom.value = zoomLevel
  }
}
