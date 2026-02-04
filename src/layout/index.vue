<template>
  <router-view v-slot="{ Component, route }">
    <section ref="container" class="container" id="container" :class="{ 'min-height': !showTabBar }">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </section>
  </router-view>

  <!-- 底部标签栏 -->
  <TabBar class="tab-bar" v-if="showTabBar" />

  <!-- 非微信用户进入 微信用户才可以进入的页面时进行拦截 -->
  <WeChatQr v-model:show="weChatQrShow">
    <template #subhead>
      <p class="subhead">即可查看您的全部评测结果</p>
    </template>
    <div class="qr-text">
      <p>扫码关注公众号</p>
      <p>解锁更多精彩内容</p>
    </div>
  </WeChatQr>

  <div v-if="error" class="error">
    <Error />
  </div>
  <!-- 返回顶部 -->
  <BackTop v-if="!backTopHidden" />

</template>
/
<script>
import { reactive, toRefs, computed } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import CopyRight from "@/components/CopyRight";
import BackTop from "@/components/BackTop";
import WeChatQr from "@/components/WeChatQr";
import Error from "@/components/Error";
import TabBar from "./TabBar";
import { useAgent } from "@/hooks/useAgent";
import { useStore } from "@/store";
import NProgress from "nprogress"
export default {
  name: "Layout",
  components: {
    BackTop,
    CopyRight,
    WeChatQr,
    TabBar,
    Error,

  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const state = reactive({
      // 需要缓存的路由页面 此处填name (一般情况下不需要)
      cachedViews: ["home", "classify"],
    });
    // 非微信浏览器用户不可访问的页面
    const weChatList = ["/user"];
    const { isWeChat } = useAgent();

    const error = computed({
      get: () => store.state.app.error,
      set: (error) => store.commit("app/SET_ERROR", error),
    });
    // 
    // 路由更新前拦截处理
    onBeforeRouteUpdate((to, from, next) => {
      if (!isWeChat) {
        if (weChatList.includes(to.path)) {
          store.commit("app/SET_WECHATQRSHOW", true);
          NProgress.done()
          return;
        }
        next();
      } else {
        next();
      }
    });

    // 是否显示 tabbar
    const showTabBar = computed(() => route.meta?.showTabBar);

    // 是否显示返回顶部
    const backTopHidden = computed(() => route.meta?.backTopHidden);

    // 是否显示公众号二维码
    const weChatQrShow = computed({
      get: () => store.state.app?.weChatQrShow,
      set: (val) => store.commit("app/SET_WECHATQRSHOW", val),
    });

    return {
      ...toRefs(state),
      showTabBar,
      backTopHidden,
      weChatQrShow,
      error,
    };
  },
};
</script>
<style lang="less" scoped>
.container {
  max-width: 750PX !important;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  position: relative;
  background-color: #EBF6FC;
}

.min-height {
  min-height: var(--container-min-height);
  .scroll-bar();
}

.subhead {
  color: @theme-color;
  font-size: 15px;
  padding-bottom: 5px;
  text-align: center;
}

.qr-text {
  color: #48ad4c;
  line-height: 25px;
  p {
    font-size: @font-size-base;
    text-align: center !important;
  }
}

.error {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 999;
  overflow: hidden;
  .full-fixed();
}

</style>
