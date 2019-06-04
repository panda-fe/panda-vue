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
            <div v-for="(operate,index) in column.operations" style="display: inline-block" :class="(operate.show?operate.show(scope.$index, scope.row):true)?'show-sep':''">
              <el-tooltip placement="top"
                          :content="operate.label"
                          :disabled="!operate.tooltips"
                          :key="index">
                <el-popover :placement="operate.popoverPlacement || 'top'" :width="operate.popoverWidth || 150" :ref="`popover-${index}-${scope.$index}`" v-if="operate.popover">
                  <p style="text-align: center">{{operate.tips(scope.$index, scope.row)}}</p>
                  <div style="text-align: center; margin: 0">
                    <el-button size="mini" @click="handleConfirm(index, scope.$index, scope.row, operate.func)">确认</el-button>
                    <el-button size="mini" @click="handleClose(index, scope.$index)">取消</el-button>
                  </div>
                  <el-button slot="reference" :type="operate.type||'text'" class="form-icon"
                             v-show="operate.show?operate.show(scope.$index, scope.row):true"
                             :key="index"
                             :icon="operate.icon"
                             :style="operate.disabledfunc?!operate.disabledfunc(scope.$index,scope.row)?'color:'+(operate.color||'#5576ed'):'':'color:'+(operate.color||'#5576ed')"
                             :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false">{{(operate.type&&operate.type!=='text')||!operate.icon?operate.label:''}}
                  </el-button>
                </el-popover>
                <el-button :type="operate.type||'text'" class="form-icon"
                           v-else
                           v-show="operate.show?operate.show(scope.$index, scope.row):true"
                           :key="index"
                           :icon="operate.icon"
                           :style="operate.disabledfunc?!operate.disabledfunc(scope.$index,scope.row)?'color:'+(operate.color||'#5576ed'):'':'color:'+(operate.color||'#5576ed')"
                           @click="operate.func(scope.$index, scope.row)"
                           :disabled="operate.disabledfunc ?operate.disabledfunc(scope.$index,scope.row) :false">{{(operate.type&&operate.type!=='text')||!operate.icon?operate.label:''}}
                </el-button>
              </el-tooltip>
            </div>
          
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
            <span v-if='column.disabled && column.disabled(scope.$index, scope.row)'>{{scope.row[column.prop]}}</span>
            <a @click="column.func(scope.$index, scope.row)"
               class='clickable-link'
               v-else-if='scope.row[column.prop]'>
              {{scope.row[column.prop]}}
            </a>
            <span v-else-if='column.formatBeside'>{{column.formatBeside(scope.$index, scope.row)}}</span>
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
      initSearch: { type: Boolean, default: true },  // 是否初始化的时候就query
      hasIndex: { type: Boolean, default: false },   // 是否需要序号列
      hasSelect: { type: Boolean, default: false }   // 是否需要选择框
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
        multipleSelection: [],
        popoverShow: false
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
      },
      /**
       * popover关闭
       */
      handleClose(index, rowIndex) {
        const name = `popover-${ index }-${ rowIndex }`
        this.$refs[name][1].doClose()
      },
      /**
       * popover确认
       */
      handleConfirm(index, rowIndex, row, func) {
        func(rowIndex, row)
        this.handleClose(index, rowIndex)
      }
    },
    mounted() {
      this.initSearch && this.search(this.initCondition)
    }
  }
</script>

<style lang="scss" scoped>
  .basic-table {
    .clickable-link {
      font-size: 14px;
      color: #07f;
      cursor: pointer;
    }
    
    .el-tag {
      margin: 3px 10px;
    }
    
    /deep/ .form-icon {
      padding-top: 0;
      padding-bottom: 0;
      border-radius: 0;
    }
  }
</style>
