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
          <span class="search-num"
            >总充值： {{ recharge_total }} 总消耗：{{
              consume_total
            }}
            总剩余：{{ surplus_total }} 今日总消耗：{{ consume_today }}
          </span>
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
            icon="el-icon-plus"
            @click="handleAdd"
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
        @sort-change="sortChange"
      >
        <el-table-column label="状态" slot="status">
          <template #default="{ row }">
            <span>
              <el-tag :type="row.status == true ? '' : 'danger'">{{
                row.status == true ? '启用' : '禁用'
              }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="计划状态" slot="plan_status">
          <template #default="{ row }">
            <span>
              <el-switch
                v-model="row.plan_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handlePlaySwitch(row, $event)"
              >
              </el-switch>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="变黄" slot="is_yellow">
          <template #default="{ row }">
            <span>
              <el-switch
                v-model="row.is_yellow"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleYellowSwitch(row, $event)"
              >
              </el-switch>
            </span>
          </template>
        </el-table-column>
      </d-table>
    </div>

    <AddUser
      @refreshTable="refreshTable"
      :visible.sync="addVisible"
      :form="model"
    />
    <EditUser
      @refreshTable="refreshTable"
      :visible.sync="editVisible"
      :form="model"
    />
    <Recharge
      @refreshTable="refreshTable"
      :visible.sync="chargeVisible"
      :form="model"
    />
    <ClueInfo
      @refreshTable="refreshTable"
      :visible.sync="infoVisible"
      :form="model"
    />
  </div>
</template>
<script>
import { getUserList, editUser, delUser, exportUserList } from '@/api/customer'
import { mapGetters } from 'vuex'
import { copyObj } from '@/utils'
import AddUser from './components/AddUser'
import EditUser from './components/EditUser'
import Recharge from './components/Recharge'
import ClueInfo from './components/ClueInfo'
import FileSaver from 'file-saver'
export default {
  name: 'UserManage',
  components: {
    AddUser,
    EditUser,
    Recharge,
    ClueInfo
  },
  data() {
    return {
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
          value: 'user_name',
          label: '用户名',
          clearable: true
        },
        {
          type: 'text',
          value: 'nick',
          label: '昵称',
          clearable: true
        },
        {
          type: 'select',
          value: 'status',
          label: '状态',
          clearable: true,
          options: [
            { label: '启用', value: true },
            { label: '禁用 ', value: false }
          ]
        },
        {
          type: 'select',
          value: 'plan_status',
          label: '计划状态',
          clearable: true,
          options: [
            { label: '启用', value: true },
            { label: '禁用 ', value: false }
          ]
        },
        {
          type: 'select',
          value: 'is_yellow',
          label: '变黄',
          clearable: true,
          options: [
            { label: '启用', value: true },
            { label: '禁用 ', value: false }
          ]
        },
        {
          type: 'text',
          value: 'city',
          label: '城市',
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
        { label: '用户名', prop: 'user_name' },
        { label: '昵称', prop: 'nick' },
        { label: '状态', slot: 'status' },
        { label: '计划状态', slot: 'plan_status' },
        { label: '变黄', slot: 'is_yellow' },
        { label: '备注', prop: 'remark', width: '320' },
        { label: '总条数', prop: 'recharge_total', sortable: 'custom' },
        { label: '共消耗', prop: 'consume_total', sortable: 'custom' },
        { label: '共剩余', prop: 'surplus_total', sortable: 'custom' },
        { label: '今日消耗', prop: 'consume_today', sortable: 'custom' },
        { label: '城市', prop: 'city' },
        {
          label: '操作',
          width: '260',
          buttons: [
            {
              type: 'text',
              label: '表单数充值',
              click: this.handleRecharge
            },
            {
              type: 'text',
              label: '线索信息',
              click: this.handleInfo
            },
            {
              type: 'text',
              label: '编辑',
              click: this.handleEdit
            }
            // {
            //   type: 'text',
            //   label: '删除',
            //   click: this.handleDelete
            // }
          ]
        }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      assignVisible: false,
      addVisible: false,
      editVisible: false,
      chargeVisible: false,
      infoVisible: false,
      model: {},
      recharge_total: 0,
      consume_total: 0,
      surplus_total: 0,
      consume_today: 0,
      start_create_time: '',
      end_create_time: '',
      order_type: '',
      order_by: '',
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
      const { user_name, nick, status, plan_status, is_yellow, city } =
        this.lockedModel

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
        user_name,
        nick,
        status,
        plan_status,
        is_yellow,
        city,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        order_type: this.order_type,
        order_by: this.order_by,
        key: this.searchText
      }
      this.loading = true
      getUserList(params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.users
          this.totalCount = res.data.total
          this.recharge_total = res.data.recharge_total
          this.consume_total = res.data.consume_total
          this.surplus_total = res.data.surplus_total
          this.consume_today = res.data.consume_today
        })
        .catch(() => {
          this.loading = false
        })
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
        user_name: this.form.user_name,
        nick: this.form.nick,
        status: this.form.status,
        plan_status: this.form.plan_status,
        is_yellow: this.form.is_yellow,
        city: this.form.city,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time
      }

      exportUserList(0, params)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleRecharge(row) {
      this.chargeVisible = true
      this.model = row
    },
    handleInfo(row) {
      this.infoVisible = true
      this.model = row
    },
    handleAdd() {
      this.addVisible = true
      this.model = {}
    },
    handleEdit(row) {
      this.editVisible = true
      this.model = row
    },
    handlePlaySwitch(row, val) {
      this.$confirm(
        `是否确认${val == true ? '开启' : '关闭'}计划状态？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          editUser(row.id, row).then(() => {
            this.$message({
              message: `${val == true ? '开启成功' : '关闭成功'}`,
              type: 'success'
            })
            this.handleTableData()
          })
        })
        .catch(() => {
          // 取消时恢复原始开关状态
          if (val == false) {
            row.plan_status = true
          } else {
            row.plan_status = false
          }
        })
    },
    handleYellowSwitch(row, val) {
      this.$confirm(`是否确认${val == true ? '开启' : '关闭'}变黄？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          editUser(row.id, row).then(() => {
            this.$message({
              message: `${val == true ? '开启成功' : '关闭成功'}`,
              type: 'success'
            })
            this.handleTableData()
          })
        })
        .catch(() => {
          // 取消时恢复原始开关状态
          if (val == false) {
            row.is_yellow = true
          } else {
            row.is_yellow = false
          }
        })
    },
    reset() {
      this.form = {}
      this.searchText = ''
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
    handleDelete(row) {
      this.$confirm('是否确认删除?', '删除', {
        showClose: true,
        confirmButtonText: '确认'
      })
        .then(() => {
          delUser(row.id).then(() => {
            this.$message.success('删除成功')
            this.handleTableData()
          })
        })
        .catch(err => console.log(err))
    },
    sortChange(column) {
      if (column.order == 'ascending') {
        this.order_type = 'asc'
        this.order_by = column.prop
      } else if (column.order == 'descending') {
        this.order_type = 'desc'
        this.order_by = column.prop
      } else {
        this.order_type = ''
        this.order_by = ''
      }
      this.handleTableData()
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
<style lang="scss" scoped>
.search-num {
  margin-left: 15px;
  color: #ed1a41;
}
</style>
