/*

Plant 3D Explorer: An browser application for 3D scanned
plants.

Copyright (C) 2019-2020 Sony Computer Science Laboratories
              & Centre national de la recherche scientifique (CNRS)

Authors:
Nicolas Forestier, Ludovic Riffault, Léo Gourven, Benoit Lucet (DataVeyes)
Timothée Wintz, Peter Hanappe (Sony CSL)
Fabrice Besnard (CNRS)

This program is free software: you can redistribute it and/or
modify it under the terms of the GNU Affero General Public
License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<https://www.gnu.org/licenses/>.

*/

import * as THREE from 'three'

import OrbitControls from 'common/thiers/OrbitController'
import { green } from 'common/styles/colors'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import SegmentedPointCloud from './entities/segmentedPointCloud'
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
    this.hoveringCameraEnable = false

    var light = new THREE.HemisphereLight(0xBBBBBFF, 0xffffff, 0.3)
    this.scene.add(light)
    light.position.set(0, 0, -500)

    this.cameraGroup = new THREE.Object3D()
    this.viewerObjects = new THREE.Object3D()
    this.scene.add(this.viewerObjects)

    this.perspectiveCamera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 10000)
    this.perspectiveCamera.position.set(1000, 0, 0)
    this.camera = this.perspectiveCamera

    this.camLight = new THREE.PointLight(0xffffff)
    this.camLight.position.set(0, 1, 0)
    this.camera.add(this.camLight)
    this.scene.add(this.camera)

    this.setControls()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
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
    this.controls.dampingFactor = 0.30
    this.controls.rotateSpeed = 0.5
    this.controls.zoomSpeed = 0.7
    this.controls.panSpeed = 0.4
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 5
    this.controls.maxDistance = 8000
    this.controls.enableDamping = false
    this.controls.screenSpacePanning = true

    this.controls.target = new THREE.Vector3(0, 0, 0)

    // Y-upifying needs to be after the creation of the controller instance
    this.camera.up.set(0, 0, -1)
    this.camera.rotation.order = 'YXZ'

    this.controls.update(clock.getDelta())
  }

  resetControls = () => {
    this.camera.zoom = 1
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

    const aspect = { x: window.innerWidth, y: window.innerHeight }

    if (this.anlesPoints) {
      this.anlesPoints.group.children.forEach((obj) => {
        obj.material.resolution = aspect
      })
    }
    if (this.skeleton) {
      this.skeleton.group.children.forEach((obj) => {
        obj.material.resolution = aspect
      })
    }
  }

  setMouse (value) {
    this.mouse = {
      moving: (this.mouse.x !== value.x) || (this.mouse.y !== value.y),
      ...value,
      old: this.mouse
    }
  }

  setViewport (zoomLevel, x, y, width, height, centerX, centerY) {
    this.viewport = [zoomLevel, x, y, width, height, centerX, centerY]
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

  setSelectedCamera (camera, last) {
    if (this.imgMesh) this.scene.remove(this.imgMesh)

    if (camera) {
      this.scene.background = this.blackBackground
      if (this.CameraPointsGroup) this.CameraPointsGroup.visible = false

      this.originPosition = new THREE.Vector3().copy(this.perspectiveCamera.position)
      this.originQuaternion = new THREE.Quaternion().copy(this.perspectiveCamera.quaternion)
      this.controls.enabled = false
      const imgDistance = 2000
      const fov = this.computeDynamicFOV(this.cameraData.model.params, imgDistance)
      const overlapCamera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 10000)
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
      const lastCam = this.camera
      this.camera = this.perspectiveCamera

      if (last) {
        const size = this.renderer.getSize()

        this.camera.position
          .copy(last.v3position)
          .applyMatrix4(this.viewerObjects.matrix)

        this.camera.rotation.setFromRotationMatrix(
          new THREE.Matrix4()
            .copy(last.vueM4rotation)
            .multiply(this.viewerObjects.matrix)
        )

        this.camera.fov = lastCam.fov

        const center = new THREE.Vector3()
        const startPos = new THREE.Vector3().copy(lastCam.position)
        const direction = lastCam.getWorldDirection(center)
        lastCam.getWorldDirection(center)
        startPos.add(direction.multiplyScalar(400))

        this.controls.object = lastCam
        this.controls.target.copy(startPos)

        this.controls.pan(
          this.viewport[5] - size.width * 0.5,
          this.viewport[6] - size.height * 0.5
        )
        this.camera.zoom = this.viewport[0]
        this.controls.object = this.camera
        this.controls.update()
      }

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

  setOrganColors (organColors) {
    if (!this.anlesPoints) return
    this.anlesPoints.setCustomColors(organColors)
  }

  setGlobalOrganColors (globalOrganColors) {
    if (!this.anlesPoints) return
    this.anlesPoints.setGlobalColors(globalOrganColors)
  }

  setHighlightedAngle (indexes) {
    if (!this.anlesPoints || !indexes.length) return
    this.anlesPoints.setHighlighted(indexes)
  }

  setMeshGeometry (geometry) {
    this.mesh = new Mesh(geometry, this.viewerObjects)
  }

  setMeshColor (color) {
    if (this.mesh) {
      this.mesh.setColor(color)
    }
  }

  setPointcloudGeometry (geometry) {
    geometry.computeBoundingBox()
    this.pointCloud = new PointCloud(geometry, this.viewerObjects)
  }

  setSegmentedPointCloudGeometry (geometry, segmentation, uniqueLabels) {
    geometry.computeBoundingBox()
    this.segmentedPointCloud = new SegmentedPointCloud(geometry,
      segmentation, uniqueLabels, this.viewerObjects)
  }

  getSegementedPointCloudColors () {
    return this.segmentedPointCloud.getColors()
  }

  setSegmentedPointCloudColor (color) {
    this.segmentedPointCloud.setColor(color)
  }

  setSegmentedPointCloudLabels (labels, points) {
    this.segmentedPointCloud.setLabels(labels, points)
  }

  setPointCloudColor (color) {
    this.pointCloud.setColor(color)
  }

  setSkeletonPoints (skeleton) {
    this.skeleton = new Skeleton(skeleton, this.viewerObjects)
  }

  setSkeletonColor (color) {
    this.skeleton.setColor(color)
  }

  setAnglesPoints (angles) {
    this.anlesPoints = new Angles(angles.fruit_points, this.viewerObjects)
  }

  setBackgroundColor (color) {
    if (color) this.scene.background = new THREE.Color(color)
  }

  setLayers (layers) {
    if (this.mesh) this.mesh.setVisible(layers.mesh)
    if (this.pointCloud) this.pointCloud.setVisible(layers.pointCloud)
    if (this.segmentedPointCloud) this.segmentedPointCloud.setVisible(layers.segmentedPointCloud)
    if (this.skeleton) this.skeleton.setVisible(layers.skeleton)
    if (this.anlesPoints) this.anlesPoints.setVisible(layers.angles)
    if (this.CameraPointsGroup) this.CameraPointsGroup.visible = layers.cameras
  }

  takeSnapshot (size) {
    const ogSize = { width: this.renderer.domElement.width,
      height: this.renderer.domElement.height }
    /* We need to change the renderer's resolution in order to
      make a screenshot with a custom resolution */
    this.renderer.setSize(size.width, size.height)
    this.renderer.render(this.scene, this.camera)
    const snapshot = this.renderer.domElement.toDataURL()
    this.renderer.setSize(ogSize.width, ogSize.height)
    this.renderer.render(this.scene, this.camera)
    return snapshot
  }

  getVirtualMouse () {
    const { width, height } = this.renderer.getSize()
    return new THREE.Vector2(
      (this.mouse.x / width) * 2 - 1,
      -(this.mouse.y / height) * 2 + 1
    )
  }

  castRayFromMouse (targetObjects) {
    const virtualMouse = this.getVirtualMouse()
    this.raycaster.setFromCamera(virtualMouse, this.controls.object)
    return this.raycaster
      .intersectObjects(targetObjects, true)
  }

  /* Casts a ray and checks if it intersects any organ. If it
    does, returns the index of the organ, returns null otherwise */

  selectOrgan () {
    if (!this.anlesPoints) return null
    const intersects = this.castRayFromMouse(this.anlesPoints.group.children)
    return intersects.length
      ? this.anlesPoints.group.children.indexOf(intersects[0].object) !== -1
        ? this.anlesPoints.group.children.indexOf(intersects[0].object)
        : null
      : null
  }

  selectSegPoint () {
    if (!this.segmentedPointCloud) return null
    const intersects = this.castRayFromMouse([this.segmentedPointCloud.object])
    const result = intersects.length
      ? intersects[0].index
      : null
    return result
  }

  removeSphere () {
    if (this.sphere) {
      this.scene.remove(this.sphere)
    }
  }

  displaySphere (pos, rad) {
    this.removeSphere()
    const geometry = new THREE.SphereGeometry(rad, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0xaaaaaa,
      opacity: 0.7,
      transparent: true
    })
    this.sphere = new THREE.Mesh(geometry, material)
    this.scene.add(this.sphere)
    this.sphere.position.set(pos.x, pos.y, pos.z)
  }

  updateSphere (point) {
    if (!this.segmentedPointCloud) return null
    const intersects = this.castRayFromMouse([this.segmentedPointCloud.object])
    const pos = this.segmentedPointCloud.getPointPos(point)
    if (intersects.length) {
      this.displaySphere(pos,
        intersects[0].point
          .distanceTo(pos))
    }
  }

  selectSegBySphere (point) {
    if (!this.segmentedPointCloud) return null
    const intersects = this.castRayFromMouse([this.segmentedPointCloud.object])
    if (intersects.length) {
      this.removeSphere()
      return this.segmentedPointCloud.selectBySphere(point, intersects[0].index)
    }
    this.removeSphere()
  }

  selectSegByProximity (point) {
    if (!this.segmentedPointCloud) return null
    return this.segmentedPointCloud.selectByProximity(point)
  }

  selectSegBySameLabel (point) {
    if (!this.segmentedPointCloud) return null
    return this.segmentedPointCloud.selectSameLabel(point)
  }

  clearSelection () {
    if (!this.segmentedPointCloud) return
    this.segmentedPointCloud.refreshColors()
  }

  colorSelectedPoints (points) {
    if (!this.segmentedPointCloud) return
    this.segmentedPointCloud.colorSelectedPoints(points)
  }

  startMeasure () {
    this.clearLine()
    const intersects = this.castRayFromMouse(this.scene.children)
    if (intersects && intersects.length) {
      this.measureStartingPoint = intersects[0].point
    } else {
      const tmp = this.getVirtualMouse()
      let planeNormal = new THREE.Vector3()
      let plane = new THREE.Plane()
      planeNormal.copy(this.camera.position).normalize()
      plane.setFromNormalAndCoplanarPoint(planeNormal, this.scene.position)
      let point = new THREE.Vector3()
      this.raycaster.setFromCamera(tmp, this.camera)
      this.raycaster.ray.intersectPlane(plane, point)
      this.measureStartingPoint = point
    }
    let points = [this.measureStartingPoint]
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      linewidth: 5,
      depthTest: false
    })
    this.line = new THREE.Line(geometry, material)
    this.scene.add(this.line)
  }

  clearLine () {
    if (this.line) this.scene.remove(this.line)
  }

  updateLine () {
    if (!this.line) return
    this.clearLine()
    const intersects = this.castRayFromMouse(this.scene.children)
    if (intersects && intersects.length) {
      this.currentEndPoint = intersects[0].point
    } else {
      const tmp = this.getVirtualMouse()
      let planeNormal = new THREE.Vector3()
      let plane = new THREE.Plane()
      planeNormal.copy(this.camera.position).normalize()
      plane.setFromNormalAndCoplanarPoint(planeNormal, this.scene.position)
      this.raycaster.setFromCamera(tmp, this.camera)
      let point = new THREE.Vector3()
      this.raycaster.ray.intersectPlane(plane, point)
      this.currentEndPoint = point
    }
    let points = [
      this.measureStartingPoint,
      this.currentEndPoint
    ]

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0xaaaaaa,
      linewidth: 5,
      depthTest: false
    })
    this.line = new THREE.Line(geometry, material)
    this.scene.add(this.line)
  /* const startPoint = this.measureStartingPoint
    const firstPoint = [startPoint.x, startPoint.y, 0]
    const endPoint = this.getVirtualMouse()
    const secondPoint = [endPoint.x, endPoint.y, 0]
    const points = [...firstPoint, ...secondPoint]
    this.line.geometry.attributes.position.array = points */
  }

  endMeasure (scale) {
    if (!this.measureStartingPoint || !this.line || !this.currentEndPoint) {
      return
    }
    console.log(this.currentEndPoint)
    const dist = this.currentEndPoint.distanceTo(this.measureStartingPoint)
    if (scale) {
      this.scale = dist
      this.clearLine()
    } else {
      if (!this.scale) return null
      return dist / this.scale
    }
  }

  getSegmentation () {
    if (!this.segmentedPointCloud) return null
    return this.segmentedPointCloud.getSegmentation()
  }

  interaction () {
    if (
      (this.mouse.x !== this.oldMouse.x) || (this.mouse.y !== this.oldMouse.y)
    ) {
      const intersects = this.castRayFromMouse(this.scene.children)

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
    if (this.hoveringCameraEnable) this.interaction()
    if (this.thiscamera) this.thiscamera.matrixAutoUpdate = false
    // if (this.controls.enabled) this.controls.update(clock.getDelta())
    this.renderer.render(this.scene, this.camera)
  }
}
