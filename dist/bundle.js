; (function (modules) {
  function require(id) {
    const [fn,mapping] = modules[id]

    const module = {
      exports: {}
    }

    function localRequire(filePath) {
      const id = mapping[filePath]
      return require(id)
    }

    fn(localRequire, module, module.exports)
    return module.exports
  }
  require(0)
})({
  

    "0": [function (require, module, exports) {
      "use strict";

var _foo = require("./foo.ts");

//@ts-ignore
(0, _foo.foo)('123');
console.log("main.js");
    },{"./foo.ts":1}],

  

    "1": [function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;

var _bar = require("./bar.ts");

//@ts-ignore
function foo(str) {
  console.log("foo");
  (0, _bar.bar)();
}
    },{"./bar.ts":2}],

  

    "2": [function (require, module, exports) {
      "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;

function bar() {
  console.log('bar');
}
    },{}],

  
})
