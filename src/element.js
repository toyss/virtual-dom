import _ from './utils'

class Element {
  constructor(tagName, attrs, children) {
    if(_.isArray(attrs)) {
      children = attrs
      attrs = {}
    }
    this.tagName =  tagName
    this.attrs = attrs || {}
    this.children = children
    this.key = attrs ? attrs.key : null
  }

  render() {
    let el = document.createElement(this.tagName)
    let attrs = this.attrs
    for (let attrName in attrs) {
      let attrValue = attrs[attrName]
      _.setAttr(el, attrName, attrValue)
    }

    let children = this.children || []
    children.forEach(child => {
      let childEl = child instanceof Element
        ? child.render()
        : document.createTextNode(child)
      el.appendChild(childEl)
    })
    return el
  }

}

export default (tagName, attrs, children) => {
  return new Element(tagName, attrs, children)
}
