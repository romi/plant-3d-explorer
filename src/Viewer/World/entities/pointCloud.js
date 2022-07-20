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
import * as THREE from "three";
import Object3DBase from "./Object3DBase";

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
`;

const fragmentShader = `
  varying vec3 vColor;
  uniform float opacity;

  void main() {
    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
    gl_FragColor = vec4( vColor, opacity );
  }
`;

export default class PointCloud extends Object3DBase {
  constructor(geometry, parent, settings, segmentation = null, uniqueLabels = null) {
    super(parent, geometry, settings)
    if(segmentation && uniqueLabels)
    {
      
    }
    this.vertices = this.bufferToVector3(this.geometry.getAttribute("position"));
    this.geometry.computeVertexNormals();
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: this.settings.opacity},
        ratio: { type: "f", value: pixelRatio },
        color: {
          type: "c",
          value: new THREE.Color(this.settings.color),
        },
        zoom: { type: "f", value: 1 },
      },
      vertexShader,
      fragmentShader,
    });

    this.object = new THREE.Points(this.geometry, this.material);
    this.object.renderOrder = -1;

    if (parent) parent.add(this.object);
    return this;
  }

  setSettings(settings)
  {
    if(this.settings.color !== settings.color)
      this.material.uniforms.color.value = new THREE.Color(settings.color);
    if(this.settings.opacity !== settings.opacity)
      this.material.uniforms.opacity.value = settings.opacity;
    if(this.settings.zoom !== settings.zoom)
      this.material.uniforms.zoom.value = settings.zoom

    super.setSettings(settings)
  }

  bufferToVector3(attribute) {
    const values = attribute;
    let vectors = Array.from(
      { length: attribute.count },
      () => new THREE.Vector3()
    );
    for (let v = 0; v < values.count; v++)
      vectors[v].fromBufferAttribute(values, v);

    return vectors;
  }

  setPosition(x = 0, y = 0, z = 0) {
    this.object.position.x = x;
    this.object.position.y = y;
    this.object.position.z = z;

    return this;
  }

  setVisible(boolean) {
    this.object.visible = boolean;
  }

  setZoomLevel(zoomLevel) {
    this.material.uniforms.zoom.value = zoomLevel;
  }

  setColor(color) {
    this.material.uniforms.color.value = new THREE.Color(color.rgb);
    this.material.uniforms.opacity.value = color.a;
  }
  // setCloudResolution(sampleSize) {
  // }

  getRandomSampleOfIndicesFromSize(indicesRange, sampleSize) {
    if (this.vertices.length < sampleSize) return;
    const indices_ = Array.from({ length: indicesRange }, (x, i) => i);
    let N = indicesRange;
    let indices = Array.from({ length: sampleSize }, (x, i) => -1);
    let i = 0;

    let index = 0;
    let n = sampleSize;
    while (n > 0) {
      // Step 1: [Generate U.] Generate a random variate U that is uniformly distributed between 0 and 1.
      const U = Math.random();
      // Step 2: [Test.] If N * U > n, go to Step 4.
      if (N * U <= n) {
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

    return indices;
  }

  setCloudResolution(sampleSize) {
    sampleSize = Math.round(sampleSize * this.vertices.length);
    const indices = this.getRandomSampleOfIndicesFromSize(
      this.vertices.length,
      sampleSize
    );

    for (const key in this.geometry.attributes) {
      let attr = this.geometry.getAttribute(key);
      for (let i = 0; i < sampleSize; i++) {
        const newX = attr.array[indices[i] * 3];
        const newY = attr.array[indices[i] * 3 + 1];
        const newZ = attr.array[indices[i] * 3 + 2];

        attr.array[indices[i] * 3] = attr.array[i * 3];
        attr.array[indices[i] * 3 + 1] = attr.array[i * 3 + 1];
        attr.array[indices[i] * 3 + 2] = attr.array[i * 3 + 2];

        attr.array[i * 3] = newX;
        attr.array[i * 3 + 1] = newY;
        attr.array[i * 3 + 2] = newZ;
      }
      attr.needsUpdate = true;
    }

    this.geometry.setDrawRange(0, sampleSize);
  }
}
