const utils = {
  isString (target) {
    return utils.type(target) === 'String'
  },
  isArray (target) {
    return utils.type(target) === 'Array'
  },
  type (target) {
    return Object.prototype.toString.call(target).replace(/\[object\s|\]/g, '')
  },
  each (array, fn) {
    for (var i = 0, len = array.length; i < len; i ++) {
      fn(array[i], i)
    }
  },
  toArray (target) {
    if (!listLike) {
      return []
    }

    var list = []

    for (var i = 0, len = target.length; i < len; i ++) {
      list.push(target[i])
    }

    return list
  },
  setAttr (node, key, value) {
    switch (key) {
      case 'style':
        node.style.cssText = value
        break
      case 'value':
        var tagName = (node.tagName || '').toLowerCase()
        if (tagName === 'input' || tagName === 'textarea') {
          node.value = value
        } else {
          node.setAttribute(key, value)
        }
        break
      default:
        node.setAttribute(key, value)
        break
    }
  }
}

export default utils