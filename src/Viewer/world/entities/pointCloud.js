import * as THREE from 'three'

const vertexShader = `
  uniform vec3 color;

  attribute float value;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = clamp(0.8 * ( 500.0 / -mvPosition.z ), 0.8, 500.0);
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
        color: { type: 'c', value: new THREE.Color(0x0077ff) }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: false
    })

    this.object = new THREE.Points(this.geometry, this.material)

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
}
