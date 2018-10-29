import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { Link } from 'gatsby'

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 20px',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
})

class NotFoundPage extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <Typography variant="h3" className={classes.title}>
            Page not found :(
          </Typography>
          <Typography variant="subtitle1">
            Maybe the page you are looking for has been removed, or you typed in
            the wrong URL
          </Typography>
          <Button
            variant="contained"
            component={Link}
            className={classes.button}
            to="/"
          >
            GO HOME
          </Button>
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'notFound' })(NotFoundPage)
