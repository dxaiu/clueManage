<template>
  <d-dialog
    title="表单数充值"
    :visible="visible"
    width="600px"
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
    >
      <template slot="recharge_num">
        <el-form-item label="充值数量" prop="recharge_num">
          <el-input-number
            v-model="currentForm.recharge_num"
            controls-position="right"
            placeholder="充值数量"
          ></el-input-number>
        </el-form-item>
      </template>
    </d-form>
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

      <ItemChargeList
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
import { mapGetters } from 'vuex'
import {
  getFormChargeList,
  chargeNum,
  exportRechargeList
} from '@/api/customer'
import formatter from '@/utils/format'
import { getItem } from '@/utils/auth'
import FileSaver from 'file-saver'
import ItemChargeList from './components/ItemChargeList'
export default {
  name: 'Recharge',
  components: {
    ItemChargeList
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
      formItems: [
        {
          type: 'text',
          value: 'nickname',
          label: '客户',
          disabled: true,
          clearable: true
        },
        {
          slot: 'recharge_num'
        },
        {
          type: 'textarea',
          label: '备注',
          value: 'remark',
          placeholder:
            '支持中文、英文大小写、数字、全部特殊字符，不超过200字符。',
          maxlength: 200,
          showWordLimit: true,
          autosize: { minRows: 3, maxRows: 6 },
          clearable: true
        }
      ],
      currentForm: {
        recharge_num: 0
      },
      rules: {
        nickname: [{ required: true, message: '请输入客户', trigger: 'blur' }],
        recharge_num: [
          { required: true, message: '请输入充值数量', trigger: 'blur' }
        ],
        remark: [{ required: false, message: '请填写备注', trigger: 'blur' }]
      },
      loading: false,
      tableData: [],
      totalCount: 0,
      columns: [
        { label: '充值时间', prop: 'created_time', formatter },
        { label: '充值数量', prop: 'recharge_num' },
        { label: '备注', prop: 'remark' },
        { label: '操作人', prop: 'operation_user_name' }
      ],
      pagination: {
        currentPage: 1,
        pageSize: 10
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
      this.tableData = []
      this.totalCount = 0
    },
    opened() {
      this.currentForm.nickname = this.form.nick
      this.uuid = this.form.id
      this.handleDetail(this.uuid)
      if (this.isMobile()) {
        this.isTable = false
      } else {
        this.isTable = true
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const params = {
          operation_user_id: parseInt(getItem('userid')),
          recharge_num: this.currentForm.recharge_num,
          remark: this.currentForm.remark,
          user_id: this.uuid
        }

        chargeNum(this.uuid, params).then(() => {
          this.$message({
            message: '充值成功',
            type: 'success'
          })
          this.close()
          this.refreshTable()
        })
      })
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
    },
    handleExport() {
      exportRechargeList(this.uuid)
        .then(res => {
          FileSaver.saveAs(res.data.url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleItem() {
      this.isTable = !this.isTable
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
<style lang="scss" scoped>
.box-item {
  width: 100%;
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
