var html = require('choo/html')
var welcome = require('../components/welcome')
var button = require('../components/button')
var embed = require('../components/embed')

module.exports = home

function home (state, emit) {
  return html`
    <main class="View-main View-main--stack">
      ${welcome()}
      <!-- slice -->
      <div class="Text u-textCenter u-spaceT6">
        <div class="u-spaceV4 u-spaceH4">
          <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
          <h2 class="Text-h4 u-spaceT0">Universums mjukaste</h2>
          <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
        </div>
        <div class="u-spaceV4 u-spaceH4">
          <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
          <h2 class="Text-h4 u-spaceT0">Universums mjukaste</h2>
          <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
        </div>
        <div class="u-spaceV4 u-spaceH4">
          <img width="135" height="76" src="https://via.placeholder.com/135x76" alt="">
          <h2 class="Text-h4 u-spaceT0">Universums mjukaste</h2>
          <p>Visste du att bambuträd kan växa upp till en meter om dagen och är en av världens mest förnybara växter?</p>
        </div>
      </div>
      <div class="u-textCenter u-spaceV6">
        ${button({ class: 'Button--invert', href: '/toa-6-pack', text: 'All nördig info' })}
      </div>
      <!-- /slice -->
      <!-- slice -->
      <div class="u-nbfc u-textCenter u-bgCurrent u-bgWhite">
        <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
        <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
        <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
        <img class="u-inlineBlock u-spaceV3 u-spaceH2" width="45" height="45" src="https://via.placeholder.com/45x45" alt="">
      </div>
      <!-- /slice -->
      ${embed({ url: 'https://vimeo.com/85390732', title: 'Fantastiska bambuskogar' })}
      <!-- slice -->
    </main>
  `
}
