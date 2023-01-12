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
import { getClueList, exportClueList } from '@/api/myClues'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
import CustomerFollow from './components/CustomerFollow'
import { getItem } from '@/utils/auth'
import FileSaver from 'file-saver'
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
        currentPage: 1,
        pageSize: 10
      },
      model: {},
      followVisible: false,
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
  },
  methods: {
    searchTable() {
      this.pagination.currentPage = 1
      this.lockedModel = copyObj(this.form)
      this.handleTableData()
    },
    handleTableData() {
      const { name, phone, source_type, province, city, department } =
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
      const userId = parseInt(getItem('userid'))
      const params = {
        name,
        phone,
        source_type,
        province,
        city,
        department,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        start_update_time: this.start_update_time,
        end_update_time: this.end_update_time,
        user_id: userId,
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        key: this.searchText
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

      const userId = parseInt(getItem('userid'))
      const params = {
        name: this.form.name,
        phone: this.form.phone,
        source_type: this.form.source_type,
        province: this.form.province,
        city: this.form.city,
        department: this.form.department,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        start_update_time: this.start_update_time,
        end_update_time: this.end_update_time,
        user_id: userId
      }
      exportClueList(0, params)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
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
    handleFollow(row) {
      this.followVisible = true
      this.model = row
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
