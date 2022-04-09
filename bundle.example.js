; (function (modules) {
  function require(filePath) {
    const fn = modules[filePath]

    const module = {
      exports: {}
    }
    fn(require, module, module.exports)
    return module.exports
  }
})({
  "./foo.js": function foojs(require, module, exports) {
    function foo() {
      console.log('foo')
    }
    module.exports = {
      foo
    }
  },
  "./main.js": function mainjs(require, module, exports) {
    const { foo } = require('./foo.js')
    foo()
    console.log('main.js')
  }
}
)
