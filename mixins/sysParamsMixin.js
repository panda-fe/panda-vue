/**
 * 创建于 2018/9/7
 * 作者: QianYu
 * type: 全局mixins
 * 功能: 获取系统数据字典
 */

export default {
  data() {
    return {
      $_filterFunc: null,       // 过滤器函数
      $_sysParams: null,        // 获取数据字典
      $_sysParamsPromise: null, // 获取sysParams之后返回的Promise
      $_sysParamsApi: () => {}  // 需被覆写，取数据字典的Api
    }
  },
  methods: {
    /**
     * 注册过滤器到_filterFunc中
     * @private
     */
    _getSysParamsFunc() {
      const { $data } = this
      return $data.$_sysParamsPromise || ($data._sysParamsPromise = $data.$_sysParamsApi()
        .then(({ data }) => {
          this.$data.$_sysParams = data
          this.$data.$_filterFunc = {}
          Object.keys(data).forEach(paramKey =>
            this.$data.$_filterFunc[paramKey] = val => {
              const tar = data[paramKey].find(item => item['paramValue'] === val)
              return tar && tar['paramDesc'] || ''
            })
          return data
        })
        .catch(err => console.error(err, ' in src/mixins/sysParamsMixin.js')))
    },
    
    /**
     * 按照键值获取单个过滤器
     * @returns {*}
     * @param id 过滤器key
     * @param val 传给过滤器的value
     */
    _rootFilters(val, id = 'DEPARTMENT') {
      const func = this.$data.$_filterFunc
      const mth = func && func[id]
      return mth && mth(val) || val
    },
    
    /**
     * 获取数据字典
     * @returns {Object}
     * @private
     */
    _getSysParams() {
      return this.$data.$_sysParams
    }
  }
}
