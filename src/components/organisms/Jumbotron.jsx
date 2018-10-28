import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'

class Jumbotron extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: 300,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          style={{
            color: '#fff',
            fontWeight: 500,
          }}
        >
          Welcome to my blog!
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          style={{
            color: '#fff',
            fontWeight: 500,
            marginTop: 20,
          }}
        >
          Introduce React, TypeScript, and JavaScript related postings.
        </Typography>
      </div>
    )
  }
}

export default Jumbotron
