import request from '@/utils/request'

// 登录
export function loginByName(params = {}) {
    params.op = 'Selection.loginByName';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}

// 获取用户信息 
export function getUserInfo(params = {}) {
    params.op = 'Selection.userInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params,
        showLoading: true,
    })
}

// 获取题目
export function getQuestions(params = {}) {
    params.op = 'Selection.getQuestions';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}
// 获取题目
export function getAnswerQuestions(params = {}) {
    params.op = 'Selection.getAnswerQuestions';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}
// 选择
export function doSelection(params = {}) {
    params.op = 'Selection.doSelection';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}
// 答题
export function doAnswer(params = {}) {
    params.op = 'Selection.doAnswer';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}


// 用户的投票
export function userPkInfo(params = {}) {
    params.op = 'Selection.userPkInfo';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}

// 获取学科
export function getSubjects(params = {}) {
    params.op = 'Selection.getSubjects';
    return request({
        url: '/index.php',
        method: 'get',
        params,
    })
}


// 发送验证码
export function sendCode(params = {}) {
    params.op = 'Selection.sendCode';
    return request({
        url: '/index.php',
        method: 'post',
        params,
    })
}