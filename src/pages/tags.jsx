import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/templates/Layout'
import TagList from '../components/organisms/TagList'
import ImageCover from '../components/molecules/ImageCover'
import tagImage from '../assets/tags.jpg'

class Tags extends Component {
  render() {
    const {
      data: {
        allMarkdownRemark: { group },
        site: {
          siteMetadata: { title },
        },
      },
    } = this.props

    return (
      <Layout location={this.props.location}>
        <Helmet title={title} />
        <ImageCover img={tagImage} alt="tags" />
        <TagList group={group} />
      </Layout>
    )
  }
}

export default Tags

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
