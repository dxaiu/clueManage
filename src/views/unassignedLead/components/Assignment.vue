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
      <el-button type="primary" size="small" @click="handleSure"
        >确定</el-button
      >
      <el-button size="small" @click="close">取消</el-button>
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
          options: [],
          filterable: true,
          remote: true,
          remoteMethod: this.remoteMethod
        },
        {
          type: 'textarea',
          label: '备注',
          value: 'remark',
          placeholder: '',
          maxlength: 50,
          showWordLimit: true,
          autosize: { minRows: 2, maxRows: 4 },
          clearable: true
        }
      ],
      currentForm: {},
      rules: {
        user_id: [
          { required: true, message: '请选择分配客户', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '请输入备注', trigger: 'blur' },
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
  mounted() {
    // 去除下拉框的readonly属性
    Array.from(document.getElementsByClassName('el-select')).forEach(item => {
      item.children[0].children[0].removeAttribute('readOnly')
      item.children[0].children[0].onblur = function () {
        let _this = this
        setTimeout(() => {
          _this.removeAttribute('readOnly')
        }, 200)
      }
    })
  },
  methods: {
    refreshTable() {
      this.$emit('refreshTable')
    },
    opened() {
      this.uuid = this.form.id
      // this.getUserList()
    },
    close() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    handleSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return

        const params = {
          user_id: this.currentForm.user_id,
          remark: this.currentForm.remark
        }

        assignCustomer(this.uuid, params).then(() => {
          this.$message({
            message: '分配成功',
            type: 'success'
          })
          this.close()
          this.refreshTable()
        })
      })
    },
    remoteMethod(val) {
      if (!val) return
      this.loading = true
      this.items[0].options = []
      const params = {
        ...this.pagination,
        user_name: val
      }
      getUserList(params)
        .then(res => {
          if (res.data.users && res.data.users.length !== 0) {
            this.items[0].options = res.data.users.map(bean => ({
              label: bean.nick,
              value: bean.id
            }))
          } else {
            this.items[0].options = []
          }
        })
        .catch(err => console.log(err))
    },
    getUserList() {
      const params = {
        ...this.pagination
      }
      getUserList(params).then(res => {
        if (res.data.users && res.data.users.length !== 0) {
          this.items[0].options = res.data.users
            .filter(bean => bean.city == this.form.city)
            .map(bean => ({
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
