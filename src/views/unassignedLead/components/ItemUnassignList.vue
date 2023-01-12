<template>
  <div>
    <div class="content" v-for="item in data" :key="item.id">
      <el-checkbox-group v-model="checkList" @change="handleChange">
        <div class="item-box">
          <el-row type="flex" class="item-row" justify="space-between">
            <el-col class="row-name" :span="8">
              <el-checkbox :label="item"><br /></el-checkbox>
            </el-col>
            <el-col class="tip" :span="16"></el-col>
          </el-row>
          <el-row type="flex" class="item-row" justify="space-between">
            <el-col class="row-name" :span="8">ID</el-col>
            <el-col class="tip" :span="16">{{ item.id }}</el-col>
          </el-row>
          <el-row type="flex" class="item-row" justify="space-between">
            <el-col class="row-name" :span="8">备注</el-col>
            <el-col class="tip" :span="16">{{ item.remark }}</el-col>
          </el-row>
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
            <el-col class="row-name" :span="8">详情</el-col>
            <el-col class="tip" :span="16">{{ item.detail }}</el-col>
          </el-row>
          <el-row type="flex" class="item-row" justify="space-between">
            <el-col class="row-name" :span="8">广告主名称</el-col>
            <el-col class="tip" :span="16">{{ item.advertiser_name }}</el-col>
          </el-row>
          <el-row type="flex" class="item-row" justify="space-between">
            <el-col class="row-name" :span="8">广告计划名称</el-col>
            <el-col class="tip" :span="16">{{ item.advertiser_plan }}</el-col>
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
              <el-button
                type="text"
                size="mini"
                @click="handleAssignCustomer(item)"
                >分配客户</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-checkbox-group>
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
  name: 'ItemUnassignList',
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
      formatter,
      checkList: []
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
    handleAssignCustomer(item) {
      this.$emit('handleAssignCustomer', item)
    },
    handleChange() {
      this.$emit('handleSelection', this.checkList)
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
