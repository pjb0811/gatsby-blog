import React, { Component, Fragment } from 'react'
import withLayout from '../components/templates/withLayout'
import Helmet from 'react-helmet'
import ImageCover from '../components/molecules/ImageCover'
import analysisImage from '../assets/analysis.jpg'
import AnalysisTabs from '../components/organisms/AnalysisTabs'
import { graphql } from 'gatsby'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

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
})

class analysis extends Component {
  render() {
    const { classes, data } = this.props
    const { edges } = data.allMarkdownRemark

    return (
      <Fragment>
        <Helmet title={'analysis'} />
        <ImageCover img={analysisImage} alt="analysis" />
        <div className={classes.root}>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={1}>
                <Typography variant="h3" className={classes.title}>
                  인기 포스트
                </Typography>
                <AnalysisTabs edges={edges} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    )
  }
}

export default withLayout(withStyles(styles, { name: 'analysis' })(analysis))

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
