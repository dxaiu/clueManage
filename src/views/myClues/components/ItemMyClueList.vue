<template>
  <div>
    <div class="content" v-for="item in data" :key="item.id">
      <div class="item-box">
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">名称</el-col>
          <el-col class="tip" :span="16">{{ item.name }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">电话</el-col>
          <el-col class="tip" :span="16">{{ item.phone }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">线索来源</el-col>
          <el-col class="tip" :span="16">{{ item.source_type }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">省份</el-col>
          <el-col class="tip" :span="16">{{ item.province }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">城市</el-col>
          <el-col class="tip" :span="16">{{ item.city }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">科室</el-col>
          <el-col class="tip" :span="16">{{ item.department }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">跟进信息</el-col>
          <el-col class="tip" :span="16">{{
            item.last_follow_up_info.remark
          }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">跟进类型</el-col>
          <el-col class="tip" :span="16">{{
            item.last_follow_up_info.follow_up_type
          }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">详情</el-col>
          <el-col class="tip" :span="16">{{ item.detail }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">创建时间</el-col>
          <el-col class="tip" :span="16">{{
            formatter('created_time', item.created_time)
          }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">更新时间</el-col>
          <el-col class="tip" :span="16">{{
            formatter('updated_time', item.updated_time)
          }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name operation" :span="8">操作</el-col>
          <el-col class="tip btn" :span="16">
            <el-button type="text" size="mini" @click="handleFollow(item)"
              >客户跟进</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <el-pagination
      background
      v-if="pagination"
      v-bind="pagination"
      :total="total"
      :layout="layout"
      :hideOnSinglePage="hideOnSinglePage"
      @current-change="currentChange"
      @size-change="sizeChange"
      @prev-click="prevClick"
      @next-click="nextClick"
    />
  </div>
</template>

<script>
import formatter from '@/utils/format'
export default {
  name: 'ItemMyClueList',
  components: {},
  inheritAttrs: false,
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Object
    },
    total: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
    },
    'hide-on-single-page': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formatter
    }
  },
  methods: {
    currentChange(val) {
      this.$emit('pagination-change', { type: 'currentPage', val })
    },
    sizeChange(val) {
      this.$emit('pagination-change', { type: 'pageSize', val })
    },
    prevClick(val) {
      this.$emit('prev-click', val)
    },
    nextClick(val) {
      this.$emit('next-click', val)
    },
    doLayout() {
      return this.$refs.table.doLayout()
    },
    sort(prop, order) {
      return this.$refs.table.sort(prop, order)
    },
    handleFollow(item) {
      this.$emit('handleFollow', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  .item-box {
    border-bottom: 1px solid #ddd;
    padding: 15px 0;
    .item-row {
      margin: 3px 0;
      line-height: 20px;
      .row-name {
        font-size: 12px;
        color: #333;
        font-weight: 700;
      }
      .operation {
        line-height: 32px;
      }
      .tip {
        font-size: 12px;
        color: #333;
      }
      .btn {
        margin-top: -1px;
      }
    }
  }
}
</style>
