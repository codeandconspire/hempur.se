module.exports = subscribe

function subscribe (state, emitter) {
  emitter.on('subscribe', function (data, url) {
    if (data instanceof window.FormData) {
      let form = data
      data = {}
      form.forEach(function (value, key) {
        data[key] = value
      })
    }

    window.fetch(`/subscribe`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (!res.ok) return res.text().then((text) => Promise.reject(text))
      emitter.emit('render')
    }).catch(() => {
      window.location = url
    })
  })
}
