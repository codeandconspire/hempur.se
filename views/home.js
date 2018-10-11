var html = require('choo/html')
var welcome = require('../components/welcome')

module.exports = home

function home (state, emit) {
  return html`
    <main class="View-main View-main--stack">
      ${welcome()}
    </main>
  `
}
