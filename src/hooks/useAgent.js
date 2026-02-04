import MobileDetect from "mobile-detect"
export const useAgent = () => {
    const ua = window.navigator.userAgent;    // 该属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息
    const md = new MobileDetect(ua);
    const agent = {
        os: md.os(),  //获取系统版本 
        isMobile: !!md.mobile(),
        isWeChat: false,
        ua,
        network: '',  // 网络状态
        env: 'browser-mobile',  // 涉及到支付 该字段不要随意修改
        md
    }

    // 网络状态
    const networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    agent.network = networkStr.toLowerCase().replace('nettype/', '')
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        agent.isWeChat = true;
        if (agent.isMobile) {
            agent.env = 'wechat-mobile'
        } else {
            agent.env = 'wechat-pc'
        }
    } else {
        if (!agent.isMobile) {
            agent.env = 'browser-pc'
        }
    }
    return agent
}