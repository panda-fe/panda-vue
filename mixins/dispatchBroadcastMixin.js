/**
 * 创建于 2018/10/30
 * 作者: QianYu
 * 功能: 实现 broadcast / dispatch，子组件可以dispatch提交事件，父组件可以broadcast广播事件
 */

function broadcast(componentName, eventName, ...params) {
  this.$children.forEach(child => {
    const name = child.$options.name
    
    if (name === componentName) {
      child.$emit(eventName, ...params)
    } else {
      broadcast.call(child, componentName, eventName, ...params)
    }
  })
}

export default {
  methods: {
    /**
     * 提交事件，子组件往祖先元素提交事件
     * @param componentName 组件名
     * @param eventName 事件名
     * @param params 参数
     */
    $dispatch(componentName, eventName, ...params) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent
        parent && (name = parent.$options.name)
      }
      parent && parent.$emit(eventName, ...params)
    },
    
    /**
     * 广播事件，如果子组件没有则找子组件的子组件
     * @param componentName 组件名
     * @param eventName 事件名
     * @param params 参数
     */
    $broadcast(componentName, eventName, ...params) {
      broadcast.call(this, componentName, eventName, ...params)
    }
  }
}
