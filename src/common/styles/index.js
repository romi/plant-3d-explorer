import { global } from 'rd/nano'

import InterRegular from './assets/Inter-Regular.ttf'
import InterMedium from './assets/Inter-Medium.ttf'
import InterBold from './assets/Inter-Bold.ttf'

global(`
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
    user-select: none;
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
    overflow-y: scroll;
  }

  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    opacity: 1;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 5px;
    background: #606060;
  }

  ::-webkit-scrollbar-thumb {
    width: 3px;
    background-color: #A7A7A7;
  }
`)
