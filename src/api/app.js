// 首页
import request from '@/utils/request'

// 记录参数
export function recordParam(params) {
    params.op = 'AIQuestion.recordParam';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}

// 获取微信jssdk配置 TODO  getJssdkConfig
export function getWeChatConfig(params) {
    params.op = 'AIQuestion.getWeChatConfig';
    return request({
        url: '/index.php',
        method: 'get',
        params
    })    
}

// 获取微信授权请求地址 wechatOauth
export function getWeChatOauthUrl({
    authType,
    redirectUrl
}) {
    //return `https://adapi.monday1.top/v1/login/wechatOauth?auth_type=${authType}&self_redirect=${redirectUrl}`
    return `${process.env.VUE_APP_BASE_API}/index.php?op=AIQuestion.authByWeChat&auth_type=${authType}&self_redirect=${redirectUrl}`
}

// 获取分享信息 share
export function getShareInfo(params) {
    params.op = 'AIQuestion.getShareInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params
    })
}