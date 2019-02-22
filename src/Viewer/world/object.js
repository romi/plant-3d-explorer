
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { map } from 'lodash'
import average from 'average'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import Skeleton from './entities/skeleton'

import points from '../assets/images.json'

console.log(
  points[1]
)

function addShadowedLight (scene, x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(x, y, z)
  scene.add(directionalLight)

  directionalLight.castShadow = true

  var d = 1
  directionalLight.shadow.camera.left = -d
  directionalLight.shadow.camera.right = d
  directionalLight.shadow.camera.top = d
  directionalLight.shadow.camera.bottom = -d

  directionalLight.shadow.camera.near = 1
  directionalLight.shadow.camera.far = 40000

  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024

  directionalLight.shadow.bias = -0.001
}

export default class World {
  constructor (width, height, elem) {
    this.elem = elem
    this.scene = new THREE.Scene()
    // this.scene.fog = new THREE.Fog(0x72645b, 2, 150)
    this.scene.background = new THREE.Color(0xe8e8e8)

    this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
    addShadowedLight(this.scene, 1, 1, 1, 0xffffff, 1.35)
    addShadowedLight(this.scene, 0.5, 1, -1, 0xffaa00, 1)

    const plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(4000, 4000),
      new THREE.MeshPhongMaterial({ color: 0xe8e8e8, specular: 0x101010 })
    )
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -1.5
    plane.receiveShadow = true
    // this.scene.add(plane)

    this.viewerObjects = new THREE.Object3D()
    this.scene.add(this.viewerObjects)

    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 15000)
    this.camera.position.set(0, 2000, 0)

    this.controls = new OrbitControls(this.camera, this.elem)
    this.controls.minPolarAngle = -Math.PI / 2
    this.controls.maxPolarAngle = Math.PI / 2
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.30
    this.controls.rotateSpeed = 0.2
    this.controls.zoomSpeed = 0.2
    this.controls.panSpeed = 0.2
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 5000
    this.controls.screenSpacePanning = true

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.elem.appendChild(this.renderer.domElement)

    // ------------------------------------------------------------

    this.cameraGroup = new THREE.Object3D()

    var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 })
    const pts = map(points, (d) => d.tvec)
    const center = [
      average(pts.map((d) => d[0])),
      average(pts.map((d) => d[1])),
      average(pts.map((d) => d[2]))
    ]
    const geometry = new THREE.SphereBufferGeometry(15, 10, 10)
    this.centerObject = new THREE.Mesh(geometry, material)
    this.cameraGroup.add(this.centerObject)

    this.pointsGroup = new THREE.Object3D()
    this.pointsRotationGroup = new THREE.Object3D()

    map(points, (d) => ({ p: d.tvec, r: d.rotmat })).forEach(({ p, r }) => {
      const g = new THREE.Object3D()
      const lookAtG = new THREE.Object3D()
      const geometry = new THREE.ConeGeometry(15, 20, 20)
      const object = new THREE.Mesh(geometry, material)
      object.rotation.x = -Math.PI / 2

      var m = new THREE.Matrix3()
      m.set(...r[0], ...r[1], ...r[2])
      m.transpose()
      m.multiplyScalar(-1)

      lookAtG.position.set(
        p[0] - center[0],
        p[1] - center[1],
        p[2] - center[2]
      ).applyMatrix3(m)

      lookAtG.add(object)
      // lookAtG.position.x = p[0] - center[0]
      // lookAtG.position.y = p[1] - center[1]
      // lookAtG.position.z = p[2] - center[2]
      lookAtG.lookAt(this.centerObject.position)

      g.add(lookAtG)

      this.pointsRotationGroup.add(g)
    })

    // this.cameraGroup.position.x = 400
    // this.cameraGroup.position.y = 400
    // this.cameraGroup.position.z = 50
    // this.cameraGroup.rotation.x = -0.49// - (Math.PI / 2)
    this.cameraGroup.add(this.pointsRotationGroup)
    this.viewerObjects.add(this.cameraGroup)

    // ------------------------------------------------------------

    // this.pointsGroup = new THREE.Object3D()
    // this.pointsRotationGroup = new THREE.Object3D()
    // var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 })

    // map(points, (d) => ({ p: d.tvec, r: d.qvec })).forEach(({ p, r }) => {
    //   const g = new THREE.Object3D()
    //   const geometry = new THREE.SphereBufferGeometry(3, 10, 10)
    //   const object = new THREE.Mesh(geometry, material)
    //   object.position.x = p[0]
    //   object.position.y = p[1]
    //   object.position.z = p[2]
    //   // g.position.x = 400
    //   // g.position.y = 400
    //   // g.position.z = -240
    //   object.quaternion.set(...r)
    //   g.add(object)
    //   // g.rotation.x = -0.49
    //   this.pointsRotationGroup.add(g)
    // })
    // // this.pointsRotationGroup.rotation.x = -Math.PI / 2
    // this.pointsGroup.add(this.pointsRotationGroup)
    // // this.pointsGroup.position.x = 400 - 50
    // // this.pointsGroup.position.y = 400 - 50
    // // this.pointsGroup.position.z = 0
    // // this.pointsGroup.rotation.x = -Math.PI / 2
    // this.viewerObjects.add(this.pointsGroup)

    // const center = map(points, (d) => (d.tvec)).reduce((p, c) => {
    //   if (!p.length) p = c
    //   return [
    //     (p[0] + c[0]) / (p.length),
    //     (p[1] + c[1]) / (p.length),
    //     (p[2] + c[2]) / (p.length)
    //   ]
    // }, [])

    // const geometry = new THREE.SphereBufferGeometry(30, 10, 10)
    // const object = new THREE.Mesh(geometry, material)
    // object.position.x = 400
    // object.position.y = 400
    // object.position.z = -50
    // this.scene.add(object)

    // ------------------------------------------------------------

    // this.pointsGroup = new THREE.Object3D()
    // var material = new THREE.MeshPhongMaterial({ color: 0xFF0000 })
    // map(points, (d) => ({ p: d.tvec, r: d.qvec })).forEach(({ p, r }) => {
    //   const geometry = new THREE.SphereBufferGeometry(3, 10, 10)
    //   const object = new THREE.Mesh(geometry, material)
    //   object.position.x = p[0] + 400
    //   object.position.y = p[1] + 400
    //   object.position.z = p[2] + 50
    //   object.quaternion.set(...r)
    //   this.pointsGroup.add(object)
    // })
    // this.pointsGroup.rotation.x = -.049
    // this.cameraObject = new THREE.Object3D()
    // this.cameraObject.add(this.pointsGroup)
    // // this.cameraObject.position
    // this.scene.add(this.cameraObject)
    // // this.cameraObject.position.x = -400
    // // this.cameraObject.position.y = -400
    // // this.cameraObject.position.z = -400
    // // this.cameraObject.rotation.z = -Math.PI / 2
    // // this.viewerObjects.add(this.pointsGroup)

    const animate = () => {
      this.render()
      window.requestAnimationFrame(animate)
    }
    animate()
  }

  setMetaData (metadata) {
    this.viewerObjects.rotation.x = Math.PI / 2
    this.viewerObjects.position.x = -(metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0])
    this.viewerObjects.position.y = metadata.scanner.workspace.z[1]
    this.viewerObjects.position.z = -(metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0])
  }

  setMeshGeometry (geometry) {
    this.mesh = new Mesh(geometry, this.viewerObjects)
    this.mesh.setPosition(0, 0, 0)
  }

  setPointcloudGeometry (geometry) {
    geometry.computeBoundingBox()
    this.pointCloud = new PointCloud(geometry, this.viewerObjects)
    console.log(
      geometry.boundingBox,
      geometry.boundingBox.min.z + (geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    )
    // this.viewerObjects.position.x = -geometry.boundingSphere.center.x
    // this.viewerObjects.position.y = geometry.boundingBox.min.z + (geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    // this.viewerObjects.position.z = -geometry.boundingSphere.center.y
  }

  setSkeletonPoints (skeleton) {
    this.skeleton = new Skeleton(skeleton, this.viewerObjects)
  }

  setLayers (layers) {
    if (this.mesh) this.mesh.setVisible(layers.mesh)
    if (this.pointCloud) this.pointCloud.setVisible(layers.pointCloud)
    if (this.skeleton) this.skeleton.setVisible(layers.skeleton)
  }

  render () {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}
