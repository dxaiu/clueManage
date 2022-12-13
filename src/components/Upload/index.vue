<template>
  <div>
    <el-upload
      ref="upload"
      v-bind="$attrs"
      :action="action"
      :accept="accept"
      :auto-upload="autoUpload"
      :drag="drag"
      :file-list="fileList"
      :on-change="onChange"
      :on-remove="onRemove"
      :before-upload="beforeUpload"
      :list-type="listType"
      :limit="limit"
      :http-request="httpRequest"
    >
      <div v-if="drag" v-loading="loading">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </div>
      <el-button
        v-else
        slot="trigger"
        size="small"
        type="primary"
        icon="el-icon-upload2"
      >
        {{ autoUpload ? '点击上传' : '选取文件' }}
      </el-button>
      <div v-if="downloadUrl" slot="tip">
        <el-button size="small" type="text" @click="download">
          {{ downloadUrl }}
        </el-button>
      </div>
      <div slot="tip" class="el-upload__tip">
        {{ tip }}
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  inheritAttrs: false,
  props: {
    action: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    autoUpload: {
      type: Boolean,
      default: false
    },
    drag: {
      type: Boolean,
      default: true
    },
    fileList: {
      type: Array,
      default: () => []
    },
    onChange: {
      type: Function,
      default: () => {}
    },
    onRemove: {
      type: Function,
      default: () => {}
    },
    beforeUpload: {
      type: Function,
      default: () => {}
    },
    listType: {
      type: String,
      default: 'text'
    },
    limit: {
      type: Number,
      default: 1
    },
    httpRequest: {
      type: Function,
      default: () => {}
    },
    downloadUrl: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    abort() {
      return this.$refs.upload.abort()
    },
    submit() {
      return this.$refs.upload.submit()
    },
    download() {
      this.$emit('download')
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-success {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .detail-info {
    margin: 12px 0;
  }
}
</style>
