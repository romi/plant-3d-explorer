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
import { flatten } from 'lodash'

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

function createGrid (width, height, step = 10) {
  const spaceX = width / step
  const spaceY = height / step
  const lines = []

  Array(step + 1).fill().forEach((_, i) => {
    lines.push([
      [(-width * 0.5) + i * spaceX, -height * 0.5, 0],
      [(-width * 0.5) + i * spaceX, height * 0.5, 0]
    ])
  })

  Array(step + 1).fill().forEach((_, i) => {
    lines.push([
      [-width * 0.5, (-height * 0.5) + i * spaceY, 0],
      [width * 0.5, (-height * 0.5) + i * spaceY, 0]
    ])
  })

  return lines
}

function cornerPoints ({ width, height, depth }) {
  const length = 15

  return [
    ...[
      [
        [-width * 0.5, -height * 0.5, -depth],
        [-width * 0.5 + length, -height * 0.5, -depth]
      ],
      [
        [-width * 0.5, -height * 0.5, -depth],
        [-width * 0.5, -height * 0.5 + length, -depth]
      ],
      [
        [-width * 0.5, -height * 0.5, -depth],
        [-width * 0.5, -height * 0.5, -depth + length]
      ]
    ],
    ...[
      [
        [width * 0.5, -height * 0.5, -depth],
        [width * 0.5 - length, -height * 0.5, -depth]
      ],
      [
        [width * 0.5, -height * 0.5, -depth],
        [width * 0.5, -height * 0.5 + length, -depth]
      ],
      [
        [width * 0.5, -height * 0.5, -depth],
        [width * 0.5, -height * 0.5, -depth + length]
      ]
    ],
    ...[
      [
        [-width * 0.5, height * 0.5, -depth],
        [-width * 0.5 + length, height * 0.5, -depth]
      ],
      [
        [-width * 0.5, height * 0.5, -depth],
        [-width * 0.5, height * 0.5 - length, -depth]
      ],
      [
        [-width * 0.5, height * 0.5, -depth],
        [-width * 0.5, height * 0.5, -depth + length]
      ]
    ],
    ...[
      [
        [width * 0.5, height * 0.5, -depth],
        [width * 0.5 - length, height * 0.5, -depth]
      ],
      [
        [width * 0.5, height * 0.5, -depth],
        [width * 0.5, height * 0.5 - length, -depth]
      ],
      [
        [width * 0.5, height * 0.5, -depth],
        [width * 0.5, height * 0.5, -depth + length]
      ]
    ],

    ...[
      [
        [-width * 0.5, -height * 0.5, 0],
        [-width * 0.5 + length, -height * 0.5, 0]
      ],
      [
        [-width * 0.5, -height * 0.5, 0],
        [-width * 0.5, -height * 0.5 + length, 0]
      ],
      [
        [-width * 0.5, -height * 0.5, 0],
        [-width * 0.5, -height * 0.5, 0 - length]
      ]
    ],
    ...[
      [
        [width * 0.5, -height * 0.5, 0],
        [width * 0.5 - length, -height * 0.5, 0]
      ],
      [
        [width * 0.5, -height * 0.5, 0],
        [width * 0.5, -height * 0.5 + length, 0]
      ],
      [
        [width * 0.5, -height * 0.5, 0],
        [width * 0.5, -height * 0.5, 0 - length]
      ]
    ],
    ...[
      [
        [-width * 0.5, height * 0.5, 0],
        [-width * 0.5 + length, height * 0.5, 0]
      ],
      [
        [-width * 0.5, height * 0.5, 0],
        [-width * 0.5, height * 0.5 - length, 0]
      ],
      [
        [-width * 0.5, height * 0.5, 0],
        [-width * 0.5, height * 0.5, 0 - length]
      ]
    ],
    ...[
      [
        [width * 0.5, height * 0.5, 0],
        [width * 0.5 - length, height * 0.5, 0]
      ],
      [
        [width * 0.5, height * 0.5, 0],
        [width * 0.5, height * 0.5 - length, 0]
      ],
      [
        [width * 0.5, height * 0.5, 0],
        [width * 0.5, height * 0.5, 0 - length]
      ]
    ]
  ]
}

function createLines (lines, gridMaterial, group) {
  lines.forEach((points) => {
    const geometry = new EnhancedTHREE.LineGeometry()
    geometry.setPositions(flatten(points))

    const obj = new EnhancedTHREE.Line2(
      geometry,
      gridMaterial
    )
    obj.computeLineDistances()

    group.add(obj)
  })
}

export default class Workspace {
  constructor (workspace, parent) {
    this.group = new THREE.Object3D()
    const sizes = {
      width: (workspace.x[1] - workspace.x[0]),
      height: (workspace.y[1] - workspace.y[0]),
      depth: (workspace.z[1] - workspace.z[0])
    }

    createLines(
      createGrid(sizes.width, sizes.height),
      new EnhancedTHREE.LineMaterial({
        linewidth: 0.001,
        color: 0xC9C9C9,
        transparent: true,
        opacity: 0.2
      }),
      this.group
    )

    createLines(
      cornerPoints(sizes),
      new EnhancedTHREE.LineMaterial({
        linewidth: 0.0015,
        color: 0xa1a5a7,
        transparent: true,
        opacity: 0.2
      }),
      this.group
    )

    
    this.group.position.x = (workspace.x[1] + workspace.x[0]) / 2
    this.group.position.y = (workspace.y[1] + workspace.y[0]) / 2
    this.group.position.z = (workspace.z[1] + workspace.z[0]) / 2 + sizes.depth * 0.5
    
    this.group.add(new THREE.AxesHelper(Math.min(sizes.width,sizes.height, sizes.width)/2))
    if (parent) parent.add(this.group)
  }
}
