import React, { Component, Fragment } from 'react'
import Typography from '@material-ui/core/Typography'

class PageTitle extends Component {
  render() {
    const { title, subTitle } = this.props
    return (
      <Fragment>
        <Typography variant="h3" style={{ marginBottom: 20 }}>
          {title}
        </Typography>
        <Typography variant="subtitle1" align="right">
          {subTitle}
        </Typography>
      </Fragment>
    )
  }
}

export default PageTitle
