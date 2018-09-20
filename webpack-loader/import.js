// 实现模块的按需加载
// import { Button } from 'antd'
// babel-plugin-import
// import { Button, Alert } from 'antd'
// import Button from 'antd/lib/button'
// import Alert from 'antd/lib/alert'

let babel = require('babel-core')
let t = require('babel-types')
let code = `import {Button, Alert} from 'antd'`
let importPlugin = {
  visitor: {
    ImportDeclaration(path) {
      let { node } = path
      //...
    }
  }
}

let r = babel.transform(code, {
  plugins: [
    importPlugin
  ]
})

console.log(r)