import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { Link } from 'gatsby'

const styles = theme => ({
  sideHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

class SideList extends Component {
  render() {
    const { classes } = this.props

    return (
      <div style={{ width: 250 }}>
        <div className={classes.sideHeader}>
          <Typography variant="h6" color="inherit" component={Link} to="/">
            pjb0811.github.io
          </Typography>
        </div>
        <Divider />
        <List>
          <a href="https://github.com/pjb0811">
            <ListItem button>
              <ListItemIcon>
                <Icon className={'fab fa-github'} />
              </ListItemIcon>

              <ListItemText primary={'github'} />
            </ListItem>
          </a>
          <ListItem button component={Link} to="/tags">
            <ListItemIcon>
              <Icon className={'fas fa-tag'} />
            </ListItemIcon>

            <ListItemText primary={'tags'} />
          </ListItem>
          <a href="mailto:pjb0811@gmail.com">
            <ListItem button>
              <ListItemIcon>
                <Icon className={'far fa-envelope'} />
              </ListItemIcon>

              <ListItemText primary={'mail'} />
            </ListItem>
          </a>
        </List>
      </div>
    )
  }
}

export default withStyles(styles)(SideList)
