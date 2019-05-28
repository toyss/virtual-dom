function Element (tagName, props, children) {
  if (!(this instanceof Element)) {
    return new Element(tagName, props, children)
  }

  this.tagName = tagName
  this.props = props || {}
  this.children = children || []
  this.key = props ? props.key : undefined

  let count = 0
  this.children.forEach(function (child) {
    if (child instanceof Element) {
      count += child.count
    }
    count ++
  })
  this.count = count
}