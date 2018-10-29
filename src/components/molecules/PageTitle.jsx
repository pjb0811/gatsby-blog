import React, { Component, Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  title: { marginBottom: 20 },
})

class PageTitle extends Component {
  render() {
    const { title, subTitle, classes } = this.props
    return (
      <Fragment>
        <Typography variant="h3" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="subtitle1" align="right">
          {subTitle}
        </Typography>
      </Fragment>
    )
  }
}

export default withStyles(styles, { name: 'pageTitle' })(PageTitle)
