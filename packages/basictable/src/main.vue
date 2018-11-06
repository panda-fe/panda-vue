/**
* 创建于 2018/1/23
* 作者: Xinwang
* 功能: 基础表格组件
*/

<template>
  <div class='basic-table'>
    <!--列表-->
    <el-table :data="dataList" border stripe @sort-change="sortChange" @selection-change="handleSelectionChange">
      <!--序号列-->
      <el-table-column type="selection" width="55" v-if="hasSelect"></el-table-column>
      <el-table-column type="index" width="40" v-if="hasIndex"></el-table-column>
      <template v-for="column in columns">

        <!--按钮操作列-->
        <el-table-column v-if="column.operations"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width||(column.operations.length*30+100)"
                         :formatter="column.formatter"
                         fixed="right"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-tooltip v-for="(operate,index) in column.operations" placement="top"
                        :content="operate.label"
                        :key="index">
              <el-button :type="operate.type||'text'" class="form-icon"
                         v-show="operate.show?operate.show(scope.$index, scope.row):true"
                         :key="index"
                         :icon="operate.icon"
                         :style="operate.disabledfunc?!operate.disabledfunc(scope.$index,scope.row)?'color:'+(operate.color||'#5576ed'):'':'color:'+(operate.color||'#5576ed')"
                         @click="operate.func(scope.$index, scope.row)"
                         :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false">{{(operate.type&&operate.type!=='text')||!operate.icon?operate.label:''}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <!--点击内容弹出的列-->
        <el-table-column v-else-if="column.func || column.href"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <!--<el-tooltip placement="top" :content="scope.row[column.prop]">     @mouseenter="enter"
                 @mouseleave="leave"-->
            <a @click="column.func(scope.$index, scope.row)"
               class='clickable-link'
               v-if='scope.row[column.prop]'
            >
              {{scope.row[column.prop]}}
            </a>
            <span v-else='column.formatBeside'>{{column.formatBeside(scope.$index, scope.row)}}</span>
            <i v-if="column.icon&&column.showIcon&&column.showIcon(scope.$index, scope.row)" :class="column.icon"></i>
            <!--</el-tooltip>-->
          </template>
        </el-table-column>

        <!--角色管理使用，无需使用可以删除-->
        <el-table-column v-else-if="column.list"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-tag v-for='item in scope.row[column.prop]' :key='item.id'>
              {{item.roleName}}
            </el-tag>
          </template>
        </el-table-column>

        <!--排序列，无需使用可以删除-->
        <el-table-column v-else-if="column.sortable"
                         sortable="custom"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :formatter="column.formatter"
                         :show-overflow-tooltip="column.tooltip"
                         :min-width='column.minwidth'>
        </el-table-column>

        <!--进度条-->
        <el-table-column v-else-if="column.progress"
                         :prop="column.prop"
                         :label="column.label"
                         :width="column.width"
                         :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-progress :stroke-width="column.progress.strokeWidth || 20"
                         :percentage="Number(scope.row[column.prop])"
                         :color="column.progress.color ? column.progress.color(scope.$index, scope.row) : ''"
                         :style="column.progress.width ? 'width: ' + (column.progress.width + 50) + 'px;' : 'width: 114px;'">
            </el-progress>
          </template>
        </el-table-column>

        <!--普通展示列-->
        <el-table-column v-else
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
    <el-row>
      <el-col :span="24">
        <el-pagination layout="total, sizes, prev, pager, next"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="page"
                       :page-size="rows"
                       :page-sizes="[10, 20, 30, 50, 80, 100]"
                       :total="total"
                       class="table-pag"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  const sortMap = { descending: 'desc', ascending: 'ASC' }
  export default {
    name: 'BasicTable',
    props: {
      api: { type: Function },    // 下个项目换名字
      columns: { type: Array },
      initCondition: { type: Object },
      hasIndex: { type: Boolean, default: false},   // 是否需要序号列
      hasSelect: { type: Boolean, default: false},   // 是否需要选择框
      searchAtOnce: { type: Boolean, default: true },   // 是否首次打开查询
      emitAfterApi: { type: Function, default: () => {}}     // 调用Api后执行的钩子
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
        this.api(param).then(res => {
          this.listLoading = false
          const { total, dataList } = res.data
          this.dataList = dataList
          this.total = total
          this.emitAfterApi(this)
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
        this.listLoading = true
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
        this.listLoading = true
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
        this.listLoading = true
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
        this.sortParams.orderBy = order ? sortMap[order] : ''
        this.reSearch()
      },
      /**
       * 处理多选
       */
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    },
    mounted() {
      this.searchAtOnce && this.search(this.initCondition)
    }
  }
</script>

<style lang="scss" scoped>
  .basic-table {
    .clickable-link {
      /*white-space: nowrap;*/
      /*      text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            overflow: hidden;*/
      font-size: 14px;
      color: #07f;
      text-decoration: underline;
      cursor: hand;
    }
    .el-tag {
      margin: 3px 10px;
    }
  }
</style>
