<template>
    <div class="user">
        <div class="header" :style="{ backgroundImage: `url(${backgroundImage})` }">
            <div class="user-img-warp">
                <img :src="userInfo?.headImgUrl || avatar" class="avatar-img" />

                <div class="text-warp">
                    <template v-if="userInfo?.userName">
                        <p>{{ userInfo?.userName }}</p>
                    </template>
                    <div v-else class="login-text">
                        <van-button round color="#a1c4fd" class="login-button" @click="handleLogin">点击登录</van-button>
                    </div>
                </div>
            </div>

            <div class="vip-info" v-show="userInfo?.vipInfo?.name">
                <div class="vip-name">
                    {{ userInfo?.vipInfo?.name }}<i class="icon fa fa-diamond"></i>
                </div>
                <div class="taps" v-if="vipEffectDay > 0">
                    {{ vipEffectDay }}天后到期
                </div>
                <div class="give-info">
                    <p class="left-text">剩余赠送次数</p>
                    <div class="progress">
                        <van-progress :percentage=giveNumPercentage stroke-width="1px" color="#efaa90"
                            :show-pivot="false" />
                    </div>
                    <p class="right-text">{{ userInfo?.vipInfo?.giveNumLimit }}次</p>
                </div>
            </div>
        </div>

        <div class="content">

            <div class="card " v-if="funcList.length" :class="{ 'show-vip-tap': userInfo?.vipInfo?.name }">
                <div class="head serve-head">我的服务</div>
                <div class="serve-list">
                    <div @click="handleServeItem(item)" class="item" v-for="item in funcList" :key="item">
                        <van-image fit="cover" :src="item?.iconImg"> </van-image>
                        <div class="text" :style="{ color: item?.color }">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <LoginDialog v-model:show="loginDialogShow" redirectPage="user"></LoginDialog>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import { useScrollBottom } from "@/hooks/useScroll";
import CopyRight from "@/components/CopyRight";
import { isObject } from "lodash";
import qs from "qs";
import { Toast } from "vant";
import moment from "moment";
import BaseDialog from "@/components/BaseDialog";
import LoginDialog from "@/components/LoginDialog";
// 服务图标
import serveVip from "@/assets/images/icon/icon-serve-vip.png";
import serveGive from "@/assets/images/icon/icon-serve-give.png";
import serveCoupon from "@/assets/images/icon/icon-serve-coupon.png";
import serveCollect from "@/assets/images/icon/icon-serve-collect.png";
import serveBrokerage from "@/assets/images/icon/icon-serve-brokerage1.png";

import bgUserImg from "@/assets/images/bg-mine.jpg";
import avatar from "@/assets/images/avatar.png";

import tagVipImg from "@/assets/images/tag-vip.png";
import tagReportImg from "@/assets/images/tag-report.png";

import vipBg from "@/assets/images/vip-banner.jpg";


export default {
    name: "user",
    components: {
        CopyRight,
        BaseDialog,
        LoginDialog
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        document.title = '个人中心'
        const state = reactive({
            query: {
                pageNum: 1,
                pageLimit: 10,
            },
            nomore: false,
            testOrderList: [],
            loginDialogShow: false,
            resetShow: false,
            testOrderId: '',
            testPaperId: '',
            resetOrderList: [], // 重测订单列表
        });
        onMounted(async () => {
            if (store.getters.token) {
                init();
                store.dispatch("user/getUserInfo");
            } else {
                const { code } = route.query;
                if (code) {
                    try {
                        await store.dispatch("user/login", { code });
                        // 登录完毕清除微信回调过来的code和state
                        window.history.replaceState(
                            null,
                            null,
                            `${window.location.origin}/user`
                        );
                        // 执行授权页的获取数据钩子
                        init();
                    } catch (error) {
                        console.log(error);
                        // 登录失败 回退上一页
                        Toast("登录失败，请重新登录user/login");
                        // setTimeout(() => {
                        //   router.go(-1);
                        // }, 1000);
                    }
                    // 登录完成 没有用户信息  获取用户信息
                    if (!store.getters.hasUserInfo && store.getters.token) {
                        store.dispatch("user/getUserInfo");
                    }
                } else {
                    state.loginDialogShow = true;
                }
            }
        });
        const userInfo = computed(() => store.getters.userInfo);
        const config = computed(() => store.getters.config);
        const backgroundImage = computed(
            () => config?.value?.userBgImg || bgUserImg
        );
        const giveNumPercentage = computed(() => {
            if (!store.getters.userInfo.vipInfo?.name) return 0;
            let vip = store.getters.userInfo.vipInfo;
            const value =
                ((vip.vipGiveLimit - vip.vipGiveNum) / vip.vipGiveLimit) * 100;
            return value >= 100 ? 100 : value;
        });
        const vipEffectDay = computed(() => {
            if (!store.getters.userInfo.vipInfo?.name) return 0;
            let vip = store.getters.userInfo.vipInfo;
            const currentTime = Date.now() / 1000; // 获取当前时间戳（秒）
            const value = (vip.effectEndTime - currentTime) / 86400;
            return Math.ceil(value); // 向上取整
        });

        const funcList = computed(() => {
            return (
                [
                    {
                        iconImg: serveVip,
                        name: "会员中心",
                        goto: "/errorQuestion",
                    },
                    {
                        iconImg: serveCoupon,
                        name: "我的优惠券",
                        goto: "/errorQuestion",
                    },
                    {
                        iconImg: serveGive,
                        name: "错题集",
                        goto: "/errorQuestion",
                    },
                    {
                        iconImg: serveCollect,
                        name: "我的收藏",
                        goto: "/errorQuestion",
                    },
                ]
            );
        });

        // 获取订单数据
        async function init() {
            if (state.nomore) {
                return;
            }

        }



        //滚动事件
        useScrollBottom(() => {
            if (state.nomore) {
                return;
            }

            init();
        }, 100);
        // 登录
        function handleLogin() {
            if (store.getters.token) {
                return;
            }
            store.dispatch("user/auth", {
                authType: 2,
                redirectUrl: `${window.location.origin}/user`,
            });
        }
        function handleServeItem({ goto }) {
            const reg = new RegExp("[a-zA-z]+://[^\s]*");
            if (reg.test(goto)) {
                location.href = goto;
            } else {
                router.push(goto);
            }
        }

        function pushBaseUrl(data) {

            // 获取当前页面域名
            const url = window.location.origin + '/';

            const baseUrl = url?.endsWith("/") ? url.slice(0, -1) : baseUrl;
            let path = isObject(data) ? data.path : data;
            if (url) {
                path = baseUrl + path;
                if (isObject(data) && data.query) {
                    const search = qs.stringify(data.query);
                    path = `${path}?${search}`;
                }
                window.location.href = path;
            } else {
                router.push(path);
            }
        }
        async function handleGoErrorRecord({ testOrderId }) {
            pushBaseUrl({
                path: "/errorRecord",
                query: { testOrderId },
            });


        }
        function handleServeItem({ goto }) {
            const reg = new RegExp("[a-zA-z]+://[^\s]*");
            if (reg.test(goto)) {
                location.href = goto;
            } else {
                router.push(goto);
            }
        }
        return {
            ...toRefs(state),
            userInfo,
            funcList,
            backgroundImage,
            giveNumPercentage,
            vipEffectDay,
            avatar,
            tagVipImg,
            tagReportImg,
            handleLogin,
            handleGoErrorRecord,
            handleServeItem,
        };
    },
};
</script>

<style lang="less" scoped>
.dialog-content {
    text-align: center;
    padding-top: 30px;

    .title {
        font-weight: bold;
        font-size: 17px;
        padding: 8px 0;
    }
}


.subhead {
    font-size: 20px;
    color: @theme-color;

    &.subhead-mini {
        font-size: 15px;
        line-height: 25px;
        color: @light-black;
        text-align: left;
    }

    &.subhead-text {
        font-size: 16px;
    }
}

.subcenter {
    font-size: 14px;
    line-height: 35px;
    color: #3a3a3a;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-weight: 600;

    .sub {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;

        i {
            margin-right: 10px;
            font-size: 16px;
            color: #526edb;
            //  color: #cecdcd;
        }

        img {
            width: 16px;
        }

        .xiahuaxian {
            //下划线
            border-bottom: 1px solid #000;
        }
    }
}

.head() {
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    border-bottom: 1px solid #efefef;
    padding: 0 @padding-base;
    font-size: 18px;
    font-weight: bold;

    position: relative;

}

.card() {

    // border-radius: @radius-base;
    // box-shadow: 0px 0px 6px #8f8f8f;
    overflow: hidden;
    background-color: #fff;
    width: 100%;
}

@keyframes blink {
    0% {
        left: -50px;
    }

    100% {
        left: 100%;
    }
}

.user {
    background-color: @bg-color;

    .header {
        position: relative;
        height: 140px;
        // background-color: #ff99ae;
        padding: @padding-base;
        font-size: @font-size-base;
        color: #fff;
        background-repeat: no-repeat;
        background-size: cover;
        .align-center();

        .user-img-warp {
            height: 50px;
            width: 50%;
            position: relative;
            position: absolute;
            top: 25%;
            display: inline-block;

            .avatar-img {
                display: inline-block;
                height: 50px;
                width: 50px;
                border-radius: 50%;
                border: 3px solid #fff;
            }

            .text-warp {
                position: absolute;
                left: 60px;
                top: 0;
                line-height: 50px;

                .login-text {
                    display: flex;
                    align-items: center;

                    // flex-direction: column;
                    // justify-content: space-between;
                    .login-button {
                        height: 30px;
                        width: 90px;
                    }
                }
            }
        }

        .vip-icon {
            padding-left: 10px;
        }



        .vip-info {
            // background-image: url("@/assets/images/vip-banner.jpg");
            z-index: 99;
            position: absolute;
            bottom: -45px;
            left: 50%;
            transform: translateX(-50%);
            width: 95%;
            height: 70px;

            background-color: #e3eeff;
            border-radius: 10px;
            // box-shadow: 0px 0px 6px #8f8f8f;
            padding: 15px;
            box-sizing: border-box;
            color: @light-black;

            &::before {
                content: "";
                position: absolute;
                width: 100px;
                height: 4px;
                top: 50%;
                left: -100px;
                background-color: rgba(#fff, 0.2);
                transform: rotate(-45deg);
                animation: blink 2.2s ease-in-out 2s infinite;
            }

            .vip-name {
                height: 30px;
                line-height: 1;
                position: absolute;
                top: 10px;
                left: 10px;
                font-size: @font-size-base;
                .ellipsis();

                .icon {
                    padding-left: 5px;
                    color: #CD7F32;
                }
            }

            .taps {
                position: absolute;
                top: -3px;
                right: -3px;
                width: 70px;
                height: 20px;
                background-color: black;
                color: @bg-color;
                display: flex;
                align-items: center;
                justify-content: center;
                border-bottom-left-radius: 10px;
                border-top-right-radius: 5px;
                border-bottom-right-radius: 2px;
                font-size: 10px;
            }

            .give-info {
                position: absolute;
                bottom: 0px;
                left: 0;
                right: 0;
                display: flex;
                height: 30px;
                color: @gray-color;
                justify-content: space-between;

                margin: 0 10px;

                p {
                    font-size: 12px !important;
                }

                .progress {
                    width: 100%;
                    position: absolute;
                    bottom: 10px;
                    left: 0px;
                }
            }
        }

    }

    .content {
        // padding: @padding-base;

        .card {
            .card();

            .head {
                .head();
            }

            .serve-list {
                margin-top: 10px;
                display: flex;
                flex-wrap: wrap;

                .item {
                    width: 25%;
                    height: 75px;
                    font-size: @font-size-sm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    cursor: pointer;

                    .text {
                        padding-top: 5px;
                    }

                    .van-image {
                        width: 45px;
                        height: 45px;
                    }
                }
            }
        }

        .show-vip-tap {
            padding-top: 50px;
        }

        .report-list {
            // margin-top: 10px;
            width: 100%;
            padding-bottom: 10px;

            .card();

            .head {
                .head();
                color: @theme-color;
            }

            .none {
                text-align: center;
                padding: @padding-base 0;
                font-size: @font-size-base;
                color: @gray-color;
            }

            .item {
                background: whitesmoke;
                margin: 10px;
                border-radius: 5px;
                padding: @padding-sm;
                margin-bottom: @padding-base;
                .pointer();
                .space-between();

                &:nth-last-child(2) {
                    border: none;
                }


                height: 90px !important;
                position: relative;

                .left {
                    width: 70px !important;
                    height: 70px !important;

                    .van-image {
                        width: 100%;
                        height: 100%;

                        :deep(img) {
                            border-radius: @radius-base;
                        }
                    }
                }

                .right {
                    padding-left: 10px;

                    flex: 1;
                    height: 70px;

                    .title {
                        font-size: @font-size-base;
                        font-weight: bold;
                    }

                    .subhead {
                        font-size: @font-size-lg;
                        height: 25px;
                        line-height: 25px;
                        color: @gray-color;
                        font-size: 14px;
                        overflow: hidden;
                    }

                    position: relative;

                    .bottom-info {
                        position: absolute;
                        height: 20px;
                        line-height: 20px;
                        bottom: 0;
                        left: 10px;
                        font-size: 12px;
                        color: @gray-color;
                    }
                }

                .go-button {
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    width: 70px;
                    height: 22px;
                    line-height: 22px;
                    border-radius: 15px;
                    text-align: center;
                    background-color: @theme-color;
                    color: #fff;
                    font-size: @font-size-sm;
                }
            }
        }
    }
}

.dialog-content {
    padding: @padding-base 20px;
    font-size: @font-size-base;
    position: relative;

    .text-content {
        line-height: 25px;
    }

    .button {
        width: 100%;
        height: 40px;
        border-radius: 40px;
        background-color: #fff;
        color: @theme-color;
        border: 1px solid @theme-color;
        line-height: 40px;
        text-align: center;
        margin: 10px auto;
    }

    .plain {
        border: none;
        color: #000;
    }

    .title {
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        padding: @padding-base 0;
    }

    .report-item {
        .space-between();
        padding: 5px 0;

        .right {
            color: @theme-color;

            &.continue {
                color: #5353f4;
            }
        }
    }
}
</style>