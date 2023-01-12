import request from '@/utils/request'
// 查询列表
export function getClueList(params) {
  return request({
    url: '/v1/clues',
    method: 'get',
    params
  })
}

// 线索跟进列表
export function getFollowList(id, params) {
  return request({
    url: `/v1/clues/${id}/follow-up`,
    method: 'get',
    params
  })
}

// 线索跟进
export function saveFollowUp(id, data) {
  return request({
    url: `/v1/clues/${id}/follow-up`,
    method: 'post',
    data
  })
}

// 导出线索跟进列表
export function exportFollowList(clue_id) {
  return request({
    url: `/v1/clues/${clue_id}/follow-up/export`
  })
}

// 导出列表
export function exportClueList(clue_id, params) {
  return request({
    url: `/v1/clues/${clue_id}/export`,
    params
  })
}
