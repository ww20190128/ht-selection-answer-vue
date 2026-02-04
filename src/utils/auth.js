import Cookies from 'js-cookie'
// token的key
const TOKENKEY = 'TOKEN'

// 获取token
export function getToken() {
    return Cookies.get(TOKENKEY)
}

// 设置token
export function setToken(token) {
    return Cookies.set(TOKENKEY, token, { expires: new Date(new Date().getTime() + 23 * 60 * 60 * 1000) })
}

// 删除token
export function removeToken() {
    return Cookies.remove(TOKENKEY)
}
