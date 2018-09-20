let babel = require('babel-core')
let t = require('babel-types')

/**
 * function Zfpx(name){
 *  this.name = name
 * }
 * Zfpx.prototype.getName = function(){
 *  return this.name
 * }
 */

let code = `
class zfpx{
  constructor(name) {
    this.name = name;
  }
  getName(){
    return this.name
  }
}`

let ClassPlugin = {
  visitor: {
    ClassDeclaration(path) {
      let { node } = path
      let className = node.id.name
      let classList = node.body.body
      
      className = t.identifier(className)   // 函数名必须是一个标识符
      let func = t.functionDeclaration(className, [], t.blockStatement([]), false, false)
      path.replaceWith(func)

      let es5Func = []
      classList.forEach((item, index) => {
        // 函数的代码体
        let body = classList[index].body
        if (item.kind === 'constructor') {
          let params = item.params.length ? item.params.map(v => v.name) : []
          params = t.identifier(params)
          func = t.functionDeclaration(className, [params], body, false, false)
          path.replaceWith(func)
        } else {
          // 其他情况就是原型上的方法
          let protoObj = t.memberExpression(className, t.identifier('prototype'))
          let left = t.memberExpression(protoObj, t.identifier(item.key.name))
          let right = t.functionExpression(null, [], body, false, false)

          let assign = t.assignmentExpression('=', left, right)
          // 多个原型上的方法
          es5Func.push(assign)
        }
      })
      if (es5Func.length == 0) {
        path.replaceWith(func)
      } else {
        // 有原型上的方法
        es5Func.push(func)
        // 替换n 个节点
        path.replaceWithMultiple(es5Func)
      }
    }
  }
}

let r = babel.transform(code, {
  plugins: [
    ClassPlugin
  ]
})

console.log(r)