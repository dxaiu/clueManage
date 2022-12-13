<template>
  <div class="d-dialog">
    <el-dialog v-bind="$attrs" v-on="$listeners">
      <slot />
      <template #title>
        <slot name="title" />
      </template>
      <template #footer>
        <slot v-if="type !== 'add' && type !== 'edit'" name="footer" />
        <template v-else>
          <el-button size="small" @click="cancel"> 取消 </el-button>
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            @click="submit"
          >
            {{ submitText }}
          </el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'dDialog',
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: ''
    },
    'vertical-center': {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: '确定'
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.$emit('submit')
    }
  }
}
</script>
