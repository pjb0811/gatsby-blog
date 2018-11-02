import React, { Component } from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'gatsby'

const styles = theme => ({
  popper: {
    marginTop: 10,
    width: '100%',
  },
  list: {
    maxHeight: 300,
    overflow: 'auto',
  },
  chips: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
})

class SearchList extends Component {
  render() {
    const { open, results, classes, handleClose, anchorEl } = this.props

    return (
      <Popper
        open={open}
        anchorEl={anchorEl}
        transition
        disablePortal
        className={classes.popper}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List className={classes.list}>
                  {results.map(result => (
                    <ListItem
                      button
                      key={result.path}
                      component={Link}
                      to={result.path}
                    >
                      <ListItemText
                        primary={result.title}
                        primaryTypographyProps={{
                          variant: 'button',
                          color: 'textPrimary',
                          noWrap: true,
                        }}
                        secondary={result.tags.join(', ')}
                      />
                    </ListItem>
                  ))}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    )
  }
}

export default withStyles(styles, { name: 'searchList' })(SearchList)
