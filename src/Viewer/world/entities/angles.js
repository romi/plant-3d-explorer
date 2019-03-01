import * as THREE from 'three'
import { first } from 'lodash'

export default class Angles {
  constructor (angles, parent) {
    this.group = new THREE.Object3D()

    const toDrawAngles = [first(angles)]
    toDrawAngles.forEach((points) => {
      const angleGroup = new THREE.Object3D()
      points.forEach((p) => {
        const geometry = new THREE.SphereBufferGeometry(4, 5, 5)
        const material = new THREE.MeshBasicMaterial({
          color: 0x111111,
          // wireframe: true
          transparent: true,
          // opacity: 0.1,
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: true
        })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.fromArray(p)
        angleGroup.add(sphere)
      })
      this.group.add(angleGroup)
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
    this.object.visible = boolean
  }
}

// import setLineSegmentsGeometry from 'common/thiers/LineSegmentsGeometry'
// import setLineGeometry from 'common/thiers/LineGeometry'
// import setLineMaterial from 'common/thiers/LineMaterial'

// let EnhancedTHREE
// EnhancedTHREE = setLineSegmentsGeometry(THREE)
// EnhancedTHREE = setLineGeometry(EnhancedTHREE)
// EnhancedTHREE = setLineMaterial(EnhancedTHREE)

// angles.forEach((points) => {
//   const geometry = new EnhancedTHREE.LineGeometry()
//   geometry.setPositions(flatten(points))
//   geometry.setColors(
//     flatten(points.map((d) => [255, 65, 58].map((d) => (d / 255) - 0.3)))
//   )
//   const obj = new THREE.Line(
//     geometry,
//     new EnhancedTHREE.LineMaterial({
//       linewidth: 10,
//       color: 0xFF0000,
//       dashed: false,
//       resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
//     })
//   )
//   // obj.position.fromArray(p)
//   this.group.add(obj)
// })
