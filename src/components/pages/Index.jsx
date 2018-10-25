import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../templates/Layout'
import Jumbotron from '../organisms/Jumbotron'
import PostList from '../organisms/PostList'
import { navigate } from 'gatsby-link'
import Paginate from '../organisms/Paginate'

class Index extends Component {
  handlePageClick = data => {
    let { selected } = data
    selected = selected === 0 ? '' : selected + 1

    navigate(`/${selected}`)
  }

  render() {
    const { location, pageContext } = this.props
    const { group, index, pageCount, additionalContext } = pageContext
    const { siteMetadata } = additionalContext

    return (
      <Layout location={location}>
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[
            { name: 'description', content: siteMetadata.description },
            { name: 'author', content: siteMetadata.author },
            { name: 'siteUrl', content: siteMetadata.siteUrl },
          ]}
          title={siteMetadata.title}
        />
        <Jumbotron />
        <PostList posts={group} />
        <Paginate
          index={index}
          pageCount={pageCount}
          onPageChange={this.handlePageClick}
        />
      </Layout>
    )
  }
}

export default Index
