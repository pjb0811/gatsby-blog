import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
    background: theme.palette.secondary.main,
    margin: `${theme.spacing.unit * 2}px 0`,
  },
})

class TranslationGuide extends Component {
  render() {
    const { translation, classes } = this.props

    if (!translation) {
      return null
    }

    return (
      <div className={classes.root}>
        <Typography variant="subtitle2" gutterBottom>
          이 글은 <a href={translation.link}>"{translation.title}"</a>를 번역한
          글입니다.
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          의역과 오역이 난무하니 자세한 내용은 해당 블로그를 참조하시면 이해가
          더 쉬울 것 같습니다.
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          억지로 번역하면 뜻이 더 모호해지는 단어들은 그 자체로 두었습니다.
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles, { name: 'translationGuide' })(
  TranslationGuide
)
