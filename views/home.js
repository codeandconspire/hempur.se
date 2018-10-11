var html = require('choo/html')

module.exports = home

function home (state, emit) {
  return html`
    <main class="View-main View-main--stack">
      <div class="u-container">
        <h1>Hello planet!</h1>
      </div>
    </main>
  `
}
