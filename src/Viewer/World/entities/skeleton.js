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

import setLineSegmentsGeometry from 'common/thiers/LineSegmentsGeometry'
import setLineGeometry from 'common/thiers/LineGeometry'
import setLineMaterial from 'common/thiers/LineMaterial'
import setWireframe2 from 'common/thiers/WireframeGeometry2'
import setLineSegements2 from 'common/thiers/LineSegement2'
import setLine2 from 'common/thiers/Line2'

let EnhancedTHREE
EnhancedTHREE = setLineSegmentsGeometry(THREE)
EnhancedTHREE = setLineGeometry(EnhancedTHREE)
EnhancedTHREE = setLineMaterial(EnhancedTHREE)
EnhancedTHREE = setWireframe2(EnhancedTHREE)
EnhancedTHREE = setLineSegements2(EnhancedTHREE)
EnhancedTHREE = setLine2(EnhancedTHREE)

export default class Skeleton {
  constructor (skeleton, parent) {
    this.group = new THREE.Object3D()

    skeleton.lines.forEach(([startIndex, endIndex]) => {
      const geometry = new EnhancedTHREE.LineGeometry()
      const positions = [
        ...skeleton.points[startIndex],
        ...skeleton.points[endIndex]
      ]
      const colors = [
        82, 211, 154,
        82, 211, 154
      ].map((d) => (d / 255) - 0.3)
      geometry.setPositions(positions)
      geometry.setColors(colors)

      const obj = new EnhancedTHREE.Line2(
        geometry,
        new EnhancedTHREE.LineMaterial({
          linewidth: 4,
          color: 0x5ca001,
          transparent: true,
          opacity: 1,
          dashed: true,
          resolution: { x: window.innerWidth, y: window.innerHeight }
        })
      )
      this.group.add(obj)
    })

    if (parent) parent.add(this.group)
  }

  setPosition (x = 0, y = 0, z = 0) {
    this.object.position.x = x
    this.object.position.y = y
    this.object.position.z = z

    return this
  }

  setVisible (boolean) {
    this.group.children.forEach((child) => {
      child.visible = boolean
    })
  }

  setColor (color) {
    this.group.children.forEach((child) => {
      child.material.color = new THREE.Color(color.rgb)
      child.material.opacity = color.a
    })
  }
}
