import React, { Component } from 'react'
import { Link } from 'gatsby'
import get from 'lodash/get'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  list: {
    margin: '10px auto',
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
})

class PostList extends Component {
  render() {
    const { posts, classes } = this.props

    return (
      <Grid item xs={8} className={classes.list}>
        <Grid container spacing={24}>
          {posts.map(({ node }) => {
            const title = get(node, 'frontmatter.title') || node.fields.slug

            return (
              <Grid item xs={12} key={node.fields.slug}>
                <Paper className={classes.paper} elevation={1}>
                  <Link to={node.fields.slug} className={classes.link}>
                    <Typography variant="h5" component="h3">
                      {title}
                      <Typography variant="caption">
                        {node.frontmatter.date}
                      </Typography>
                    </Typography>
                    <Typography component="p">{node.excerpt}</Typography>
                  </Link>
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(PostList)
