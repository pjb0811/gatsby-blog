import React, { Component } from 'react'
import Layout from '../components/templates/Layout'
import Helmet from 'react-helmet'
import ImageCover from '../components/molecules/ImageCover'
import analysisImage from '../assets/analysis.jpg'
import AnalysisList from '../components/organisms/AnalysisList'
import { graphql } from 'gatsby'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { analytics } from 'google-cloud-apis'

const styles = theme => ({
  root: {
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      width: 600,
    },
    [theme.breakpoints.up('md')]: {
      width: 960,
    },
  },
  container: {
    width: '100%',
    margin: 0,
  },
  title: {
    marginBottom: 20,
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  signIn: {
    display: 'none',
  },
})

class analysis extends Component {
  state = {
    reports: [],
  }

  componentDidMount() {
    this.getReports({ dateRange: 7 })
  }

  getReports = async ({ dateRange }) => {
    const res = await analytics({
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

    this.filterReports({ reports: res.result.reports })
  }

  filterReports = ({ reports }) => {
    const { data } = this.props
    const { edges } = data.allMarkdownRemark
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
          pagaview: curr.metrics[0].values[0],
        })
      }

      return prev
    }, [])

    this.setState({
      reports: newReports,
    })
  }

  render() {
    const { classes } = this.props
    const { reports } = this.state

    return (
      <Layout location={this.props.location}>
        <Helmet>
          <title>analysis</title>
          <meta
            name="google-signin-client_id"
            content="183407112685-51gi54qhqn734uid2lvvasucse6db0lo.apps.googleusercontent.com"
          />
          <meta
            name="google-signin-scope"
            content="https://www.googleapis.com/auth/analytics.readonly"
          />
          <script src="https://apis.google.com/js/client:platform.js" />
        </Helmet>
        <ImageCover img={analysisImage} alt="tags" />
        <div className={classes.root}>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h3" className={classes.title}>
                  인기 포스트
                </Typography>
                <p
                  className={`g-signin2 ${classes.signIn}`}
                  data-onsuccess="queryReports"
                />
                <AnalysisList list={reports} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles, { name: 'analysis' })(analysis)

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            date(formatString: "YYYY.MM.DD")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`
