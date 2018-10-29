import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { withStyles } from '@material-ui/core/styles'
import Layout from '../templates/Layout'
import Paper from '@material-ui/core/Paper'
import ImageCover from '../organisms/ImageCover'
import tagImage from '../../assets/tags.jpg'
import jsImage from '../../assets/javascript.png'
import cssImage from '../../assets/css.jpg'
import htmlImage from '../../assets/html.png'
import reactImage from '../../assets/react.png'
import tsImage from '../../assets/typescript.jpg'
import PostCard from '../molecules/PostCard'
import Grid from '@material-ui/core/Grid'
import PageTitle from '../molecules/PageTitle'

const styles = theme => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
})

class Tags extends Component {
  render() {
    const { pageContext, data, classes } = this.props
    const { tag } = pageContext
    const { edges, totalCount } = data.allMarkdownRemark
    const images = {
      javascript: jsImage,
      css: cssImage,
      html: htmlImage,
      react: reactImage,
      typescript: tsImage,
    }

    return (
      <Layout location={this.props.location}>
        <ImageCover img={images[tag] || tagImage} alt={tag} />
        <div
          className={classes.root}
          style={{
            margin: '20px auto',
          }}
        >
          <Paper className={classes.paper} elevation={1}>
            <PageTitle title={tag} subTitle={`${totalCount}개의 글`} />
            <Grid
              container
              spacing={24}
              style={{
                width: '100%',
                margin: 0,
              }}
            >
              {edges.map(({ node }) => (
                <PostCard key={node.fields.slug} node={node} />
              ))}
            </Grid>
          </Paper>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles, { name: 'tags' })(Tags)

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
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
          fields {
            slug
          }
        }
      }
    }
  }
`
