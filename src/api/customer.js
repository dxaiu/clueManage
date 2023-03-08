import request from '@/utils/request'
// 获取用户列表
export function getUserList(params) {
  return request({
    url: '/v1/users',
    method: 'get',
    params
  })
}
// 添加用户
export function addUser(data) {
  return request({
    url: '/v1/users',
    method: 'post',
    data
  })
}
// 获取用户详情
export function getUserDetail(user_id) {
  return request({
    url: `/v1/users/${user_id}`
  })
}
// 修改用户
export function editUser(user_id, data) {
  return request({
    url: `/v1/users/${user_id}`,
    method: 'put',
    data
  })
}
// 删除用户
export function delUser(user_id) {
  return request({
    url: `/v1/users/${user_id}`,
    method: 'delete'
  })
}
// 表单数充值列表
export function getFormChargeList(user_id, params) {
  return request({
    url: `/v1/users/${user_id}/recharge`,
    method: 'get',
    params
  })
}
// 表单数充值
export function chargeNum(user_id, data) {
  return request({
    url: `/v1/users/${user_id}/recharge`,
    method: 'post',
    data
  })
}
// 线索信息列表
export function getCuleInfoList(params) {
  return request({
    url: '/v1/clues',
    method: 'get',
    params
  })
}

// 导出用户列表
export function exportUserList(user_id, params) {
  return request({
    url: `/v1/users/${user_id}/export`,
    params
  })
}

// 导出充值列表
export function exportRechargeList(user_id) {
  return request({
    url: `/v1/users/${user_id}/recharge/export`
  })
}

// 导出弹窗线索信息
export function exportList(clue_id, params) {
  return request({
    url: `/v1/clues/${clue_id}/export`,
    params
  })
}
// 获取统计
export function getCount(user_id) {
  return request({
    url: `/v1/users/${user_id}`
  })
}
