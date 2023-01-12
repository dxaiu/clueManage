<template>
  <div>
    <div class="content" v-for="item in data" :key="item.id">
      <div class="item-box">
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">充值时间</el-col>
          <el-col class="tip" :span="16">{{
            formatter('created_time', item.created_time)
          }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">充值数量</el-col>
          <el-col class="tip" :span="16">{{ item.recharge_num }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">备注</el-col>
          <el-col class="tip" :span="16">{{ item.remark }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">操作人</el-col>
          <el-col class="tip" :span="16">{{ item.operation_user_name }}</el-col>
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
  name: 'ItemChargeList',
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
