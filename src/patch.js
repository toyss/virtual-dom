import _ from './utils'

var OPERATE_TYPE = {
  REPLACE: 0,
  REORDER: 1,
  PROPS: 2,
  TEXT: 3
}

var LIST_OPERATE_TYPE = {
  REMOVE: 0,
  INSERT: 1
}

function patch (node, patches) {
  var walker = { index: 0 }
  dfsWalk(node, walker, patches)
}

function dfsWalk (node, walker, patches) {
  var currentPatches = patches[walker.index]  // 当前节点的差异
  var len = node.children
      ? node.children.length
      : 0

      console.log(len);
  for (var i = 0; i < len; i ++) { // 深度遍历子节点
    var child = node.children[i]

    walker.index ++
    dfsWalk(child, walker, patches)
  }

  if (currentPatches) {
    applyPatches(node, currentPatches)
  }
}

function applyPatches (node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case OPERATE_TYPE.REPLACE:
        var newNode = _.isString(currentPatch.type)
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render()
        node.parentNode.replaceChild(newNode, node)
        break
      case OPERATE_TYPE.REORDER:
        reorderChildren(node, currentPatch.moves)
        break
      case OPERATE_TYPE.PROPS:
        setProps(node, currentPatch.props)
        break
      case OPERATE_TYPE.TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content
        } else {
          node.nodeValue = currentPatch.content
        }
        break
      default:
        throw new Error('Unknown patch type' + currentPatch.type)
    }
  })
}

function reorderChildren (node, moves) {
  var staticNodeList = _.toArray(node.children)
  var maps = {}

  _.each(moves, function (move) {
    var index = move.index

    switch (move.type) {
      case LIST_OPERATE_TYPE.REMOVE:
        if (staticNodeList[index] === node.children[index]) {
          node.removeChild(node, childNodes[index])
        }
        staticNodeList.splice(index, 1)
        break
      case LIST_OPERATE_TYPE.INSERT:
        var insertNode = maps[move.item.key]
            ? maps[move.item.key].clone(true)
            : typeof move.item === 'object'
              ? move.item.render()
              : document.createTextNode(move.item)
        
        staticNodeList.splice(index, 0, insertNode)
        node.insertBefore(insertNode, node.children[index] || null)
        break
    }
  })
}

function setProps (node, props) {
  for (var key in props) {
    var value = props[key]
    
    if (value === undefined) {
      node.removeAttribute(key)
    } else {
      _.setAttr(node, key, value)
    }
  }
}

export default patch