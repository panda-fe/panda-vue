/**
* 创建于 2018/1/23
* 作者: Xinwang
* 功能: 基础表格组件
*/
<template>
  <div>
    <!--列表-->
    <el-table :data="dataList" border stripe>
      <template v-for="column in columns">
        <el-table-column  v-if="column.operations" align="center" :prop="column.prop" :label="column.label" :width="column.width||(column.operations.length*30+100)" :formatter="column.formatter" fixed="right"  :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-tooltip v-for="(operate,index) in column.operations" :content="operate.label"  placement="top" :key="index">
              <el-button type="text" :key="index" :icon="operate.icon" :style="!operate.disabledfunc(scope.$index,scope.row)?'color:'+(operate.color||'#5576ed'):''"
                         @click="operate.func(scope.$index, scope.row)" :disabled="operate.disabledfunc?operate.disabledfunc(scope.$index,scope.row):false" class="form-icon" v-show="operate.show?operate.show(scope.$index, scope.row):true"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-else-if="column.func" :prop="column.prop"  align="center" :label="column.label" :width="column.width" :formatter="column.formatter" :show-overflow-tooltip="column.tooltip"  :min-width='column.minwidth'>
          <template slot-scope="scope">
            <el-button type="text" @click="column.func(scope.$index, scope.row)"><div class="cell-button">{{scope.row[column.prop]}}</div></el-button>
          </template>
        </el-table-column>
        <el-table-column v-else :prop="column.prop" :label="column.label" align="center" :width="column.width" :formatter="column.formatter" :show-overflow-tooltip="column.tooltip" :min-width='column.minwidth'>
        </el-table-column>
      </template>
    </el-table>
    <!--分页  -->
    <el-row>
      <el-col :span="24">
        <el-pagination layout="total, sizes, prev, pager, next" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="rows" :page-sizes="[10, 20, 30, 50, 80, 100]" :total="total" class="table-pag"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default
  {
    name: 'BasicTable',
    props: ['columns', 'api', 'initConditon'],
    data() {
      return {
        page: 1,
        rows: 10,
        total: 0,
        storeParams: {},
        listLoading: false,
        dataList: []
      }
    },
    methods: {
      /**
       * 获得表格内容
       */
      getlist(param) {
        this.api(param).then(res => {
          this.listLoading = false
          const {total, dataList} = res.data
          this.dataList = dataList
          this.total = total
          this.listLoading = false
        }).catch((err) => {
          console.log(err)
          this.listLoading = false
        })
      },
      /**
       * 不含查询条件的查询
       */
      reSearch() {
        this.listLoading = true
        if (this.page !== 1) {
          this.page = 1
        } else {
          const param = Object.assign({}, this.storeParams)
          param.rows = this.rows
          param.page = 1
          this.getlist(param)
        }
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
        if (this.page !== 1) {
          this.page = 1
        } else {
          const param = Object.assign({}, this.storeParams)
          param.rows = val
          param.page = 1
          setTimeout(() => this.getlist(param), 100)
        }
      },
      /**
       * 处理当前页改变
       */
      handleCurrentChange(val) {
        this.listLoading = true
        this.page = val
        const param = Object.assign({}, this.storeParams)
        param.rows = this.rows
        param.page = val
        setTimeout(() => this.getlist(param), 100)
      }
    },
    mounted() {
      this.search(this.initConditon)
    },
    watch: {
      // listLoading: function(val, oldVal) {
      //   if (val) {
      //     this.$store.dispatch('ApplyFullscreenLoading')
      //   } else {
      //     this.$store.dispatch('CancelFullscreenLoading')
      //   }
      // }
    }
  }
</script>
<style lang="scss" scoped>
  .el-table {
     /deep/.cell-button {
        width: 158px;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        overflow: hidden;
        font-size: 14px;
        color: #5576ed;
      }
  }
</style>
