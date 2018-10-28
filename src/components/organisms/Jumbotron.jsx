import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  jumbotronRoot: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: 300,
  },
  jumbotronText: {
    color: '#fff',
    fontWeight: 500,
  },
  jumbotronSubTitle: {
    marginTop: 20,
  },
})

class Jumbotron extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.jumbotronRoot}>
        <Typography
          variant="h3"
          align="center"
          className={classes.jumbotronText}
        >
          Welcome to my blog!
        </Typography>
        <Typography
          variant="jumbotronSubTitle1"
          align="center"
          className={`${classes.jumbotronText} ${classes.jumbotronSubTitle}`}
        >
          Introduce React, TypeScript, and JavaScript related postings.
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(Jumbotron)
