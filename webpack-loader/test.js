var esprima = require('esprima')
let estraverse = require('estraverse')

let code = 'function(){}'
let tree = esprima.parseScript(code)

estraverse.traverse(TreeWalker, {
  enter(node) {
    if(node.type === 'Identifier') {
      node.name = 'zfpx';
    }
  }
})

let escodegen = require('escodegen')
let r = escodegen.generate(tree)
console.log(r)
