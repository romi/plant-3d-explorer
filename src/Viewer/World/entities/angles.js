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

export default class Angles {
  constructor (angles, parent) {
    this.group = new THREE.Object3D()

    angles.forEach((points) => {
      const geometry = new EnhancedTHREE.LineGeometry()
      geometry.setPositions(flatten(points))

      const obj = new EnhancedTHREE.Line2(
        geometry,
        new EnhancedTHREE.LineMaterial({
          linewidth: 0.0105,
          color: 0x7ee7b0,
          dashed: false,
          depthTest: false,
          transparent: true,
          opacity: 0.2
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

  setHighlighted (indexes) {
    const nextIndexed = indexes.reduce((p, c) => {
      return [...p, c, { ...c, index: c.index + 1 }]
    }, [])
    this.group.children.forEach((child, i) => {
      const ref = nextIndexed.find((d) => d.index === i)
      child.visible = !!ref
      child.material.color = ref && ref.type === 'selected'
        ? new THREE.Color(0x84eee6)
        : new THREE.Color(0x7ee7b0)
    })
  }
}
