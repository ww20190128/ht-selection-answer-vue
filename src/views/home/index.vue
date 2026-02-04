<template>
  <div class="home-wrap">
    <div class="head-wrap">
      <div class="info-wrap" v-if="userInfo">
        <div class="item">
          <div class="num-wrap">
            <span class="current"> {{ userInfo?.userSelectionNum }} </span> /
            <span class="max"> {{ userInfo?.selectionLimit }}</span>
          </div>
          <p class="text">已投票</p>
        </div>
        <div class="item">
          <div class="num-wrap">
            <span class="current"> {{ userInfo?.userSelectionTodayNum }}</span
            ><span class="max">次</span>
          </div>
          <p class="text">今日投票</p>
        </div>
        <!-- <div class="item">
          <div class="num-wrap">
            <span class="current"> {{ userInfo?.userSelectionNum }}</span
            ><span class="max"> 次</span>
          </div>
          <p class="text">累积参评</p>
        </div> -->
      </div>
    </div>

    <div class="contenter-wrap">
      <div
        class="recommend-wrap"
        v-if="recommend && !titleIsFixed"
        :class="{ is_fixed: isFixed }"
        id="boxFixed"
      >
        <div class="name">快速投票</div>
        <div class="content">
          <div class="left">
            {{ recommend.treeName }} | {{ recommend.typeName }}
          </div>
          <div
            class="right"
            @click="handleRcommend(recommend)"
            v-if="userInfo?.userSelectionNum < userInfo?.selectionLimit"
          >
            投票
          </div>
        </div>
      </div>
      <div class="content-list-wrap" :class="{ 'content-fixed': isFixed }">
        <div class="title-wrap" :class="{ 'title-is-fixed': titleIsFixed }">
          <div
            class="title"
            @click="changeSwipeIndex(0)"
            :class="{ active: activeSwipeIndex === 0 }"
          >
            客观题
          </div>
          <div
            class="subhead"
            @click="changeSwipeIndex(1)"
            :class="{ active: activeSwipeIndex === 1 }"
          >
            主观题
          </div>
        </div>
        <van-swipe
          indicator-color="#6EA9FB"
          class="swipe-wrap"
          :class="{ title_is_fixed: titleIsFixed }"
          :show-indicators="false"
          @change="handleSwipe"
          ref="swiperRef"
        >
          <van-swipe-item class="item-list" key="0">
            <div class="item" v-for="item in classifyList0" :key="item.id">
              <ClassifyItem :item="item"></ClassifyItem>
            </div>
          </van-swipe-item>
          <!-- 简介 -->
          <van-swipe-item class="item-list" key="1">
            <div class="item" v-for="item in classifyList1" :key="item.id">
              <ClassifyItem :item="item"></ClassifyItem>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div class="copy-right-wrap">
        <p>2025@师资风采大赛</p>
        <!-- <p>ICP备案/许可证号：鄂ICP备2023021507号-3</p> -->
      </div>
    </div>
  </div>
</template>
<script>
import {
  reactive,
  toRefs,
  onMounted,
  inject,
  ref,
  nextTick,
  computed,
  watch,
  onBeforeUnmount,
  onActivated,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { loadingToast } from "@/plugins/vant";
import { useWx } from "@/hooks/useWx";
import { setUserSubject } from "@/api/aiQuestion";
import { getUserInfo } from "@/api/selection";
import ClassifyItem from "@/components/ClassifyItem";
import { useAuth } from "@/hooks/useAuth";
import { useEventListener } from "@/hooks/useEventListener";
import { debounce } from "lodash";
export default {
  name: "home",
  components: {
    ClassifyItem,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      activeSwipeIndex: 0,
      isFixed: false,
      offsetTop: 0,
      classifyList0: [],
      classifyList1: [],

      userInfo: {},
      recommend: {},
      subjectSetShow: false, // 显示学科设置
      titleIsFixed: false, // 标题是否固定
    });
    const { on, off } = useEventListener();
    const store = useStore();
    const wechatInfo = computed(() => store.getters.wechatInfo);
    const { userId } = route.query;
    onMounted(() => {
      init();
      on(window, "scroll", onScroll);
    });
    onBeforeUnmount(() => {
      off(window, "scroll", onScroll);
    });

    const onScroll = debounce(async () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      // state.footerButtonShow = scrollTop >= 250;
    }, 100);
    watch(
      () => state.redPacketType,
      async (val) => {}
    );

    function monitorBoxFixed() {
      const boxFixed = document.querySelector("#boxFixed");
      if (boxFixed) {
        const boxRect = boxFixed.getBoundingClientRect();
        state.isFixed = boxRect.top <= 0;
        state.titleIsFixed = boxRect.top <= 160;
      }
    }
    onActivated(() => {
      init();
      on(window, "scroll", onScroll);
    });
    // 获取分类列表
    async function init() {
      //window.addEventListener("scroll", initHeight);
      // nextTick(() => {
      //   // 获取对象相对于版面或由 offsetTop 属性指定的父坐标的计算顶端位置
      //   state.offsetTop = document.querySelector("#boxFixed")?.offsetTop; // 239
      // });

      const { userInfo, classifyList0, classifyList1, recommend } =
        await getUserInfo({ userId: userId });
      state.userInfo = userInfo;
      state.classifyList0 = classifyList0;
      state.classifyList1 = classifyList1;
      state.recommend = recommend;
    }
    // 重新加载数据
    async function reloadSubject(subjectId, force = false) {
      const { userInfo, classifyList0, classifyList1 } = await setUserSubject({
        subjectId,
      });

      state.userInfo = userInfo;
      state.classifyList0 = classifyList0;
      state.classifyList1 = classifyList1;
    }

    function handleSwipe(index) {
      state.activeSwipeIndex = index;
    }

    function initHeight() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      // state.isFixed = scrollTop - 160 > state.offsetTop ? true : false;

      console.log("scrollTop", scrollTop, state.offsetTop);

      //   state.titleIsFixed = scrollTop - 160 > state.offsetTop ? true : false;
    }
    //监听滚动事件
    window.addEventListener("scroll", function () {
      initHeight();
    });
    const swiperRef = ref(null);
    function changeSwipeIndex(index) {
      swiperRef.value.swipeTo(index);
    }

    function handleRcommend(item) {
      router.push({
        path: "/answer",
        query: {
          treeId: item.treeId,
          type: item.id,
          pkId: item?.pkId || "",
        },
      });
    }
    return {
      wechatInfo,
      ...toRefs(state),
      handleSwipe,
      changeSwipeIndex,
      swiperRef,
      initHeight,
      reloadSubject,
      handleRcommend,
    };
  },
};
</script>

<style lang="less" scoped>
.copy-right-wrap {
  text-align: center;
  padding: 10px 0;
  p {
    text-align: center;
    font-size: 12px;
    color: #8d8888;
    margin: 0;
    line-height: 20px;
  }
}
.home-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  background-color: #ebf6fc;
  margin: 0 !important;
  .popup-subject-set {
    .content-wrap {
      padding: 10px 20px 30px 20px;
      width: 100%;

      .title-head {
        font-size: 18px;
        line-height: 25px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .title {
        color: @gray-color;
        font-size: 14px;
        line-height: 40px;
      }

      .list-wrap {
        font-size: 14px;
        margin-bottom: 15px;
        font-weight: 400;
        height: 25px;

        .item {
          height: 100%;
          display: inline-block;
          background-color: #f7f7f7;
          padding: 0px 10px;
          border-radius: 3px;
          margin-right: 20px;
          line-height: 25px;

          &.current {
            color: #60c5bd;
            background-color: #d4f5f2;
          }
        }
      }

      .button {
        margin-top: 40px;
        width: 100%;
        height: 40px;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        background-color: #51d5b7;
        border-radius: 20px;
        color: #fff;
      }
    }
  }

  .head-wrap {
    position: fixed;
    background-color: #ebf6fc;
    width: 100%;
    height: 150px;
    top: 0px;

    z-index: 997;
    padding: 10px 15px;
    overflow: hidden;
    max-width: 370px !important;
    .select-wrap {
      width: 190px;
      margin: 0 auto;
      height: 30px;
      background-color: #fff;
      padding: 0 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20px;

      // box-shadow: 0px 0px 4px #e8e8e8;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex: 1;
        font-size: 14px;
        color: @gray-color;

        &:not(:last-child) {
          border-right: 1px solid #fafafa;
        }

        i {
          margin-left: 5px;
          margin-top: -5px;
        }

        &.current {
          font-weight: 400;
          color: #000;
          background-image: url("@/assets/images/icon/selected.png");
          background-size: auto 40px;
          background-repeat: no-repeat;
          background-position: center center;
        }

        &.name-wrap {
          font-size: 12px;
        }
      }
    }

    .info-wrap {
      position: relative;
      margin-top: 20px;
      width: 100%;
      height: 80px;
      box-shadow: 0 1px 6px #e8e8e8;
      border-radius: 10px;
      background-color: #e8f5fb;
      display: flex;
      border: 1px solid #f7f7f7;

      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .num-wrap {
          text-align: center;
          font-size: @font-size-base;

          .current {
            font-size: 20px !important;
            font-weight: 400;
          }

          .max {
            font-size: @font-size-base;
          }
        }

        .text {
          margin-top: 5px;
          color: @gray-color;
          text-align: center;
          font-size: 11px;
        }
      }
    }
  }

  .contenter-wrap {
    padding-top: 160px;
    width: 100%;
    position: relative;
    height: calc(100vh - 150px);

    .recommend-wrap {
      position: relative;
      margin: 0 auto;
      height: 80px;
      border-radius: 10px;
      background-color: #d2faf2;

      width: calc(100% - 20px);

      &.title-is-fixed {
        display: none;
      }

      .name {
        padding-left: 18px;
        height: 40px;
        line-height: 40px;
        width: 100%;
        font-size: @font-size-sm;
        color: #46b69a;
        font-weight: 450;
        position: relative;

        &:before {
          content: "";
          display: block;
          height: 10px;
          width: 3px;
          background-color: #17dbb4;
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translate(0, -50%);
        }
      }

      position: relative;

      .content {
        width: 100%;
        height: 55%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 10px;
        padding: 0px 10px;
        background-color: #fff;
        font-size: @font-size-base;
        .space-between();
        display: flex;
        align-items: center;

        .left {
          font-size: @font-size-base;
          font-weight: 500;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .right {
          width: 60px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #17dbb4;
          text-align: center;
          background-color: #17dbb4;
          border-radius: 15px;
          color: #ffff;
          font-size: @font-size-sm;
        }
      }
    }

    .title-wrap {
      padding-left: 15px;
      padding-top: 20px;
      height: 60px;
      background-color: #ebf6fc;
      position: relative;
      font-size: @font-size-base;
      &.title-is-fixed {
        width: 100%;
        position: fixed;
        top: 150px;
        z-index: 999;
        border: 1px solid green !important;
      }
      .title {
        display: inline-block;
      }

      .active {
        position: relative;
        font-weight: bold;
        // color: @light-black !important;
        font-size: @font-size-lg;

        &::after {
          border-radius: 2px;
          content: "";
          display: block;
          width: 80%;
          height: 8px; // 下划线的粗细
          background-color: #17dbb4; // 下划线的颜色
          opacity: 0.3;
          position: absolute;
          bottom: 1px; // 调整下划线与文字的距离
          left: 50%;
          transform: translateX(-50%);
        }
      }

      .subhead {
        margin-left: 10px;
        display: inline-block;
      }
    }

    // 滑动翻页
    .swipe-wrap {
      width: 100%;
      height: 100%;
      overflow: hidden;
      transform: translateY(0);
      background-color: transparent !important;
      &.title_is_fixed {
        margin-top: 50px;
      }

      :deep(.van-swipe__indicators) {
        bottom: 0px;
      }

      :deep(.van-swipe__indicator) {
        background-color: gray;
      }

      :deep(.van-swipe__indicator--active) {
        background-color: @theme-color;
      }
    }

    .content-list-wrap {
      &.content-fixed {
        //    margin-top: 140px;
        margin-top: 60px;
      }

      width: 100%;
      padding-bottom: 20px;

      .item-list {
        padding: 0 10px;
        scroll-behavior: smooth;
      }
    }
  }
}
</style>
