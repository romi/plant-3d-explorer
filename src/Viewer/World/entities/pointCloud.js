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
import { isEqual, uniq } from "lodash";
import * as THREE from "three";
import Object3DBase from "./Object3DBase";

const vertexShader = `
  uniform float zoom;
  uniform float ratio;

  attribute vec3 color;
  attribute float value;

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
    console.log(this.settings)
    const pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1;
    const cloudSize = this.geometry.getAttribute('position').count
    this.permutation = this.getRandomSampleOfIndicesFromSize(cloudSize, cloudSize);

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        opacity: { value: this.settings.opacity},
        ratio: { type: "f", value: pixelRatio },
        zoom: { type: "f", value: this.settings.zoom },
      },
      vertexShader,
      fragmentShader,
    });

    this.selectionColor = new THREE.Color(0.7, 0.7, 1);

    // If there is a segmentation for this point cloud
    if(segmentation !== null && uniqueLabels !== null)
    {
      const labelNumbers = segmentation.labels.map((d) => {
        return uniqueLabels.indexOf(d)
      })

      this.labelNumbers = labelNumbers
      this.uniqueLabels = uniqueLabels
  
      const defaultColors = uniqueLabels.map((val) => this.settings.colors[val])
      this.colors = defaultColors
  
      let color = new THREE.Color(0xffffff)
      this.colorsArray = new Float32Array(segmentation.labels.length * 3)
      labelNumbers.forEach((elem, i) => {
        color.set(defaultColors[elem])
        color.toArray(this.colorsArray, i * 3)
      })
    } else
    {
      console.log(this.geometry)
      this.colorsArray = new Float32Array(this.geometry.attributes.position.array.length);
      const color = new THREE.Color(this.settings.color)
      for(let pt = 0; pt < this.geometry.attributes.position.count; pt++)
        color.toArray(this.colorsArray, pt * 3)
    }
    const attr = new THREE.BufferAttribute(this.colorsArray, 3)
    this.geometry.setAttribute('color', attr)

    // This is kinda ugly but it aims to be explicit. 
    //
    let pos = this.geometry.getAttribute('position');
    let col = this.geometry.getAttribute('color')
    for (let i = 0; i < pos.count; i++) {
      // Swapping position according to the randomized set
      const newX = pos.array[this.permutation[i] * 3];
      const newY = pos.array[this.permutation[i] * 3 + 1];
      const newZ = pos.array[this.permutation[i] * 3 + 2];
      pos.array[this.permutation[i] * 3] = pos.array[i * 3];
      pos.array[this.permutation[i] * 3 + 1] = pos.array[i * 3 + 1];
      pos.array[this.permutation[i] * 3 + 2] = pos.array[i * 3 + 2];
      pos.array[i * 3] = newX;
      pos.array[i * 3 + 1] = newY;
      pos.array[i * 3 + 2] = newZ;

      // Swapping colors according to the randomized set
      const newR = col.array[this.permutation[i] * 3];
      const newG = col.array[this.permutation[i] * 3 + 1];
      const newB = col.array[this.permutation[i] * 3 + 2];
      col.array[this.permutation[i] * 3] = col.array[i * 3];
      col.array[this.permutation[i] * 3 + 1] = col.array[i * 3 + 1];
      col.array[this.permutation[i] * 3 + 2] = col.array[i * 3 + 2];
      col.array[i * 3] = newR;
      col.array[i * 3 + 1] = newG;
      col.array[i * 3 + 2] = newB;

      // Now that we moved points around, labels are wrong, we're fixing that here
      if(segmentation)
      {
        const newLabel = this.labelNumbers[this.permutation[i]]
        this.labelNumbers[this.permutation[i]] = this.labelNumbers[i];
        this.labelNumbers[i] = newLabel;

      }
    }
    this.vertices = this.bufferToVector3(pos);
    this.colorVectors = this.bufferToVector3(col);
    this.geometry.computeVertexNormals();

    this.object = new THREE.Points(this.geometry, this.material);
    this.object.renderOrder = -1;

    this.setCloudResolution(this.settings.density)

    if (parent) parent.add(this.object);
    return this;
  }

  setSettings(settings)
  {
    console.log(settings)
    if(!(this.labelNumbers && this.uniqueLabels) && this.settings.color !== settings.color)
      this.material.uniforms.color.value = new THREE.Color(settings.color);
    if (!(this.labelNumbers && this.uniqueLabels) && !isEqual(this.settings.colors, settings.colors))
      this.setColor(settings.colors)
    if(this.settings.opacity !== settings.opacity)
      this.material.uniforms.opacity.value = settings.opacity;
    if(this.settings.zoom !== settings.zoom)
      this.material.uniforms.zoom.value = settings.zoom
    if(this.settings.density !== settings.density)
      this.setCloudResolution(settings.density)

    this.settings = settings;
  }

  getColors () {
    return this.colors
  }

  setColor (colors) {
    window.clearTimeout(this.timeoutFunction)
    colors = Object.keys(colors).reduce((acc, val) => {acc.push(colors[val]); return acc;}, [])
    if (colors && colors.length === this.colors.length) {
      this.colors = colors
      this.timeoutFunction = setTimeout(() => { this.refreshColors() }, 500)
    }
  }

  refreshColors()
  {
    let color = new THREE.Color(0xffffff)
    this.colorsArray = new Float32Array(this.labelNumbers.length * 3)
    this.labelNumbers.forEach((elem, i) => {
      color.set(this.colors[elem])
      color.toArray(this.colorsArray, i * 3)
    })
    this.geometry.removeAttribute('color')
    this.geometry.setAttribute('color',
      new THREE.BufferAttribute(this.colorsArray, 3))
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

  setCloudResolution(sampleSize) {
    sampleSize = Math.round(sampleSize * this.vertices.length);
    this.geometry.setDrawRange(0, sampleSize);
  }

  getRandomSampleOfIndicesFromSize(indicesRange, sampleSize) {
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
}
