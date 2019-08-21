/**
* 创建于 2018/1/23
* 作者: Xinwang
* 功能: 基础表格组件
*/

<template>
  <div class='basic-table' :class="className">
    <!--列表-->
    <el-table :data="dataList"
              v-loading="listLoading"
              border
              stripe
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <!--选择列-->
      <el-table-column v-if="hasSelect"
                       type="selection"
                       width="55">
      </el-table-column>
      <!--序号列-->
      <el-table-column v-if="hasIndex"
                       type="index"
                       width="40"
                       label="序号">
      </el-table-column>

      <template v-for="column in columns">

        <!--按钮操作列-->
        <el-table-column v-if="column.operations"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width||(column.operations.length*50+100)"
                         :formatter="column.formatter"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <div v-for="(operate,index) in column.operations"
                 style="display: inline-block"
                 :class="(operate.show?operate.show(scope.$index, scope.row):true)?'show-sep':''">
              <el-tooltip placement="top"
                          :content="operate.label"
                          :disabled="!operate.tooltips"
                          :key="index">
                <el-popover v-if="operate.popover"
                            :placement="operate.popoverPlacement || 'top'"
                            :width="operate.popoverWidth || 150"
                            :ref="`popover-${index}-${scope.$index}`" >
                  <p style="text-align: center">{{operate.tips(scope.$index, scope.row)}}</p>
                  <div style="text-align: center; margin: 0">
                    <el-button size="mini" @click="handleConfirm(index, scope.$index, scope.row, operate.func)">确认</el-button>
                    <el-button size="mini" @click="handleClose(index, scope.$index)">取消</el-button>
                  </div>
                  <el-button slot="reference"
                             :type="operate.type||'text'"
                             class="form-icon"
                             v-show="operate.show?operate.show(scope.$index, scope.row):true"
                             :key="index"
                             :icon="operate.icon"
                             :style="handleButtonStyle(operate, scope)"
                             :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false">
                    {{(operate.type&&operate.type!=='text')||!operate.icon?operate.label:''}}
                  </el-button>
                </el-popover>
                <el-button :type="operate.type||'text'"
                           class="form-icon"
                           v-else
                           v-show="operate.show?operate.show(scope.$index, scope.row):true"
                           :key="index"
                           :icon="operate.icon"
                           :style="handleButtonStyle(operate, scope)"
                           @click="operate.func(scope.$index, scope.row)"
                           :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false">
                  {{(operate.type&&operate.type!=='text')||!operate.icon?operate.label:''}}
                </el-button>
              </el-tooltip>
            </div>

          </template>
        </el-table-column>

        <el-table-column v-else-if="column.slotName"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
          <template v-slot="scope">
            <slot :name="'col-' + column.slotName"
                  :row="scope.row"/>
          </template>
        </el-table-column>

        <!--普通展示列-->
        <el-table-column v-else
                         :sortable="column.sortable?'custom':false"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
        </el-table-column>
      </template>
    </el-table>

    <!--分页  -->
    <el-row type="flex" justify="end">
      <el-col :span="24">
        <el-pagination layout="total, sizes, prev, pager, next"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="page"
                       :page-size="rows"
                       :page-sizes="[10, 20, 30, 50, 80, 100]"
                       :total="total"
                       class="table-pag">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const sortMap = { descending: 2, ascending: 1 }
  export default {
    name: 'BasicTable',
    props: {
      // 获取数据的接口
      api: { type: Function },
      // 自定义类名
      className: {type: String},
      // 表格信息
      columns: { type: Array },
      // 初始化条件
      initCondition: { type: Object },
      // 是否初始化的时候就query
      initSearch: { type: Boolean, default: true },
      // 是否需要序号列
      hasIndex: { type: Boolean, default: false },
      // 是否需要选择框
      hasSelect: { type: Boolean, default: false }
    },
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        storeParams: {},
        listLoading: false,
        dataList: [],
        sortParams: {
          orderColumn: '',
          orderBy: ''
        },
        multipleSelection: []
      }
    },
    methods: {
      /**
       * 获得表格内容
       */
      getlist(param) {
        this.listLoading = true
        this.api(param).then(res => {
          const { total, dataList } = res.data
          this.dataList = dataList
          this.total = total
          this.listLoading = false
        }).catch((err) => {
          console.error(err)
          this.listLoading = false
        })
      },

      /**
       * 不含查询条件的查询
       */
      reSearch() {
        this.page = 1
        const param = Object.assign({}, this.storeParams, this.sortParams)
        param.rows = this.rows
        param.page = this.page
        this.getlist(param)
      },

      /**
       * 查询按钮查询
       */
      search(params) {
        this.storeParams = Object.assign({}, params)
        this.reSearch()
      },

      /**
       * 处理页数变化
       */
      handleSizeChange(val) {
        this.rows = val
        const param = Object.assign({}, this.storeParams, this.sortParams)
        param.rows = val
        param.page = this.page
        setTimeout(() => this.getlist(param), 100)
      },

      /**
       * 处理当前页改变
       */
      handleCurrentChange(val) {
        this.page = val
        const param = Object.assign({}, this.storeParams, this.sortParams)
        param.rows = this.rows
        param.page = val
        setTimeout(() => this.getlist(param), 100)
      },
      /**
       * 处理排序
       */
      sortChange({ column, prop, order }) {
        this.sortParams.orderColumn = prop || ''
        this.sortParams.order = order ? sortMap[order] : ''
        this.reSearch()
      },
      /**
       * 处理多选
       */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /**
       * popover关闭
       */
      handleClose(index, rowIndex) {
        const name = `popover-${ index }-${ rowIndex }`
        this.$refs[name][0].doClose()
      },
      /**
       * popover确认
       */
      handleConfirm(index, rowIndex, row, func) {
        func(rowIndex, row)
        this.handleClose(index, rowIndex)
      },
      /**
       * 处理按钮样式
       */
      handleButtonStyle(operate, scope) {
        const defalutColor = (operate.type && operate.type !== 'text') ? '#ffffff' : '#409EFF'
        return operate.disabledfunc && operate.disabledfunc(scope.$index,scope.row) ? {} : {color: operate.color || defalutColor}
      }
    },
    mounted() {
      this.initSearch && this.search(this.initCondition)
    }
  }
</script>

<style lang="scss" scoped>
  .el-pagination{
    display: flex;
    justify-content: flex-end;
  }
  .show-sep+.show-sep{
    margin-left: 10px;
  }
</style>
