import React from 'react'
import AppBar from '../organisms/AppBar'
import Footer from '../organisms/Footer'
import Helmet from 'react-helmet'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from '../../utils/getPageContext'
import 'typeface-roboto'
// import { loadCSS } from 'fg-loadcss/src/loadCSS'

const Layout = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.muiPageContext = getPageContext()
    }

    componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    }

    /*
    componentDidMount() {
      loadCSS(
        'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
        document.querySelector('#___gatsby')
      )
    }
    */

    render() {
      return (
        <JssProvider generateClassName={this.muiPageContext.generateClassName}>
          <MuiThemeProvider
            theme={this.muiPageContext.theme}
            sheetsManager={this.muiPageContext.sheetsManager}
          >
            <CssBaseline />
            <Helmet>
              <link
                rel="stylesheet"
                href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
                media="all"
              />
            </Helmet>
            <AppBar />
            <Component {...this.props} />
            <Footer />
          </MuiThemeProvider>
        </JssProvider>
      )
    }
  }
}

export default Layout
