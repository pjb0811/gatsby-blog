import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import gatsbyIcon from '../../assets/gatsby.png'

const styles = theme => ({
  root: {
    padding: 20,
    background: theme.palette.grey['200'],
  },
  caption: {
    textAlign: 'center',
  },
  gatsby: {
    width: 24,
    height: 24,
    verticalAlign: 'middle',
  },
})

class Footer extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Grid item xs={12}>
          <Typography
            variant="subtitle2"
            color="inherit"
            className={classes.caption}
          >
            Copyright © 2018. pjb0811 All rights reserved.
          </Typography>
          <Typography
            variant="subtitle2"
            color="inherit"
            className={classes.caption}
          >
            Powered by{' '}
            <a href="https://www.gatsbyjs.org/">
              <img src={gatsbyIcon} className={classes.gatsby} alt="gatsby" />
            </a>
          </Typography>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Footer)
