import React from 'react'
import { map } from 'lodash'

import styled from '@emotion/styled'

import { useLayers } from 'flow/settings/accessors'
import { useSelectedcamera } from 'flow/interactions/accessors'

import { useScan } from 'flow/scans/accessors'
import { useWorld3dReset } from 'Viewer/World/shares'

const Container = styled.div({
  position: 'absolute',
  top: 5,
  left: 5,
  width: 150,
  padding: 10,
  zIndex: 1,
  background: 'white',
  borderRadius: 3
})
const Sublevel = styled.div({
  paddingLeft: 10
})
const Input = styled.input({
  display: 'inline-block',
  marginRight: 10
})

const Select = styled.select({
  width: 110
})

const Button = styled.div({
  display: 'inline-block',
  padding: '1px 10px',
  background: 'white',
  border: '1px solid grey',
  borderRadius: 3,
  marginRight: 10,
  cursor: 'pointer',

  '&:hover': {
    opacity: 0.5
  }
})

export default function Controls (props) {
  const [layers, setLayers] = useLayers()
  const [scan] = useScan()
  const cameraPoses = ((scan && scan.camera.poses) || [])
  const [selectedCamera, setSelectedCamera] = useSelectedcamera()
  const [worldViewReset] = useWorld3dReset()

  return <Container>
    <div>
      Layers:
      <Sublevel>
        {
          map(
            layers,
            (value, key) => {
              return <div key={key}>
                <label>
                  <Input
                    className='form-check-input'
                    type='checkbox'
                    onChange={(e) => setLayers({ ...layers, [key]: e.target.checked })}
                    value={value}
                    checked={value}
                  />
                  {key}
                </label>
              </div>
            }
          )
        }
      </Sublevel>
    </div>
    <div>
      Cameras:
      <Sublevel>
        <Select
          value={(selectedCamera && `${selectedCamera.index}`) || 'none'}
          onChange={(e) => {
            setSelectedCamera(cameraPoses[e.target.value])
          }}
        >
          <option key={'none'} value={'none'}>None</option>
          {
            cameraPoses && map(
              cameraPoses,
              (point) => {
                return <option key={point.id} value={point.index}>{point.fileName}</option>
              }
            )
          }
        </Select>
        <div>
          <Button
            onClick={() => {
              if (selectedCamera) {
                if (cameraPoses[selectedCamera.index - 1]) {
                  setSelectedCamera(cameraPoses[selectedCamera.index - 1])
                } else {
                  setSelectedCamera(cameraPoses[0])
                }
              }
            }}
          >
            -
          </Button>
          <Button
            onClick={() => {
              if (selectedCamera) {
                if (cameraPoses[selectedCamera.index + 1]) {
                  setSelectedCamera(cameraPoses[selectedCamera.index + 1])
                } else {
                  setSelectedCamera(cameraPoses[0])
                }
              }
            }}
          >
            +
          </Button>
        </div>
      </Sublevel>
      {
        worldViewReset && <Sublevel>
          <input type='button' value='RESET' onClick={() => worldViewReset()} />
        </Sublevel>
      }
    </div>
  </Container>
}
