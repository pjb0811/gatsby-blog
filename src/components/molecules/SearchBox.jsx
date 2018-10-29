import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import SearchIcon from '@material-ui/icons/Search'
import InputBase from '@material-ui/core/InputBase'
import SearchList from './SearchList'

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputRoot: {
    color: 'inherit',
    width: '100%',
  },
  searchInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
})

class SearchBox extends Component {
  state = {
    open: false,
    query: '',
    results: [],
  }

  getSearchResults(query) {
    if (!query || !window.__LUNR__) {
      return []
    }
    const results = window.__LUNR__['en'].index.search(query)
    return results.map(({ ref }) => window.__LUNR__['en'].store[ref])
  }

  search = event => {
    const query = event.target.value
    const results = this.getSearchResults(query)
    this.setState({ open: !!results.length, query, results })
  }

  checkEnterKey = event => {
    if (event.key === 'Enter') {
      this.search(event)
    }
  }

  onSuccess = () => {
    this.setState({ open: false })
  }

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return
    }

    this.setState({ open: false })
  }

  render() {
    const { classes } = this.props
    const { open, query, results } = this.state

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: classes.searchInputRoot,
            input: classes.searchInput,
          }}
          inputRef={node => {
            this.anchorEl = node
          }}
          onFocus={this.search}
          onChange={this.search}
          onKeyDown={this.checkEnterKey}
        />
        <SearchList
          open={open}
          query={query}
          handleClose={this.handleClose}
          anchorEl={this.anchorEl}
          results={results}
        />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'searchBox' })(SearchBox)
