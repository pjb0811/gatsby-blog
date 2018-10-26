import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Layout from '../templates/Layout'
import ImageCover from '../organisms/ImageCover'
import PostList from '../organisms/PostList'
import { navigate } from 'gatsby-link'
import Paginate from '../organisms/Paginate'
import jsImage from '../../assets/javascript.jpg'
import Jumbotron from '../organisms/Jumbotron'

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
        <ImageCover img={jsImage} alt="javascript">
          <Jumbotron />
        </ImageCover>
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
