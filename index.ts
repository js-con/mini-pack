import * as fs from "fs"
import * as parser from "@babel/parser"
import * as traverse from "@babel/traverse"

function createAsset(filePath) {
  // 1. 获取文件内容
  const source = fs.readFileSync(filePath, { encoding: "utf-8" })

  // 2. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  })

  const deps = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    },
  })

  return {
    source,
    deps
  }
}
