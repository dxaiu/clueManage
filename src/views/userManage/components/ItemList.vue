<template>
  <div>
    <div class="content" v-for="item in data" :key="item.id">
      <div class="item-box">
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">用户名</el-col>
          <el-col class="tip" :span="16">{{ item.user_name }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">昵称</el-col>
          <el-col class="tip" :span="16">{{ item.nick }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">状态</el-col>
          <el-col class="tip" :span="16">
            <el-tag size="mini" :type="item.status == true ? '' : 'danger'">{{
              item.status == true ? '启用' : '禁用'
            }}</el-tag>
          </el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">计划状态</el-col>
          <el-col class="tip" :span="16">
            <el-switch
              v-model="item.plan_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handlePlaySwitch(item)"
            >
            </el-switch>
          </el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">变黄</el-col>
          <el-col class="tip" :span="16">
            <el-switch
              v-model="item.is_yellow"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleYellowSwitch(item)"
            >
            </el-switch>
          </el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">备注</el-col>
          <el-col class="tip" :span="16">{{ item.remark }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">总条数</el-col>
          <el-col class="tip" :span="16">{{ item.recharge_total }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">共消耗</el-col>
          <el-col class="tip" :span="16">{{ item.consume_total }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">共剩余</el-col>
          <el-col class="tip" :span="16">{{ item.surplus_total }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">今日消耗</el-col>
          <el-col class="tip" :span="16">{{ item.consume_today }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name" :span="8">城市</el-col>
          <el-col class="tip" :span="16">{{ item.city }}</el-col>
        </el-row>
        <el-row type="flex" class="item-row" justify="space-between">
          <el-col class="row-name operation" :span="8">操作</el-col>
          <el-col class="tip btn" :span="16">
            <el-button type="text" size="mini" @click="handleRecharge(item)"
              >表单数充值</el-button
            >
            <el-button type="text" size="mini" @click="handleInfo(item)"
              >线索信息</el-button
            >
            <el-button type="text" size="mini" @click="handleEdit(item)"
              >编辑</el-button
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
export default {
  name: 'ItemList',
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
    handlePlaySwitch(item) {
      this.$emit('handlePlaySwitch', item)
    },
    handleYellowSwitch(item) {
      this.$emit('handleYellowSwitch', item)
    },
    handleRecharge(item) {
      this.$emit('handleRecharge', item)
    },
    handleInfo(item) {
      this.$emit('handleInfo', item)
    },
    handleEdit(item) {
      this.$emit('handleEdit', item)
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
