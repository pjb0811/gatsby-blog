import Typography from 'typography'
import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  html: {
    height: '100%',
  },
  body: {
    height: '100%',
  },
  '#___gatsby': {
    height: '100%',
  },
  '#___gatsby>div': {
    height: '100%',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
  'a:hover': {
    textDecoration: 'none',
  },
  'a.icon': {
    display: 'inline-flex;',
  },
  img: {
    marginBottom: '0',
  },
  '.language-javascript .keyword': {
    color: '#d73a49',
  },
  '.language-javascript .function': {
    color: '#6f42c1',
  },
  '.language-javascript .number': {
    color: '#005cc5',
  },
  '.language-javascript .boolean': {
    color: '#005cc5',
  },
  '.language-json .boolean': {
    color: '#005cc5',
  },
  figcaption: {
    textAlign: 'center',
    fontSize: '14px',
  },
  iframe: {
    width: '100%',
  },
  'img[src*=".gif"]': {
    display: 'block',
    margin: '0 auto',
  },
})

const typography = new Typography(githubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
