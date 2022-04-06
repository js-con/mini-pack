import * as fs from "fs"
import * as parser from "@babel/parser"
import * as traverse from "@babel/traverse"
import * as path from 'path'

interface Asset {
  filePath: string
  source: string
  deps: string[]
}
function createAsset(filePath: string): Asset {
  // 1. 获取文件内容
  const source = fs.readFileSync(filePath, { encoding: "utf-8" })

  // 2. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  })

  const deps: string[] = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    },
  })

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
      const child = createAsset(path.resolve('./example', relativePath))
      queue.push(child)
    })
  }

  return queue
}

const graph = createGraph()
