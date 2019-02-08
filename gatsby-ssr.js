const React = require('react')
const { renderToString } = require('react-dom/server')
const JssProvider = require('react-jss/lib/JssProvider').default
const getPageContext = require('./src/utils/getPageContext').default
const { Helmet } = require('react-helmet')

function replaceRenderer({
  bodyComponent,
  replaceBodyHTMLString,
  setHeadComponents,
}) {
  // Get the context of the page to collected side effects.
  const muiPageContext = getPageContext()
  const helmet = Helmet.renderStatic()
  const bodyHTML = renderToString(
    <JssProvider registry={muiPageContext.sheetsRegistry}>
      {bodyComponent}
    </JssProvider>
  )

  setHeadComponents([
    helmet.title.toComponent(),
    helmet.link.toComponent(),
    helmet.meta.toComponent(),
    helmet.noscript.toComponent(),
    helmet.script.toComponent(),
    helmet.style.toComponent(),
    <style
      type="text/css"
      id="jss-server-side"
      key="jss-server-side"
      dangerouslySetInnerHTML={{
        __html: muiPageContext.sheetsRegistry.toString(),
      }}
    />,
  ])
  replaceBodyHTMLString(bodyHTML)
}

exports.replaceRenderer = replaceRenderer
