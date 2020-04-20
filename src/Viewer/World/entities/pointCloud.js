/*

Romi 3D PlantViewer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/
import * as THREE from 'three'

const vertexShader = `
  uniform vec3 color;
  uniform float zoom;
  uniform float ratio;

  attribute float value;
  attribute vec3 customColor;

  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = ratio * zoom * clamp(1.0 * ( 200.0 / -mvPosition.z ), 0.8, 500.0);
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

    const pixelRatio = window.devicePixelRatio
      ? window.devicePixelRatio
      : 1

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        ratio: { type: 'f', value: pixelRatio },
        color: { type: 'c', value: new THREE.Color(0x50cec9) },
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
