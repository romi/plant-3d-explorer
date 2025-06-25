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
import { flatten } from 'lodash'

import setLineSegmentsGeometry from 'common/thiers/LineSegmentsGeometry'
import setLineGeometry from 'common/thiers/LineGeometry'
import setLineMaterial from 'common/thiers/LineMaterial'
import setWireframe2 from 'common/thiers/WireframeGeometry2'
import setLineSegements2 from 'common/thiers/LineSegement2'
import setLine2 from 'common/thiers/Line2'

import { LineRaycast } from 'three-line-raycast'

let EnhancedTHREE
EnhancedTHREE = setLineSegmentsGeometry(THREE)
EnhancedTHREE = setLineGeometry(EnhancedTHREE)
EnhancedTHREE = setLineMaterial(EnhancedTHREE)
EnhancedTHREE = setWireframe2(EnhancedTHREE)
EnhancedTHREE = setLineSegements2(EnhancedTHREE)
EnhancedTHREE = setLine2(EnhancedTHREE)

export default class Angles {
  constructor (angles, parent) {
    var op = window.localStorage.getItem('defaultOrganOpacity')
    var col1 = window.localStorage.getItem('defaultOrgan1Color')
    var col2 = window.localStorage.getItem('defaultOrgan2Color')

    this.group = new THREE.Object3D()
    this.globalColors = [{ rgb: (col1 != null) ? col1 : '#BD10E0', a: (op != null) ? op : 0.5 },
      { rgb: (col2 != null) ? col2 : '#E691F7', a: (op != null) ? op : 0.5 }]

    angles.forEach((points, index) => {
      const geometry = new EnhancedTHREE.LineGeometry()
      geometry.setPositions(flatten(points))

      const color = new THREE.Color(index % 2 === 0
        ? this.globalColors[0].rgb
        : this.globalColors[1].rgb)
      const obj = new EnhancedTHREE.Line2(
        geometry,
        new EnhancedTHREE.LineMaterial({
          linewidth: 10,
          color: index % 2 === 0 ? this.globalColors[0].rgb
            : this.globalColors[1].rgb,
          dashed: false,
          depthTest: false,
          transparent: true,
          opacity: 0.2,
          resolution: { x: window.innerWidth, y: window.innerHeight }
        })
      )
      obj.raycast = LineRaycast
      obj.defaultColor = color
      obj.customColor = null
      obj.computeLineDistances()
      obj.renderOrder = 1

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

  setCustomColors (organColors) {
    this.group.children.forEach((child, index) => {
      if (child !== undefined && child !== null) {
        if (organColors[index]) {
          const matColor = new THREE.Color(organColors[index].rgb)
          child.customColor = matColor
          child.material.color = matColor
          child.material.opacity = organColors[index].a
        } else {
          child.customColor = null
          child.material.opacity =
            this.globalColors[index % 2 ? 1 : 0].a
          child.material.color =
            new THREE.Color(this.globalColors[index % 2 ? 1 : 0].rgb)
        }
      }
    })
  }

  setGlobalColors (globalColors) {
    if (globalColors.length !== 2) return
    this.globalColors = globalColors
    this.group.children.forEach((child, index) => {
      if (!child.customColor) {
        if (index % 2) {
          const color = new THREE.Color(globalColors[1].rgb)
          child.material.color = color
          child.material.opacity = globalColors[1].a
        } else {
          const color = new THREE.Color(globalColors[0].rgb)
          child.material.color = color
          child.material.opacity = globalColors[0].a
        }
      }
    })
  }

  setHighlighted (indexes) {
    const nextIndexed = indexes.reduce((p, c) => {
      return [...p, c, { ...c, index: c.index + 1 }]
    }, [])

    this.group.children.forEach((child, i) => {
      const ref = nextIndexed.find((d) => d.index === i)
      const refIndex = nextIndexed.indexOf(ref)
      child.visible = !!ref

      const defaultColor = new THREE.Color((i % 2)
        ? this.globalColors[1].rgb
        : this.globalColors[0].rgb)

      child.material.color = (ref && refIndex >= 0)
        ? child.customColor
          ? child.customColor
          : defaultColor
        : child.customColor
          ? child.customColor
          : defaultColor
    })
  }
}
