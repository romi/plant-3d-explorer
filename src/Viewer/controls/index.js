import React from 'react'
import { map } from 'lodash'

import { styled } from 'rd/nano'
import useFetch from 'rd/tools/hooks/fetch'
import { useLayers, useSelectedcamera } from 'flow/settings/accessors'

import urls from '../assets'

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
  const [cameraPoints] = useFetch(urls.cameraPoints)
  const [selectedCamera, setSelectedCamera] = useSelectedcamera()

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
          value={(selectedCamera && selectedCamera.id) || 'none'}
          onChange={(e) => {
            setSelectedCamera(cameraPoints[e.target.value])
          }}
        >
          <option key={'none'} value={'none'}>None</option>
          {
            cameraPoints && map(
              cameraPoints,
              (point) => {
                return <option key={point.id} value={point.id}>{point.name}</option>
              }
            )
          }
        </Select>
        <div>
          <Button
            onClick={() => {
              if (selectedCamera) {
                if (cameraPoints[selectedCamera.id - 1]) {
                  setSelectedCamera(cameraPoints[selectedCamera.id - 1])
                } else {
                  setSelectedCamera(cameraPoints['0'])
                }
              }
            }}
          >
            -
          </Button>
          <Button
            onClick={() => {
              if (selectedCamera) {
                if (cameraPoints[selectedCamera.id + 1]) {
                  setSelectedCamera(cameraPoints[selectedCamera.id + 1])
                } else {
                  setSelectedCamera(cameraPoints['0'])
                }
              }
            }}
          >
            +
          </Button>
          {/* <input type='button'>+</input> */}
          {/* <input type='button'>-</input> */}
        </div>
      </Sublevel>
    </div>
  </Container>
}
