var html = require('choo/html')
var { isSameDomain, className } = require('../base')

module.exports = menu

function menu (links, opts = {}) {
  return html`
    <ul class="${className('Menu', { [`Menu--${opts.direction}`]: opts.direction, [`Menu--${opts.align}`]: opts.align })}">
      ${links.map(link)}
    </ul>
  `
}

function link (props) {
  var attrs = { href: props.href, class: 'Menu-link' }
  if (props.target === '_blank' || !isSameDomain(attrs.href)) {
    if (props.target) attrs.target = props.target
    attrs.rel = 'noopener noreferrer'
  }
  return html`
    <li class="Menu-item">
      <a ${attrs}>${props.text}</a>
    </li>
  `
}
