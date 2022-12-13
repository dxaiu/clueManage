<template>
  <el-table-column v-bind="column">
    <d-table-column
      v-for="column in column.columns"
      :key="column.prop"
      :column="column"
    />
  </el-table-column>
</template>

<script>
export default {
  name: 'Column',
  inheritAttrs: false,
  props: {
    column: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
