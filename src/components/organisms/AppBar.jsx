import React, { Component, Fragment } from 'react'
import { Link } from 'gatsby'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AppMenu from '../molecules/AppMenu'
import SearchBox from '../molecules/SearchBox'
import Drawer from '@material-ui/core/Drawer'
import SideList from '../molecules/SideList'

const styles = theme => ({
  appBarRoot: {
    width: '100%',
  },
  appBarGrow: {
    flexGrow: 1,
  },
  appBarMenuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  appBarSpace: {
    ...theme.mixins.toolbar,
    marginBottom: 10,
  },
  appBarTitle: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
})

class ButtonAppBar extends Component {
  state = {
    drawer: {
      open: false,
    },
  }

  toggleDrawer = open => () => {
    this.setState({
      drawer: {
        open,
      },
    })
  }

  render() {
    const { classes } = this.props
    const { drawer } = this.state

    return (
      <Fragment>
        <Drawer open={drawer.open} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            <SideList />
          </div>
        </Drawer>
        <div className={classes.appBarRoot}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                className={classes.appBarMenuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                color="inherit"
                className={classes.appBarTitle}
                component={Link}
                to={'/'}
              >
                pjb0811.github.io
              </Typography>
              <div className={classes.appBarGrow} />
              <SearchBox />
              <AppMenu />
            </Toolbar>
          </AppBar>
        </div>
        <div className={classes.appBarSpace} />
      </Fragment>
    )
  }
}

export default withStyles(styles)(ButtonAppBar)
