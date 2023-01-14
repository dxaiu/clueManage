<template>
  <d-dialog
    title="客户跟进"
    :visible="visible"
    width="700px"
    vertical-center
    :close-on-click-modal="false"
    @close="close"
    @opened="opened"
  >
    <d-form
      ref="form"
      :items="formItems"
      :model="currentForm"
      :rules="rules"
      label-width="120px"
    />
    <div class="btn-group-block">
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
    </div>
    <div class="box-item">
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

      <ItemFollowList
        v-else
        :data="tableData"
        :pagination="pagination"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        small
        @pagination-change="handlePageChange"
      />
    </div>
    <div slot="footer">
      <el-button type="primary" size="small" @click="save">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </div>
  </d-dialog>
</template>

<script>
import { getFollowList, saveFollowUp, exportFollowList } from '@/api/myClues'
import formatter from '@/utils/format'
import FileSaver from 'file-saver'
import ItemFollowList from './components/ItemFollowList'
export default {
  name: 'CustomerFollow',
  components: {
    ItemFollowList
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
  data() {
    return {
      formItems: [
        {
          type: 'radio',
          value: 'follow_up_type',
          label: '跟进状态',
          options: [
            {
              label: '未接听'
            },
            {
              label: '拒接'
            },
            {
              label: '无意向'
            },
            {
              label: '待定'
            },
            {
              label: '已成交'
            },
            {
              label: '恶意订购'
            },
            {
              label: '回购'
            },
            {
              label: '加微信'
            },
            {
              label: '红名单'
            },
            {
              label: '已录入'
            },
            {
              label: '接听'
            },
            {
              label: '空号'
            },
            {
              label: '停机'
            },
            {
              label: '关机'
            },
            {
              label: '派单重单'
            }
          ]
        },
        {
          type: 'textarea',
          label: '跟进内容',
          value: 'remark',
          placeholder: '跟进内容支持中文、英文大小写、数字、全部特殊字符。',
          maxlength: 1000,
          showWordLimit: false,
          autosize: { minRows: 3, maxRows: 6 },
          clearable: true
        }
      ],
      currentForm: {},
      rules: {
        follow_up_type: [
          { required: true, message: '请选择跟进状态', trigger: 'change' }
        ],
        remark: [{ required: true, message: '请填写跟进内容', trigger: 'blur' }]
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { label: '跟进时间', prop: 'created_time', formatter },
        { label: '跟进状态', prop: 'follow_up_type' },
        { label: '跟进执行人', prop: 'executor_name' },
        { label: '备注', prop: 'remark' }
      ],
      pagination: {
        page_num: 1,
        page_size: 10
      },
      uuid: '',
      isTable: true
    }
  },
  methods: {
    refreshTable() {
      this.$emit('refreshTable')
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    opened() {
      this.uuid = this.form.id
      this.handleDetail(this.uuid)
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const params = {
          follow_up_type: this.currentForm.follow_up_type,
          remark: this.currentForm.remark
        }

        saveFollowUp(this.uuid, params).then(() => {
          this.$message({
            message: '跟进成功',
            type: 'success'
          })
          this.close()
          this.refreshTable()
        })
      })
    },
    handlePageChange({ type, val }) {
      this.pagination[type] = val
      type === 'pageSize' && (this.pagination.page_num = 1)
      this.handleDetail(this.uuid)
    },
    handleDetail(uuid) {
      const params = {
        ...this.pagination
      }
      this.loading = true
      getFollowList(uuid, params)
        .then(res => {
          this.loading = false
          this.tableData = res.data.users
          this.totalCount = res.data.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleExport() {
      exportFollowList(this.uuid)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleItem() {
      this.isTable = !this.isTable
    }
  }
}
</script>
