var html = require('choo/html')
var LazyView = require('choo-lazy-view')
var logo = require('../logo')
var menu = require('../menu')
var error = require('./error')
var { i18n } = require('../base')
var player = require('../embed/player')

var text = i18n()

module.exports = View

function View (view) {
  if (!(this instanceof View)) return View.wrap(view)
  LazyView.apply(this, Array.prototype.slice.call(arguments))
  this.createElement = View.wrap(this.createElement.bind(this))
}

Object.assign(View, LazyView)
View.prototype = Object.create(LazyView.prototype)
View.prototype.constructor = View

View.wrap = function (view) {
  return function (state, emit) {
    try {
      var children = view(state, emit)
    } catch (err) {
      emit('error', err)
      children = error(err, emit)
    }

    return state.prismic.getSingle('webpage', function (err, doc) {
      if (err) throw err
      if (!doc || state.prefetch) return children

      return html`
        <body id="app" class="View">
          <header>
            <nav class="View-header u-container">
              <a href="/" title="${text`Go to start page`}">${logo({ theme: 'green' })}</a>
              ${menu(doc.data.header_menu.map((item) => ({ href: state.prismic.resolve(item.link), text: item.label })), { direction: 'row' })}
            </nav>
          </header>
          ${children}
          <footer class="View-footer">
            <div class="u-container">
              ${menu(doc.data.footer_menu.map((item) => ({ href: state.prismic.resolve(item.link), text: item.label })), { align: 'right', direction: 'column' })}
              <hr class="View-divider">
              <div class="View-credits">
                <a href="/" title="${text`Back to start page`}">${logo()}</a>
                ${doc.data.copyright}
              </div>
            </div>
          </footer>
          ${player.render(null)}
        </body>
      `
    })
  }
}
