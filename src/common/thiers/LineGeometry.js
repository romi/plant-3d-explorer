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
/* eslint-disable */
export default function (THREE) {
  THREE.LineGeometry = function () {
    THREE.LineSegmentsGeometry.call(this)

    this.type = 'LineGeometry'
  }

  THREE.LineGeometry.prototype = Object.assign(Object.create(THREE.LineSegmentsGeometry.prototype), {

    constructor: THREE.LineGeometry,

    isLineGeometry: true,

    setPositions: function (array) {
      // converts [ x1, y1, z1,  x2, y2, z2, ... ] to pairs format

      var length = array.length - 3
      var points = new Float32Array(2 * length)

      for (var i = 0; i < length; i += 3) {
        points[ 2 * i ] = array[ i ]
        points[ 2 * i + 1 ] = array[ i + 1 ]
        points[ 2 * i + 2 ] = array[ i + 2 ]

        points[ 2 * i + 3 ] = array[ i + 3 ]
        points[ 2 * i + 4 ] = array[ i + 4 ]
        points[ 2 * i + 5 ] = array[ i + 5 ]
      }

      THREE.LineSegmentsGeometry.prototype.setPositions.call(this, points)

      return this
    },

    setColors: function (array) {
      // converts [ r1, g1, b1,  r2, g2, b2, ... ] to pairs format

      var length = array.length - 3
      var colors = new Float32Array(2 * length)

      for (var i = 0; i < length; i += 3) {
        colors[ 2 * i ] = array[ i ]
        colors[ 2 * i + 1 ] = array[ i + 1 ]
        colors[ 2 * i + 2 ] = array[ i + 2 ]

        colors[ 2 * i + 3 ] = array[ i + 3 ]
        colors[ 2 * i + 4 ] = array[ i + 4 ]
        colors[ 2 * i + 5 ] = array[ i + 5 ]
      }

      THREE.LineSegmentsGeometry.prototype.setColors.call(this, colors)

      return this
    },

    fromLine: function (line) {
      var geometry = line.geometry

      if (geometry.isGeometry) {
        this.setPositions(geometry.vertices)
      } else if (geometry.isBufferGeometry) {
        this.setPositions(geometry.position.array) // assumes non-indexed
      }

      // set colors, maybe

      return this
    },

    copy: function (source) {
      // todo

      return this
    }

  })
  return THREE
}
