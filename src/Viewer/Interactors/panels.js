import React, { useState, useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from '@emotion/styled'
import { get } from 'lodash'

import { usePanels } from 'flow/settings/accessors'
import { useScan } from 'flow/scans/accessors'

import { green, darkGreen } from 'common/styles/colors'
import { H3 } from 'common/styles/UI/Text/titles'

import { ExpandIcon, ShrinkIcon } from './icons'

const Container = styled.div`
  position: absolute;
  top: 35px;
  right: 1px;
  display: flex;
`

const ExpandBtn = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  background: ${green};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    filter: saturate(130%);
  }

  &:active {
    background: ${darkGreen};
  }
`

const List = styled.div`
`
const Option = styled.div`
  cursor: pointer;
  padding-right: 0px;
  width: 160px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding-left: 15px;
  height: 40px;

  &:hover {
    background: ${green};

    span {
      color: white;
    }
  }

  &:active {
    background: ${darkGreen};

    span {
      color: white;
    }
  }
`
const OptionText = styled(H3)`
  margin: 0px;
  text-transform: none;
  color: ${green};
`

const ListHeader = styled(Option)`
  background: ${green};
  cursor: default;

  span {
    color: white;
  }

  &:active {
    background: ${green};

    span {
      color: white;
    }
  }
`

export default function PanelsInteractor () {
  const [panels, setPanels] = usePanels()
  const [isOpen, setIsOpen] = useState(false)
  const [scan] = useScan()

  useEffect(() => {
    const onOutsideClick = () => setIsOpen(false)
    if (isOpen) window.addEventListener('click', onOutsideClick)
    return () => window.removeEventListener('click', onOutsideClick)
  }, [isOpen])

  const stopPropagation = useCallback((e) => {
    e.stopPropagation()
  }, [])

  const togglFn = useCallback(() => {
    setIsOpen((v) => !v)
  }, [setIsOpen])

  const isPanelUsable = {
    ...(
      Object.keys(panels).reduce((p, c) => {
        p[c] = true
        return p
      }, {})
    ),
    'panels-angles': !!get(scan, 'data.angles.angles'),
    'panels-distances': !!get(scan, 'data.angles.internodes')
  }

  const validePanels = Object
    .keys(panels)
    .reduce((p, c) => {
      if (isPanelUsable[c]) p[c] = panels[c]
      return p
    }, {})

  const haveOptions = Object.keys(validePanels)
    .map((d) => panels[d])
    .filter((d) => !d)
    .length

  if (!haveOptions) return null

  return <Container onClick={stopPropagation}>
    {
      isOpen
        ? (
          <List>
            <ListHeader>
              <OptionText>
                <FormattedMessage id='panels-add' />
              </OptionText>
              <ExpandBtn onClick={togglFn}>
                <ShrinkIcon />
              </ExpandBtn>
            </ListHeader>

            {
              Object.keys(validePanels)
                .filter((id) => !panels[id])
                .map((d) => {
                  return (
                    <Option
                      key={d}
                      onClick={(e) => {
                        setPanels({
                          ...panels,
                          [d]: true
                        })
                        setIsOpen(false)
                      }}
                    >
                      <OptionText>
                        <FormattedMessage id={d} />
                      </OptionText>
                    </Option>
                  )
                })
            }
          </List>
        )
        : (
          <ExpandBtn onClick={togglFn}>
            <ExpandIcon />
          </ExpandBtn>
        )
    }
  </Container>
}
