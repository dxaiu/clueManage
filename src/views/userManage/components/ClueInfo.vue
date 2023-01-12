<template>
  <d-dialog
    title="线索信息"
    :visible="visible"
    width="90%"
    vertical-center
    :close-on-click-modal="false"
    @close="close"
    @opened="opened"
  >
    <div class="page-container">
      <div class="form-wrapper" v-show="isExpand">
        <d-form
          ref="info"
          :layout-span="layoutSpan"
          :breakpoint="breakpoint"
          :inline="true"
          :items="formItems"
          :model="model"
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

        <ItemClueList
          v-else
          :data="tableData"
          :pagination="pagination"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          small
          @pagination-change="handlePageChange"
        />
      </div>
    </div>
  </d-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCuleInfoList, exportList } from '@/api/customer'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
import FileSaver from 'file-saver'
import ItemClueList from './components/ItemClueList'
export default {
  name: 'ClueInfo',
  components: {
    ItemClueList
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    dialogType: {
      type: String,
      default: 'ADD'
    },
    form: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['info'])
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
      model: {},
      lockedModel: {},
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
        { label: '名称', prop: 'name' },
        { label: '电话', prop: 'phone' },
        { label: '线索来源', prop: 'source_type' },
        { label: '省份', prop: 'province' },
        { label: '城市', prop: 'city' },
        { label: '科室', prop: 'department' },
        { label: '跟进信息', prop: 'last_follow_up_info.remark' },
        { label: '跟进类型', prop: 'last_follow_up_info.follow_up_type' },
        { label: '备注', prop: 'remark' },
        { label: '广告主名称', prop: 'advertiser_name' },
        { label: '广告计划名称', prop: 'advertiser_plan' },
        { label: '详情', prop: 'detail' },
        { label: '创建时间', prop: 'created_time', formatter },
        { label: '更新时间', prop: 'updated_time', formatter }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      uuid: '',
      start_create_time: '',
      end_create_time: '',
      start_update_time: '',
      end_update_time: '',
      searchText: '',
      isTable: true,
      isExpand: false
    }
  },
  methods: {
    refreshTable() {
      this.$emit('refreshTable')
    },
    close() {
      this.$refs.info.resetFields()
      this.$emit('update:visible', false)
      this.searchText = ''
      this.isTable = true
      this.isExpand = false
    },
    opened() {
      this.uuid = this.form.id
      this.handleDetail(this.uuid)
    },
    searchTable() {
      this.lockedModel = copyObj(this.model)
      this.handleDetail(this.uuid)
    },
    reset() {
      this.model = {}
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.currentPage = 1)
      this.handleDetail(this.uuid)
    },
    handleDetail(uuid) {
      const {
        name,
        phone,
        source_type,
        province,
        city,
        department,
        advertiser_name,
        advertiser_plan
      } = this.lockedModel
      if (this.model.createtime) {
        this.start_create_time = parseInt(
          new Date(this.model.createtime[0]).getTime() / 1000
        )
        this.end_create_time = parseInt(
          new Date(this.model.createtime[1]).getTime() / 1000
        )
      } else {
        this.start_create_time = ''
        this.end_create_time = ''
      }
      if (this.model.updatetime) {
        this.start_update_time = parseInt(
          new Date(this.model.updatetime[0]).getTime() / 1000
        )
        this.end_update_time = parseInt(
          new Date(this.model.updatetime[1]).getTime() / 1000
        )
      } else {
        this.start_update_time = ''
        this.end_update_time = ''
      }
      const params = {
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
        user_id: uuid,
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize,
        key: this.searchText
      }
      this.loading = true
      getCuleInfoList(params)
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
      if (this.model.createtime) {
        this.start_create_time = parseInt(
          new Date(this.model.createtime[0]).getTime() / 1000
        )
        this.end_create_time = parseInt(
          new Date(this.model.createtime[1]).getTime() / 1000
        )
      } else {
        this.start_create_time = ''
        this.end_create_time = ''
      }
      if (this.model.updatetime) {
        this.start_update_time = parseInt(
          new Date(this.model.updatetime[0]).getTime() / 1000
        )
        this.end_update_time = parseInt(
          new Date(this.model.updatetime[1]).getTime() / 1000
        )
      } else {
        this.start_update_time = ''
        this.end_update_time = ''
      }
      const params = {
        name: this.model.name,
        phone: this.model.phone,
        source_type: this.model.source_type,
        province: this.model.province,
        city: this.model.city,
        department: this.model.department,
        advertiser_name: this.model.advertiser_name,
        advertiser_plan: this.model.advertiser_plan,
        start_create_time: this.start_create_time,
        end_create_time: this.end_create_time,
        start_update_time: this.start_update_time,
        end_update_time: this.end_update_time,
        user_id: this.uuid
      }
      exportList(0, params)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSearch(val) {
      this.searchText = val
      this.handleDetail(this.uuid)
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
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
