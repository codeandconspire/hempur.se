var html = require('choo/html')

module.exports = home

function home () {
  return html`
    <main class="View-main">
      <div class="u-container">
        <h1>Hello planet!</h1>
      </div>
    </main>
  `
}
