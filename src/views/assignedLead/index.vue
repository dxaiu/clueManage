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
        <div class="btn-group-block">
          <el-button type="primary" plain @click="handleExport">
            导出
          </el-button>
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
import { getAssignLeadList, exportAssign } from '@/api/assignedLead'
import { mapGetters } from 'vuex'
// import FileSaver from 'file-saver'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
export default {
  name: 'assignedLead',
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
          value: 'phone',
          label: '电话',
          clearable: true
        },
        {
          type: 'text',
          value: 'province',
          label: '省份',
          clearable: true
        },
        {
          type: 'text',
          value: 'city',
          label: '城市',
          clearable: true
        },
        {
          type: 'text',
          value: 'department',
          label: '科室',
          clearable: true
        },
        {
          type: 'daterange',
          value: 'createtime',
          label: '创建时间',
          clearable: true
        }
      ],
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { label: '电话', prop: 'phone' },
        { label: '省份', prop: 'province' },
        { label: '城市', prop: 'city' },
        { label: '科室', prop: 'department' },
        { label: '创建时间', prop: 'created_time', formatter }
      ],
      pagination: {
        page_num: 1,
        page_size: 10
      },
      uuid: ''
    }
  },
  computed: {
    ...mapGetters(['info'])
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
      const { phone, province, city, department, createtime } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const params = {
        phone,
        province,
        city,
        department,
        start_create_time,
        end_create_time,
        ...this.pagination
      }
      this.loading = true
      getAssignLeadList(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.clues
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
    },
    handleExport() {
      const [start_create_time, end_create_time] = this.form.createtime || []
      const params = {
        phone: this.form.phone,
        province: this.form.province,
        city: this.form.city,
        department: this.form.department,
        start_create_time,
        end_create_time
      }

      exportAssign(0, params)
        .then(() => {})
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
