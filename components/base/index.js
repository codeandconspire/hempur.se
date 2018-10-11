var fs = require('fs')
var path = require('path')
var assert = require('assert')
var common = require('./lang.json')

// initialize translation utility with given language file
// obj -> str
exports.i18n = i18n
function i18n (source) {
  source = source || common

  // get text by applying as tagged template literal i.e. text`Hello ${str}`
  // (arr|str[, ...str]) -> str
  return function (strings, ...parts) {
    parts = parts || []

    var key = Array.isArray(strings) ? strings.join('%s') : strings
    var value = source[key] || common[key]

    if (!value) {
      value = common[key] = key
      if (typeof window === 'undefined') {
        var file = path.join(__dirname, 'lang.json')
        fs.writeFileSync(file, JSON.stringify(common, null, 2))
      }
    }

    return value.split('%s').reduce(function (result, str, index) {
      return result + str + (parts[index] || '')
    }, '')
  }
}

// get viewport height
// () -> num
exports.vh = vh
function vh () {
  return Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
}

// get viewport width
// () -> num
exports.vw = vw
function vw () {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
}

// compose class name based on supplied conditions
// (str|obj, obj?) -> str
exports.className = className
function className (root, classes) {
  if (typeof root === 'object') {
    classes = root
    root = ''
  }

  return Object.keys(classes).reduce((str, key) => {
    if (!classes[key]) return str
    return str + ' ' + key
  }, root).trim()
}

// detect if meta key was pressed on event
// obj -> bool
exports.metaKey = metaKey
function metaKey (e) {
  if (e.button && e.button !== 0) return true
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey
}

// compose srcset attribute from url for given sizes
// (str, arr, obj?) -> str
exports.srcset = srcset
function srcset (uri, sizes, opts = {}) {
  var type = opts.type || 'fetch'
  var transforms = opts.transforms
  if (!transforms) transforms = 'c_fill,f_auto,q_auto'
  if (!/c_/.test(transforms)) transforms += ',c_fill'
  if (!/f_/.test(transforms)) transforms += ',f_auto'
  if (!/q_/.test(transforms)) transforms += ',q_auto'

  // trim prismic domain from uri
  var parts = uri.split('hempur.cdn.prismic.io/hempur/')
  uri = parts[parts.length - 1]

  return sizes.map(function (size) {
    var transform = transforms
    if (Array.isArray(size)) {
      transform = size[1]
      if (!/c_/.test(transform)) transform += ',c_fill'
      if (!/f_/.test(transform)) transform += ',f_auto'
      if (!/q_/.test(transform)) transform += ',q_auto'
      size = size[0]
    }
    if (opts.aspect) transform += `,h_${Math.floor(size * opts.aspect)}`

    return `/media/${type}/${transform},w_${size}/${uri} ${size}w`
  }).join(', ')
}

// check if an URL is on the the current domain
// str -> bool
exports.isSameDomain = isSameDomain
function isSameDomain (url) {
  var external = /^[\w-]+:\/{2,}\[?[\w.:-]+\]?(?::[0-9]*)?/

  try {
    var result = external.test(url) && new window.URL(url)
    return !result || (result.hostname === window.location.hostname)
  } catch (err) {
    return true
  }
}
