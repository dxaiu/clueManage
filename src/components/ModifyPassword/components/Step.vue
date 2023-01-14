<template>
  <div>
    <d-form
      ref="form"
      :items="items"
      :model="model"
      :rules="rules"
      :label-width="0"
    />
    <div class="btn-con">
      <el-button type="primary" size="small" @click="save">确认修改</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import formValidate from '@/utils/validate'
export default {
  name: 'Step',
  data() {
    const validateRepassword = (rule, value, callback) => {
      if (value !== this.model.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      items: [
        {
          type: 'password',
          value: 'password',
          placeholder: '请输入新密码',
          showPassword: true
        },
        {
          type: 'password',
          value: 'repassword',
          placeholder: '请再次输入新密码',
          showPassword: true
        }
      ],
      model: {},
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            validator: formValidate('validatePwd'),
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            validator: validateRepassword,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    save() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('save', this.model.password)
      })
    },
    cancel() {
      this.$emit('cancel')
    },
    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
