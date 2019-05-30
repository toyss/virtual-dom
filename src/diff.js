// 1、两棵树完全比较时间复杂度是O(n^3)，但是如果放弃深度遍历，只做平层比较两棵树的节点，时间复杂度是O(n)
// 2、平层Diff，只有四种情况：节点类型变更、节点属性变更、文本变更、移动/增加/删除子节点
// 节点类型变更（REPLACE）：直接将旧节点卸载并装载新节点
// 节点属性变更（PROPS）：将节点属性更新
// 文本变更（TEXT）：修改文本内容
// 移动/增加/删除子节点（REORDER）

import _ from './utils'
import listDiff from './list-diff'

var OPERATE_TYPE = {
  REPLACE: 0,
  REORDER: 1,
  PROPS: 2,
  TEXT: 3
}

function diff (oldNode, newNode) {
  var index = 0 // 当前节点的标志
  var patches = {} // 记录每个节点差异的地方

  dfsWalk(oldNode, newNode, index, patches)

  return patches
}

function dfsWalk (oldNode, newNode, index, patches) {
  var currentPatch = []

  // 节点被移除
  if (newNode == null) {
    // 真实节点将被移除
  }
  // 节点文本变更
  else if (
    _.isString(oldNode) &&
    _.isString(newNode)
  ) {
    if (newNode !== oldNode) {
      currentPatch.push({
        type: OPERATE_TYPE.TEXT,
        content: newNode
      })
    }
  }
  // 节点属性变更
  else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    var propsPatches = diffProps(oldNode, newNode)

    if (propsPatches) {
      currentPatch.push({
        type: OPERATE_TYPE.PROPS,
        props: propsPatches
      })
    }
    // 如果节点存在ignore属性，不比较子节点
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      )
    }
  }
  // 节点变更
  else {
    currentPatch.push({
      type: OPERATE_TYPE.REPLACE,
      node: newNode
    })
  }

  if (currentPatch.length) {
    patches[index] = currentPatch
  }
}

function diffProps (oldNode, newNode) {
  var count = 0
  var oldProps = oldNode.props
  var newProps = newNode.props

  var propsPatches = {}
  // 值不同的属性
  for (var key in oldProps) {
    var value = oldProps[key]
    if (newProps[key] !== value) {
      count ++
      propsPatches[key] = newProps[key]
    }
  }
  // 新增属性
  for (var key in newProps) {
    var value = newProps[key]
    if (oldProps.hasOwnProperty(key)) {
      count ++
      propsPatches[key] = value
    }
  }

  if (count == 0) {
    return null
  }

  return propsPatches
}

function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
  var listDiffs = listDiff(oldChildren, newChildren, 'key')
  var newChildren = listDiffs.children

  // 移动/增加/删除子节点（REORDER）
  if (listDiffs.moves.length) {
    currentPatch.push({
      type: OPERATE_TYPE.REORDER,
      moves: listDiffs.moves
    })
  }

  var leftNode = null
  var currentNodeIndex = index

  _.each(oldChildren, function (child, i) {
    var newChild = newChildren[i]
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1
    dfsWalk(child, newChild, currentNodeIndex, patches)
    leftNode = child
  })
}

function isIgnoreChildren (node) {
  return node.props && node.props.hasOwnProperty('ignore')
}

export default diff