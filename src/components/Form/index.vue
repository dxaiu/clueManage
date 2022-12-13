<template>
  <div class="i-form" ref="wrapper">
    <el-row type="flex" :justify="inline ? 'start' : 'center'">
      <el-col :span="layoutSpan">
        <el-form
          ref="form"
          v-bind="$attrs"
          v-on="$listeners"
          :model="model"
          :inline="inline && !isResponsive"
          :rules="computedRules"
          :label-width="computedLabelWidth"
          :label-position="computedLabelPosition"
          :validate-on-rule-change="false"
        >
          <slot />
          <el-row v-bind="row">
            <template v-for="(item, index) in computedItems">
              <el-col
                :key="index"
                v-bind="item._colAttrs"
                v-if="item._vif"
                :disabled="item._disabled"
              >
                <slot v-if="item.slot" :name="item.slot" />
                <el-form-item :prop="item.type ? item.value : ''" v-bind="item">
                  <span
                    v-if="item.type === 'detail'"
                    :disabled="item._disabled"
                  >
                    {{
                      item.formatter
                        ? item.formatter(
                            item.value,
                            getValueByPath(model, item.value)
                          )
                        : getValueByPath(model, item.value)
                    }}
                  </span>
                  <el-input
                    v-if="item.type === 'text' || item.type === 'password'"
                    v-bind="item"
                    :disabled="item._disabled"
                    v-model.trim="model[item.value]"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-input
                    v-if="item.type === 'textarea'"
                    v-model.trim="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-input-number
                    v-if="item.type === 'inputNumber'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-switch
                    v-if="item.type === 'switch'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                  />
                  <el-select
                    v-if="item.type === 'select'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                    @change="val => item.change && item.change(val)"
                  >
                    <el-option
                      v-for="option in item._options"
                      :key="option.label"
                      v-bind="option"
                    />
                  </el-select>
                  <el-radio-group
                    v-if="item.type === 'radio'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    @change="val => item.change && item.change(val)"
                  >
                    <el-radio
                      v-for="childItem in item._options"
                      :key="childItem.label"
                      v-bind="childItem"
                    >
                      {{ childItem.text || childItem.label }}
                    </el-radio>
                  </el-radio-group>
                  <el-checkbox-group
                    v-if="item.type === 'checkbox'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    @change="val => item.change && item.change(val)"
                  >
                    <el-checkbox
                      v-for="childItem in item._options"
                      :key="childItem.label"
                      v-bind="childItem"
                    >
                      {{ childItem.text || childItem.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-date-picker
                    v-if="
                      item.type === 'date' ||
                      item.type === 'week' ||
                      item.type === 'month' ||
                      item.type === 'year'
                    "
                    v-model="model[item.value]"
                    :value-format="item.valueFormat || 'timestamp'"
                    v-bind="item"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-date-picker
                    v-if="item.type === 'datetime'"
                    v-model="model[item.value]"
                    :value-format="item.valueFormat || 'timestamp'"
                    v-bind="item"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-date-picker
                    v-if="item.type === 'daterange'"
                    v-model="model[item.value]"
                    :value-format="item.valueFormat || 'timestamp'"
                    :default-time="defaultTime"
                    v-bind="item"
                    :disabled="item._disabled"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                  <el-date-picker
                    v-if="item.type === 'datetimerange'"
                    v-model="model[item.value]"
                    :value-format="item.valueFormat || 'timestamp'"
                    :default-time="defaultTime"
                    v-bind="item"
                    :disabled="item._disabled"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                  />
                  <el-time-select
                    v-if="item.type === 'timeselect'"
                    v-model="model[item.value]"
                    :picker-options="item.pickerOptions"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-time-picker
                    v-if="item.type === 'timepicker'"
                    v-bind="item"
                    v-model="model[item.value]"
                    :disabled="item._disabled"
                    :placeholder="_getPlaceholder(item)"
                  />
                  <el-color-picker
                    v-if="item.type === 'color'"
                    v-bind="item"
                    v-model="model[item.value]"
                  />
                  <el-slider
                    v-if="item.type === 'slider'"
                    v-bind="item"
                    v-model="model[item.value]"
                  />
                  <el-cascader
                    v-if="item.type === 'cascader'"
                    v-model="model[item.value]"
                    v-bind="item"
                    :disabled="item._disabled"
                    @change="val => item.change && item.change(val)"
                  />
                  <el-link
                    v-if="item.type === 'link'"
                    type="primary"
                    :href="model[item.value]"
                    :underline="false"
                    v-bind="item"
                    :disabled="item._disabled"
                  >
                    {{ model[item.value] }}
                  </el-link>
                  <el-image
                    v-if="item.type === 'image'"
                    style="width: 100px; height: 100px"
                    :src="model[item.value]"
                    :preview-src-list="[model[item.value]]"
                    lazy
                    v-bind="item"
                    :disabled="item._disabled"
                  />
                  <template v-if="item.icons && item.icons.length">
                    <i
                      v-for="(icon, iconIndex) in item.icons"
                      :key="iconIndex"
                      :class="icon.class"
                      @click="icon.click"
                    >
                    </i>
                  </template>
                  <template v-if="item.btns && item.btns.length">
                    <el-button
                      v-for="(btn, btnIndex) in item.btns"
                      :key="btnIndex"
                      :type="btn.type"
                      v-bind="btn"
                      @click="btn.click($event, item, index, btn, btnIndex)"
                    >
                      {{ btn.text }}
                    </el-button>
                  </template>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="computedSpan" :style="wrapperStyle">
              <el-form-item v-if="buttons && buttons.length">
                <el-button
                  v-for="(btn, index) in buttons.filter(btn =>
                    btn.ifRender !== undefined
                      ? typeof btn.ifRender === 'function'
                        ? btn.ifRender(model)
                        : btn.ifRender
                      : true
                  )"
                  :key="index"
                  v-bind="btn"
                  @click="btn.click(btn.value)"
                >
                  {{ btn.text }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import responsiveMixin from './mixins/responsiveMixin'
import { getValueByPath, isNumber, isFunction, throttle } from '@/utils'
export default {
  name: 'dForm',
  mixins: [responsiveMixin],
  inheritAttrs: false,
  props: {
    model: {
      type: Object,
      default() {
        return {}
      }
    },
    rules: {
      type: Object,
      default() {
        return {}
      }
    },
    inline: {
      type: Boolean,
      default: false
    },
    'layout-span': {
      type: Number,
      default: 24
    },
    span: {
      type: Number,
      default: 24
    },
    items: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    col: {
      type: Object,
      default() {
        return {}
      }
    },
    'wrapper-style': {
      type: Object,
      default() {
        return {}
      }
    },
    buttons: {
      type: Array,
      default: () => []
    },
    'default-time': {
      type: Array,
      default: () => ['00:00:00', '23:59:59']
    },
    'label-width': {
      type: [Number, String],
      default: '100px'
    }
  },
  computed: {
    computedItems() {
      let acc = Object.assign([], this.items)
      acc.forEach(item => {
        item._colAttrs = this._getColAttrs(item.span)
        if (
          item.type === 'checkbox' &&
          !(this.model[item.value] instanceof Array)
        ) {
          this.$set(this.model, item.value, [])
        }
        if (
          item.options &&
          (item.options instanceof Array || isFunction(item.options))
        ) {
          if (isEqual(item._options, item.options)) {
            return
          }
          this._setOptions(item)
        } else if (
          item.options &&
          (!(item.options instanceof Array) || !isFunction(item.options))
        ) {
          throw new TypeError('options的类型不正确')
        }
      })
      return acc
    },
    computedRules() {
      let rules = Object.assign({}, this.rules)
      return this.items.reduce((rules, item) => {
        rules[item.value] = rules[item.value] ? rules[item.value] : []
        if (item.required && !rules[item.value].some(rule => rule.required)) {
          rules[item.value].push({
            required: true,
            message: '该项为必填项'
          })
        }
        return rules
      }, rules)
    },
    computedLabelWidth() {
      if (isNumber(this.labelWidth)) {
        return this.labelWidth + 'px'
      } else {
        return this.labelWidth
      }
    }
  },
  watch: {
    items: {
      handler(items) {
        if (items) {
          this._checkLinkage()
        }
      },
      immediate: true
    },
    model: {
      handler(model) {
        if (model) {
          this._checkLinkage()
        }
      },
      deep: true
    }
  },
  methods: {
    getValueByPath,
    _getPlaceholder(item) {
      let placeholder
      if (item._disabled) return
      if (item.placeholder) return item.placeholder
      if (
        item.type === 'text' ||
        item.type === 'textarea' ||
        item.type === 'inputNumber'
      ) {
        placeholder = '请输入' + item.label
      } else if (
        item.type === 'select' ||
        item.type === 'data' ||
        item.type === 'datetime'
      ) {
        placeholder = '请选择' + item.label
      } else {
        placeholder = item.label
      }
      return placeholder
    },
    _getColAttrs(span) {
      return this.inline
        ? { span: span || this.computedSpan }
        : { xs: 24, sm: 24, md: span || 24 }
    },
    _setOptions(formItem) {
      let newOptions = this._changeProp(formItem.options, formItem.prop)
      this.$set(formItem, 'options', newOptions)
      this.$set(formItem, '_options', newOptions)
    },
    _changeProp(options, prop) {
      let newOptions = []
      newOptions = isFunction(options)
        ? options(this.model)
        : options
        ? options
        : []
      if (prop) {
        return newOptions.map(option => ({
          label: option[prop.label || 'label'],
          value: option[prop.value || 'value']
        }))
      } else {
        return newOptions
      }
    },
    _checkLinkage() {
      this._checkLinkageFn = throttle(() => {
        this.items.forEach(item => {
          const vif =
            item.ifRender !== undefined
              ? isFunction(item.ifRender)
                ? item.ifRender(this.model)
                : item.ifRender
              : true
          const disabled =
            item.disabled !== undefined
              ? isFunction(item.disabled)
                ? item.disabled(this.model)
                : item.disabled
              : false
          if (!vif && item.value) {
            delete this.model[item.value]
          } else if (vif && item.value && item._vif !== vif) {
            this.$set(this.model, item.value, this.model[item.value])
          }
          if (vif && item._vif !== vif && isFunction(item.options)) {
            this._setOptions(item)
          }
          item._vif = vif
          item._disabled = disabled
        })
      }, 300)
      this._checkLinkageFn()
    },
    validate(valid) {
      return this.$refs.form.validate(valid)
    },
    validateField(value, callback) {
      return this.$refs.form.validateField(value, callback)
    },
    resetFields() {
      return this.$refs.form.resetFields()
    },
    clearValidate() {
      return this.$refs.form.clearValidate()
    }
  }
}
</script>

<style lang="scss">
.el-select {
  width: 100%;
}
.el-form--inline .el-col {
  display: inline-block;
}
</style>
