import * as THREE from 'three'

import setLineSegmentsGeometry from 'common/thiers/LineSegmentsGeometry'
import setLineGeometry from 'common/thiers/LineGeometry'
import setLineMaterial from 'common/thiers/LineMaterial'

let EnhancedTHREE
EnhancedTHREE = setLineSegmentsGeometry(THREE)
EnhancedTHREE = setLineGeometry(EnhancedTHREE)
EnhancedTHREE = setLineMaterial(EnhancedTHREE)

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

      this.group.add(
        new THREE.Line(
          geometry,
          new EnhancedTHREE.LineMaterial({
            linewidth: 0.0025,
            vertexColors: THREE.VertexColors,
            dashed: false
          })
        )
      )
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
}
