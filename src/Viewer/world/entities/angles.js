import * as THREE from 'three'
import { first, flatten } from 'lodash'

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

export default class Angles {
  constructor (angles, parent) {
    this.group = new THREE.Object3D()

    this.group = new THREE.Object3D()

    const toDrawAngles = [first(angles)]
    toDrawAngles.forEach((points) => {
      const geometry = new EnhancedTHREE.LineGeometry()
      geometry.setPositions(flatten(points))

      const obj = new EnhancedTHREE.Line2(
        geometry,
        new EnhancedTHREE.LineMaterial({
          linewidth: 0.0065,
          color: 0xFF0000,
          dashed: true,
          depthTest: false
        })
      )
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
}
