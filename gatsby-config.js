const SITE_CONFIG = require('./site-config')

const lunrPlugin = lunr => builder => {
  builder.pipeline.reset()
  builder.pipeline.add(lunr.stopWordFilter, lunr.stemmer)
  builder.field('title')
  builder.field('tags')
  builder.field('content')
  builder.field('path')
}

module.exports = {
  siteMetadata: {
    title: SITE_CONFIG.title,
    author: SITE_CONFIG.author,
    description: SITE_CONFIG.description,
    siteUrl: SITE_CONFIG.siteUrl,
  },
  pathPrefix: SITE_CONFIG.pathPrefix,
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages/`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: {
              wrapperStyle: 'margin-bottom: 1.0725rem',
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: SITE_CONFIG.googleAnalyticsID,
        exclude: ['/', '/tags', '/tags/**', '/tags/**/', '/analysis'],
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                author
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  title: edge.node.frontmatter.title,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] }
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: SITE_CONFIG.siteRss,
            title: SITE_CONFIG.title
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'pjb0811 blog',
        short_name: 'pjb0811 blog',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#448AFF',
        display: 'minimal-ui',
        icon: 'src/assets/pjb0811.png',
        icons: [
          {
            src: '/image/logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-lunr',
      options: {
        languages: [
          {
            name: 'en',
            filterNodes: node => node.frontmatter !== undefined,
            plugins: [lunrPlugin],
          },
        ],
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'tags', store: true },
          { name: 'content', store: true },
          { name: 'path', store: true },
        ],
        resolvers: {
          MarkdownRemark: {
            title: node => node.frontmatter.title,
            tags: node => node.frontmatter.tags,
            content: node => node.rawMarkdownBody,
            path: node => node.fields.slug,
          },
        },
      },
    },
  ],
}
