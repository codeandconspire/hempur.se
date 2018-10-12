var html = require('choo/html')

module.exports = hero

function hero (props) {
  return html`
    <div class="Hero">
      <div class="u-container">
        <small class="Hero-subheading">${props.subheading}</small>
        <h1 class="Hero-heading">${props.heading}</h1>
      </div>
    </div>
  `
}
