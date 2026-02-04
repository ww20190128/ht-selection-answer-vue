<template>
    <van-dialog>
        <div class="dialog-content">
            <img src="@/assets/images/unlogin-icon.jpg" />

            <div class="title">您还未登录</div>
            <div class="sub-title">请先登录再进行操作</div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <van-button @click="handleLogin" round block color="#6EA9FB">点击登录</van-button>
                <div class="footer-text" @click="$router.push('/')">返回首页</div>
            </div>
        </template>
    </van-dialog>
</template>

<script>

import { computed } from "vue";
import { useStore } from "@/store";
export default {
    components: {},
    props: {
        redirectPage: {
            type: String,
            default: "user",
        },
    },
    setup(props, cxt) {
        const store = useStore();

        // 登录
        function handleLogin() {
            if (store.getters.token) {
                return;
            }
            store.dispatch("user/auth", {
                authType: 2,
                redirectUrl: `${window.location.origin}/` + props.redirectPage,
            });
        }
        return {
            handleLogin,
        };
    },
};
</script>

<style lang="less" scoped>
@keyframes rotateAnimation {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.dialog-content {
    text-align: center;
    padding-top: 30px;

    img {
        border-radius: 50%;
        width: 60%;
        animation: rotateAnimation 2s linear infinite;
        transition: transform 0.5s ease;
    }

    .title {
        font-weight: bold;
        font-size: 17px;
        padding: 8px 0;
    }

    .sub-title {
        font-size: 15px;
    }
}

.dialog-footer {
    padding: 20px;
    text-align: center;

    :deep(.van-button__text) {
        font-size: 15px !important;
        font-weight: bold;
        letter-spacing: 5px;
    }

    .footer-text {
        font-size: 15px;
        color: gray;
        padding-top: 15px;

    }
}
</style>