import { login, logout } from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getItem,
  setItem,
  removeAll
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: getItem('username'),
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, username) => {
    state.username = username
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ user_name: username.trim(), password: password })
        .then(response => {
          const { data } = response

          commit('SET_TOKEN', data.token)
          commit('SET_NAME', data.user_name)
          setToken(data.token)
          setItem('userid', data.id)
          setItem('username', data.user_name)
          setItem('info', JSON.stringify(response))
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const { data } = JSON.parse(getItem('info'))

      if (!data) {
        reject('验证失败，请重新登录')
      }

      const { user_type } = data

      const roles = user_type.split(',')
      if (!roles || roles.length <= 0) {
        reject('用户类型错误！')
      }

      commit('SET_ROLES', roles)
      resolve(roles)
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          removeAll()
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeAll()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
