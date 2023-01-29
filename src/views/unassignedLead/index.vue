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
            icon="el-icon-s-promotion"
            @click="handleBatchAssignCustomer"
          ></el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete"
          ></el-button>
          <el-button size="small" icon="el-icon-download" @click="handleImport">
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
        :cell-style="cellStyle"
        @pagination-change="handlePageChange"
        @selection-change="handleSelection"
      />

      <ItemUnassignList
        v-else
        :data="tableData"
        :pagination="pagination"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        small
        @pagination-change="handlePageChange"
        @handleAssignCustomer="handleAssignCustomer"
        @handleSelection="handleSelection"
      />
    </div>

    <Assignment
      @refreshTable="refreshTable"
      :visible.sync="assignVisible"
      :form="model"
    />
    <BatchAssignment
      @refreshTable="refreshTable"
      :visible.sync="assignBatchVisible"
      :form="model"
      :list="list"
    />
    <Import :visible.sync="importVisible" @refreshTable="refreshTable" />
  </div>
</template>
<script>
import { getUnassignLeadList, delUnAssign } from '@/api/unassignedLead'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
import Assignment from './components/Assignment'
import BatchAssignment from './components/BatchAssignment'
import Import from './components/Import'
import ItemUnassignList from './components/ItemUnassignList'
export default {
  name: 'unassignedLead',
  components: {
    Assignment,
    BatchAssignment,
    Import,
    ItemUnassignList
  },
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
          value: 'id',
          label: 'ID',
          clearable: true
        },
        {
          type: 'text',
          value: 'remark',
          label: '备注',
          clearable: true
        },
        {
          type: 'text',
          value: 'name',
          label: '名称',
          clearable: true
        },
        {
          type: 'text',
          value: 'phone',
          label: '电话',
          clearable: true
        },
        {
          type: 'text',
          value: 'source_type',
          label: '线索来源',
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
          type: 'text',
          value: 'advertiser_name',
          label: '广告主名称',
          clearable: true
        },
        {
          type: 'text',
          value: 'advertiser_plan',
          label: '广告计划名称',
          clearable: true
        },
        {
          type: 'daterange',
          value: 'createtime',
          label: '创建时间',
          clearable: true
        },
        {
          type: 'daterange',
          value: 'updatetime',
          label: '更新时间',
          clearable: true
        }
      ],
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { type: 'selection' },
        { label: 'ID', prop: 'id' },
        { label: '备注', prop: 'remark', width: '320' },
        { label: '名称', prop: 'name' },
        { label: '电话', prop: 'phone' },
        { label: '线索来源', prop: 'source_type' },
        { label: '省份', prop: 'province' },
        { label: '城市', prop: 'city' },
        { label: '科室', prop: 'department' },
        { label: '详情', prop: 'detail' },
        { label: '广告主名称', prop: 'advertiser_name' },
        { label: '广告计划名称', prop: 'advertiser_plan' },
        { label: '创建时间', prop: 'created_time', formatter },
        { label: '更新时间', prop: 'updated_time', formatter },
        {
          label: '操作',
          width: '100',
          // fixed: 'right',
          buttons: [
            {
              type: 'text',
              label: '分配客户',
              click: this.handleAssignCustomer
            }
          ]
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      assignVisible: false,
      assignBatchVisible: false,
      importVisible: false,
      model: {},
      selectedList: [],
      list: [],
      start_create_time: '',
      end_create_time: '',
      start_update_time: '',
      end_update_time: '',
      searchText: '',
      isTable: true,
      isExpand: false
    }
  },
  mounted() {
    this.handleTableData()
    if (this.isMobile()) {
      this.isTable = false
    } else {
      this.isTable = true
    }
  },
  methods: {
    searchTable() {
      this.pagination.currentPage = 1
      this.lockedModel = copyObj(this.form)
      this.handleTableData()
    },
    handleTableData() {
      const {
        id,
        remark,
        name,
        phone,
        source_type,
        province,
        city,
        department,
        advertiser_name,
        advertiser_plan
      } = this.lockedModel

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
      if (this.form.updatetime) {
        this.start_update_time = parseInt(
          new Date(this.form.updatetime[0]).getTime() / 1000
        )
        this.end_update_time = parseInt(
          new Date(this.form.updatetime[1]).getTime() / 1000
        )
      } else {
        this.start_update_time = ''
        this.end_update_time = ''
      }
      const params = {
        id,
        remark,
        name,
        phone,
        source_type,
        province,
        city,
        department,
        advertiser_name,
        advertiser_plan,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        start_update_time: this.start_update_time,
        end_update_time: this.end_update_time,
        user_id: 0,
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        key: this.searchText
      }
      this.loading = true
      getUnassignLeadList(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.clues
          this.totalCount = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleAssignCustomer(row) {
      this.assignVisible = true
      this.model = row
    },
    reset() {
      this.form = {}
    },
    refreshTable() {
      this.reset()
      // this.pagination.currentPage = 1
      this.handleTableData()
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.currentPage = 1)
      this.handleTableData()
    },
    handleSelection(val) {
      this.selectedList = val.map(t => t.id)
    },
    handleBatchAssignCustomer() {
      if (this.selectedList && this.selectedList.length == 0) {
        this.$message.warning('请选择要分配客户的客户信息')
        return
      }
      this.assignBatchVisible = true
      this.model = {}
      this.list = this.selectedList
    },
    handleDelete() {
      if (this.selectedList && this.selectedList.length == 0) {
        this.$message.warning('请选择要删除的客户信息')
        return
      }
      this.$confirm('是否确认删除?', '删除', {
        showClose: true,
        confirmButtonText: '确认'
      })
        .then(() => {
          const params = {
            clue_ids: this.selectedList
          }
          delUnAssign(0, params).then(() => {
            this.$message.success('删除成功')
            this.handleTableData()
          })
        })
        .catch(err => console.log(err))
    },
    handleImport() {
      this.importVisible = true
    },
    handleSearch(val) {
      this.searchText = val
      this.pagination.currentPage = 1
      this.handleTableData()
    },
    handleItem() {
      this.isTable = !this.isTable
      this.selectedList = []
    },
    handleExpand() {
      this.isExpand = !this.isExpand
    },
    cellStyle({ columnIndex }) {
      if (columnIndex == 2) {
        return { color: '#ef4a4a' }
      }
    },
    isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      )
      return flag
    }
  }
}
</script>
