import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v1/users/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/v1/users/logout',
    method: 'post'
  })
}

export function logoutCode(id, params) {
  return request({
    url: `/v1/home/${id}/logout`,
    method: 'get',
    params
  })
}
