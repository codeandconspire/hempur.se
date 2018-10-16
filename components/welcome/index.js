var html = require('choo/html')
var button = require('../button')
var { srcset, i18n } = require('../base')

var text = i18n()

module.exports = welcome
module.exports.loading = loading

function welcome (props) {
  var image = 'v1539257536/hempur/toapapper-pack.png'
  var background = 'v1539262386/hempur/toapapper-rulle_ih9ndb.png'
  return html`
    <div class="Welcome">
      <div class="u-container">
        <div class="Welcome-wrapper">
          <img aria-hidden="true" role="presentational" class="Welcome-background" width="1018" height="1244" sizes="(min-width: 1000px) 563px, 266px" srcset="${srcset(background, [300, 500, 900, [1200, 'q_50']], { type: 'upload' })}" src="/media/upload/q_auto,w_266/${background}" alt="${text`Picture of Hempur toilet roll`}">
          <div class="Welcome-body">
            <div class="Text">
              <h1 class="Text-stack">${props.heading}</h1>
              <p><strong>${props.subheading}</strong></p>
            </div>
          </div>
          <img class="Welcome-image" width="318" height="256" sizes="(min-width: 1000px) 644px, 100vw" srcset="${srcset(image, [400, 600, 900, [1200, 'q_50']], { type: 'upload' })}" src="/media/upload/q_auto,w_644/${image}" alt="${text`Picture of Hempur toilet paper 6-pack`}">
          ${button({ href: props.link.href, text: props.link.text })}
        </div>
      </div>
    </div>
  `
}

function loading () {
  return html`
    <div class="Welcome">
      <div class="u-container">
        <div class="Welcome-body">
          <div class="Text">
            <h1 class="Text-stack"><span class="u-loadingOnColor">${text`Hold tight, the content is loading`}</span></h1>
            <p><strong><span class="u-loadingOnColor">${text`It should be ready any second now`}</span></strong></p>
          </div>
        </div>
      </div>
    </div>
  `
}
