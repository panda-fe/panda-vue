/**
 * 创建于 2019-03-28
 * 维护: SHERlocked93
 * 功能: 完成 Echart 图表的初始化、注销、自动注册 resize 事件、注销 resize 事件
 * 注意: 实际环境中，初始化的时候记得调用一下 _chartResize 方法
 * 接口: * _chartDomId：String|Array  初始化的chart容器，ID选择器
 *      * _chartOption: Object|Array<Object>  chart对应的配置项,key为ID
 */

import Echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      _chartIsList: null       // chartDomId传的是string还是array
    }
  },

  computed: {
    /**
     * 图表DOM
     * @returns {*}
     */
    _chartWrapperDom() {
      const _chartDomId = this.$data._chartDomId

      if (_.isString(_chartDomId)) {
        const dom = document.getElementById(_chartDomId)
        return dom && Echarts.init(dom)
      } else if (_.isArray(_chartDomId)) {
        const domList = _chartDomId.map(id => document.getElementById(id))
        return domList && domList.map(dom => Echarts.init(dom))
      } else throw new Error('_chartDomId 应为 Array 或 String')
    },

    /**
     * 图表resize节流
     * @return {*}
     */
    _chartResize() {
      return _.throttle(() => {
        if (this.$data._chartIsList) {
          this._chartWrapperDom.forEach(chart => chart.resize())
        } else this._chartWrapperDom.resize()
      }, 400)
    }
  },

  methods: {
    /**
     * 图表初始化
     */
    _initChart() {
      const _chartDomId = this.$data._chartDomId
      const _chartOption = this.$data._chartOption
      const _chartIsList = this.$data._chartIsList

      if (_chartIsList) {
        _chartDomId.forEach((key, idx) =>
          this._chartWrapperDom[idx].setOption(_chartOption[key]))
      } else this._chartWrapperDom.setOption(_chartOption)
    }
  },

  mounted() {
    const _chartDomId = this.$data._chartDomId
    this.$data._chartIsList = _.isArray(_chartDomId)
    this._initChart()
    window.addEventListener('resize', this._chartResize)
  },

  destroyed() {
    window.removeEventListener('resize', this._chartResize)
  }
}
