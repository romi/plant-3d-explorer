/**
 * This is unused code. 
 *
 */

import { Vector3, Box3, Box3Helper } from "three";
export default class AABB {
  constructor(parent, box) {
    this.box = new Box3(
      new Vector3(parseFloat(box.min.x), parseFloat(box.min.y), parseFloat(box.min.z)), 
      new Vector3(parseFloat(box.max.x), parseFloat(box.max.y), parseFloat(box.max.z))
    )

    this.object = new Box3Helper(this.box, 0xffffff);
    this.object.renderOrder = -1;
    if(parent) parent.add(this.object);
  }

  setVisible(boolean)
  {
    this.object.visible = boolean;
  }

  setBoundingBox(aabb) {
    // We could maybe do without creating a new GeometryBuffer
    // This is left as excercise for the next intern here :)
    this.box = new Box3(
      new Vector3(parseFloat(aabb.min.x), parseFloat(aabb.min.y), parseFloat(aabb.min.z)), 
      new Vector3(parseFloat(aabb.max.x), parseFloat(aabb.max.y), parseFloat(aabb.max.z))
    )
    let oldObj = this.object
    const newObj = new Box3Helper(this.box, 0xffffff);
    newObj.visible = oldObj.visible
    //oldObj.visible = false
    oldObj.parent.add(newObj)
    newObj.parent.remove(oldObj)
    this.object = newObj
    
  }

  getBoundingBox()
  {
     
    const ret = {
      min: {
        x: this.box.min.x.toFixed(4),
        y: this.box.min.y.toFixed(4),
        z: this.box.min.z.toFixed(4),
      },
      max: {
        x: this.box.max.x.toFixed(4),
        y: this.box.max.y.toFixed(4),
        z: this.box.max.z.toFixed(4),
      }
    }
    return ret
  }
}
