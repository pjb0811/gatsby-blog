import React, { Fragment } from 'react'
import AppBar from '../organisms/AppBar'
// import { loadCSS } from 'fg-loadcss/src/loadCSS'
import Footer from '../organisms/Footer'
import 'typeface-roboto'
import withRoot from './withRoot'
import Helmet from 'react-helmet'

class Layout extends React.Component {
  /*
  componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#___gatsby')
    )
  }
  */

  render() {
    const { children } = this.props

    return (
      <Fragment>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
            media="all"
          />
        </Helmet>
        <AppBar />
        {children}
        <Footer />
      </Fragment>
    )
  }
}

export default withRoot(Layout)
