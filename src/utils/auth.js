// import Cookies from 'js-cookie'

const TokenKey = 'token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export const getItem = key => {
  return localStorage.getItem(key)
}

export const setItem = (key, value) => {
  localStorage.setItem(key, value)
}

export const removeAll = () => {
  localStorage.clear()
}
