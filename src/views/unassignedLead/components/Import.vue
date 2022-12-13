<template>
  <div>
    <d-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible="visible"
      width="400px"
      @close="outerClose"
    >
      <Upload
        ref="upload"
        :file-list="fileList"
        :on-change="onChange"
        :on-remove="onRemove"
        :http-request="httpRequest"
        :loading="loading"
      />
      <div class="import-btn-wrapper" v-if="show">
        <el-button size="small" @click="outerClose"> 取消 </el-button>
        <el-button type="primary" @click="confirm" :disabled="loading"
          >确定</el-button
        >
      </div>
    </d-dialog>
  </div>
</template>
<script>
import Upload from '@/components/Upload'
import { importClue } from '@/api/unassignedLead'

export default {
  components: { Upload },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      // 导入参数
      fileList: [],
      show: true,
      // 导入结束
      title: '导入'
    }
  },
  methods: {
    outerClose() {
      this.$emit('update:visible', false)
    },
    onChange(file) {
      const arr = file.raw.name.split('.')
      const suffix = arr[arr.length - 1]
      const isExcel = suffix === 'xlsx'
      if (!isExcel) {
        this.$message.error('文件错误，请上传xlsx格式文件')
        this.fileList = []
      } else {
        this.fileList[0] = file
      }
    },
    onRemove() {
      this.fileList = []
    },
    httpRequest(option) {
      this.loading = true
      const file = option.file
      const fileName = option.fileName
      const formData = new FormData()
      formData.append('file', file, fileName)
      importClue(0, formData)
        .then(() => {
          this.loading = false
          this.outerClose()
          this.$message.success('上传成功')
          this.$emit('refreshTable')
        })
        .catch(() => {
          this.loading = false
        })
    },
    confirm() {
      if (this.fileList.length !== 0) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请上传文件',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.import-btn-wrapper {
  text-align: right;
}
</style>
