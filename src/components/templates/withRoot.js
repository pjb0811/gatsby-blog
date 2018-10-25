import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import JssProvider from 'react-jss/lib/JssProvider'
import getPageContext from '../../utils/getPageContext'

function withRoot(Component) {
  class WithRoot extends React.Component {
    constructor(props) {
      super(props)
      this.muiPageContext = getPageContext()
    }

    /* componentDidMount() {
      const jssStyles = document.querySelector('#jss-server-side')
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles)
      }
    } */

    render() {
      return (
        <JssProvider
          registry={this.muiPageContext.sheetsRegistry}
          generateClassName={this.muiPageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.muiPageContext.theme}
            sheetsManager={this.muiPageContext.sheetsManager}
          >
            {/* <CssBaseline /> */}
            <Component {...this.props} />
          </MuiThemeProvider>
        </JssProvider>
      )
    }
  }

  return WithRoot
}

export default withRoot
