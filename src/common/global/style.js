import { global } from 'rd/nano'

import RobotoRegular from './assets/Roboto-Regular.ttf'

global(`
  * {
    box-sizing: border-box;
    user-select: none;
  }

  html {
    font-size: 62.5%;
    line-height: 1.35rem;
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

  @font-face {
    font-family: Roboto;
    src: url('${RobotoRegular}') format('truetype');
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    overflow: hidden;
  }
`)
