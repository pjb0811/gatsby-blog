import React, { Component } from 'react'

// Search component
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
      results: [],
    }
  }

  getSearchResults(query) {
    if (!query || !window.__LUNR__) return []
    const results = window.__LUNR__['en'].index.search(query)
    return results.map(({ ref }) => window.__LUNR__['en'].store[ref])
  }

  search = event => {
    const query = event.target.value
    const results = this.getSearchResults(query)
    this.setState(s => {
      return {
        results,
        query,
      }
    })
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.query} onChange={this.search} />
        <ul>
          {this.state.results.map((page, i) => (
            <li key={i}>{page.title}</li>
          ))}
        </ul>
      </div>
    )
  }
}
