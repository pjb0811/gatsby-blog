import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { Link } from 'gatsby'
import GoogleLoginButton from '../atoms/GoogleLoginButton'

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing.unit * 2,
  },
  error: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  signIn: {
    marginTop: 20,
  },
})

class AnalysisList extends Component {
  responseSuccess = res => {
    this.props.resetReports(0)
  }

  render() {
    const { list, errors, classes } = this.props
    if (errors.msg) {
      return (
        <div className={`${classes.root} ${classes.error}`}>
          <Typography variant="button" color="inherit" gutterBottom>
            {errors.msg}
          </Typography>
          <div className={classes.signIn}>
            <GoogleLoginButton onSuccess={this.responseSuccess} />
          </div>
        </div>
      )
    }

    if (!list.length) {
      return (
        <div className={classes.root}>
          <CircularProgress className={classes.progress} />
          <GoogleLoginButton style={{ display: 'none' }} />
        </div>
      )
    }

    return (
      <List>
        {list.map(item => (
          <ListItem key={item.url} component={Link} to={item.url} button>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                noWrap: true,
              }}
              secondary={item.date}
            />
            {item.pageview}
          </ListItem>
        ))}
      </List>
    )
  }
}

export default withStyles(styles, { name: 'analysisList' })(AnalysisList)
