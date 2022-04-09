import * as fs from "fs"
import * as parser from "@babel/parser"
import * as traverse from "@babel/traverse"
import * as path from "path"
import * as babelCore from "@babel/core"
import * as ts from "ts-node"
import * as ejs from "ejs"

interface Asset {
  filePath: string
  code: string
  deps: string[]
  id: number
  mapping: Record<string, number>
}

//每个文件的id
let id = 0
function createAsset(filePath: string): Asset {
  // 1. 获取文件内容
  let source = fs.readFileSync(filePath, { encoding: "utf-8" })

  // 2. 转换成JS
  if (filePath.endsWith(".ts"))
    source = ts
      .create({
        compilerOptions: {
          module: "es6",
        },
      })
      .compile(source, filePath)

  //console.log('-----source--------\n',source)

  // 3. 获取依赖关系
  const ast = parser.parse(source, {
    sourceType: "module",
  })
  //console.log("---------ast----------\n", ast)

  const deps: string[] = []
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value)
    },
  })

  // 5. esm转cjs
  const { code } = babelCore.transformFromAstSync(ast, null, {
    presets: ["env"],
  })
  //console.log('-----------code-------------',code)

  return {
    filePath,
    code,
    deps,
    mapping: {},
    id: id++,
  }
}

function createGraph() {
  const mainAsset = createAsset("./example/main.ts")

  //队列广度优先遍历生成图
  const queue = [mainAsset]

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath))
      asset.mapping[relativePath] = child.id
      queue.push(child)
    })
  }

  return queue
}

function build(graph: Asset[]) {
  const tpl = fs.readFileSync("./bundle.example.ejs", { encoding: "utf-8" })
  const data = graph.map((asset) => ({
    id: asset.id,
    code: asset.code,
    mapping: asset.mapping,
  }))
  const code = ejs.render(tpl, { data })
  fs.writeFileSync("./bundle.js", code)
}
const graph = createGraph()

build(graph)
