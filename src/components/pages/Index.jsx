import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'
import withLayout from '../templates/withLayout'
import ImageCover from '../molecules/ImageCover'
import PostList from '../organisms/PostList'
import { navigate } from 'gatsby-link'
import Paginate from '../organisms/Paginate'
import mainImage from '../../assets/main.jpg'
import Jumbotron from '../organisms/Jumbotron'

class Index extends Component {
  handlePageClick = data => {
    let { selected } = data
    selected = selected === 0 ? '' : selected + 1

    navigate(`/${selected}`)
  }

  render() {
    const { pageContext } = this.props
    const { group, index, pageCount, additionalContext } = pageContext
    const { siteMetadata } = additionalContext

    return (
      <Fragment>
        <Helmet
          title={siteMetadata.title}
          meta={[
            { name: 'description', content: siteMetadata.description },
            { name: 'author', content: siteMetadata.author },
            { name: 'siteUrl', content: siteMetadata.siteUrl },
          ]}
        />
        <ImageCover img={mainImage} alt="javascript">
          <Jumbotron />
        </ImageCover>
        <PostList posts={group} />
        <Paginate
          index={index}
          pageCount={pageCount}
          onPageChange={this.handlePageClick}
        />
      </Fragment>
    )
  }
}

export default withLayout(Index)
