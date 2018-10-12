var html = require('choo/html')
var hero = require('../components/hero')
var { i18n } = require('../components/base')

var text = i18n()

module.exports = product

function product (state, emit) {
  return html`
    <main class="View-main View-main--stack">
      ${hero({ subheading: text`Product`, heading: 'Hempur toa 6-pack' })}
    </main>
  `
}
