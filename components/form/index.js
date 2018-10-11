var html = require('choo/html')

exports.input = function (props) {
  var attrs = Object.assign({ size: 28 }, props, {
    class: 'Form-input' + (props.class ? ' ' + props.class : '')
  })
  return html`<input ${attrs}>`
}
