import React, { Component } from 'react'
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  moveLeftIcon: {
    marginRight: theme.spacing.unit,
  },
  moveRightIcon: {
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
      <Button
        component={Link}
        variant="contained"
        color="primary"
        to={direction.fields.slug}
      >
        {rel === 'prev' && (
          <Icon className={`fas fa-arrow-left ${classes.moveLeftIcon}`} />
        )}
        <Typography
          variant="button"
          color="inherit"
          noWrap={true}
          style={{
            width: 100
          }}
        >
          {direction.frontmatter.title}
        </Typography>
        {rel === 'next' && (
          <Icon className={`fas fa-arrow-right ${classes.moveRightIcon}`} />
        )}
      </Button>
    )
  }
}

export default withStyles(styles)(Move)
