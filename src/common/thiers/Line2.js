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
export default function (THREE) {
  /**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

  THREE.Line2 = function (geometry, material) {
    THREE.LineSegments2.call(this)

    this.type = 'Line2'

    this.geometry = geometry !== undefined ? geometry : new THREE.LineGeometry()
    this.material = material !== undefined ? material : new THREE.LineMaterial({ color: Math.random() * 0xffffff })
  }

  THREE.Line2.prototype = Object.assign(Object.create(THREE.LineSegments2.prototype), {

    constructor: THREE.Line2,

    isLine2: true,

    copy: function (source) {
      // todo

      return this
    }

  })

  return THREE
}
