/*

Plant 3D Explorer: An browser application for 3D scanned
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
  uniform float opacity;

  void main() {
    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
    gl_FragColor = vec4( vColor, opacity );
  }
`

export default class PointCloud {
  constructor (geometry, parent) {
    this.vertices = []
    this.geometry = geometry
    this.computeVerticesPositionFromBufferGeometry(geometry);
    this.geometry.computeVertexNormals()

    const pixelRatio = window.devicePixelRatio
      ? window.devicePixelRatio
      : 1

    var opacity = window.localStorage.getItem('defaultPointCloudOpacity')
    var color = window.localStorage.getItem('defaultPointCloudColor')
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: (opacity != null) ? parseFloat(opacity) : 1 },
        ratio: { type: 'f', value: pixelRatio },
        color: { type: 'c', value: (color != null) ? new THREE.Color(color) : new THREE.Color('#f8de96') },
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

  computeVerticesPositionFromBufferGeometry(geometry)
  {
    const position = geometry.getAttribute('position');
    let vertices = Array.apply(null, Array(position.count)).map(function () { return new THREE.Vector3(); });
    for(let v = 0; v < position.count; v++)
      vertices[v].fromBufferAttribute(position, v);

    this.vertices = vertices;
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

  setColor (color) {
    if (color && color.rgb && color.a) {
      this.material.uniforms.color.value = new THREE.Color(color.rgb)
      this.material.uniforms.opacity.value = color.a
    }
  }
  // setCloudResolution(sampleSize) {
  // }

  setCloudResolution(sampleSize) {
    sampleSize = sampleSize ? sampleSize : 10000;

    // 
    // Direct implementation from the PCL pcl::RandomSample
    // See : https://github.com/PointCloudLibrary/pcl/blob/master/filters/src/random_sample.cpp
    // lines 122-147
    // 
    if (this.vertices.length < sampleSize)
      return;
    const indices_ = Array.apply(null, Array(this.vertices.length)).map(function (x, i) { return i; })
    let N = this.vertices.length // TODO extract number of points
    let indices = Array.apply(null, Array(sampleSize)).map(function (x,i) {return -1;})
    console.log(sampleSize)
    let i = 0;
    let index = 0;
    let n = sampleSize;
    while (n > 0)
    {
      // Step 1: [Generate U.] Generate a random variate U that is uniformly distributed between 0 and 1.
      const U = Math.random();
      // Step 2: [Test.] If N * U > n, go to Step 4.
      if ((N * U) <= n)
      {
        // Step 3: [Select.] Select the next record in the file for the sample, and set n : = n - 1.

        indices[i++] = indices_[index];
        --n;
      }
      // Step 4: [Don't select.] Skip over the next record (do not include it in the sample).
      // Set N : = N - 1.
      --N;
      ++index;
      // If n > 0, then return to Step 1; otherwise, the sample is complete and the algorithm terminates.
    }

    const selected_vertices = indices.map(i => this.vertices[i])
    console.log(selected_vertices)
    const newGeometry = new THREE.BufferGeometry().setFromPoints(selected_vertices)
    newGeometry.computeBoundingBox()
    newGeometry.computeVertexNormals()
    this.object.geometry.copy(newGeometry)
    return this
  }
}
