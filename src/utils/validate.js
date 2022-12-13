/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'customer']
  return valid_map.indexOf(str.trim()) >= 0
}

const validateMap = {
  // 正整数
  positiveInteger: {
    reg: /^[0-9]*[1-9][0-9]*$/,
    msg: '请输入正整数'
  },
  chinese: {
    reg: /^[\u4e00-\u9fa5]*$/,
    msg: '请输入汉字'
  },
  zhen: {
    reg: /^[\u4e00-\u9fa5_a-zA-Z]+$/,
    msg: '仅允许输入汉字和英文'
  },
  /* 用户名校验 长度6-16位，允许大小写英文、数字、下划线 */
  validateUserName: {
    reg: /^[a-zA-Z0-9_]{6,16}$/,
    msg: '长度5-18位，允许大小写英文、数字、下划线'
  },
  /* 密码校验 长度6-16，数字、特殊符号及大小写字母四选三 */
  validatePassword: {
    reg: /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{6,16}$/,
    msg: '长度6-16，数字、特殊符号及大小写字母四选三'
  },
  // 密码校验，6到16位（字母，数字，下划线，减号）
  validatePwd: {
    reg: /^[a-zA-Z0-9_-]{6,16}$/,
    msg: '长度6-16，字母、数字、下划线'
  },
  /* 电话号码校验 由11位数字组成  */
  validatePhone: {
    reg: /^\d{11}$/,
    msg: '请输入11位手机号'
  },
  /* 邮箱校验 */
  validateEmail: {
    reg: /^([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{1,})*)@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{1,})*)(\.[a-zA-Z0-9]{2,6})$/,
    msg: '请输入正确的邮箱地址'
  },
  /* 数字，正整数，不包含0 */
  validateNumber: {
    reg: /^[1-9]\d*$/,
    msg: '格式错误！'
  },
  id: {
    reg: /^[a-zA-Z0-9_]{18}$/,
    msg: '支持18位数字英文'
  }
}

/* 生成表单自定义校验函数 */
export default key => (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    rule.required || rule.defRequired
      ? callback(new Error(rule.emptymsg || '不能为空'))
      : callback()
    return
  }
  if (typeof validateMap[key] === 'function') {
    validateMap[key](value)
      ? callback(new Error(validateMap[key](value)))
      : callback()
  } else {
    validateMap[key].reg.test(value)
      ? callback()
      : callback(new Error(validateMap[key].msg))
  }
}
