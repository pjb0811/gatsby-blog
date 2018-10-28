import React, { Component, Fragment } from 'react'

class ImageCover extends Component {
  render() {
    const { children, img, alt } = this.props

    return (
      <Fragment>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: 400,
          }}
        >
          <img
            src={img}
            style={{
              zIndex: -1,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
            alt={alt}
          />
          {children}
        </div>
        <div
          style={{
            height: 300,
          }}
        />
      </Fragment>
    )
  }
}

export default ImageCover
