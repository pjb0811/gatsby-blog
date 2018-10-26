import Typography from 'typography'
import githubTheme from 'typography-theme-github'

const typography = new Typography({
  ...githubTheme,
  overrideStyles: ({ rhythm, scale }, options) => {
    return {
      a: {
        color: 'inherit',
        textDecoration: 'none',
      },
      'a.icon': {
        display: 'inline-flex;',
      },
      img: {
        marginBottom: 0,
      },
    }
  },
})

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
