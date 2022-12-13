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
          <el-button type="primary" @click="handleBatchAssignCustomer">
            分配客户
          </el-button>
          <el-button type="danger" @click="handleDelete"> 删除 </el-button>
          <el-button @click="handleImport"> 导入 </el-button>
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
        @selection-change="handleSelection"
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
export default {
  name: 'unassignedLead',
  components: {
    Assignment,
    BatchAssignment,
    Import
  },
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
        { label: '备注', prop: 'remark' },
        { label: '名称', prop: 'name' },
        { label: '电话', prop: 'phone' },
        { label: '线索来源', prop: 'source_type' },
        { label: '省份', prop: 'province' },
        { label: '城市', prop: 'city' },
        { label: '科室', prop: 'department' },
        { label: '广告主名称', prop: 'advertiser_name' },
        { label: '广告计划名称', prop: 'advertiser_plan' },
        { label: '创建时间', prop: 'created_time', formatter },
        { label: '更新时间', prop: 'updated_time', formatter },
        {
          label: '操作',
          width: '100',
          fixed: 'right',
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
        page_num: 1,
        page_size: 10
      },
      assignVisible: false,
      assignBatchVisible: false,
      importVisible: false,
      model: {},
      selectedList: [],
      list: []
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
        advertiser_plan,
        createtime,
        updatetime
      } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const [start_update_time, end_update_time] = updatetime || []
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
        start_create_time,
        end_create_time,
        start_update_time,
        end_update_time,
        ...this.pagination
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
      this.pagination.page_num = 1
      this.handleTableData()
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.page_num = 1)
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
    }
  }
}
</script>
