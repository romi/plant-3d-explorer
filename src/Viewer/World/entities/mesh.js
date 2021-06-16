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

export default class Mesh {
  constructor (geometry, parent) {
    geometry.computeVertexNormals()

    var op = window.localStorage.getItem('defaultMeshOpacity')
    var col = window.localStorage.getItem('defaultMeshColor')
    const material = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: (op != null) ? op : 0.5,
      color: (col != null) ? col : '#96c0a7',
      flatShading: true,
      metalness: 0.1
    })
    this.object = new THREE.Mesh(geometry, material)
    this.object.castShadow = true
    this.object.receiveShadow = true

    if (parent) parent.add(this.object)
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

  setColor (color) {
    if (color) {
      this.object.material.color = new THREE.Color(color.rgb)
      this.object.material.opacity = color.a
    }
  }
}
