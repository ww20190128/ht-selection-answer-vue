// 提现
import request from '@/utils/request'

// 获取考点列表
export function getPoints(params = {}) {
    params.op = 'AIQuestion.getPoints';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 获取考点详情
export function getPointInfo(params = {}) {
    params.op = 'AIQuestion.getPointInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 获取内容
export function getContentGroupInfo(params = {}) {
    params.op = 'AIQuestion.getContentGroupInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 提交作答记录
export function submitAnswers(params = {}) {
    params.op = 'AIQuestion.submitAnswers';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}

// 设置学科
export function setUserSubject(params = {}) {
    params.op = 'AIQuestion.setUserSubject';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}

// 预约考点
export function subscribePoint(params = {}) {
    params.op = 'AIQuestion.subscribePoint';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 保存收货地址
export function saveAddress(params = {}) {
    params.op = 'AIQuestion.saveAddress';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 获取错题记录
export function getErrorQuestion(params = {}) {
    params.op = 'AIQuestion.getErrorQuestion';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 创建vip支付订单
export function createVipOrder(params = {}) {
    params.op = 'AIQuestion.createVipOrder';
    return request({
        url: '/index.php',
        method: 'get',
        params
    })
}

// vip订单支付
export function vipOrderPay(params = {}) {
    params.op = 'AIQuestion.vipOrderPay';
    return request({
        url: '/index.php',
        method: 'post',
        params
    })
}


// 检测vip订单是否支付 
export function checkVipOrderPay(params = {}) {
    params.op = 'AIQuestion.checkVipOrderPay';
    params.t = new Date().getTime()
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}