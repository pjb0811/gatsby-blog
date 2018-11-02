import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = theme => ({
  progressRoot: {
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
})

class AnalysisList extends Component {
  state = {
    tabValue: 0,
  }

  handleChange = (event, tabValue) => {
    this.setState({ tabValue })
  }

  render() {
    const { list, classes } = this.props

    if (!list.length) {
      return (
        <div className={classes.progressRoot}>
          <CircularProgress className={classes.progress} />
        </div>
      )
    }

    return (
      <Tabs
        value={this.state.tabValue}
        onChange={this.handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="지난 7일" />
        <Tab label="지난 30일" />
        <Tab label="지난 1년" />
      </Tabs>
    )
  }
}

export default withStyles(styles, { name: 'analysisList' })(AnalysisList)
