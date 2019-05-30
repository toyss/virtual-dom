import Element from './element'
import diff from './diff'
import patch from './patch'

var tree = new Element('div', {'id': 'container'}, [
  new Element('h1', {style: 'color: blue'}, ['simple virtal dom']),
  new Element('p', ['Hello, virtual-dom1']),
  new Element('ul', [
    new Element('li', ['窝边草']), 
    new Element('li', ['兔子都不吃'])
  ])
])

// 2. 通过虚拟DOM构建真正的DOM
var root = tree.render()
document.body.appendChild(root)

// 3. 生成新的虚拟DOM
var newTree = new Element('div', {'id': 'container'}, [
  new Element('h1', {style: 'color: red'}, ['simple virtal dom']),
  new Element('p', ['Hello, virtual-dom2']),
  new Element('ul', [
    new Element('li', ['窝边草在哪里']), 
    new Element('li', ['兔子吃'])
  ])
])


console.log(tree);
console.log(newTree);

console.log(diff(tree, newTree));

var diffs = diff(tree, newTree)

patch(tree, diffs)