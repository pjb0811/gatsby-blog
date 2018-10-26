import React, { Component } from 'react'
import { Link } from 'gatsby'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Icon from '@material-ui/core/Icon'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  buttonText: {
    width: 100,
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
          <Icon className={`fas fa-arrow-left ${classes.leftIcon}`} />
        )}
        <Typography
          variant="button"
          color="inherit"
          noWrap={true}
          className={classes.buttonText}
        >
          {direction.frontmatter.title}
        </Typography>
        {rel === 'next' && (
          <Icon className={`fas fa-arrow-right ${classes.rightIcon}`} />
        )}
      </Button>
    )
  }
}

export default withStyles(styles)(Move)
