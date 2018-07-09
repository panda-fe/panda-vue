// import BasicTable from '../packages/basictable/index.js'
var BasicTable = require('../packages/basictable/index.js')

const components = [
  BasicTable
]

const install = function(Vue, opts = {}) {

  // 组件统一载入
  components.map(component => {
    Vue.component(component.name, component)
  })

  // 1. 添加全局方法或属性，如:  vue-custom-element
  // Vue.myGlobalMethod = function () {
  //   // 逻辑...
  // }

  // 2. 添加全局资源：指令/过滤器/过渡等，如 vue-touch
  // Vue.directive('my-directive', {
  //   bind (el, binding, vnode, oldVnode) {
  //     // 逻辑...
  //   }
  // })

  // 3. 通过全局 mixin方法添加一些组件选项，如: vuex
  // Vue.mixin({
  //   created: function () {
  //     // 逻辑...
  //   }
  // })

  // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
  // Vue.prototype.$myMethod = function (options) {
  //   // 逻辑...
  // }

}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

module.exports = {
  BasicTable
}

module.exports.default = module.exports
