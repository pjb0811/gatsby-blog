import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import AnalysisList from './AnalysisList'
import { analytics } from 'google-cloud-apis'

const styles = theme => ({})

class AnalysisTabs extends Component {
  state = {
    tabValue: 0,
    range: {
      0: 7,
      1: 30,
      2: 365,
    },
    reports: [],
    errors: {
      msg: '',
    },
  }

  componentDidMount() {
    this.mounted = true
    this.getReports({ dateRange: 7 }).then(
      this.successResponseReports,
      this.errorResponseReports
    )
  }

  componentWillUnmount() {
    this.mounted = false
  }

  successResponseReports = res => {
    if (this.mounted) {
      this.setState({
        reports: this.getFilterReports({ reports: res.result.reports }),
      })
    }
  }

  errorResponseReports = res => {
    if (this.mounted) {
      this.setState({
        errors: {
          msg: 'Google 계정을 통해 로그인 해주세요',
        },
      })
    }
  }

  getReports = async ({ dateRange }) => {
    return await analytics({
      delay: 1000,
      viewId: '183746371',
      data: {
        dateRanges: [
          {
            startDate: `${dateRange}daysAgo`,
            endDate: 'today',
          },
        ],
        metrics: [{ expression: 'ga:pageviews' }],
        dimensions: [{ name: 'ga:pagePath' }],
        orderBys: [
          {
            fieldName: 'ga:pageviews',
            sortOrder: 'DESCENDING',
          },
        ],
      },
    })
  }

  getFilterReports = ({ reports }) => {
    const { edges } = this.props
    const newReports = reports[0].data.rows.reduce((prev, curr) => {
      let title = ''
      let date = ''
      if (
        edges.some(item => {
          if (item.node.fields.slug === curr.dimensions[0]) {
            title = item.node.frontmatter.title
            date = item.node.frontmatter.date
            return true
          }
          return false
        })
      ) {
        prev.push({
          url: curr.dimensions[0],
          title,
          date,
          pageview: curr.metrics[0].values[0],
        })
      }

      return prev
    }, [])

    return newReports
  }

  tabChange = (event, tabValue) => {
    this.resetReports(tabValue)
  }

  resetReports = tabValue => {
    this.setState({
      tabValue,
      reports: [],
      errors: {
        msg: '',
      },
    })

    this.getReports({ dateRange: this.state.range[tabValue] }).then(
      this.successResponseReports,
      this.errorResponseReports
    )
  }

  render() {
    const { reports, errors } = this.state

    return (
      <div>
        <Tabs
          value={this.state.tabValue}
          onChange={this.tabChange}
          indicatorColor="primary"
          textColor="primary"
          fullWidth
        >
          <Tab label="지난 7일" />
          <Tab label="지난 30일" />
          <Tab label="지난 1년" />
        </Tabs>
        <AnalysisList
          list={reports}
          errors={errors}
          resetReports={this.resetReports}
        />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'analysisTabs' })(AnalysisTabs)
