let babel = require('babel-core')
let t = require('babel-types')
// 1. 生成 ast
// 2. 判断是不是某个东西

let code = `let sum = (a, b) => {return a + b}`

let ArrowPlugin = {
  visitor: {
    // path 是树的路径
    ArrowFunctionExpression(path) {
      let node = path.node
      let params = node.params
      let body = node.body
      // 生成一个函数表达式
      if (!t.isBlockStatement(body)) {
        // 不是代码块
        let returnStatement = t.returnStatement(body)
        body = t.blockStatement([returnStatement])
      }
      let func = t.functionExpression(null, params, body, false, false)
      path.replaceWith(func)
    }
  }
}

let r = babel.transform(code, {
  plugins: [
    ArrowPlugin
  ]
})

console.log(r.code)