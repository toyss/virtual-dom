import _ from './utils'

const REPLACE = 0
const ATTRS   = 1
const TEXT    = 2
const REORDER = 3

export default (oldTree, newTree) => {
  let index   = 0,
      patches = {}
  walk(oldTree, newTree, index, patches)
  return patches
}

const walk = (oldNode, newNode, index, patches) => {
  let currentPatch = []
  if(!_.isDef(newNode)) {

  } else if(_.isString(oldNode) && _.isString(newNode)) {
    newNode !== oldNode && currentPatch.push({ type: TEXT, content: newNode })
  } else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
    let attrsPatches = diffAttrs(oldNode, newNode)
    attrsPatches && currentPatch.push({ type: ATTRS, attrs: attrsPatches })
    diffChildren(oldNode.children, newNode.children, index, patches)
  } else {
    currentPatch.push({ type: REPLACE, content: newNode })
  }
  currentPatch.length && (patches[index] = currentPatch)
}

const diffAttrs = (oldNode, newNode) => {
  let count    = 0,
      oldAttrs = oldNode.attrs,
      newAttrs = newNode.attrs,
      attrsPatches = {}
  for (let key in oldAttrs) {
    if(newAttrs[key] !== oldAttrs[key]) {
      count ++
      attrsPatches[key] = newAttrs[key]
    }
  }
  for(let key in newAttrs) {
    if(!oldAttrs.hasOwnProperty(key)) {
      count ++
      attrsPatches[key] = newAttrs[key]
    }
  }
  if(count === 0) return
  return attrsPatches
}

let key_id = 0

const diffChildren = (oldChildren, newChildren, index, patches) => {
  let currentNodeIndex = index
  oldChildren.forEach((child, ind) => {
    currentNodeIndex = ++ key_id
    walk(child, newChildren[ind], currentNodeIndex, patches)
  })
}