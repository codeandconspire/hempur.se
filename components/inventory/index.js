var html = require('choo/html')

module.exports = inventory

function inventory (list) {
  let items = []
  for (let i = 0, len = list.length; i < len; i++) {
    items.push(
      html`<dt class="Inventory-label">${list[i].label}:</dt>`,
      html`<dd class="Inventory-value">${list[i].value}</dd>`
    )
  }
  return html`
    <dl class="Inventory">
      ${items}
    </dl>
  `
}
