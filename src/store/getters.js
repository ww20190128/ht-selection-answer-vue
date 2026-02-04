const getters = {
    token: state => state.user.token,
    config: state => state.user.config,
    userInfo: state => state.user.userInfo,
    hasUserInfo: state => state.user.hasUserInfo,
    wechatInfo: state => state.app.wechatInfo,
    globalParams: state => state.app.globalParams,
    hasParams: state => state.app.hasParams
}
export default getters
