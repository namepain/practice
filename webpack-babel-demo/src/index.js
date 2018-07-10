import 'babel-polyfill'

function fn() {
  return new Promise(() => {
   setTimeout(() => {
     console.log('asdasd')
   }, 1000)
 })
}

var bb = async function() {
  await fn()
}
bb()

console.log('bbbbbb')

console.log([1,2,3,4].includes(2))

console.log(Array.from({length: 2}))

console.log(Object.assign({a: 'aaa'}, {b: 'bbb'}))

var c = new WeakMap()
console.log(c)