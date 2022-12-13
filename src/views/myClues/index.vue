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

    <CustomerFollow
      @refreshTable="refreshTable"
      :visible.sync="followVisible"
      :form="model"
    />
  </div>
</template>
<script>
import { getClueList } from '@/api/myClues'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
import CustomerFollow from './components/CustomerFollow'
import { getItem } from '@/utils/auth'
export default {
  name: 'myCluesList',
  components: {
    CustomerFollow
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
        { label: '名称', prop: 'name' },
        { label: '电话', prop: 'phone' },
        { label: '线索来源', prop: 'source_type' },
        { label: '省份', prop: 'province' },
        { label: '城市', prop: 'city' },
        { label: '科室', prop: 'department' },
        { label: '跟进信息', prop: 'last_follow_up_info.remark' },
        { label: '跟进类型', prop: 'last_follow_up_info.follow_up_type' },
        { label: '详情', prop: 'detail' },
        { label: '创建时间', prop: 'created_time', formatter },
        { label: '更新时间', prop: 'updated_time', formatter },
        {
          label: '操作',
          width: '100',
          fixed: 'right',
          buttons: [
            {
              type: 'text',
              label: '客户跟进',
              click: this.handleFollow
            }
          ]
        }
      ],
      pagination: {
        page_num: 1,
        page_size: 10
      },
      model: {},
      followVisible: false
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
        name,
        phone,
        source_type,
        province,
        city,
        department,
        createtime,
        updatetime
      } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const [start_update_time, end_update_time] = updatetime || []
      const userId = parseInt(getItem('userid'))
      const params = {
        name,
        phone,
        source_type,
        province,
        city,
        department,
        start_create_time,
        end_create_time,
        start_update_time,
        end_update_time,
        user_id: userId,
        ...this.pagination
      }
      this.loading = true
      getClueList(params)
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
    handleFollow(row) {
      this.followVisible = true
      this.model = row
    }
  }
}
</script>
