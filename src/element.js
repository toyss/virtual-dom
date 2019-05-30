import _ from './utils'

function Element (tagName, props, children) {
  if (_.isArray(props)) {
    children = props
    props = {}
  }

  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props ? props.key : undefined
}

Element.prototype.render = function () {
  var el = document.createElement(this.tagName)
  var props = this.props

  for (var propKey in props) {
    el.setAttribute(propKey, props[propKey])
  }

  this.children.forEach(function (child) {
    var childEl = (child instanceof Element)
      ? child.render()
      : document.createTextNode(child)
    el.appendChild(childEl)
  })

  return el
}

export default Element