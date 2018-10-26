import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../templates/Layout'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import PostNavigation from '../molecules/PostNavigation'
import { DiscussionEmbed } from 'disqus-react'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import ImageCover from '../organisms/ImageCover'

const styles = theme => ({
  root: {
    margin: '20px auto',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
  },
  post: {
    width: '100%',
    margin: 0,
  },
  chips: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

class BlogPost extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const siteDescription = post.excerpt
    const { classes } = this.props
    const disqusShortname = 'pjb0811'
    const disqusConfig = {
      identifier: post.id,
      title: post.frontmatter.title,
    }

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title || siteTitle}`}
        />
        <ImageCover
          img={post.frontmatter.mainImage.childImageSharp.sizes.src}
          alt={`${post.frontmatter.title || siteTitle}`}
        />
        <div className={classes.root}>
          <Grid container spacing={24} className={classes.post}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h3">{post.frontmatter.title}</Typography>
                <Typography variant="subtitle1" align="right">
                  {post.frontmatter.date}
                </Typography>
                <div className={classes.chips}>
                  {post.frontmatter.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      color="secondary"
                      label={tag}
                      className={classes.chip}
                    />
                  ))}
                </div>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <DiscussionEmbed
                  shortname={disqusShortname}
                  config={disqusConfig}
                />
              </Paper>
            </Grid>
            <PostNavigation {...this.props.pageContext} />
          </Grid>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles)(BlogPost)

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "YYYY.MM.DD")
        tags
        mainImage {
          childImageSharp {
            sizes(maxWidth: 1200) {
              aspectRatio
              base64
              sizes
              src
              srcSet
            }
          }
        }
      }
    }
  }
`
