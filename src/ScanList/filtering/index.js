import React, { useEffect } from 'react'
import styled from '@emotion/styled'

import { omit } from 'lodash'

import { useFiltering } from 'flow/scans/accessors'

import meshIcon from 'common/assets/ico.mesh.21x21.svg'
import pointCloudIcon from 'common/assets/ico.point_cloud.21x21.svg'
import skeletonIcon from 'common/assets/ico.skeleton.21x21.svg'
import nodeIcon from 'common/assets/ico.internodes.21x21.svg'

const Icon = styled((props) => <div {...omit(props, ['isActive'])} />)({
  display: 'inline-block',
  width: 24,
  height: 24,
  marginLeft: 8,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  cursor: 'pointer'
}, (props) => {
  return {
    backgroundImage: `url(${props.src})`,
    opacity: props.isActive ? 1 : 0.8,
    filter: props.isActive ? 'none' : 'grayscale(100%)'
  }
})

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  marginTop: 10
})

export default function (props) {
  const [filtering, setFiltering] = useFiltering()

  useEffect(() => {
    setFiltering({
      hasMesh: false,
      hasPointCloud: false,
      hasSkeleton: false,
      hasAngleData: false
    })
  }, [])

  return <RowContainer>
    <Icon src={meshIcon}
      onClick={() => setFiltering({
        ...filtering,
        hasMesh: !filtering.hasMesh })}
      isActive={filtering.hasMesh}
    />
    <Icon src={pointCloudIcon}
      onClick={() => setFiltering({
        ...filtering,
        hasPointCloud: !filtering.hasPointCloud })}
      isActive={filtering.hasPointCloud}
    />
    <Icon src={skeletonIcon}
      onClick={() => setFiltering({
        ...filtering,
        hasSkeleton: !filtering.hasSkeleton })}
      isActive={filtering.hasSkeleton}
    />
    <Icon src={nodeIcon}
      onClick={() => setFiltering({
        ...filtering,
        hasAngleData: !filtering.hasAngleData })}
      isActive={filtering.hasAngleData}
    />
  </RowContainer>
}
