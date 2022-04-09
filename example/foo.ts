//@ts-ignore
import { bar } from "./bar.ts"

export function foo(str: string) {
  console.log("foo")
  bar()
}
