/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

/**
 * The GLSL shader code for the vertex shader used in a WebGL or Three.js rendering pipeline.
 *
 * This shader defines various uniform and attribute variables that control the appearance and behavior
 * of rendering points in 3D space. It computes the size and position of the point primitives rendered
 * on the screen, while also passing color information to the fragment shader for further processing.
 *
 * Uniforms:
 * - color: A vec3 representing the base color to be used for rendering.
 * - zoom: A float representing the zoom factor to scale the size of points.
 * - ratio: A float that defines the ratio to scale the point size.
 *
 * Attributes:
 * - value: A float attribute representing a custom value assigned to each vertex (not used directly in this shader).
 * - customColor: A vec3 attribute representing custom color values for each vertex (not used directly in this shader).
 *
 * Varyings:
 * - vColor: A vec3 passed to the fragment shader, initialized with the uniform base color.
 *
 * Main Function:
 * - Computes vColor using the uniform color.
 * - Calculates mvPosition as the model-view transformation of the vertex position.
 * - Computes gl_PointSize based on zoom, ratio, and a clamped distance factor.
 * - Determines gl_Position as the projection of the transformed model-view position.
 */
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

/**
 * GLSL fragment shader code as a template literal string.
 *
 * This fragment shader is used to render point sprites with a circular appearance
 * by discarding fragments outside a circular shape. It also applies a color and
 * opacity to the sprites.
 *
 * Variables:
 * - `vColor`: A varying vector passed from the vertex shader representing the color
 *    of the fragment.
 * - `opacity`: A uniform float value representing the transparency level of the sprite.
 *
 * The `main` function:
 * - Discards fragments outside the circular area by checking the distance from
 *   the center of the point (gl_PointCoord) to the edges.
 * - Sets the fragment color using the `vColor` and `opacity` values.
 */
const fragmentShader = `
  varying vec3 vColor;
  uniform float opacity;

  void main() {
    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
    gl_FragColor = vec4( vColor, opacity );
  }
`

/**
 * The PointCloud class is used to generate and manipulate a point cloud
 * geometry, including rendering options, positions, visibility, and other
 * configurable properties using Three.js.
 */
export default class PointCloud {
  constructor (geometry, parent) {
    this.geometry = geometry
    this.vertices = this.bufferToVector3(geometry.getAttribute('position'))
    this.geometry.computeVertexNormals()
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1

    var opacity = window.localStorage.getItem('defaultPointCloudOpacity')
    var color = window.localStorage.getItem('defaultPointCloudColor')
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: opacity != null ? parseFloat(opacity) : 1 },
        ratio: { type: 'f', value: pixelRatio },
        color: {
          type: 'c',
          value:
            color != null ? new THREE.Color(color) : new THREE.Color('#f8de96')
        },
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

  bufferToVector3 (attribute) {
    const values = attribute
    let vectors = Array.from(
      { length: attribute.count },
      () => new THREE.Vector3()
    )
    for (let v = 0; v < values.count; v++) { vectors[v].fromBufferAttribute(values, v) }

    return vectors
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

  getRandomSampleOfIndicesFromSize (indicesRange, sampleSize) {
    if (this.vertices.length < sampleSize) return
    const indices_ = Array.from({ length: indicesRange }, (x, i) => i)
    let N = indicesRange
    let indices = Array.from({ length: sampleSize }, (x, i) => -1)
    let i = 0

    let index = 0
    let n = sampleSize
    while (n > 0) {
      // Step 1: [Generate U.] Generate a random variate U that is uniformly distributed between 0 and 1.
      const U = Math.random()
      // Step 2: [Test.] If N * U > n, go to Step 4.
      if (N * U <= n) {
        // Step 3: [Select.] Select the next record in the file for the sample, and set n : = n - 1.

        indices[i++] = indices_[index]
        --n
      }
      // Step 4: [Don't select.] Skip over the next record (do not include it in the sample).
      // Set N : = N - 1.
      --N
      ++index
      // If n > 0, then return to Step 1; otherwise, the sample is complete and the algorithm terminates.
    }

    return indices
  }

  setCloudResolution (sampleSize) {
    sampleSize = Math.round(sampleSize * this.vertices.length)
    console.log(sampleSize)
    const indices = this.getRandomSampleOfIndicesFromSize(
      this.vertices.length,
      sampleSize
    )

    for (const key in this.geometry.attributes) {
      let attr = this.geometry.getAttribute(key)
      for (let i = 0; i < sampleSize; i++) {
        const newX = attr.array[indices[i] * 3]
        const newY = attr.array[indices[i] * 3 + 1]
        const newZ = attr.array[indices[i] * 3 + 2]

        attr.array[indices[i] * 3] = attr.array[i * 3]
        attr.array[indices[i] * 3 + 1] = attr.array[i * 3 + 1]
        attr.array[indices[i] * 3 + 2] = attr.array[i * 3 + 2]

        attr.array[i * 3] = newX
        attr.array[i * 3 + 1] = newY
        attr.array[i * 3 + 2] = newZ
      }
      attr.needsUpdate = true
    }

    this.geometry.setDrawRange(0, sampleSize)
  }
}
