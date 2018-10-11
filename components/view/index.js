var html = require('choo/html')
var LazyView = require('choo-lazy-view')
var logo = require('../logo')
var menu = require('../menu')
var { i18n } = require('../base')

var text = i18n()

module.exports = class View extends LazyView {
  createElement (state, emit) {
    return html`
      <body id="app" class="View">
        <header class="u-container">
          <nav class="View-header">
            <a href="/" title="${text`Go to start page`}">${logo()}</a>
            ${menu([{ href: '/faq', text: 'Frågor och svar' }, { href: '/kontakt', text: 'Kontakt' }], { direction: 'row' })}
          </nav>
        </header>
        ${super.createElement(state, emit)}
        <footer class="View-footer">
          <div class="u-container">
            ${menu([{ href: '/faq', text: 'Frågor och svar' }, { href: '/kontakt', text: 'Kontakt' }], { align: 'right', direction: 'column' })}
            <hr class="View-divider u-spaceV3">
            <div class="View-credits">
              <a href="/" title="${text`Back to start page`}">${logo()}</a>
              © 2018 Hempur AB
            </div>
          </div>
        </footer>
      </body>
    `
  }
}
