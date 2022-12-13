<template>
  <d-dialog
    :title="title"
    :visible="visible"
    width="500px"
    vertical-center
    :close-on-click-modal="false"
    @close="close"
    @opened="opened"
  >
    <d-form
      ref="form"
      :items="items"
      :model="currentForm"
      :rules="rules"
      labelPosition="top"
    />
    <div slot="footer">
      <el-button type="primary" @click="handleSure">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </d-dialog>
</template>
<script>
import { assignCustomer } from '@/api/unassignedLead'
import { getUserList } from '@/api/customer'
export default {
  name: 'Assignment',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      default: () => ({})
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '分配客户',
      items: [
        {
          type: 'select',
          value: 'user_id',
          label: '分配客户',
          clearable: true,
          options: []
        },
        {
          label: '备注',
          type: 'text',
          value: 'remark',
          clearable: true,
          placeholder: '请输入备注'
        }
      ],
      currentForm: {},
      rules: {
        user_id: [
          { required: true, message: '请选择分配客户', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
          { max: 50, message: '备注不超过50个字符', trigger: 'blur' }
        ]
      },
      pagination: {
        page_num: 1,
        page_size: 100000
      },
      uuid: ''
    }
  },
  methods: {
    refreshTable() {
      this.$emit('refreshTable')
    },
    opened() {
      this.uuid = this.form.id
      this.getUserList()
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const params = {
          clue_ids: this.list,
          user_id: this.currentForm.user_id,
          remark: this.currentForm.remark
        }

        assignCustomer(0, params).then(() => {
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.close()
          this.refreshTable()
        })
      })
    },
    getUserList() {
      const params = {
        ...this.pagination
      }
      getUserList(params).then(res => {
        if (res.data.users && res.data.users.length !== 0) {
          this.items[0].options = res.data.users.map(bean => ({
            label: bean.nick,
            value: bean.id
          }))
        } else {
          this.items[0].options = []
        }
      })
    }
  }
}
</script>
