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
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { format } from 'date-fns'

import { H2, H3 } from 'common/styles/UI/Text/titles'
import { green, darkGreen } from 'common/styles/colors'
import { landingUrl } from 'common/routing'

import { useScan } from 'flow/scans/accessors'

import { DocLink } from 'ScanList/list/index'

import Logo from './assets/ico.logo_minified.25x31.svg'
import chevronIco from './assets/ico.chevron.8x12.svg'
import { useResetSettings } from 'flow/settings/accessors'
import { useResetInteraction } from 'flow/interactions/accessors'
import { Settings } from './Settings'

export const headerHeight = 80

const Container = styled.div({
  width: '100%',
  height: headerHeight,
  background: 'white',
  padding: '0px 40px',

  gridTemplateColumns: '0.55fr 1fr 210px',
  display: 'grid',
  gridColumnGap: 0
})

const Column = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: '100%'
})
const InlineElement = styled.div({
  display: 'flex',
  alignItems: 'center'
})

const AllScans = styled((props) => <Link {...props} />)({
  textDecoration: 'none',
  color: green,

  '&:hover': {
    textDecoration: 'underline'
  }
})
const BackH2 = styled(H2)({
  color: green
})

const Chevron = styled.img({
  marginLeft: 13,
  marginRight: 13,
  marginTop: 2
})

const TypeContainer = styled.div({
  marginRight: 35
})

const TypeWording = styled(H3)({
  margin: 0,
  marginBottom: 3,
  marginRight: 11
})

const TypeValue = styled(H3)({
  margin: 0,
  textTransform: 'none',
  fontWeight: 700,
  color: darkGreen,
  fontSize: 13,
  letterSpacing: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis'
})

const MarginedDocLink = styled(DocLink)({
  marginRight: 10,
  display: 'inline-block'
})




export default function () {
  const [scan] = useScan()
  const [resetSettings] = useResetSettings()
  const [resetInteractions] = useResetInteraction()

  return (
    <Container>
      <Column>
        <InlineElement style={{ marginRight: 10 }}>
          <img src={Logo} alt="" />
        </InlineElement>
        <InlineElement>
          <AllScans
            to={landingUrl}
            onClick={() => {
              resetSettings();
              resetInteractions();
            }}
          >
            <BackH2>
              <FormattedMessage id="header-back" />
            </BackH2>
          </AllScans>
          <Chevron src={chevronIco} />
          <H2>{scan && scan.metadata.plant}</H2>
        </InlineElement>
      </Column>
      <Column
        style={{
          marginRight: 50,
          justifyContent: "flex-end",
        }}
      >
        <TypeContainer>
          <TypeWording>
            <FormattedMessage id="scanlist-sort-species" />
          </TypeWording>
          <TypeValue>{scan && scan.metadata.species}</TypeValue>
        </TypeContainer>
        <TypeContainer>
          <TypeWording>
            <FormattedMessage id="scanlist-sort-environment" />
          </TypeWording>
          <TypeValue>{scan && scan.metadata.environment}</TypeValue>
        </TypeContainer>
        <TypeContainer>
          <TypeWording>
            <FormattedMessage id="scanlist-sort-date" />
          </TypeWording>
          <TypeValue>
            {scan &&
              format(new Date(scan.metadata.date), "MMM DD YYYY HH:mm:ss")}
          </TypeValue>
        </TypeContainer>
      </Column>
      <Column>
        <TypeContainer
          style={{
            justifyContent: "space-between",
            marginRight: 0,
          }}
        >
          {scan && (
            <MarginedDocLink href={scan.metadata.files.archive} target="_blank">
              <FormattedMessage id="scanlist-link-download" />
            </MarginedDocLink>
          )}
          {scan && (
            <MarginedDocLink
              href={scan.metadata.files.metadatas}
              target="_blank"
            >
              <FormattedMessage id="scanlist-link-metadata" />
            </MarginedDocLink>
          )}
        </TypeContainer>
        <InlineElement>
          <Settings
            menu={{
              id: 'user-settings',
              settings: [
                {
                  id: 'general',
                  name: 'General',
                  fields : [
                    {
                      id: 'backgroundColor',
                      name : 'Background Color',
                      type : 'colorpicker',
                      default: '#ECF3F0'
                    }
                  ]
                },
                {
                  id: 'mesh',
                  name: 'Mesh',
                  fields: [
                    {
                      id: 'color',
                      name: 'Color',
                      type: 'colorpicker',
                      default: '#96C0A7'
                    },
                  ],
                },
                {
                  id: 'pcd',
                  name: 'PointCloud',
                  fields: [
                    {
                      id: 'color',
                      name: 'Color',
                      type: 'colorpicker',
                      default : '#F8DE96'
                    },
                    {
                      id : 'density',
                      name : 'Cloud density',
                      type : 'slider' 
                    },
                    {
                      id : 'opacity',
                      name : 'Cloud opacity',
                      type : 'slider' 
                    }
                  ],
                },
                {
                  id: 'segmentedPcd',
                  name: 'Segmented Point Cloud',
                  fields: [
                    {
                      id: 'colors',
                      name: 'Colors',
                      fields: [
                        {
                          id: "fruit",
                          name: "Fruit",
                          type: "colorpicker",
                        },
                        {
                          id: "pedicel",
                          name: "Pedicel",
                          type: "colorpicker",
                        },
                        {
                          id: "stem",
                          name: "Stem",
                          type: "colorpicker",
                        },
                        {
                          id: "flower",
                          name: "Flower",
                          type: "colorpicker",
                        },
                        {
                          id: "leaf",
                          name: "Leaf",
                          type: "colorpicker",
                        }
                      ],
                    },
                    {
                      id : 'density',
                      name : 'Cloud density',
                      type : 'slider' 
                    },
                    {
                      id : 'opacity',
                      name : 'Cloud opacity',
                      type : 'slider' 
                    }
                  ],
                },
                {
                  id: 'skeleton',
                  name: 'Skeleton',
                  fields : []
                },
                {
                  id: 'organs',
                  name: 'Organs',
                  fields : []
                }
              ],
            }}
          />
        </InlineElement>
      </Column>
    </Container>
  );
}
