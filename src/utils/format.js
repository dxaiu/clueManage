import { getPropByPath } from '@/utils'
import dayjs from 'dayjs'
const filedMap = {
  status: {
    true: '启用',
    false: '禁用'
  },
  plan_status: {
    true: '启用',
    false: '禁用'
  },
  is_yellow: {
    true: '启用',
    false: '禁用'
  },
  created_time: val => {
    if (!val) return
    return dayjs.unix(val).format('YYYY-MM-DD HH:mm:ss')
  },
  updated_time: val => {
    if (!val) return
    return dayjs.unix(val).format('YYYY-MM-DD HH:mm:ss')
  }
}

// 方法重载
export default (...args) => {
  let key, value
  if (args.length === 2) {
    ;[key, value] = args
  } else {
    key = getPropByPath(args[0], args[1].property).k
    value = args[2]
  }
  if (!filedMap[key]) return
  if (typeof filedMap[key] === 'function') {
    return filedMap[key](value)
  } else {
    return filedMap[key][value] || value
  }
}
