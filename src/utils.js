const setAttr = (node, key, value) => {
  switch(key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      let tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      tagName === 'input' && tagName === 'textarea' ? node.value = value : node.setAttribute(key, value)
      break
    default:
      node.setAttribute(key, value)
      break
  }
}

const type = (target) => {
  return Object.prototype.toString.call(target).replace(/\[.*\s(.*)\]/g, '$1')
}

const isArray = (list) => {
  return type(list) === 'Array'
}

const isString = (str) => {
  return type(str) === 'String'
}

const isDef = (v) => {
  return v !== undefined && v !== null
}

const toArray = (arrayLike) => {
  if (!arrayLike) return []
  const list = []
  for (let i = 0, len = arrayLike.length; i < len; i ++) list.push(arrayLike[i])
  return list
}

const slice = (arrayLike, index) => {
  return Array.prototype.slice.call(arrayLike, index)
}

const isElementNode = (node) => {
  return node.nodeType === 1
}

export default {
  setAttr,
  type,
  isArray,
  isString,
  isDef,
  toArray,
  slice,
  isElementNode
}