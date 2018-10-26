const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require('gatsby-paginate')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const BlogPost = path.resolve('./src/components/pages/BlogPost.jsx')

    resolve(
      graphql(
        `
          {
            posts: allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  id
                  excerpt
                  frontmatter {
                    title
                    date(formatString: "YYYY.MM.DD")
                    tags
                    mainImage {
                      childImageSharp {
                        sizes(maxWidth: 800) {
                          aspectRatio
                          base64
                          sizes
                          src
                          srcSet
                        }
                      }
                    }
                  }
                  fields {
                    slug
                  }
                }
              }
            }
            site {
              siteMetadata {
                title
                author
                description
                siteUrl
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        createPaginatedPages({
          edges: result.data.posts.edges,
          createPage: createPage,
          pageTemplate: 'src/components/pages/index.jsx',
          pageLength: 5, // This is optional and defaults to 10 if not used
          pathPrefix: '', // This is optional and defaults to an empty string if not used
          context: {
            ...result.data.site,
          }, // This is optional and defaults to an empty object if not used
        })

        // Create blog posts pages.
        const posts = result.data.posts.edges

        posts.forEach(({ node }, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: node.fields.slug,
            component: BlogPost,
            context: {
              slug: node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug',
      node,
      value,
    })
  }
}
