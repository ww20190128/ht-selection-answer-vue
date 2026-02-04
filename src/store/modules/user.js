
import { getToken, setToken } from '@/utils/auth'
import { getUserInfo, loginByName } from "@/api/selection";
import { getWeChatOauthUrl } from "@/api/app";
import { storage } from "@/utils/tools"
const state = {
    token: getToken(), //token
    userInfo: storage().get('userInfo') || {},    // 用户信息
    config: storage().get('config') || {}, // 个人中心页配置
    hasUserInfo: !!storage().get('hasUserInfo')  // 是否有用户信息
}

const mutations = {
    // 更新token
    SET_TOKEN: (state, token) => {
        state.token = token
        setToken(token)
    },
    // 更新用户信息
    SET_USERINFO: (state, userInfo) => {
        state.userInfo = userInfo
        storage().set('userInfo', userInfo)
    },
    // 更新是否有用户信息
    SET_HASUSERINFO: (state, hasUserInfo) => {
        state.hasUserInfo = hasUserInfo
        storage().set('hasUserInfo', hasUserInfo)
    },


}

const actions = {
    // 授权
    auth(ctx, { authType = 2, redirectUrl = window.location.href }) {
        return new Promise(async (resolve, reject) => {
            try {
                const url = getWeChatOauthUrl({ // 回调跳转域名
                    authType,
                    redirectUrl: encodeURIComponent(redirectUrl),
                })
                window.location.replace(url)
                resolve();
            } catch (error) {
                // reject(error)
            }
        })
    },

    // 登录
    login({ commit }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const { token } = await loginByName(data)
                commit('SET_TOKEN', 'Bearer ' + token)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },
    // 获取用户信息
    getUserInfo({ commit, state }) {
        return new Promise(async (resolve, reject) => {
            if (state.hasUserInfo) {
                resolve()
                return
            }
            try {
                const { userInfo } = await getUserInfo();
                commit('SET_USERINFO', userInfo)
                commit('SET_HASUSERINFO', true)

                resolve()
            } catch (error) {
                reject()
            }
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
