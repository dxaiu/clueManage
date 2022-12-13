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
      <div class="form-wrapper">
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
          <el-button type="primary" @click="searchTable">查询</el-button>
          <el-button @click="reset">重置</el-button>
          <el-button @click="handleExport">导出</el-button>
        </div>
      </div>
      <div class="table-dash">
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
  </d-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCuleInfoList, exportList } from '@/api/customer'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
export default {
  name: 'ClueInfo',
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
        { label: '广告主名称', prop: 'advertiser_name' },
        { label: '广告计划名称', prop: 'advertiser_plan' },
        { label: '详情', prop: 'detail' },
        { label: '创建时间', prop: 'created_time', formatter },
        { label: '更新时间', prop: 'updated_time', formatter }
      ],
      pagination: {
        page_num: 1,
        page_size: 10
      },
      uuid: ''
    }
  },
  methods: {
    refreshTable() {
      this.$emit('refreshTable')
    },
    close() {
      this.$refs.info.resetFields()
      this.$emit('update:visible', false)
    },
    opened() {
      this.uuid = this.form.id
      this.handleDetail(this.uuid)
    },
    searchTable() {
      this.lockedModel = copyObj(this.model)
      this.handleDetail()
    },
    reset() {
      this.model = {}
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.page_num = 1)
      this.handleDetail()
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
        advertiser_plan,
        createtime,
        updatetime
      } = this.lockedModel
      const [start_create_time, end_create_time] = createtime || []
      const [start_update_time, end_update_time] = updatetime || []
      const params = {
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
        user_id: uuid,
        ...this.pagination
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
      const [start_create_time, end_create_time] = this.model.createtime || []
      const [start_update_time, end_update_time] = this.model.updatetime || []
      const params = {
        name: this.model.name,
        phone: this.model.phone,
        source_type: this.model.source_type,
        province: this.model.province,
        city: this.model.city,
        department: this.model.department,
        advertiser_name: this.model.advertiser_name,
        advertiser_plan: this.model.advertiser_plan,
        start_create_time,
        end_create_time,
        start_update_time,
        end_update_time
      }
      exportList(0, params)
        .then(() => {})
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
