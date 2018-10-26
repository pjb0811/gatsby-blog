import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 300,
  },
  text: {
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
        <Typography variant="h3" align="center" className={classes.text}>
          Welcome to my blog!
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          className={`${classes.text} ${classes.subtitle}`}
        >
          Introduce React, TypeScript, and JavaScript related postings.
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Jumbotron)
