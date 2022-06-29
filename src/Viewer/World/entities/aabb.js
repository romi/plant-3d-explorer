/**
 * This is a simple implementation of an Axis Aligned Bounding Box.
 *
 */

import * as THREE from "three";

export default class AABB {
  constructor(parent, fromCloud) {
    if (parent) parent.add(this.object);

    // This is not the nicest way to do that.
    this.object = new THREE.Box3Helper(fromCloud.object, 0xffff00);
  }

  resizeBox(min, max) {
    const vecs = [
      new THREE.Vector3(min.x, min.y, min.z),
      new THREE.Vector3(max.x, max.y, max.z),
    ];
    this.object.box.setFromPoints(vecs);
  }

  getBoxSize() {
    return {
      min: {
        x: this.object.box.min.x,
        y: this.object.box.min.y,
        z: this.object.box.min.z,
      },
      max: {
        x: this.object.box.max.x,
        y: this.object.box.max.y,
        z: this.object.box.max.z,
      },
    };
  }
}
