import React, { Component } from 'react'
import MoveButton from '../atoms/MoveButton'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  nav: {
    padding: 20,
  },
})

class PostNavigation extends Component {
  render() {
    const { previous, next, classes } = this.props

    return (
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        className={classes.nav}
      >
        <MoveButton direction={previous} rel="prev" />
        <MoveButton direction={next} rel="next" />
      </Grid>
    )
  }
}

export default withStyles(styles)(PostNavigation)
