import React from 'react'
import AppBar from '../organisms/AppBar'
// import { loadCSS } from 'fg-loadcss/src/loadCSS'
import { withStyles } from '@material-ui/core/styles'
import Footer from '../organisms/Footer'
import 'typeface-roboto'
import './layout.css'
import withRoot from './withRoot'
import Helmet from 'react-helmet'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: 10,
  },
})

class Layout extends React.Component {
  /* componentDidMount() {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.1.0/css/all.css',
      document.querySelector('#___gatsby')
    )
  } */

  render() {
    const { children, classes } = this.props

    return (
      <div className={classes.root}>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
            media="all"
          />
        </Helmet>
        <AppBar />
        <div className={classes.toolbar} />
        {children}
        <Footer />
      </div>
    )
  }
}

export default withRoot(withStyles(styles)(Layout))
