import React, { Component } from 'react'
import googleLogo from '../../assets/google.jpg'
import { GoogleLogin } from 'react-google-login'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.unit,
  },
})

class GoogleLoginButton extends Component {
  render() {
    const { classes, onSuccess, style } = this.props
    return (
      <GoogleLogin
        clientId="183407112685-51gi54qhqn734uid2lvvasucse6db0lo.apps.googleusercontent.com"
        onSuccess={onSuccess}
        render={renderProps => (
          <Button
            variant="outlined"
            color="primary"
            onClick={renderProps.onClick}
            style={style}
          >
            <img src={googleLogo} alt="google" className={classes.googleLogo} />
            Sign in with Google
          </Button>
        )}
      />
    )
  }
}

export default withStyles(styles, { name: 'googleLoginButton' })(
  GoogleLoginButton
)
