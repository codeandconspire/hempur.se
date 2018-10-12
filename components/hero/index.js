var html = require('choo/html')

module.exports = hero

function hero (props) {
  return html`
    <div class="Hero">
      <div class="u-container">
        <div class="Text">
          <small class="Text-label">${props.subheading}</small>
          <h1>${props.heading}</h1>
        </div>
      </div>
    </div>
  `
}
