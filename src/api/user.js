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
