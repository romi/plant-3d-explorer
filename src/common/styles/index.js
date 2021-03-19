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
import { Global, css } from '@emotion/core'

import InterRegular from './assets/Inter-Regular.ttf'
import InterMedium from './assets/Inter-Medium.ttf'
import InterBold from './assets/Inter-Bold.ttf'
import { green, darkGreen } from './colors'

const rules = css(`
  @font-face {
    font-family: Inter;
    src: url('${InterRegular}') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: Inter;
    src: url('${InterMedium}') format('truetype');
    font-weight: 500;
  }

  @font-face {
    font-family: Inter;
    src: url('${InterBold}') format('truetype');
    font-weight: 700;
  }

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    line-height: 1.35rem;
    height: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Inter;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;

    overflow-x: hidden;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    opacity: 1;
  }

  input, button {
    background-color: transparent
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: rgba(151, 172, 163, 0.1);
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${green};
  }
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${darkGreen};
  }
`)

export default () => {
  return <Global styles={rules} />
}
