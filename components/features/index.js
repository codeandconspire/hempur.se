var html = require('choo/html')

module.exports = features

function features (items) {
  return html`
    <ul class="Features">
      ${items.map((item) => html`
        <li class="Features-item">
          ${typeof item === 'function' ? item() : item}
        </li>
      `)}
    </ul>
  `
}
