var html = require('choo/html')
var hero = require('../components/hero')
var { i18n } = require('../components/base')
var inventory = require('../components/inventory')

var text = i18n()

module.exports = product

function product (state, emit) {
  return html`
    <main class="View-main View-main--stack">
      ${hero({ subheading: text`Product`, heading: 'Hempur toa 6-pack' })}
      <div class="u-bgWhite u-bgCurrent u-nbfc">
        <div class="u-container u-spaceV8">
          ${/* eslint-disable indent */
            inventory([
              { label: 'Antal', value: '6 rullar, 3 lager' },
              { label: 'Vikt', value: '130 gram' },
              { label: 'Antal ark per rulle', value: '255 st' },
              { label: 'Storlek per ark', value: '9,8x11 cm' },
              { label: 'Längd per rulle', value: '28 meter' },
              { label: 'Fiberråvara', value: '100% bambu' }
            ])
          /* eslint-enable indent */}
        </div>
      </div>
    </main>
  `
}
