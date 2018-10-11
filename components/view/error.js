var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

module.exports = error

function error (err) {
  return html`
    <main class="View-main">
      <div class="u-container u-center u-spaceV8">
        <div class="Text u-textCenter">
          <h1>${text(err.status === 404 ? 'Oops! Page not found.' : 'Oops! Something went wrong.')}</h1>
          ${err.status === 404 ? html`
            <p>
              ${text`There is no page at this address. Try finding your way using the menu or from` + ' '}
              <a href="/">${text`the homepage`}</a>.
            </p>
          ` : html`
            <p>
              ${text`We apologize, an error has occured on our site. It may be temporary and you could` + ' '}
              <a href="">${text`try again`}</a>
              ${' ' + text`or go back to` + ' '}
              <a href="/">${text`the homepage`}</a>.
            </p>
          `}
          <img src="https://prismic-io.s3.amazonaws.com/hempur%2Fd81430d2-c5cb-46a3-96c3-21e8e55222d7_4ea.jpg.gif">
          ${process.env.NODE_ENV === 'development' ? html`<pre>${err.stack}</pre>` : null}
        </div>
      </div>
    </main>
  `
}
