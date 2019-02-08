import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../templates/Layout'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import PostNavigation from '../molecules/PostNavigation'
import { DiscussionEmbed } from 'disqus-react'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ImageCover from '../molecules/ImageCover'
import PageTitle from '../molecules/PageTitle'
import TranslationGuide from '../molecules/TranslationGuide'
import 'github-markdown-css'

const styles = theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
    margin: '20px auto',
  },
  container: {
    width: '100%',
    margin: 0,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  paper: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
  },
})

class BlogPost extends React.Component {
  render() {
    const { pageContext } = this.props
    const { site, markdownRemark: post } = this.props.data
    const { title, mainImage } = post.frontmatter
    const { classes } = this.props
    const disqusShortname = 'pjb0811'
    const disqusConfig = {
      identifier: post.id,
      title,
    }

    return (
      <Layout location={this.props.location}>
        <Helmet
          title={`${title}`}
          meta={[
            { name: 'description', content: post.excerpt },
            {
              name: 'image',
              content: `${site.siteMetadata.siteUrl}${
                mainImage.childImageSharp.sizes.src
              }`,
            },
            {
              name: 'og:url',
              content: `${site.siteMetadata.siteUrl}${pageContext.slug}`,
            },
            { name: 'og:type', content: 'article' },
            { name: 'og:title', content: title },
            { name: 'og:description', content: post.excerpt },
            {
              name: 'og:image',
              content: `${site.siteMetadata.siteUrl}${
                mainImage.childImageSharp.sizes.src
              }`,
            },
          ]}
        />
        <ImageCover
          img={mainImage.childImageSharp.sizes.src}
          alt={`${title}`}
        />
        <div className={classes.root}>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <PageTitle title={title} subTitle={post.frontmatter.date} />
                <div className={classes.buttons}>
                  {post.frontmatter.tags.map((tag, i) => (
                    <Button
                      key={i}
                      color="primary"
                      className={classes.button}
                      component={Link}
                      to={`/tags/${tag}`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
                <TranslationGuide translation={post.frontmatter.translation} />
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />
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

export default withStyles(styles, { name: 'blogPost' })(BlogPost)

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        description
        siteUrl
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
        translation {
          title
          link
        }
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
