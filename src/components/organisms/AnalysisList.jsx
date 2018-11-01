import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

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

class AnalysisList extends Component {
  render() {
    const { classes } = this.props

    return (
      <div className={classes.root}>
        <Grid container spacing={24} className={classes.container}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={1}>
              <Typography variant="h3" className={classes.title}>
                인기 포스트
              </Typography>
              {/*
              <List >
                <ListItem
                    button
                    component={Link}
                    to={`/tags/${kebabCase(tag.fieldValue)}/`}
                  >
                    <Badge
                      className={classes.margin}
                      badgeContent={tag.totalCount}
                      color="primary"
                    >
                      <ListItemText primary={tag.fieldValue} />
                    </Badge>
                  </ListItem>
              </List>
              */}
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'analysisList' })(AnalysisList)
