import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import { Link } from 'gatsby'

const styles = theme => ({
  progressRoot: {
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

class AnalysisList extends Component {
  render() {
    const { list, classes } = this.props
    console.log(list)

    if (!list.length) {
      return (
        <div className={classes.progressRoot}>
          <CircularProgress className={classes.progress} />
        </div>
      )
    }

    return (
      <List>
        {list.map(item => (
          <ListItem key={item.url} component={Link} to={item.url} button>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                noWrap: true,
              }}
              secondary={item.date}
            />
            {item.pageview}
          </ListItem>
        ))}
      </List>
    )
  }
}

export default withStyles(styles, { name: 'analysisList' })(AnalysisList)
