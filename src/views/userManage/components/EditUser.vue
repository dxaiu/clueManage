<template>
  <d-dialog
    title="编辑"
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
    >
      <template slot="loginfailure">
        <el-form-item label="登录失败次数" prop="loginfailure">
          <el-input-number
            v-model="currentForm.loginfailure"
            controls-position="right"
            placeholder="登录失败次数"
          ></el-input-number>
        </el-form-item>
      </template>
    </d-form>
    <div slot="footer">
      <el-button type="primary" @click="save">确定</el-button>
      <el-button @click="close">取消</el-button>
    </div>
  </d-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUserDetail, editUser } from '@/api/customer'
import formValidate from '@/utils/validate'
export default {
  name: 'EditUser',
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
      loading: false,
      formItems: [
        {
          type: 'select',
          value: 'user_type',
          label: '所属组别',
          clearable: true,
          options: [
            { label: '管理员', value: 'admin' },
            { label: '客户', value: 'customer' }
          ]
        },
        {
          type: 'text',
          value: 'user_name',
          label: '用户名',
          clearable: true
        },
        {
          type: 'text',
          value: 'email',
          label: 'Email',
          clearable: true
        },
        {
          type: 'text',
          value: 'nick',
          label: '昵称',
          clearable: true
        },
        {
          type: 'text',
          value: 'password',
          label: '密码',
          clearable: true
        },
        // {
        //   slot: 'loginfailure'
        // },
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
          type: 'select',
          value: 'department',
          label: '科室',
          clearable: true,
          options: [
            { label: '男科', value: '男科' },
            { label: '妇科', value: '妇科' },
            { label: '肠胃', value: '肠胃' },
            { label: '肛肠', value: '肛肠' },
            { label: '性病', value: '性病' },
            { label: '不孕不育', value: '不孕不育' },
            { label: '耳鼻喉', value: '耳鼻喉' },
            { label: '种植牙', value: '种植牙' },
            { label: '矫正', value: '矫正' },
            { label: '植发', value: '植发' },
            { label: '双眼皮', value: '双眼皮' },
            { label: '眼科', value: '眼科' },
            { label: '吸脂', value: '吸脂' },
            { label: '产检', value: '产检' },
            { label: '早孕', value: '早孕' }
          ]
        },
        {
          type: 'textarea',
          label: '备注',
          value: 'remark',
          placeholder:
            '支持中文、英文大小写、数字、全部特殊字符，不超过50字符。',
          maxlength: 50,
          showWordLimit: true,
          autosize: { minRows: 2, maxRows: 4 },
          clearable: true
        },
        {
          type: 'radio',
          value: 'status',
          label: '状态',
          options: [
            {
              label: '启用'
            },
            {
              label: '禁用'
            }
          ]
        },
        {
          type: 'radio',
          value: 'enable_wechat',
          label: '公众号',
          options: [
            {
              label: '启用'
            },
            {
              label: '禁用'
            }
          ]
        }
      ],
      currentForm: {
        id: ''
      },
      rules: {
        user_type: [
          { required: true, message: '请选择所属组别', trigger: 'change' }
        ],
        user_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: false, message: '请输入Email', trigger: 'blur' },
          {
            validator: formValidate('validateEmail'),
            trigger: 'blur'
          }
        ],
        nick: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [
          { required: false, message: '请输入密码', trigger: 'blur' },
          {
            validator: formValidate('validatePwd'),
            trigger: 'blur'
          }
        ],
        loginfailure: [
          { required: true, message: '请输入登录失败次数', trigger: 'blur' }
        ],
        province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
        city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        department: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
        remark: [{ required: false, message: '请填写备注', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        enable_wechat: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      uuid: ''
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
          user_type: this.currentForm.user_type,
          user_name: this.currentForm.user_name,
          email: this.currentForm.email,
          nick: this.currentForm.nick,
          password: this.currentForm.password,
          province: this.currentForm.province,
          city: this.currentForm.city,
          department: this.currentForm.department,
          remark: this.currentForm.remark,
          status: this.currentForm.status === '启用' ? true : false,
          enable_wechat:
            this.currentForm.enable_wechat === '启用' ? true : false
        }

        editUser(this.uuid, params).then(() => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.close()
          this.refreshTable()
        })
      })
    },
    handleDetail(uuid) {
      this.loading = true
      getUserDetail(uuid)
        .then(res => {
          this.loading = false
          this.currentForm = {
            id: res.data.id,
            user_type: res.data.user_type,
            user_name: res.data.user_name,
            email: res.data.email,
            nick: res.data.nick,
            password: res.data.password,
            province: res.data.province,
            city: res.data.city,
            department: res.data.department,
            remark: res.data.remark,
            status: res.data.status === true ? '启用' : '禁用',
            enable_wechat: res.data.enable_wechat === true ? '启用' : '禁用'
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
