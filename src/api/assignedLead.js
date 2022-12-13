import request from '@/utils/request'
// 查询列表--线索信息
export function getAssignLeadList(params) {
  return request({
    url: '/v1/clues',
    method: 'get',
    params
  })
}
// 导出
export function exportAssign(clue_id, params) {
  return request({
    url: `/v1/clues/${clue_id}/export`,
    params
  })
}
