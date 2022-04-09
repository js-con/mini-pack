import * as fs from "fs"
import * as parser from "@babel/parser"
import * as traverse from "@babel/traverse"
import * as path from "path"
import * as babelCore from "@babel/core"
import * as ts from 'ts-node'

interface Asset {
  filePath: string
  source: string
  deps: string[]
}
function createAsset(filePath: string): Asset {
  // 1. 获取文件内容
  let source = fs.readFileSync(filePath, { encoding: "utf-8" })

  // 2. 转换成JS
  if(filePath.endsWith('.ts'))
    source = ts.create({
      compilerOptions:{
        module:'es6'
      }
    }).compile(source, filePath)

  console.log('-----source--------\n',source)

  // 3. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  })
  console.log('---------ast----------\n',ast)

  const deps: string[] = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      console.log('---------------deps',node.source.value)
      deps.push(node.source.value)
    },
  })

  // 5. esm转cjs
/*   const { code } = babelCore.transformFromAstSync(ast, null, {
    presets: ["env"],
  })
  console.log('code',code) */

  return {
    filePath,
    source,
    deps,
  }
}

function createGraph() {
  const mainAsset = createAsset("./example/main.ts")

  //队列广度优先遍历生成图
  const queue = [mainAsset]

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath))
      queue.push(child)
    })
  }

  return queue
}

const graph = createGraph()
console.log('--------------graph----------',graph)
