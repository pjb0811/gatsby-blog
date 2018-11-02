import React, { Component } from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'

const styles = theme => ({})

class TagList extends Component {
  render() {
    const { group } = this.props
    return (
      <List component="nav">
        {group.map(tag => (
          <ListItem
            button
            key={tag.fieldValue}
            component={Link}
            to={`/tags/${kebabCase(tag.fieldValue)}/`}
          >
            <Badge badgeContent={tag.totalCount} color="primary">
              <ListItemText primary={tag.fieldValue} />
            </Badge>
          </ListItem>
        ))}
      </List>
    )
  }
}

export default withStyles(styles, { name: 'tagList' })(TagList)
