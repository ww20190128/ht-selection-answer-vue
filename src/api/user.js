// 用户
import request from '@/utils/request'

// 获取用户信息 getUserInfo
export function getUserInfo(params = {}) {
    params.op = 'AIQuestion.userInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params,
        showLoading: true,
    })
}

// 微信登录 TODO wechatLogin
export function loginByWeChat(params = {}) {
    params.op = 'AIQuestion.loginByWeChat';
    return request({
        url: '/index.php',
        method: 'post',
        params,
        showLoading: true,
    })
    // return request({
    //     baseURL: 'https://adapi.monday1.top',
    //     url: '/v1/login/wechatLogin',
    //     method: 'post',
    //     params,
    //     showLoading: true,
    // })
}

