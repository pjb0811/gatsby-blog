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
      },
    },
    'gatsby-plugin-feed',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'pjb0811 blog',
        short_name: 'pjb0811 blog',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#663399',
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
            // ISO 639-1 language codes. See https://lunrjs.com/guides/language_support.html for details
            name: 'en',
            // A function for filtering nodes. () => true by default
            filterNodes: node => node.frontmatter !== undefined,
            plugins: [lunrPlugin],
          },
        ],
        // Fields to index. If store === true value will be stored in index file.
        // Attributes for custom indexing logic. See https://lunrjs.com/docs/lunr.Builder.html for details
        fields: [
          { name: 'title', store: true, attributes: { boost: 20 } },
          { name: 'tags', store: true },
          { name: 'content', store: true },
          { name: 'path', store: true },
        ],
        // How to resolve each field's value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields' values
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
