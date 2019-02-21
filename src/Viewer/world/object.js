
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

import Mesh from './entities/mesh'
import PointCloud from './entities/pointCloud'
import Skeleton from './entities/skeleton'

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
    this.scene.add(plane)

    this.viewerObjects = new THREE.Object3D()
    this.viewerObjects.rotation.x = Math.PI / 2
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
    this.controls.maxDistance = 500
    this.controls.screenSpacePanning = true

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    this.renderer.shadowMap.enabled = true
    this.elem.appendChild(this.renderer.domElement)

    const animate = () => {
      this.render()
      window.requestAnimationFrame(animate)
    }
    animate()
  }

  setMeshGeometry (geometry) {
    this.mesh = new Mesh(geometry, this.viewerObjects)
    this.mesh.setPosition(0, 0, 0)
  }

  setPointcloudGeometry (geometry) {
    geometry.computeBoundingBox()
    this.pointCloud = new PointCloud(geometry, this.viewerObjects)
    this.viewerObjects.position.x = -geometry.boundingSphere.center.x
    this.viewerObjects.position.y = geometry.boundingBox.min.z + (geometry.boundingBox.max.z - geometry.boundingBox.min.z)
    this.viewerObjects.position.z = -geometry.boundingSphere.center.y
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
