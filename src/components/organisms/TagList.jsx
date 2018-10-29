import React, { Component } from 'react'
import { Link } from 'gatsby'
import kebabCase from 'lodash/kebabCase'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'

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

class TagList extends Component {
  render() {
    const { group, classes } = this.props
    return (
      <div className={classes.root}>
        <Grid container spacing={24} className={classes.container}>
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={1}>
              <Typography variant="h3" className={classes.title}>
                Tags
              </Typography>
              <List component="nav">
                {group.map(tag => (
                  <ListItem
                    button
                    key={tag.fieldValue}
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
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'tagList' })(TagList)
