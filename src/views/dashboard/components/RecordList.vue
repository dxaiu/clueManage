<template>
  <d-dialog
    title="查看充值记录"
    :visible="visible"
    width="50%"
    vertical-center
    :close-on-click-modal="false"
    @close="close"
    @opened="opened"
  >
    <div class="page-container">
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
import { getFormChargeList } from '@/api/customer'
import { copyObj } from '@/utils'
import formatter from '@/utils/format'
import { getItem } from '@/utils/auth'
export default {
  name: 'RecordList',
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
      formItems: [],
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { label: '充值数量', prop: 'recharge_num' },
        { label: '充值时间', prop: 'created_time', formatter }
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
      this.$emit('update:visible', false)
    },
    opened() {
      this.uuid = parseInt(getItem('userid'))
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
      const params = {
        page_num: this.pagination.currentPage,
        page_size: this.pagination.pageSize
      }
      this.loading = true
      getFormChargeList(uuid, params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.recharge_infos
          this.totalCount = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
