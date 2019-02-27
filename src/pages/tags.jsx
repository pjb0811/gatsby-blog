import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import withLayout from '../components/templates/withLayout'
import TagList from '../components/organisms/TagList'
import ImageCover from '../components/molecules/ImageCover'
import tagImage from '../assets/tags.jpg'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
  },
  container: {
    width: '100%',
    margin: 0,
  },
  title: {
    marginBottom: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

class Tags extends Component {
  render() {
    const {
      data: {
        allMarkdownRemark: { group },
        site: {
          siteMetadata: { title },
        },
      },
      classes,
    } = this.props

    return (
      <Fragment>
        <Helmet title={title} />
        <ImageCover img={tagImage} alt="tags" />
        <div className={classes.root}>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h3" className={classes.title}>
                  Tags
                </Typography>
                <TagList group={group} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    )
  }
}

export default withLayout(withStyles(styles, { name: 'tags' })(Tags))

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
