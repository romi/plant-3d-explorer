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
/**
 * @author WestLangley / http://github.com/WestLangley
 *
 */

export default function (THREE) {
  THREE.WireframeGeometry2 = function (geometry) {
    THREE.LineSegmentsGeometry.call(this)

    this.type = 'WireframeGeometry2'

    this.fromWireframeGeometry(new THREE.WireframeGeometry(geometry))

    // set colors, maybe
  }

  THREE.WireframeGeometry2.prototype = Object.assign(Object.create(THREE.LineSegmentsGeometry.prototype), {

    constructor: THREE.WireframeGeometry2,

    isWireframeGeometry2: true,

    copy: function (source) {
      // todo

      return this
    }

  })
  return THREE
}
