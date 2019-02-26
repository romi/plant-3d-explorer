
import * as THREE from 'three'
import OrbitControls from 'common/thiers/OrbitController'
import { map } from 'lodash'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import Skeleton from './entities/skeleton'

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
    // this.scene.fog = new THREE.Fog(0x72645b, 2, 150)
    this.scene.background = new THREE.Color(0xe8e8e8)

    this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122))
    addShadowedLight(this.scene, 1, 1, 1, 0xffffff, 1.35)
    addShadowedLight(this.scene, 0.5, 1, -1, 0xffaa00, 1)

    this.cameraGroup = new THREE.Object3D()
    this.viewerObjects = new THREE.Object3D()
    this.scene.add(this.viewerObjects)
    console.log(this.viewerObjects)

    this.perspectiveCamera = new THREE.PerspectiveCamera(35, width / height, 1, 15000)
    this.perspectiveCamera.position.set(1000, 100, 0)
    this.camera = this.perspectiveCamera

    this.controls = new OrbitControls(this.perspectiveCamera, this.elem)
    // this.controls.rotate(Math.PI / 2, Math.PI / 2)
    // this.controls.minPolarAngle = -Math.PI / 2
    // this.controls.maxPolarAngle = Math.PI / 2
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.30
    this.controls.rotateSpeed = 0.2
    this.controls.zoomSpeed = 0.2
    this.controls.panSpeed = 0.2
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 8000
    this.controls.screenSpacePanning = true

    this.camera.up.set(0, 0, -1)
    // this.camera.rotation.order = 'ZYX'

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
    // this.viewerObjects.rotation.x = Math.PI / 2

    const geometry = new THREE.BoxGeometry(
      (metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0]),
      (metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0]),
      (metadata.scanner.workspace.z[1] - metadata.scanner.workspace.z[0])
    )
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const box = new THREE.Mesh(geometry, material)
    box.position.x = (metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0])
    box.position.y = (metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0])
    box.position.z = metadata.scanner.workspace.z[0] + (metadata.scanner.workspace.z[1] - metadata.scanner.workspace.z[0]) / 2
    this.viewerObjects.add(box)

    this.viewerObjects.position.x = -(metadata.scanner.workspace.x[1] - metadata.scanner.workspace.x[0])
    this.viewerObjects.position.y = -(metadata.scanner.workspace.y[1] - metadata.scanner.workspace.y[0])
    this.viewerObjects.position.z = -(metadata.scanner.workspace.z[1] - metadata.scanner.workspace.z[0]) / 2
    this.metadata = metadata
    this.camera.rotation.order = 'YXZ'
  }

  setCameraPoints (points) {
    const material = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: false })
    this.CameraPointsGroup = new THREE.Object3D()

    map(points, (d) => ({ p: d.tvec, r: d.rotmat, q: d.qvec }))
      .forEach(({ p, r, q }) => {
        const cameraGroup = new THREE.Object3D()
        const coneGeeometry = new THREE.ConeGeometry(10, 25, 6)
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
      console.log(
        camera
      )
      this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 15000)
      this.camera.setFocalLength(24)
      this.camera.zoom = ((6000 / 4000) / (this.width / this.height))
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

      const imgMaterial = new THREE.MeshBasicMaterial({ map: imgLoader.load(`/images/${camera.name}`), side: THREE.DoubleSide })
      const imgGeometry = new THREE.PlaneGeometry(510, 340)
      const mesh = new THREE.Mesh(imgGeometry, imgMaterial)

      mesh.position.x = this.metadata.scanner.workspace.x[1] - this.metadata.scanner.workspace.x[0]
      mesh.position.y = this.metadata.scanner.workspace.y[1] - this.metadata.scanner.workspace.y[0]
      mesh.position.z = -30 + (this.metadata.scanner.workspace.z[1] - this.metadata.scanner.workspace.z[0]) / 2
      mesh.rotation.setFromRotationMatrix(mrotobj)

      if (this.imgMesh) this.viewerObjects.remove(this.imgMesh)
      this.viewerObjects.add(mesh)
      this.imgMesh = mesh

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
    // snip
    this.controls.update(clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }
}
