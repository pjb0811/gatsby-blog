import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
})

class AppMenu extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.sectionDesktop}>
        <IconButton color="inherit">
          <a href="https://github.com/pjb0811" className="icon">
            <Icon className={'fab fa-github'} />
          </a>
        </IconButton>
        <IconButton color="inherit">
          <a href="/tags" className="icon">
            <Icon className={'fas fa-tag'} />
          </a>
        </IconButton>
        <IconButton color="inherit">
          <a href="/analysis" className="icon">
            <Icon className={'fas fa-chart-bar'} />
          </a>
        </IconButton>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'appMenu' })(AppMenu)
