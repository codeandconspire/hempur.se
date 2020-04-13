var html = require('choo/html')
var Component = require('choo/component')
var { input } = require('../form')
var Button = require('../button')
var { i18n } = require('../base')

var text = i18n()

module.exports = class Subscribe extends Component {
  constructor (id, state, emit) {
    super(id)
    this.cache = state.cache
    this.local = state.components[id] = {
      id: id,
      subscribed: false
    }
  }

  update () {
    return false
  }

  createElement (props) {
    var self = this

    return html`
      <form method="POST" action="${props.action}" class="Form" onsubmit=${onsubmit} target="_blank">
        ${this.local.subscribed ? html`
          <fieldset class="Text Text--center">
            <p>${props.success}</p>
            ${this.cache(Button, `subscribe-reset-${this.local.id}`).render({ type: 'reset', class: 'Button--invert', text: text`Signup another e-mail address`, onclick: onreset })}
          </fieldset>
        ` : html`
          <fieldset class="js-fieldset">
            ${props.ref ? html`<input type="hidden" name="REF" value="${props.ref}">` : null}
            <label class="u-block u-spaceB2">
              <span class="u-hiddenVisually">${text`Enter your e-mail address`}</span>
              ${input({ class: 'js-input', name: 'EMAIL', type: 'email', value: '', placeholder: text`Enter your e-mail address` })}
            </label>
            ${this.cache(Button, `subscribe-submit-${this.local.id}`).render({ type: 'submit', class: 'Button--invert', text: text`Send` })}
          </fieldset>
        `}
      </form>
    `

    function onreset () {
      self.local.subscribed = false
      self.rerender()
    }

    function onsubmit (event) {
      var data = new window.FormData(this)
      var fieldset = this.querySelector('.js-fieldset')

      var body = {}
      data.forEach(function (value, key) {
        body[key] = value
      })

      window.fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (!res.ok) return res.text().then((text) => Promise.reject(text))
        self.local.subscribed = true
        self.rerender()
      }).catch(() => {
        var url = new URL(props.action)
        Object.keys(data).forEach(function (key) {
          url.searchParams.set(key, data[key])
        })
        window.location = url.toString()
      })

      fieldset.disabled = true
      event.preventDefault()
    }
  }
}
