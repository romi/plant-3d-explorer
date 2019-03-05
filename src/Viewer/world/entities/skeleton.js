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
          linewidth: 0.0025,
          color: 0x5ca001,
          dashed: true
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
}
