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
  THREE.LineSegments2 = function (geometry, material) {
    THREE.Mesh.call(this)

    this.type = 'LineSegments2'

    this.geometry = geometry !== undefined ? geometry : new THREE.LineSegmentsGeometry()
    this.material = material !== undefined ? material : new THREE.LineMaterial({ color: Math.random() * 0xffffff })
  }

  THREE.LineSegments2.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {

    constructor: THREE.LineSegments2,

    isLineSegments2: true,

    computeLineDistances: (function () { // for backwards-compatability, but could be a method of LineSegmentsGeometry...
      var start = new THREE.Vector3()
      var end = new THREE.Vector3()

      return function computeLineDistances () {
        var geometry = this.geometry

        var instanceStart = geometry.attributes.instanceStart
        var instanceEnd = geometry.attributes.instanceEnd
        var lineDistances = new Float32Array(2 * instanceStart.data.count)

        for (var i = 0, j = 0, l = instanceStart.data.count; i < l; i++, j += 2) {
          start.fromBufferAttribute(instanceStart, i)
          end.fromBufferAttribute(instanceEnd, i)

          lineDistances[ j ] = (j === 0) ? 0 : lineDistances[ j - 1 ]
          lineDistances[ j + 1 ] = lineDistances[ j ] + start.distanceTo(end)
        }

        var instanceDistanceBuffer = new THREE.InstancedInterleavedBuffer(lineDistances, 2, 1) // d0, d1

        geometry.addAttribute('instanceDistanceStart', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 0)) // d0
        geometry.addAttribute('instanceDistanceEnd', new THREE.InterleavedBufferAttribute(instanceDistanceBuffer, 1, 1)) // d1

        return this
      }
    }()),

    copy: function (source) {
      // todo

      return this
    }

  })

  return THREE
}
