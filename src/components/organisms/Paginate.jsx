import React, { Component } from 'react'
import ReactPaginate from 'react-paginate'
import Icon from '@material-ui/core/Icon'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  pagination: {
    display: 'flex',
    margin: '20px 0',
    listStyle: 'none',
    justifyContent: 'center',
  },
  list: {
    margin: 0,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    ...theme.typography.button,
    ...theme.palette.action,
    color: 'inherit',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  icon: {
    color: theme.palette.primary.light,
    display: 'flex !important',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  active: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '50%',
    boxShadow: theme.shadows[1],
  },
})

class Paginate extends Component {
  render() {
    const { index, pageCount, onPageChange, classes } = this.props

    return (
      <ReactPaginate
        previousLabel={
          <Icon
            className={`fas fa-caret-left ${classes.icon}`}
            fontSize="large"
          />
        }
        nextLabel={
          <Icon
            className={`fas fa-caret-right ${classes.icon}`}
            fontSize="large"
          />
        }
        previousClassName={classes.list}
        nextClassName={classes.list}
        pageClassName={classes.list}
        previousLinkClassName={classes.link}
        nextLinkClassName={classes.link}
        pageLinkClassName={classes.link}
        forcePage={index - 1}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        containerClassName={classes.pagination}
        activeClassName={classes.active}
      />
    )
  }
}

export default withStyles(styles)(Paginate)
