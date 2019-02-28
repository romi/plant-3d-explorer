
import * as THREE from 'three'
import OrbitControls from 'common/thiers/OrbitController'
import { map } from 'lodash'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import Skeleton from './entities/skeleton'

import { basename } from 'common/routing'

const clock = new THREE.Clock()
const imgLoader = new THREE.TextureLoader()

function addShadowedLight (scene, x, y, z, color, intensity) {
  const directionalLight = new THREE.DirectionalLight(color, intensity)
  directionalLight.position.set(x, y, z)
  scene.add(directionalLight)

  directionalLight.castShadow = true

  const d = 1
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
    this.width = width
    this.height = height
    this.elem = elem
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xe8e8e8)

    this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
    addShadowedLight(this.scene, 1, 1, 1, 0xffffff, 1.35)
    addShadowedLight(this.scene, 0.5, 1, -1, 0xffaa00, 1)

    this.cameraGroup = new THREE.Object3D()
    this.viewerObjects = new THREE.Object3D()
    this.scene.add(this.viewerObjects)
    window.viewerObjects = this.viewerObjects

    this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 5000)
    this.perspectiveCamera.position.set(1000, 100, 0)
    this.camera = this.perspectiveCamera

    this.controls = new OrbitControls(this.perspectiveCamera, this.elem)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.30
    this.controls.rotateSpeed = 0.2
    this.controls.zoomSpeed = 0.2
    this.controls.panSpeed = 0.2
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 8000
    this.controls.screenSpacePanning = true

    // Y-upifying needs to be after the creation of the controller instance
    this.camera.up.set(0, 0, -1)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.elem.appendChild(this.renderer.domElement)

    this.viewerObjects.add(this.cameraGroup)

    const animate = () => {
      this.render()
      window.requestAnimationFrame(animate)
    }
    animate()
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height)
    this.renderer.render(this.scene, this.controls.object)
  }

  setMetaData (metadata) {
    const geometry = new THREE.BoxGeometry(
      (metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0]),
      (metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0]),
      (metadata.scanner.workspace.z[1] - metadata.scanner.workspace.z[0])
    )
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const box = new THREE.Mesh(geometry, material)

    box.position.x = (metadata.scanner.workspace.x[1] + metadata.scanner.workspace.x[0]) / 2
    box.position.y = (metadata.scanner.workspace.y[1] + metadata.scanner.workspace.y[0]) / 2
    box.position.z = (metadata.scanner.workspace.z[1] + metadata.scanner.workspace.z[0]) / 2
    this.viewportBox = box
    this.viewerObjects.add(box)

    this.viewerObjects.position.x = -(metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0])
    this.viewerObjects.position.y = -(metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0])
    this.viewerObjects.position.z = -(metadata.scanner.workspace.z[1] - metadata.scanner.workspace.z[0]) / 2
    this.metadata = metadata
    this.camera.rotation.order = 'YXZ'
  }

  setCameraPoints (points) {
    const material = new THREE.MeshPhongMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.1 })
    this.CameraPointsGroup = new THREE.Object3D()

    map(points, (d) => ({ p: d.tvec, r: d.rotmat, q: d.qvec }))
      .forEach(({ p, r, q }) => {
        const cameraGroup = new THREE.Object3D()
        const coneGeeometry = new THREE.ConeGeometry(10, 25, 4)
        const cone = new THREE.Mesh(coneGeeometry, material)

        const mrot = new THREE.Matrix3()
        mrot.set(...r[0], ...r[1], ...r[2])
        mrot.transpose()
        mrot.multiplyScalar(-1)

        cameraGroup.position.set(
          p[0],
          p[1],
          p[2]
        ).applyMatrix3(mrot)

        const mrotobj = new THREE.Matrix4()
        mrotobj.set(
          ...r[0], 0,
          ...r[1], 0,
          ...r[2], 0,
          0, 0, 0, 1
        )
        const t = new THREE.Matrix4().makeRotationX(-Math.PI / 2)
        mrotobj.transpose()
        mrotobj.multiply(t)
        cameraGroup.rotation.setFromRotationMatrix(mrotobj)
        cameraGroup.add(cone)

        this.CameraPointsGroup.add(cameraGroup)
      })

    this.cameraGroup.add(this.CameraPointsGroup)
  }

  setSelectedCamera (camera) {
    if (camera) {
      const dist = 2000
      /// / (dist * (53.1 * Math.PI) / 180) // 53.1 is the vertical angle of a 24mm camera
      const height = (4000 * dist) / 4303.84464954118

      const fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI)
      this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 5000)

      var distance = dist
      var aspect = 6000 / 4000
      var vFov = this.camera.fov * Math.PI / 180
      var planeHeightAtDistance = 2 * Math.tan(vFov / 2) * distance
      var planeWidthAtDistance = planeHeightAtDistance * aspect

      this.camera.updateProjectionMatrix()

      const material = new THREE.MeshPhongMaterial({ color: 0x0000FF, wireframe: false })
      const coneGeeometry = new THREE.ConeGeometry(10, 25, 6)
      const cone = new THREE.Mesh(coneGeeometry, material)
      this.viewerObjects.add(cone)

      const mrot = new THREE.Matrix3()
      mrot.set(...camera.rotmat[0], ...camera.rotmat[1], ...camera.rotmat[2])
      mrot.transpose()
      mrot.multiplyScalar(-1)

      this.camera.position.set(
        camera.tvec[0],
        camera.tvec[1],
        camera.tvec[2]
      )
        .applyMatrix3(mrot)
        .applyMatrix4(this.viewerObjects.matrix)

      const mrotobj = new THREE.Matrix4()
      mrotobj.set(
        ...camera.rotmat[0], 0,
        ...camera.rotmat[1], 0,
        ...camera.rotmat[2], 0,
        0, 0, 0, 1
      ).transpose()

      const t = new THREE.Matrix4()
        .makeRotationX(-Math.PI)
      mrotobj
        .multiply(t)
        .multiply(this.viewerObjects.matrix)

      this.camera.rotation.setFromRotationMatrix(mrotobj)

      const imgWidth = planeWidthAtDistance
      const imgHeight = planeHeightAtDistance
      const imgMaterial = new THREE.MeshBasicMaterial({ map: imgLoader.load(`${basename}images/${camera.name}`), side: THREE.DoubleSide })
      const imgGeometry = new THREE.PlaneGeometry(imgWidth, imgHeight)
      const mesh = new THREE.Mesh(imgGeometry, imgMaterial)
      mesh.rotation.setFromRotationMatrix(mrotobj)
      var startPos = new THREE.Vector3().copy(this.camera.position)
      var direction = this.camera.getWorldDirection()
      startPos.add(direction.multiplyScalar(dist))
      mesh.position.copy(startPos)
      this.scene.add(mesh)
      if (this.imgMesh) this.scene.remove(this.imgMesh)
      this.imgMesh = mesh

      window.camera = this.camera

      window.imgMesh = this.imgMesh
    } else {
      if (this.imgMesh) this.viewerObjects.remove(this.imgMesh)
      this.camera = this.perspectiveCamera
    }
  }

  setMeshGeometry (geometry) {
    this.mesh = new Mesh(geometry, this.viewerObjects)
  }

  setPointcloudGeometry (geometry) {
    geometry.computeBoundingBox()
    this.pointCloud = new PointCloud(geometry, this.viewerObjects)
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
    clock.getDelta()
    this.controls.update(clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }
}
