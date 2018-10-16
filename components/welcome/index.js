var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var button = require('../button')
var { srcset, i18n, vh } = require('../base')

var text = i18n()

module.exports = class Welcome extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id: id,
      loaded: false,
      inview: 0
    }
  }

  static loading () {
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

  update () {
    return false
  }

  load (el) {
    var self = this
    var background = el.querySelector('.js-background')
    var image = el.querySelector('.js-image')
    var images = [background, image]

    Promise.all(images.map(function (img) {
      return new Promise(function (resolve, reject) {
        var image = new window.Image()
        image.addEventListener('load', resolve)
        image.addEventListener('error', reject)
        image.src = img.currentSrc
      })
    })).then(function () {
      self.local.loaded = true
      self.rerender()

      var top = offset(el)
      var max = offset(image) + image.offsetHeight + (image.offsetHeight / 2)
      var onscroll = nanoraf(function () {
        var scroll = window.scrollY + vh()
        var prev = self.local.inview
        var range = Math.min(Math.max(scroll - top, 0), max)
        var value = +(range / max).toFixed(3)
        var next = self.local.inview = 1 - (Math.cos(Math.PI * value) + 1) / 2
        if (next !== prev) el.style.setProperty('--Welcome-inview', next)
      })
      var onresize = nanoraf(function () {
        top = offset(el)
        var height = image.offsetHeight
        max = offset(image) + height + (height / 2)
      })

      onscroll()
      window.addEventListener('scroll', onscroll)
      window.addEventListener('resize', onresize)
      self.unload = function () {
        window.removeEventListener('scroll', onscroll)
        window.removeEventListener('resize', onresize)
      }
    })
  }

  createElement (props) {
    var image = 'v1539257536/hempur/toapapper-pack.png'
    var background = 'v1539262386/hempur/toapapper-rulle_ih9ndb.png'
    return html`
      <div class="Welcome" id=${this.local.id} style="--Welcome-inview: ${this.local.inview}">
        <div class="u-container">
          <div class="Welcome-wrapper">
            <img aria-hidden="true" role="presentational" class="Welcome-background js-background ${this.local.loaded ? 'is-loaded' : ''}" width="1018" height="1244" sizes="(min-width: 1000px) 563px, 266px" srcset="${srcset(background, [300, 500, 900, [1200, 'q_50']], { type: 'upload' })}" src="/media/upload/q_auto,w_266/${background}" alt="${text`Picture of Hempur toilet roll`}">
            <div class="Welcome-body">
              <div class="Text">
                <h1 class="Text-stack">${props.heading}</h1>
                <p><strong>${props.subheading}</strong></p>
              </div>
            </div>
            <img class="Welcome-image js-image ${this.local.loaded ? 'is-loaded' : ''}" width="318" height="256" sizes="(min-width: 1000px) 644px, 100vw" srcset="${srcset(image, [400, 600, 900, [1200, 'q_50']], { type: 'upload' })}" src="/media/upload/q_auto,w_644/${image}" alt="${text`Picture of Hempur toilet paper 6-pack`}">
            <div class="Welcome-link">
              ${button({ href: props.link.href, text: props.link.text })}
            </div>
          </div>
        </div>
      </div>
    `
  }
}

// get element scroll offset
// Element -> num
function offset (el) {
  var parent = el
  var top = el.offsetTop
  while ((parent = parent.offsetParent)) top += parent.offsetTop
  return top
}
