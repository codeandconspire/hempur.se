var html = require('choo/html')
var button = require('../button')

module.exports = welcome

function welcome (props) {
  return html`
    <div class="Welcome">
      <div class="u-container">
        <h1 class="Welcome-heading">
          Precis som vanligt, fast helt annorlunda<br>
          <small class="Welcome-subheading">Toapapper av bambu, alltså.</small>
        </h1>
        ${button({ href: '/toa-6-pack', text: 'Produktinfo' })}
      </div>
    </div>
  `
}
