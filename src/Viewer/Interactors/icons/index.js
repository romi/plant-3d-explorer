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
import React from 'react'
import Icon, { IconHOC } from 'rd/UI/Icon'

import { green } from 'common/styles/colors'

import meshRaw from 'common/assets/ico.mesh.21x21.svg'
import pointCloudRaw from 'common/assets/ico.point_cloud.21x21.svg'
import skeletonRaw from 'common/assets/ico.skeleton.21x21.svg'
import internodesRaw from 'common/assets/ico.internodes.21x21.svg'
import camerasRaw from 'Viewer/Interactors/assets/ico.cameras.15x9.svg'
import resertRaw from 'Viewer/Interactors/assets/ico.reset_view.14x14.svg'
import expandRaw from 'common/assets/ico.expand-white.14x14.svg'
import shrinkRaw from 'common/assets/ico.shrink-white.14x14.svg'
import paintRaw from 'common/assets/ico.paint.23x23.svg'
import snapRaw from 'common/assets/ico.snap.24x24.svg'
import segmentedPointCloudRaw from 'common/assets/ico.segmented_point_cloud.21x21.svg'
import photoSetRaw from 'common/assets/ico.photoset.24x24.svg'
import rulerRaw from 'common/assets/ico.ruler.21x21.svg'
import backgroundColorRaw from 'common/assets/ico.background_color.21x21.svg'
import zoomInRaw from 'common/assets/ico.zoom-in.14x14.svg'
import zoomOutRaw from 'common/assets/ico.zoom-out.14x14.svg'
import boundingBoxRaw from 'common/assets/ico.bounding_box.21x21.svg'

const rules = (props) => ({
  default: {
    '& path, & polygon, & rect': {
      fill: 'white'
    },
    display: 'flex'
  },
  active: {
    '& path, & polygon, & rect': {
      fill: (props.isActivated && props.activated)
        ? 'white'
        : green
    }
  }
})

export const MeshIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={meshRaw}
    alt='mesh icon'
  />
})

export const PointCloudIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={pointCloudRaw}
    alt='point cloud icon'
  />
})

export const SegmentedPointCloudIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={segmentedPointCloudRaw}
    alt='segmented point cloud icon'
  />
})

export const SkeletonIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={skeletonRaw}
    alt='skeleton icon'
  />
})

export const InternodesIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={internodesRaw}
    alt='angles icon'
  />
})

export const CamerasIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={camerasRaw}
    alt='cameras icon'
  />
})

export const ResetIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={resertRaw}
    alt='reset icon'
  />
})

export const ExpandIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={expandRaw}
    alt='expand icon'
  />
})

export const ShrinkIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={shrinkRaw}
    alt='shrink icon'
  />
})

export const PaintIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={paintRaw}
    alt='paint icon'
  />
})

export const SnapIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={snapRaw}
    alt='snap icon'
  />
})

export const PhotoSetIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={photoSetRaw}
    alt='photoset icon'
  />
})

export const RulerIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={rulerRaw}
    alt='ruler icon'
  />
}) 

export const BackgroundColorIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={backgroundColorRaw}
    alt='background color icon'
  />
})

export const ZoomInIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={zoomInRaw}
    alt='point cloud zoom in icon'
  />
})

export const ZoomOutIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={zoomOutRaw}
    alt='point cloud zoom out icon'
  />
})

export const BoundingBoxIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={boundingBoxRaw}
    alt='bounding box icon'
  />
})
