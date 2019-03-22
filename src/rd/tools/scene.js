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
