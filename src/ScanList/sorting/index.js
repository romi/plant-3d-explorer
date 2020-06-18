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
import React, { memo } from 'react'
import styled from '@emotion/styled'
import { FormattedMessage } from 'react-intl'
import { omit } from 'lodash'

import { useSorting } from 'flow/scans/accessors'
import { H3 } from 'common/styles/UI/Text/titles'
import { darkGreen } from 'common/styles/colors'
import Filtering from 'ScanList/filtering'
import Tooltip, { TooltipContent } from 'rd/UI/Tooltip'

import sortingIconNeutral from './assets/ico.table_sort_neutral.7x12.svg'
import sortingIconAsc from './assets/ico.table_sort_asc.7x12.svg'
import sortingIconDesc from './assets/ico.table_sort_desc.7x12.svg'

const Container = styled.div({
  width: '100%',
  height: 81,
  borderBottom: '1px solid rgba(21,119,65, 0.15)',
  display: 'grid',
  gridTemplateColumns: `
    calc(105px + 9.8% + 16px + 5px)
    calc(15.7% - 8px)
    calc(10% - 6px)
    calc(10.3% - 10px) 
    11%
  `,
  gridColumnGap: 29
})

const H3Button = H3.withComponent('button')
const SortingIcon = styled.img((props) => {
  return {
    marginLeft: 9
  }
})

const SortingOption = memo(styled((props) => {
  return <H3Button {...omit(props, ['children'])}>
    {props.children}
    <SortingIcon
      src={
        !props.selected
          ? sortingIconNeutral
          : props.method === 'asc'
            ? sortingIconAsc
            : sortingIconDesc
      }
      selected={props.selected}
    />
  </H3Button>
})({
  padding: 0,
  margin: 0,
  outline: 'none',
  border: 'none',
  textAlign: 'left',
  background: 'none',
  color: darkGreen,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',

  '&:hover, &:focus': {
    textDecoration: 'underline'
  }
}, (props) => {
  return {
    textDecoration: props.selected ? 'underline' : 'none'
  }
}))

const ColumTitle = styled(H3)({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column'
})

export default function () {
  const [sorting, sortings, setSorting] = useSorting()
  return <Container>
    {
      sortings.map((d) => {
        const isSelected = sorting.label === d.label
        return <SortingOption
          key={d.label}
          selected={isSelected}
          onClick={(e) => {
            setSorting(
              !isSelected
                ? d
                : {
                  ...sorting,
                  method: d.method === 'asc' ? 'desc' : 'asc'
                }
            )
          }}
          method={(isSelected ? sorting : d).method}
        >
          <FormattedMessage id={`scanlist-sort-${d.label}`} />
        </SortingOption>
      })
    }
    <ColumTitle key={'data'}>
      <Tooltip>
        <FormattedMessage id={'scanlist-data-availability'} />
        <TooltipContent style={{ marginTop: -60 }}>
          <H3>
            <FormattedMessage id={'scanlist-filter-data-availability'} />
          </H3>
        </TooltipContent>
      </Tooltip>
      <Filtering />
    </ColumTitle>
  </Container>
}
