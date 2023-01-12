<template>
  <div class="page-container">
    <div class="form-wrapper" v-show="isExpand">
      <d-form
        :layout-span="layoutSpan"
        :breakpoint="breakpoint"
        :inline="true"
        :items="formItems"
        :model="form"
        class="iform"
      />
      <div class="btn-wrapper">
        <el-button type="primary" size="small" @click="searchTable"
          >查询</el-button
        >
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <div class="table-dash">
      <div class="search-header">
        <div class="search-result-count">
          <i class="el-icon-info" />
          <span>当前搜索结果{{ totalCount || 0 }}条</span>
        </div>
        <div class="btn-group-block">
          <div class="item-search">
            <el-input
              v-model="searchText"
              size="small"
              placeholder="搜索"
              @input="handleSearch"
            ></el-input>
          </div>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-tickets"
            @click="handleItem"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-top-right"
            @click="handleExport"
          >
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleExpand"
          >
          </el-button>
        </div>
      </div>
      <d-table
        v-if="isTable"
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
import FileSaver from 'file-saver'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
export default {
  name: 'assignedLead',
  data() {
    return {
      barData: [],
      layoutSpan: 24,
      breakpoint: [
        [600, 1],
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
        currentPage: 1,
        pageSize: 10
      },
      uuid: '',
      start_create_time: '',
      end_create_time: '',
      searchText: '',
      isTable: true,
      isExpand: false
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
      this.pagination.currentPage = 1
      this.lockedModel = copyObj(this.form)
      this.handleTableData()
    },
    handleTableData() {
      const { phone, province, city, department } = this.lockedModel
      if (this.form.createtime) {
        this.start_create_time = parseInt(
          new Date(this.form.createtime[0]).getTime() / 1000
        )
        this.end_create_time = parseInt(
          new Date(this.form.createtime[1]).getTime() / 1000
        )
      } else {
        this.start_create_time = ''
        this.end_create_time = ''
      }
      const params = {
        phone,
        province,
        city,
        department,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        key: this.searchText
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
      this.pagination.currentPage = 1
      this.handleTableData()
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.currentPage = 1)
      this.handleTableData()
    },
    handleExport() {
      if (this.form.createtime) {
        this.start_create_time = parseInt(
          new Date(this.form.createtime[0]).getTime() / 1000
        )
        this.end_create_time = parseInt(
          new Date(this.form.createtime[1]).getTime() / 1000
        )
      } else {
        this.start_create_time = ''
        this.end_create_time = ''
      }
      const params = {
        phone: this.form.phone,
        province: this.form.province,
        city: this.form.city,
        department: this.form.department,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time
      }

      exportAssign(0, params)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSearch(val) {
      this.searchText = val
      this.handleTableData()
    },
    handleItem() {
      this.isTable = !this.isTable
    },
    handleExpand() {
      this.isExpand = !this.isExpand
    }
  }
}
</script>
