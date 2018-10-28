import React, { Component, Fragment } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pageTitleMain: {
    marginBottom: 20,
  },
})

class PageTitle extends Component {
  render() {
    const { classes, title, subTitle } = this.props
    return (
      <Fragment>
        <Typography variant="h3" className={classes.pageTitleMain}>
          {title}
        </Typography>
        <Typography variant="subtitle1" align="right">
          {subTitle}
        </Typography>
      </Fragment>
    )
  }
}

export default withStyles(styles)(PageTitle)
