/*

Plant 3D Explorer: A browser application for 3D scanned plants.

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

import setLineSegmentsGeometry from 'common/thiers/LineSegmentsGeometry'
import setLineGeometry from 'common/thiers/LineGeometry'
import setLineMaterial from 'common/thiers/LineMaterial'
import setWireframe2 from 'common/thiers/WireframeGeometry2'
import setLineSegements2 from 'common/thiers/LineSegement2'
import setLine2 from 'common/thiers/Line2'

/**
 * EnhancedTHREE is an extended object or namespace that enhances the functionalities
 * of the THREE.js library by adding customized or additional features.
 * This variable may include methods, properties, or modules that go beyond the
 * standard THREE.js implementation to provide tailored solutions for specific use cases.
 */
let EnhancedTHREE
// Enhance THREE.js with custom line rendering capabilities by extending its functionality

// Add support for line segments geometry with custom attributes and instancing
EnhancedTHREE = setLineSegmentsGeometry(THREE)

// Add line geometry support for continuous lines with custom attributes
EnhancedTHREE = setLineGeometry(EnhancedTHREE)

// Add specialized material for rendering thick lines with various styling options
EnhancedTHREE = setLineMaterial(EnhancedTHREE)

// Add enhanced wireframe geometry with thickness and styling support
EnhancedTHREE = setWireframe2(EnhancedTHREE)

// Add improved line segments renderer with better performance
EnhancedTHREE = setLineSegements2(EnhancedTHREE)

// Add enhanced line renderer with better visual quality and performance
EnhancedTHREE = setLine2(EnhancedTHREE)

/**
 * Represents a 3D skeleton structure using lines based on a provided skeleton definition.
 */
export default class Skeleton {
  constructor (skeleton, parent) {
    // Create a 3D object group to hold all line segments
    this.group = new THREE.Object3D()

    // Iterate through skeleton lines defined by start and end point indices
    skeleton.lines.forEach(([startIndex, endIndex]) => {
      const geometry = new EnhancedTHREE.LineGeometry()

      // Create array of 3D positions by combining start and end points
      const positions = [
        ...skeleton.points[startIndex],
        ...skeleton.points[endIndex]
      ]

      // Define colors for line segments (mint green with slight darkening)
      const colors = [
        82, 211, 154,
        82, 211, 154
      ].map((d) => (d / 255) - 0.3)

      geometry.setPositions(positions)
      geometry.setColors(colors)

      // Get stored opacity and color preferences from localStorage
      var op = window.localStorage.getItem('defaultSkeletonOpacity')
      var col = window.localStorage.getItem('defaultSkeletonColor')

      // Create line segment with custom material properties
      const obj = new EnhancedTHREE.Line2(
        geometry,
        new EnhancedTHREE.LineMaterial({
          linewidth: 4,
          color: (col != null) ? col : '#D0021B', // Default to red if no stored color
          transparent: true,
          opacity: (op != null) ? parseFloat(op) : 1, // Default to fully opaque
          dashed: true,
          resolution: { x: window.innerWidth, y: window.innerHeight }
        })
      )
      this.group.add(obj)
    })

    // Add group to parent object if provided
    if (parent) parent.add(this.group)
  }

  // Set position of the skeleton in 3D space
  setPosition (x = 0, y = 0, z = 0) {
    this.object.position.x = x
    this.object.position.y = y
    this.object.position.z = z
    return this
  }

  // Toggle visibility of all line segments
  setVisible (boolean) {
    this.group.children.forEach((child) => {
      child.visible = boolean
    })
  }

  // Update color and opacity of all line segments
  setColor (color) {
    this.group.children.forEach((child) => {
      child.material.color = new THREE.Color(color.rgb)
      child.material.opacity = color.a
    })
  }
}
