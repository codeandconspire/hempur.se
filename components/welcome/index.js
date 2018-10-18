var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var Button = require('../button')
var { srcset, i18n, vh, offset } = require('../base')

var text = i18n()

module.exports = class Welcome extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id: id,
      loaded: false,
      done: false,
      minimized: true,
      inview: 0,
      offset: 0
    }
    this.button = new Button('welcome-button')
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

  init () {
    var el = this.element
    var background = el.querySelector('.js-background')
    var image = el.querySelector('.js-image')

    this.local.loaded = true
    this.rerender()

    var top, imgMax, bgMax
    var onscroll = nanoraf(() => {
      var scroll = window.scrollY

      // transform image
      var prev = this.local.inview
      var range = Math.min(Math.max(scroll + vh() - top, 0), imgMax)
      var value = +(range / imgMax).toFixed(3)
      var next = this.local.inview = 1 - (Math.cos(Math.PI * value) + 1) / 2
      if (next !== prev) {
        el.style.setProperty('--Welcome-inview', next)
        this.local.done = next === 1
        if (this.local.minimized === this.local.done) {
          this.local.minimized = !this.local.minimized
          this.rerender()
        }
      }

      // transform backgrund
      prev = this.local.offset
      range = Math.min(Math.max(scroll - top, 0), bgMax)
      next = this.local.offset = +(range / bgMax).toFixed(3)
      if (next !== offset) el.style.setProperty('--Welcome-offset', next)
    })
    var onresize = nanoraf(function () {
      top = offset(el)
      var height = image.offsetHeight
      imgMax = offset(image) + height * 1.5
      height = background.offsetHeight
      bgMax = offset(background) + height * 1.5
    })

    onresize()
    onscroll()
    window.addEventListener('scroll', onscroll)
    window.addEventListener('resize', onresize)
    this.unload = () => {
      this.local.loaded = false
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  createElement (props) {
    var image = 'v1539257536/hempur/toapapper-pack.png'
    var background = 'v1539262386/hempur/toarulle.png'
    var queue = 2
    var onload = () => {
      queue--
      if (!this.local.loaded && queue === 0) this.init()
    }

    return html`
      <div class="Welcome" id=${this.local.id} style="--Welcome-inview: ${this.local.inview}; --Welcome-offset: ${this.local.offset}">
        <div class="u-container">
          <div class="Welcome-wrapper">
            <img onload=${onload} aria-hidden="true" role="presentational" class="Welcome-background js-background ${this.local.loaded ? 'is-loaded' : ''}" width="1018" height="1244" sizes="(min-width: 1000px) 450px, 266px" srcset="${srcset(background, [300, [500, 'q_60'], [900, 'q_35']], { type: 'upload' })}" src="/media/upload/q_auto,w_266/${background}" alt="${text`Picture of Hempur toilet roll`}">
            <div class="Welcome-body">
              <div class="Text">
                <h1 class="Text-stack">${props.heading}</h1>
                <p><strong>${props.subheading}</strong></p>
              </div>
            </div>
            <img onload=${onload} class="Welcome-image js-image ${this.local.loaded ? 'is-loaded' : ''}" width="318" height="256" sizes="(min-width: 1000px) 644px, 100vw" srcset="${srcset(image, [400, 600, [900, 'q_60'], [1200, 'q_60']], { type: 'upload' })}" src="/media/upload/q_auto,w_644/${image}" alt="${text`Picture of Hempur toilet paper 6-pack`}">
            <div class="Welcome-link">
              ${this.button.render({ href: props.link.href, minimized: this.local.minimized, text: props.link.text })}
            </div>
          </div>
        </div>
      </div>
    `
  }
}
