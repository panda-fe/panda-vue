/**
 * 创建于 2018/10/10
 * 功能: 在组件要跳转的时候多此一举的拦住用户并且问他，你真的要跳转吗 _(:з」∠)_
 */

const canJump = {
  data() {
    return {
      $_canJump: true,                       // 是否可以直接跳转
      $_tipsMessage: '是否放弃当前操作？'      // 提示
    }
  },
  methods: {
    /**
     * 信息修改标记
     */
    _infoChange(flag) {
      this.$data.$_canJump = flag
    },
    
    /**
     * 改变提示
     * @param res
     * @private
     */
    _tipsMessageChange(res) {
      this.$data.$_tipsMessage = res || '是否放弃当前操作？'
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.$data.$_canJump) {      // 跳转前提示是否保存
      this.$confirm && this.$confirm(this.$data.$_tipsMessage, '提示', {
          center: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => next())
        .catch(() => next(false))
    } else next()
  }
}

export default canJump
