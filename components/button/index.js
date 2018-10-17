var html = require('choo/html')
var Component = require('choo/component')
var nanoraf = require('nanoraf')
var { className } = require('../base')

module.exports = class Button extends Component {
  constructor (id) {
    super(id)
    this.local = {
      id: id,
      minimized: false
    }
  }

  update (props) {
    return props !== this.props
  }

  load (el) {
    var self = this
    var onresize = nanoraf(size)

    onresize()
    window.addEventListener('resize', onresize)
    self.unload = function () {
      window.removeEventListener('resize', onresize)
    }

    function size () {
      el.classList.remove('is-minimized')
      el.style.width = 'auto'
      self.local.width = el.offsetWidth
      self.rerender()
      if (self.local.minimized) {
        el.classList.add('is-minimized')
      }
    }
  }

  createElement (props) {
    this.props = props
    this.local.minimized = props.minimized

    var attrs = {}
    var keys = Object.keys(props)
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let val = props[key]
      if (key !== 'text' && key !== 'minimized' && key !== 'class') {
        if (typeof val === 'boolean' && val) val = key
        if (val) attrs[key] = val
      }
    }
    attrs.class = className('Button', { [props.class]: props.class, 'is-minimized': props.minimized })
    attrs.id = this.local.id
    attrs.style = `width: ${this.local.width}px`
    var label = html`<span class="Button-text">${props.text}</span>`
    if (attrs.href) return html`<a ${attrs}>${label}</a>`
    return html`<button ${attrs}>${label}</button>`
  }
}
