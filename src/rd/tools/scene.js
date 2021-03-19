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

const defaultWidth = 800
const defaultHeight = 300

export default function SceneWrap (Component, options = {}) {
  class Container extends React.Component {
    componentDidMount () {
      this.forceUpdate()
      window.addEventListener('resize', this.lazyUpdate, false)
    }

    componentWillUnmount () {
      window.removeEventListener('resize', this.lazyUpdate, false)
    }

    lazyUpdate = () => {
      this.setState({})
    }

    getSize () {
      return (this.refs.self)
        ? {
          containerWidth: (this.refs.self.offsetWidth || 1),
          containerHeight: (this.refs.self.offsetHeight || 1) }
        : {
          containerWidth: defaultWidth,
          containerHeight: defaultHeight
        }
    }

    render (props = this.props) {
      return <div
        ref='self'
        style={{
          width: '100%',
          height: '100%',
          position: props.scenePosition || 'relative'
        }}
      >
        {
          this.refs.self && <Component {...this.props} {...this.getSize()} />
        }
      </div>
    }
  }

  return Container
}
