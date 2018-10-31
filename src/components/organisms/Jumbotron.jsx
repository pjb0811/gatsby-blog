import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 300,
  },
  title: {
    color: '#fff',
    fontWeight: 500,
  },
  subtitle: {
    marginTop: 20,
  },
})

class Jumbotron extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Typography variant="h3" align="center" className={classes.title}>
          Welcome to my blog!
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          className={`${classes.title} ${classes.subtitle}`}
        >
          Introduce HTML, CSS, and JavaScript related postings.
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'jumbotron' })(Jumbotron)
