import React, { Component } from 'react'
import Layout from '../components/templates/Layout'
import Helmet from 'react-helmet'
import ImageCover from '../components/molecules/ImageCover'
import analysisImage from '../assets/analysis.jpg'
import AnalysisList from '../components/organisms/AnalysisList'

class analysis extends Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <Helmet title={'analysis'} />
        <ImageCover img={analysisImage} alt="tags" />
        <AnalysisList />
      </Layout>
    )
  }
}

export default analysis
