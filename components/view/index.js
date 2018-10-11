var html = require('choo/html')
var LazyView = require('choo-lazy-view')

module.exports = class View extends LazyView {
  createElement (state, emit) {
    return html`
      <body id="app" class="View">
        ${super.createElement(state, emit)}
      </body>
    `
  }
}
