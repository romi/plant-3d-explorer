import React from 'react'
import { map } from 'lodash'

import { styled } from 'rd/nano'
import { useLayers } from 'flow/settings/accessors'

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

export default function Controls (props) {
  const [layers, setLayers] = useLayers()

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
  </Container>
}
