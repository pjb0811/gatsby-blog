import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../templates/Layout'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PostNavigation from '../molecules/PostNavigation'
import { DiscussionEmbed } from 'disqus-react'

const styles = theme => ({
  post: {
    margin: '10px auto',
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

    console.log(post)

    return (
      <Layout location={this.props.location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <Grid item xs={8} className={classes.post}>
          <Typography variant="h3">{post.frontmatter.title}</Typography>
          <Typography variant="subtitle1" gutterBottom>
            {post.frontmatter.date}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <Divider light />
          <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
          <PostNavigation {...this.props.pageContext} />
        </Grid>
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
      }
    }
  }
`
