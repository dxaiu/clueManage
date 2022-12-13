<template>
  <d-dialog
    class="modify-password-container"
    title="修改密码"
    :visible="visible"
    width="500px"
    vertical-center
    :close-on-click-modal="false"
    @close="close"
  >
    <Step ref="step" @save="save" @cancel="close" />
  </d-dialog>
</template>

<script>
import Step from './components/Step'
import { editUser } from '@/api/customer'
import { getItem } from '@/utils/auth'
export default {
  name: 'ModifyPassword',
  components: { Step },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      model: {}
    }
  },
  methods: {
    close() {
      if (this.$refs.Step) {
        this.$refs.Step.resetFields()
      }
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('update:visible', false)
    },
    save(password) {
      const { data } = JSON.parse(getItem('info'))
      const params = {
        user_type: data.user_type,
        user_name: data.user_name,
        email: data.email,
        nick: data.nick,
        password: password,
        province: data.province,
        city: data.city,
        department: data.department,
        remark: data.remark,
        status: data.status,
        enable_wechat: data.enable_wechat
      }
      const userId = parseInt(getItem('userid'))
      editUser(userId, params)
        .then(() => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.close()
          this.$store.dispatch('user/resetToken').then(() => {
            this.$router.push('/login')
          })
        })
        .catch(() => {})
    }
  }
}
</script>
