<template>
  <div>
    <el-table ref="table" v-bind="$attrs" v-on="$listeners" :data="data">
      <template v-for="column in columns">
        <!-- slot -->
        <slot
          v-if="
            column.slot &&
            !(typeof column.hidden === 'function'
              ? column.hidden()
              : column.hidden)
          "
          :name="column.slot"
        />
        <el-table-column
          v-else-if="
            column.buttons &&
            !(typeof column.hidden === 'function'
              ? column.hidden()
              : column.hidden)
          "
          :key="column.label"
          v-bind="column"
        >
          <template #default="scope">
            <el-button
              v-for="(button, index) in column.buttons.filter(btn =>
                btn.ifRender !== undefined
                  ? typeof btn.ifRender === 'function'
                    ? btn.ifRender(scope.row)
                    : btn.ifRender
                  : true
              )"
              :key="index"
              v-bind="button"
              :class="
                typeof button.class === 'function'
                  ? button.class(scope.row)
                  : button.class
              "
              :disabled="
                typeof button.disabled === 'function'
                  ? button.disabled(scope.row)
                  : button.disabled
              "
              @click="button.click(scope.row, scope.$index)"
            >
              {{
                typeof button.label === 'function'
                  ? button.label(scope.row)
                  : button.label || getRowIdentity(scope.row, button.prop)
              }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="
            column.columns &&
            !(typeof column.hidden === 'function'
              ? column.hidden()
              : column.hidden)
          "
          :key="column.prop"
          v-bind="column"
        >
          <d-table-column
            v-for="column in column.columns"
            :key="column.prop"
            :column="column"
          />
        </el-table-column>
        <el-table-column
          v-else-if="
            !(typeof column.hidden === 'function'
              ? column.hidden()
              : column.hidden)
          "
          :key="column.prop"
          v-bind="column"
        />
      </template>
    </el-table>
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
import dTableColumn from './dTableColumn'
import { getRowIdentity } from '@/utils'
export default {
  name: 'dTable',
  components: {
    dTableColumn
  },
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
    getRowIdentity,
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
    clearSelection() {
      return this.$refs.table.clearSelection()
    },
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected)
    },
    toggleAllSelection() {
      return this.$refs.table.toggleAllSelection()
    },
    toggleRowExpansion(row, expanded) {
      return this.$refs.table.toggleRowExpansion(row, expanded)
    },
    setCurrentRow(row) {
      return this.$refs.table.setCurrentRow(row)
    },
    clearSort() {
      return this.$refs.table.clearSort()
    },
    clearFilter(columnKey) {
      return this.$refs.table.clearFilter(columnKey)
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
