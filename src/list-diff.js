var LIST_OPERATE_TYPE = {
  REMOVE: 0,
  INSERT: 1
}

function listDiff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)

  var newFree = newMap.free

  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex

  var moves = []

  // 模拟操作列表
  var children = []
  var i = 0
  var item
  var itemKey
  var freeIndex = 0

  // 第一遍检测：删除或不存在的节点
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    
    if (itemKey) {
      // 新列表当前节点删除
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      }
      // 新列表存在当前节点
      else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex ++]
      children.push(freeItem || null)
    }
    i ++
  }
  var simulateList = children.slice()

  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] == null) {
      remove(i)
      removeSimulate(i)
    } else {
      i ++
    }
  }
  // i 是指向 newList 的光标
  // j 是指向 模拟操作列表的光标
  var j = i = 0
  while (i < newList.length) {
    item = newList[i]
    itemKey = getItemKey(item, key)

    var simulateItem = simulateList[j]
    var simulateItemKey = getItemKey(simulateItem, key)

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j ++
      } else {
        // 如果是新项，做插入记录
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item)
        } else {
          var nextItemKey = getItemKey(simulateList[j + 1], key)
          if (nextItemKey === itemKey) {
            remove(i)
            removeSimulate(j)
            j ++
          } else {
            insert(i, item)
          }
        }
      }
    } else {
      insert(i, item)
    }
    i ++
  }

  // 如果 j 没有到模拟操作列表，则删除剩余项
  var k = 0
  while (j ++ < simulateList.length) {
    remove(k + i)
    k ++
  }

  function remove (index) {
    moves.push({
      type: LIST_OPERATE_TYPE.REMOVE,
      index: index
    })
  }

  function insert (index, item) {
    moves.push({
      type: LIST_OPERATE_TYPE.INSERT,
      index: index,
      item: item
    })
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1)
  }

  return { moves, children }
}

function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  var len = list.length

  for (var i = 0; i < len; i ++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)

    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
    }
  }

  return { keyIndex, free }
}

function getItemKey (item, key) {
  if (!item || !key) return
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

export default listDiff