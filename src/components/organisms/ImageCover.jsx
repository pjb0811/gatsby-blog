import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  imageCoverRoot: {
    position: 'absolute',
    width: '100%',
    height: 400,
  },
  imageCoverSpace: {
    height: 300,
  },
  imageCoverImg: {
    zIndex: -1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center center',
  },
})

class ImageCover extends Component {
  render() {
    const { classes, children, img, alt } = this.props

    return (
      <Fragment>
        <div className={classes.imageCoverRoot}>
          <img src={img} className={classes.imageCoverImg} alt={alt} />
          {children}
        </div>
        <div className={classes.imageCoverSpace} />
      </Fragment>
    )
  }
}

export default withStyles(styles)(ImageCover)
