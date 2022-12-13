import request from '@/utils/request'
// 查询列表
export function getClueDateList(params) {
  return request({
    url: '/customer/index/stat',
    method: 'get',
    params
  })
}
