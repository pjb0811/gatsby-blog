import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import PostCard from '../molecules/PostCard'

const styles = theme => ({
  postListRoot: {
    margin: '0 auto',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
  },
  postListContainer: {
    width: '100%',
    margin: 0,
  },
})

class PostList extends Component {
  render() {
    const { posts, classes } = this.props

    return (
      <div className={classes.postListRoot}>
        <Grid container spacing={24} className={classes.postListContainer}>
          {posts.map(({ node }) => (
            <PostCard key={node.fields.slug} node={node} />
          ))}
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles)(PostList)
