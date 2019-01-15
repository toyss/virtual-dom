import el   from './element'
import diff from './diff'

let ul = el('ul', { id: '222' }, [
  el('li', { class: 'item1' }, ['Item 1']),
  el('li', { class: 'item' }, ['Item 2']),
  el('li', { class: 'item' }, ['Item 3']),
  el('li', { class: 'item' }, ['Item 3'])
])
let ul1 = el('ul', { id: 'list1' }, [
  el('li', { class: 'item1' }, ['Item 1']),
  el('li', { class: 'item2' }, ['Item 5']),
  el('li', { class: 'item' }, ['Item 4']),
])
let patches = diff(ul, ul1);
console.log(patches);
