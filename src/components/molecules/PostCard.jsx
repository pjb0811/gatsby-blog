import React, { Component } from 'react'
import { Link } from 'gatsby'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'

class PostCard extends Component {
  render() {
    const { node } = this.props
    const { title, mainImage, tags } = node.frontmatter

    return (
      <Grid item xs={12}>
        <Card>
          <CardActionArea component={Link} to={node.fields.slug}>
            <CardMedia
              image={mainImage.childImageSharp.sizes.src}
              title={title || node.fields.slug}
              style={{
                height: 140,
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {title || node.fields.slug}
              </Typography>
              <Typography component="p">{node.excerpt}</Typography>
            </CardContent>
          </CardActionArea>
          <CardActions>
            {tags.map((tag, i) => (
              <Button key={i} size="small" color="primary">
                {tag}
              </Button>
            ))}
          </CardActions>
        </Card>
      </Grid>
    )
  }
}

export default PostCard
