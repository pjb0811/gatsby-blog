import React, { Component } from 'react'
import MoveButton from '../atoms/MoveButton'
import Grid from '@material-ui/core/Grid'

class PostNavigation extends Component {
  render() {
    const { previous, next } = this.props

    return (
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        style={{
          padding: 20,
        }}
      >
        <MoveButton direction={previous} rel="prev" />
        <MoveButton direction={next} rel="next" />
      </Grid>
    )
  }
}

export default PostNavigation
