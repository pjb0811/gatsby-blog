import React, { Component } from 'react'
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})

class Move extends Component {
  render() {
    const { direction, rel, classes } = this.props
    if (!direction) {
      return null
    }

    return (
      <Link to={direction.fields.slug} rel={rel} className={classes.link}>
        <Button variant="contained" color="primary">
          {rel === 'prev' && (
            <Icon className={`fas fa-arrow-left ${classes.leftIcon}`} />
          )}
          {direction.frontmatter.title}
          {rel === 'next' && (
            <Icon className={`fas fa-arrow-right ${classes.rightIcon}`} />
          )}
        </Button>
      </Link>
    )
  }
}

export default withStyles(styles)(Move)
