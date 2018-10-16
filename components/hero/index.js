var html = require('choo/html')
var { i18n, srcset } = require('../base')

var text = i18n()

module.exports = hero
module.exports.loading = loading

function hero (props) {
  var { portrait, landscape } = props.image

  return html`
    <div class="Hero">
      <div class="u-container">
        <picture>
          <source media="(max-width: 999px)" srcset="${srcset(portrait.url, [400, 600, 1000, [2000, 'q_25']])}">
          <source media="(min-width: 1000px)" srcset="${srcset(landscape.url, [1000, 1600, [2000, 'q_50'], [2800, 'q_25'], [3600, 'q_25']])}">
          <img class="Hero-background" alt="${props.image.alt}" src="/media/fetch/q_auto,w_1600/${props.image.landscape.url}">
        </picture>
        <div class="Text Text--center">
          <small class="Text-label">${props.subheading}</small>
          <h1>${props.heading}</h1>
        </div>
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Hero">
      <div class="u-container">
        <div class="Text Text--center">
          <small class="Text-label"><span class="u-loadingOnColor">${text`Fetching content`}</span></small>
          <h1><span class="u-loadingOnColor">${text`Hold tight, the content is loading`}</span></h1>
        </div>
      </div>
    </div>
  `
}
