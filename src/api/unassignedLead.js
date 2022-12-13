import request from '@/utils/request'
// 查询列表
export function getUnassignLeadList(params) {
  return request({
    url: '/v1/clues',
    method: 'get',
    params
  })
}

// 分配客戶
export function assignCustomer(clue_id, data) {
  return request({
    url: `/v1/clues/${clue_id}/distribution`,
    method: 'patch',
    data
  })
}
// 删除线索
export function delUnAssign(clue_id, data) {
  return request({
    url: `/v1/clues/${clue_id}`,
    method: 'delete',
    data
  })
}
// 导入
export function importClue(clue_id, data) {
  return request({
    url: `/v1/clues/${clue_id}/import`,
    method: 'post',
    data
  })
}
