import React, { lazy as lazyReact } from 'react'

const routerWrapper = (Component) =>
  (props) => <Component {...props} />

export const lazy = (fn) => routerWrapper(lazyReact(fn))
