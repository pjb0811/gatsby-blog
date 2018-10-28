import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import gatsbyIcon from '../../assets/gatsby.png'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  footerRoot: {
    padding: 20,
    background: theme.palette.secondary.main,
  },
})

class Footer extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.footerRoot}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="inherit" align="center">
            Copyright © 2018. pjb0811 All rights reserved.
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <IconButton color="inherit">
              <a href="https://github.com/pjb0811" className="icon">
                <Icon className={'fab fa-github'} fontSize="small" />
              </a>
            </IconButton>
            <IconButton color="inherit">
              <a href="mailto:pjb0811@gmail.com" className="icon">
                <Icon className={'far fa-envelope'} fontSize="small" />
              </a>
            </IconButton>
            <IconButton color="inherit">
              <a href="/rss.xml" className="icon">
                <Icon className={'fas fa-rss'} fontSize="small" />
              </a>
            </IconButton>
          </div>
          <Typography variant="subtitle2" color="inherit" align="center">
            Powered by{' '}
            <a href="https://www.gatsbyjs.org/">
              <img
                src={gatsbyIcon}
                alt="gatsby"
                style={{
                  width: 24,
                  height: 24,
                  verticalAlign: 'middle',
                  marginLeft: 10,
                }}
              />
            </a>
          </Typography>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(Footer)
