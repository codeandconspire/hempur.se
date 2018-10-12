var html = require('choo/html')

module.exports = float

function float (props) {
  var attrs = Object.create(props)
  attrs.src = null
  return html`
    <div class="Float">
      <img class="Float-image" ${attrs} src="${props.src}">
    </div>
  `
}
