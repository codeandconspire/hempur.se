var html = require('choo/html')
var { className } = require('../base')

module.exports = button

function button (props) {
  var attrs = {}
  var keys = Object.keys(props)
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let val = props[key]
    if (key !== 'text' && key !== 'class') {
      if (typeof val === 'boolean' && val) val = key
      if (val) attrs[key] = val
    }
  }
  attrs.class = className('Button', { [props.class]: props.class })
  if (attrs.href) return html`<a ${attrs}>${props.text}</a>`
  return html`<button ${attrs}>${props.text}</button>`
}
