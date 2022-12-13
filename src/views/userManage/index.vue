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
          <span class="search-num"
            >总充值： {{ recharge_total }} 总消耗：{{
              consume_total
            }}
            总剩余：{{ surplus_total }} 今日总消耗：{{ consume_today }}
          </span>
        </div>
        <div class="btn-group-block">
          <el-button type="primary" @click="handleAdd"> 添加 </el-button>
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
        { label: '备注', prop: 'remark' },
        { label: '总条数', prop: 'total_recharge_count' },
        { label: '共消耗', prop: 'total_used_count' },
        { label: '共剩余', prop: 'total_remaining_count' },
        { label: '今日消耗', prop: 'today_used_count' },
        { label: '城市', prop: 'city' },
        {
          label: '操作',
          width: '200',
          fixed: 'right',
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
        page_num: 1,
        page_size: 10
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
      consume_today: 0
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
      const {
        user_name,
        nick,
        status,
        plan_status,
        is_yellow,
        city,
        createtime
      } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const params = {
        user_name,
        nick,
        status,
        plan_status,
        is_yellow,
        city,
        start_create_time,
        end_create_time,
        ...this.pagination
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
      const [start_create_time, end_create_time] = this.form.createtime || []
      const params = {
        user_name: this.form.user_name,
        nick: this.form.nick,
        status: this.form.status,
        plan_status: this.form.plan_status,
        is_yellow: this.form.is_yellow,
        city: this.form.city,
        start_create_time,
        end_create_time
      }

      exportUserList(0, params)
        .then(() => {})
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
