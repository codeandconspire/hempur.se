var html = require('choo/html')
var hero = require('../components/hero')
var float = require('../components/float')
var inventory = require('../components/inventory')
var { i18n, srcset } = require('../components/base')

var text = i18n()

module.exports = product

function product (state, emit) {
  var image = 'v1539262386/hempur/toapapper-rulle_ih9ndb.png'
  var attrs = {
    width: 1018,
    height: 1244,
    sizes: '(min-width: 1000px) 563px, 266px',
    srcset: srcset(image, [300, 500, 900, [1200, 'q_50']], { type: 'upload' }),
    src: `/media/upload/q_auto,w_266/${image}`,
    alt: text`Picture of Hempur toilet roll`
  }

  return html`
    <main class="View-main View-main--stack">
      ${hero({ subheading: text`Product`, heading: 'Hempur toa 6-pack' })}
      <div class="u-nbfc">
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
        ${float(attrs)}
        <div class="u-container u-spaceT3">
          <div class="Text">
            <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
            <p>Det är en anledning till varför framtidens papper görs av just bambu. Som en gräsväxt mår den bra av att skördas, till skillnad från träd, som dör när de fälls. Dessutom tar det bara 5 år år för bambu att bli fullvuxen, medan ett träd kan ta upp mot 60 år. Det gör bambu till ett mer modernt och hållbart alternativ.</p>
            <h2>Många fördelar</h2>
            <ul>
              <li>Bambu är hållbart på riktigt</li>
              <li>Det är universums mjukaste papper</li>
              <li>Inga onödiga tillsatser</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  `
}
