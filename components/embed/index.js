var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var player = require('./player')
var { i18n, offset, vh } = require('../base')

var text = i18n()

// match short and long youtube links
// https://www.youtube.com/watch?v=WwE7TxtoyqM
// https://youtu.be/gd6_ZECm58g
var YOUTUBE_RE = /https?:\/\/(?:www.)?youtu\.?be(?:\.com\/watch\?v=|\/)(\w+)(?:\?|&|$)/

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
      if (next !== prev) el.style.setProperty('--Embed-inview', next)
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
    var [provider, id] = parse(props.url)
    var src = `/media/${provider}/w_900,c_fill,q_auto/${id}`
    var portrait = [
      `/media/${provider}/w_400,h_533,c_fill,q_auto/${id} 400w`,
      `/media/${provider}/w_600,h_800,c_fill,q_auto/${id} 600w`,
      `/media/${provider}/w_999,h_1332,c_fill,q_auto/${id} 999w`
    ]
    var landscape = [
      `/media/${provider}/w_1000,c_fill,q_auto/${id} 1000w`,
      `/media/${provider}/w_1800,c_fill,q_auto/${id} 1800w`,
      `/media/${provider}/w_3600,c_fill,q_30/${id} 3600w`
    ]

    return html`
      <a href="${props.url}" target="_blank" rel="noopener noreferrer" onclick=${onclick} class="Embed" style="--Embed-inview: ${this.local.inview}" id="${this.local.id}">
        <figure class="Embed-figure">
          <picture>
            <source media="(max-width: 999px)" srcset="${portrait.join(',')}">
            <source media="(min-width: 1000px)" srcset="${landscape.join(',')}">
            <img class="Embed-image js-image" src="${src}" alt="${props.title || ''}">
          </picture>
          <figcaption class="Embed-caption">
            ${props.title ? html`<strong class="Embed-title">${props.title}</strong>` : null}
            <span class="Embed-play">${text`Play the film`}</span>
          </figcaption>
        </figure>
      </a>
    `

    function onclick (event) {
      player.render(props.url)
      event.preventDefault()
    }
  }
}

// extract provider and id from embed url
// str -> arr
function parse (url) {
  var match = url.match(/vimeo\.com\/(.+)?\??/)
  if (match) return ['vimeo', match[1]]

  match = url.match(YOUTUBE_RE)
  if (match) return ['youtube', match[1]]

  throw new Error(`embed: provider not supported`)
}
