var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var { i18n, offset, vh } = require('../base')

var text = i18n()

module.exports = class Embed extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = {
      id: id,
      inview: 0
    }
  }

  update () {
    return false
  }

  load (el) {
    var top, height
    var image = el.querySelector('.js-image')
    var onscroll = nanoraf(() => {
      var viewport = vh()
      var scroll = window.scrollY
      if (scroll + viewport < top) return
      if (scroll > top + height) return
      var prev = this.local.inview
      var max = height + viewport
      var range = Math.min(Math.max(scroll + viewport - top, 0), max)
      var next = this.local.inview = +(range / max).toFixed(3)
      if (next !== prev) el.style.setProperty('--Photo-inview', next)
    })
    var onresize = nanoraf(function () {
      top = offset(image)
      height = image.offsetHeight
    })

    onresize()
    onscroll()
    window.addEventListener('scroll', onscroll)
    window.addEventListener('resize', onresize)
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  createElement (props) {
    var img = props.image.url
    var src = `/media/fetch/w_900,c_fill,q_35/${img}`
    var portrait = [
      `/media/fetch/w_400,h_533,c_fill,q_35/${img} 400w`,
      `/media/fetch/w_600,h_800,c_fill,q_35/${img} 600w`,
      `/media/fetch/w_999,h_1332,c_fill,q_35/${img} 999w`
    ]
    var landscape = [
      `/media/fetch/w_1000,c_fill,q_35/${img} 1000w`,
      `/media/fetch/w_1800,c_fill,q_35/${img} 1800w`,
      `/media/fetch/w_3600,c_fill,q_35/${img} 3600w`
    ]

    return html`
      <div class="Photo" style="--Photo-inview: ${this.local.inview}" id="${this.local.id}">
        <figure class="Photo-figure">
          <picture>
            <source media="(max-width: 999px)" srcset="${portrait.join(',')}">
            <source media="(min-width: 1000px)" srcset="${landscape.join(',')}">
            <img class="Photo-image js-image" src="${src}" alt="${props.title || ''}">
          </picture>
        </figure>
      </div>
    `
  }
}
