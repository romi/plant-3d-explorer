/*

Romi 3D PlantViewer: An browser application for 3D scanned
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
import raw from 'raw.macro'

import { green } from 'common/styles/colors'

const rules = (props) => ({
  default: {
    '& path, & polygon': {
      fill: 'white'
    },
    display: 'flex'
  },
  active: {
    '& path, & polygon': {
      fill: (props.isActivated && props.activated)
        ? 'white'
        : green
    }
  }
})

const meshRaw = raw('../../../common/assets/ico.mesh.21x21.svg')
export const MeshIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={meshRaw}
  />
})

const pointCloudRaw = raw('../../../common/assets/ico.point_cloud.21x21.svg')
export const PointCloudIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={pointCloudRaw}
  />
})

const skeletonRaw = raw('../../../common/assets/ico.skeleton.21x21.svg')
export const SkeletonIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={skeletonRaw}
  />
})

const internodesRaw = raw('../../../common/assets/ico.internodes.21x21.svg')
export const InternodesIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={internodesRaw}
  />
})

const camerasRaw = raw('../assets/ico.cameras.15x9.svg')
export const CamerasIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={camerasRaw}
  />
})

const resertRaw = raw('../assets/ico.reset_view.14x14.svg')
export const ResetIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={{
      default: {
        '& path': {
          fill: 'white'
        }
      },
      active: {
        '& path': {
          fill: green
        }
      }
    }}
    raw={resertRaw}
  />
})

const expandRaw = raw('../../../common/assets/ico.expand-white.14x14.svg')
export const ExpandIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={expandRaw}
  />
})

const shrinkRaw = raw('../../../common/assets/ico.shrink-white.14x14.svg')
export const ShrinkIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={shrinkRaw}
  />
})

const paintRaw = raw('../../../common/assets/ico.paint.23x23.svg')
export const PaintIcon = IconHOC((props) => {
  return <Icon
    {...props}
    rules={rules(props)}
    raw={paintRaw}
  />
})
