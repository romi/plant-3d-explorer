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
