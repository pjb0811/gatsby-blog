import React, { Component } from 'react'
import ReactPaginate from 'react-paginate'
import Icon from '@material-ui/core/Icon'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  paginateContainer: {
    display: 'flex',
    margin: '20px 0',
    listStyle: 'none',
    justifyContent: 'center',
  },
  paginateList: {
    margin: 0,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
  },
  paginateLink: {
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
  paginateIcon: {
    color: theme.palette.primary.light,
    display: 'flex !important',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  paginateActive: {
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
            className={`fas fa-caret-left ${classes.paginateIcon}`}
            fontSize="large"
          />
        }
        nextLabel={
          <Icon
            className={`fas fa-caret-right ${classes.paginateIcon}`}
            fontSize="large"
          />
        }
        previousClassName={classes.paginateList}
        nextClassName={classes.paginateList}
        pageClassName={classes.paginateList}
        previousLinkClassName={classes.paginateLink}
        nextLinkClassName={classes.paginateLink}
        pageLinkClassName={classes.paginateLink}
        forcePage={index - 1}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        onPageChange={onPageChange}
        containerClassName={classes.paginateContainer}
        activeClassName={classes.paginateActive}
      />
    )
  }
}

export default withStyles(styles)(Paginate)
