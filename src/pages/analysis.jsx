import React, { Component } from 'react'
import Layout from '../components/templates/Layout'
import Helmet from 'react-helmet'
import ImageCover from '../components/molecules/ImageCover'
import analysisImage from '../assets/analysis.jpg'
import AnalysisList from '../components/organisms/AnalysisList'
import { graphql } from 'gatsby'

class analysis extends Component {
  render() {
    const { edges } = this.props.data.allMarkdownRemark

    return (
      <Layout location={this.props.location}>
        <Helmet title={'analysis'} />
        <ImageCover img={analysisImage} alt="tags" />
        <AnalysisList list={edges} />
      </Layout>
    )
  }
}

export default analysis

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
