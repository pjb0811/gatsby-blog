import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import PostCard from '../molecules/PostCard'

const styles = theme => ({
  list: {
    margin: '10px auto',
  },
})

class PostList extends Component {
  render() {
    const { posts, classes } = this.props

    return (
      <Grid item xs={8} className={classes.list}>
        <Grid container spacing={24}>
          {posts.map(({ node }) => (
            <PostCard key={node.fields.slug} node={node} />
          ))}
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(PostList)
