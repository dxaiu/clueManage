<template>
  <div class="page-container">
    <div class="form-wrapper">
      <d-form
        :layout-span="layoutSpan"
        :breakpoint="breakpoint"
        :inline="true"
        :items="formItems"
        :model="form"
        class="iform"
      />
      <div class="btn-wrapper">
        <el-button type="primary" @click="searchTable">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <div class="table-dash">
      <div class="search-header">
        <div class="search-result-count">
          <i class="el-icon-info" />
          <span>当前搜索结果{{ totalCount || 0 }}条</span>
        </div>
      </div>
      <d-table
        ref="table"
        v-loading="loading"
        class="table-wrapper table-wrapper-scorll"
        :data="tableData"
        :columns="columns"
        :pagination="pagination"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        small
        @pagination-change="handlePageChange"
      />
    </div>
  </div>
</template>
<script>
import { getClueDateList } from '@/api/clueDataStatistics'
import { copyObj } from '@/utils'
export default {
  name: 'clueDataStatistics',
  data() {
    return {
      barData: [],
      layoutSpan: 24,
      breakpoint: [
        [768, 2],
        [992, 3],
        [1200, 3],
        [1920, 3],
        [Infinity, 4]
      ],
      labelPosition: 'right',
      labelWidth: 150,
      form: {},
      lockedModel: {},
      multipleSelection: [],
      formItems: [
        {
          type: 'text',
          value: 'nickname',
          label: '客户名',
          clearable: true
        },
        {
          type: 'daterange',
          value: 'createtime',
          label: '线索时间',
          clearable: true
        }
      ],
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { label: '客户名', prop: 'nickname' },
        { label: '发布量', prop: 'bdnum' }
      ],
      pagination: {
        page_num: 1,
        page_size: 10
      }
    }
  },
  mounted() {
    this.handleTableData()
  },
  methods: {
    searchTable() {
      this.pagination.page_num = 1
      this.lockedModel = copyObj(this.form)
      this.handleTableData()
    },
    handleTableData() {
      const { createtime } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const params = {
        start_create_time,
        end_create_time,
        ...this.pagination
      }
      this.loading = true
      getClueDateList(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.items
          this.totalCount = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    reset() {
      this.form = {}
    },
    refreshTable() {
      this.reset()
      this.pagination.page_num = 1
      this.handleTableData()
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.page_num = 1)
      this.handleTableData()
    }
  }
}
</script>
