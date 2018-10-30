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
    marginBottom: 0,
  },
})

const typography = new Typography(githubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
