
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import { map } from 'lodash'

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

    this.perspectiveCamera = new THREE.PerspectiveCamera(35, width / height, 1, 15000)
    this.perspectiveCamera.position.set(0, 2000, 0)

    this.controls = new OrbitControls(this.perspectiveCamera, this.elem)
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

    var material = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false })
    this.CameraPointsGroup = new THREE.Object3D()

    map(points, (d) => ({ p: d.tvec, r: d.rotmat, q: d.qvec })).forEach(({ p, r, q }) => {
      const cameraGroup = new THREE.Object3D()
      const coneGeeometry = new THREE.ConeGeometry(10, 25, 6)
      const cone = new THREE.Mesh(coneGeeometry, material)
      cone.rotation.x = -Math.PI / 2

      var mrot = new THREE.Matrix3()
      mrot.set(...r[0], ...r[1], ...r[2])
      mrot.transpose()
      mrot.multiplyScalar(-1)

      cameraGroup.position.set(
        p[0],
        p[1],
        p[2]
      ).applyMatrix3(mrot)

      var mrotobj = new THREE.Matrix4()
      mrotobj.set(
        ...r[0], 0,
        ...r[1], 0,
        ...r[2], 0,
        0, 0, 0, 1
      )
      mrotobj.transpose()
      cameraGroup.rotation.setFromRotationMatrix(mrotobj)
      cameraGroup.add(cone)

      this.CameraPointsGroup.add(cameraGroup)
    })

    this.cameraGroup.add(this.CameraPointsGroup)
    this.viewerObjects.add(this.cameraGroup)

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
    this.renderer.render(this.scene, this.perspectiveCamera)
  }
}
