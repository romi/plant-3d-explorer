
import * as THREE from 'three'

import OrbitControls from 'common/thiers/OrbitController'
import { green } from 'common/styles/colors'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import Skeleton from './entities/skeleton'
import Angles from './entities/angles'
import Workspace from './entities/workspace'

const clock = new THREE.Clock()

export default class World {
  constructor (width, height, elem) {
    this.width = width
    this.height = height
    this.elem = elem
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xECF3F0)
    this.originalBackground = new THREE.Color(0xECF3F0)
    this.blackBackground = new THREE.Color(0x232122)
    this.raycaster = new THREE.Raycaster()
    this.mouse = { x: 0, y: 0, moving: false }
    this.oldMouse = { ...this.mouse }
    this.onHoverFn = () => {}
    this.unmounted = false

    var light = new THREE.HemisphereLight(0xBBBBBFF, 0xffffff, 0.5)
    var helper = new THREE.HemisphereLightHelper(light, 10)
    this.scene.add(light)
    light.position.set(0, 0, -500)
    this.scene.add(helper)

    this.cameraGroup = new THREE.Object3D()
    this.viewerObjects = new THREE.Object3D()
    this.scene.add(this.viewerObjects)

    this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 5000)
    this.perspectiveCamera.position.set(1000, 0, 0)
    this.camera = this.perspectiveCamera

    this.camLight = new THREE.PointLight(0xffffff)
    this.camLight.position.set(0, 1, 0)
    this.camera.add(this.camLight)
    this.scene.add(this.camera)

    this.setControls()

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(
      window.devicePixelRatio
        ? window.devicePixelRatio
        : 1
    )
    this.renderer.shadowMap.enabled = true
    this.elem.appendChild(this.renderer.domElement)
    this.setSize(width, height)

    this.viewerObjects.add(this.cameraGroup)

    const animate = () => {
      this.render()
      if (!this.unmounted) window.requestAnimationFrame(animate)
    }
    animate()
  }

  onHover (fn) {
    this.onHoverFn = fn
  }

  unmount () {
    this.unmounted = true
  }

  computeDynamicFOV (cameraParams, dist) {
    const height = ((cameraParams[3] * 2) * dist) / cameraParams[0]
    return 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI)
  }

  setControls () {
    this.controls = new OrbitControls(this.perspectiveCamera, this.elem)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.30
    this.controls.rotateSpeed = 0.2
    this.controls.zoomSpeed = 0.7
    this.controls.panSpeed = 0.4
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 8000
    this.controls.screenSpacePanning = true

    // Y-upifying needs to be after the creation of the controller instance
    this.camera.up.set(0, 0, -1)
    this.camera.rotation.order = 'YXZ'

    this.controls.update(clock.getDelta())
  }

  resetControls = () => {
    this.controls.reset()
  }

  setSize (width, height) {
    this.width = width
    this.height = height
    this.renderer.setSize(width, height)
    this.renderer.render(this.scene, this.camera)
    this.setAspectRatio(width, height)
  }

  setAspectRatio (width = this.width, height = this.height) {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  setMouse (value) {
    this.mouse = {
      moving: (this.mouse.x !== value.x) || (this.mouse.y !== value.y),
      ...value,
      old: this.mouse
    }
  }

  setViewport (zoomLevel, x, y, width, height) {
    this.viewport = [zoomLevel, x, y, width, height]
    this.renderer.setViewport(x, y, width, height)
    if (this.pointCloud) {
      this.pointCloud.setZoomLevel(zoomLevel)
    }
  }

  getViewport () {
    return this.renderer.getCurrentViewport()
  }

  setWorkSpaceBox (workspace) {
    if (this.viewportBox) this.viewerObjects.remove(this.viewportBox)
    this.viewportBox = new Workspace(workspace, this.viewerObjects)
  }

  setWorkSpace (workspace) {
    this.workspace = workspace
    this.setWorkSpaceBox(workspace)

    this.viewerObjects.position.x = -(workspace.x[1] - workspace.x[0])
    this.viewerObjects.position.y = -(workspace.y[1] - workspace.y[0])
    this.viewerObjects.position.z = -(workspace.z[1] - workspace.z[0])

    this.viewerObjects.position.x = -(workspace.x[1] - workspace.x[0])
    this.viewerObjects.position.y = -(workspace.y[1] - workspace.y[0])
    this.viewerObjects.position.z = workspace.z[1] - (workspace.z[1] - workspace.z[0])
  }

  setCamera (camera) {
    this.cameraData = camera
  }

  setCameraPoints (points) {
    this.CameraPointsGroup = new THREE.Object3D()

    points.forEach((p) => {
      const material = new THREE.MeshPhongMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.1 })
      const { v3position, objM4rotation } = p
      const coneGeeometry = new THREE.ConeGeometry(10, 25, 4)
      const cone = new THREE.Mesh(coneGeeometry, material)
      cone.data = p

      cone.position.copy(v3position)
      cone.rotation.setFromRotationMatrix(objM4rotation)

      this.CameraPointsGroup.add(cone)
    })

    this.cameraGroup.add(this.CameraPointsGroup)
  }

  setHoveredCamera (camera) {
    if (this.CameraPointsGroup) {
      this.hoveredCamera = camera
      this.CameraPointsGroup.children.forEach((d) => {
        if (camera && d.data.id === camera.id) {
          d.material.wireframe = false
          d.material.opacity = 1
        } else {
          d.material.wireframe = true
          d.material.opacity = 0.1
        }
      })
    }
  }

  setSelectedCamera (camera, percent) {
    if (this.imgMesh) this.scene.remove(this.imgMesh)

    if (camera) {
      this.scene.background = this.blackBackground
      if (this.CameraPointsGroup) this.CameraPointsGroup.visible = false

      this.originPosition = new THREE.Vector3().copy(this.perspectiveCamera.position)
      this.originQuaternion = new THREE.Quaternion().copy(this.perspectiveCamera.quaternion)
      this.controls.enabled = false
      const imgDistance = 2000
      const fov = this.computeDynamicFOV(this.cameraData.model.params, imgDistance)
      const overlapCamera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 5000)
      overlapCamera.add(this.camLight)

      overlapCamera.position
        .copy(camera.v3position)
        .applyMatrix4(this.viewerObjects.matrix)

      overlapCamera.rotation.setFromRotationMatrix(
        new THREE.Matrix4()
          .copy(camera.vueM4rotation)
          .multiply(this.viewerObjects.matrix)
      )
      const distance = imgDistance
      const aspect = this.cameraData.model.params[2] / this.cameraData.model.params[3]
      const vFov = overlapCamera.fov * Math.PI / 180

      const imgHeight = 2 * Math.tan(vFov / 2) * distance
      const imgWidth = imgHeight * aspect
      const imgPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(imgWidth, imgHeight),
        new THREE.MeshBasicMaterial({ map: camera.texture, side: THREE.DoubleSide })
      )

      const center = new THREE.Vector3()
      const startPos = new THREE.Vector3().copy(overlapCamera.position)
      const direction = overlapCamera.getWorldDirection(center)
      startPos.add(direction.multiplyScalar(imgDistance))

      imgPlane.position.copy(startPos)
      imgPlane.rotation.copy(overlapCamera.rotation)

      this.overlapCamera = overlapCamera
      this.overlapCamera.data = camera

      this.scene.remove(this.camera)
      this.scene.add(overlapCamera)
      this.camera = this.overlapCamera

      this.scene.add(imgPlane)
      this.imgMesh = imgPlane
      this.setAspectRatio()
    } else {
      if (this.CameraPointsGroup) this.CameraPointsGroup.visible = true
      this.scene.background = this.originalBackground

      this.scene.remove(this.camera)
      this.camera = this.perspectiveCamera
      this.camera.add(this.camLight)
      this.scene.add(this.camera)
      this.setAspectRatio()
      this.controls.enabled = true
    }
  }

  animateCamera (percent, active) {
    if (this.thiscamera && active) {
      this.perspectiveCamera.position.copy(
        new THREE.Vector3()
          .copy(this.originPosition)
          .lerp(this.thiscamera.position, percent)
      )

      this.perspectiveCamera.quaternion.copy(
        new THREE.Quaternion()
          .copy(this.originQuaternion)
          .slerp(this.thiscamera.quaternion, percent)
      )

      this.perspectiveCamera.fov -= (this.perspectiveCamera.fov - this.thiscamera.fov) * percent
      this.perspectiveCamera.updateProjectionMatrix()
    }
  }

  setHighlightedAngle (indexes) {
    if (!this.anlesPoints || !indexes.length) return
    this.anlesPoints.setHighlighted(indexes)
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

  setAnglesPoints (angles) {
    this.anlesPoints = new Angles(angles.fruit_points, this.viewerObjects)
  }

  setLayers (layers) {
    if (this.mesh) this.mesh.setVisible(layers.mesh)
    if (this.pointCloud) this.pointCloud.setVisible(layers.pointCloud)
    if (this.skeleton) this.skeleton.setVisible(layers.skeleton)
    if (this.anlesPoints) this.anlesPoints.setVisible(layers.angles)
    if (this.CameraPointsGroup) this.CameraPointsGroup.visible = layers.cameras
  }

  interaction () {
    if (
      (this.mouse.x !== this.oldMouse.x) || (this.mouse.y !== this.oldMouse.y)
    ) {
      const { width, height } = this.renderer.getSize()

      const virtualMouse = new THREE.Vector2(
        (this.mouse.x / width) * 2 - 1,
        -(this.mouse.y / height) * 2 + 1
      )

      this.raycaster.setFromCamera(virtualMouse, this.controls.object)
      const intersects = this.raycaster
        .intersectObjects(this.scene.children, true)

      if (intersects.length) {
        if (intersects[0].object.uuid !== this.hoveredUUID) {
          if (intersects[0].object.data) {
            this.onHoverFn({
              ...intersects[0].object.data,
              mouse: this.mouse
            })
          }
          this.hoveredUUID = intersects[0].object.uuid
        }
      } else {
        if (this.hoveredCamera && this.hoveredCamera.mouse) {
          this.onHoverFn(null)
          this.hoveredUUID = null
        }
      }
      this.oldMouse = this.mouse
    }
  }

  render () {
    this.interaction()
    if (this.thiscamera) this.thiscamera.matrixAutoUpdate = false
    if (this.controls.enabled) this.controls.update(clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }
}
