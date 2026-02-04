import { getWeChatConfig, getShareInfo } from "@/api/app";
import wx from "weixin-js-sdk"; // 引入微信SDK
import { useAgent } from '@/hooks/useAgent'
// 微信分享钩子
export const useWx = async (params) => {
    const { isWeChat } = useAgent(); // 是否为微信登录
    if (!isWeChat) { // 微信外不执行
        return
    }
    
    // 获取微信的配置
    const {
        debug, appId, timestamp, nonceStr, signature, jsApiList,
    } = await getWeChatConfig({ url: window.location.href });

    wx.config({
        debug: debug ? true : false,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList,
    });
    if (params?.testPaperId) {
        const {
            title, desc, link, imgUrl,
        } = await getShareInfo({
            testPaperId: params.testPaperId,
            link: params.link || '',
            puid: params.puid || 0,
        });
        const shareData = {
            title,
            desc,
            link: params.link || link, // 如果传了link就用传递过来的link  没有则用接口返回的link
            imgUrl,
            success: () => {
                console.log("初始化分享成功！");
            },
        };
        wx.ready(() => {
            // ww 临时注释
            wx.updateAppMessageShareData(shareData);
            wx.updateTimelineShareData(shareData);
        });
    }
}