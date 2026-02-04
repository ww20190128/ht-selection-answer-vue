<template>
  <div class="vip-open-wrap">
    <div class="fix-content-wrap" v-if="Object.keys(priceConfig).length > 0">
      <div class="price-wrap">
        <div class="left">
          <span class="price">￥{{ getPrice(currentSubjectType) }}</span>
          <span
            class="original-price"
            v-if="
              getPrice(currentSubjectType) !=
              getOriginalPrice(currentPackageId, currentSubjectType)
            "
            >原价￥{{
              getOriginalPrice(currentPackageId, currentSubjectType)
            }}</span
          >
        </div>
        <div class="right">
          <span class="desc"> {{ getPeople }}人已经购买</span>
        </div>
      </div>
      <div class="select-wrap">
        <div
          class="item"
          :class="{
            current: currentPackageId === item.id,
            haveDiscountsTag: item.id == 3,
          }"
          @click="currentPackageId = item.id"
          v-for="item in priceConfig?.packageList"
          :key="item.id"
        >
          {{ item?.name }}
          <div v-if="item.id == 3" class="discounts-tag">
            <!-- <p>降价</p>
                        <p>27%</p> -->
          </div>
        </div>
      </div>
      <div class="subject-wrap">
        <div class="left" @click="vipOpenShow = true">
          <span>{{ currentSubject?.name }}</span
          >·<span>{{ currentSubjectClassify?.classify }}</span
          ><i class="fa fa-sort-down"></i>

          <router-link class="home-warp" to="/home">
            <img src="../../assets/images/icon/icon-home-on.png" />
          </router-link>
        </div>
        <div class="right">
          <div class="button" @click="handlePay">立即购买</div>
        </div>
      </div>
    </div>
    <div class="detail-wrap">
      <div class="back-wrap" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="18" />
      </div>
      <img src="@/assets/images/bg/content1.jpeg" class="img" />
      <img src="@/assets/images/bg/content2.jpeg" class="img" />
      <!-- <img src="@/assets/images/bg/content3.jpeg" class="img" /> -->
    </div>
    <!-- 科目设置弹窗 -->
    <van-popup
      v-model:show="vipOpenShow"
      round
      position="bottom"
      :style="{ width: '100%', bottom: '0px' }"
      :close-on-click-overlay="true"
      class="popup-subject-set"
      @click-close-icon="vipOpenShowCancel"
      close-icon="close"
      closeable
    >
      <div class="content-wrap">
        <div class="title-head">
          <span>订单确认</span>
        </div>

        <div class="site-wrap" @click="showAddressDialog = true">
          <div class="left">
            <i class="fa fa-map-marker"></i>
          </div>
          <div class="center">
            <div
              v-if="userInfo?.addressInfo?.name && userInfo?.addressInfo?.tel"
            >
              <span v-if="userInfo?.addressInfo?.province"
                >{{ userInfo?.addressInfo?.city }}
              </span>
              <span v-if="userInfo?.addressInfo?.county"
                >{{ userInfo?.addressInfo?.county }}
              </span>
              <span v-if="userInfo?.addressInfo?.addressDetail"
                >{{ userInfo?.addressInfo?.addressDetail }}
              </span>
            </div>
            <div v-else>请填写收货地址</div>
          </div>
          <div class="right">
            <span
              v-if="userInfo?.addressInfo?.name && userInfo?.addressInfo?.tel"
              >修改</span
            >
            <span v-else>添加</span>
          </div>
        </div>
        <span class="price">￥{{ getPrice(currentSubjectType) }}</span
        ><span
          class="original-price"
          v-if="
            getPrice(currentSubjectType) !=
            getOriginalPrice(currentPackageId, currentSubjectType)
          "
          >原价￥{{
            getOriginalPrice(currentPackageId, currentSubjectType)
          }}</span
        >
        <div class="price-desc">
          已选:<span>{{
            ["速学包+手卡", "仅速学包", "仅手卡"][currentPackage?.id - 1]
          }}</span
          ><span>{{ currentSubject?.name }}</span
          ><span>{{ currentSubjectClassify?.classify }}</span>
        </div>
        <div class="title">套餐选择</div>
        <div
          class="list-wrap"
          v-if="priceConfig?.packageList && priceConfig?.packageList.length > 0"
        >
          <div
            class="item"
            :class="{ current: currentPackageId === item.id }"
            @click="currentPackageId = item.id"
            v-for="item in priceConfig?.packageList"
            :key="item.id"
          >
            {{ item?.name }}
          </div>
        </div>
        <div class="title">选择学科</div>
        <div
          class="list-wrap"
          v-if="
            priceConfig?.subjectTypeList &&
            priceConfig?.subjectTypeList.length > 0
          "
        >
          <div
            class="item"
            :class="{ current: currentSubjectType === item.id }"
            @click="currentSubjectType = item.id"
            v-for="item in priceConfig?.subjectTypeList"
            :key="item.id"
          >
            <span>{{ item.name }}</span
            ><span class="price-sm">￥{{ getPrice(item.id) }}</span>
          </div>
        </div>
        <div class="title">选择学段</div>
        <div class="list-wrap">
          <div
            class="item"
            :class="{ current: currentSubjectClassifyId === item.id }"
            @click="currentSubjectClassifyId = item.id"
            v-for="item in subjectClassifyList"
            :key="item.id"
          >
            <span>{{ item.classify }}</span>
          </div>
        </div>
        <div class="button" @click="handlePay">
          立即支付￥{{ getPrice(currentSubjectType) }}
        </div>
      </div>
    </van-popup>
    <!-- 地址设置弹窗 -->
    <van-popup
      v-model:show="showAddressDialog"
      round
      position="center"
      :style="{ width: '90%' }"
      v-if="userInfo?.addressInfo"
    >
      <van-address-edit
        :area-list="areaList"
        :address-info="userInfo?.addressInfo"
        show-search-result
        show-area
        show-detail
        :show-set-default="false"
        :search-result="searchResult"
        show-delete
        delete-button-text="取消"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="onSaveAddress"
        @delete="showAddressDialog = false"
      />
    </van-popup>
  </div>
  <!-- PC微信扫码支付 -->
  <WeChatPayQr
    v-model:show="qrPayShow"
    :url="qrUrl"
    @confirm="qrConfirm"
    @cancel="qrConfirm"
  />
</template>
<script>
import { reactive, toRefs, computed, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useScrollBottom } from "@/hooks/useScroll";
import { useWx } from "@/hooks/useWx";
import CopyRight from "@/components/CopyRight";
import WeChatPayQr from "@/components/WeChatPayQr";
import qs from "qs";
import { getUserInfo } from "@/api/user";
import {
  saveAddress,
  createVipOrder,
  vipOrderPay,
  checkVipOrderPay,
} from "@/api/aiQuestion";
import { AddressEdit } from "vant";
import { areaList } from "@vant/area-data";
import { loadingToast } from "@/plugins/vant";
import { useAuth } from "@/hooks/useAuth";
import { useAgent } from "@/hooks/useAgent";
import { useStore } from "@/store";
import { Toast } from "vant";
import { parseQueryString } from "@/utils/tools";
export default {
  name: "vipOpened",
  components: {
    WeChatPayQr,
    CopyRight,
    loadingToast,
    "van-address-edit": AddressEdit,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      userInfo: {},
      subjectClassifyList: [],
      vipOpenShow: false,
      priceConfig: {},
      currentPackageId: 3, // 套餐类型 1 仅速学包  2 仅手卡  3  速学包 + 手卡
      currentSubjectType: 3, //  1  科目一  2  科目二  0双科
      currentSubjectClassifyId: 1, //  1  幼儿园  2  小学  3  中学
      showAddressDialog: false,
      searchResult: [],
      qrPayShow: false,
      qrUrl: "",
      timer: null,
      time: 0,
      show: false,
    });
    const { md, isWeChat, ua, network, os } = useAgent();
    const { classifyId } = route.query;
    useAuth(
      {
        authType: 1,
      },
      () => {
        useWx();
        init();
        const { fromType, orderId } = route.query;
        if (fromType === "pay") {
          state.orderId = orderId;
          poll(10);
        }
      }
    );

    // 开通VIP
    async function handlePay() {
      const loading = loadingToast("创建订单中...");
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      const { classifyId } = route.query;
      try {
        // 设备信息
        const { width, height } = window.screen;
        const deviceInfo = {
          phoneModel: "",
          browserVersion: ua,
          screenResolution: `${width}*${height}`,
          network,
          useEnv: isWeChat ? 1 : 2,
          ...route.query,
        };
        if (os == "iOS") {
          deviceInfo.phoneModel = md.os() + md.version("iPhone");
        } else if (os == "AndroidOS") {
          deviceInfo.phoneModel = md.os() + md.version("Android");
        }

        // 创建vip支付订单
        const { orderId } = await createVipOrder({
          packageId: state.currentPackageId,
          subjectType: state.currentSubjectType,
          subjectClassifyId: state.currentSubjectClassifyId,
          ...deviceInfo,
        });
        state.orderId = orderId;
        // 支付类型
        const { env } = useAgent();
        const payType = {
          "wechat-mobile": "JSAPI",
          "wechat-pc": "NATIVE",
          "browser-mobile": "NATIVE",
          // "browser-mobile": "MWEB",
          "browser-pc": "NATIVE",
        };
        const tradeType = payType[env]; // 交易类型

        const query = parseQueryString(window.location.href);
        const search = qs.stringify({
          ...query,
          fromType: "pay",
          orderId,
        });
        const redirectUrl = `${window.location.origin}/vipOpened?${search}`;

        const { info } = await vipOrderPay({
          // 订单支付
          orderId: state.orderId,
          paymentType: 1, // 微信支付
          redirectUrl,
          tradeType, // 支付类型
        });

        loading?.clear();
        switch (env) {
          case "browser-mobile": // H5支付
            window.location.replace(info.mweb_url);
            break;
          case "wechat-mobile": // 微信浏览器内支付
            wechatPay(info);
            break;
          case "wechat-pc": // 微信浏览器内支付
            qrPay(info);
            break;
          case "browser-pc": // 微信浏览器内支付
            qrPay(info);
        }
      } catch (error) {
        console.log(error);
        loading?.clear();
      }
    }
    function qrPay({ code_url }) {
      state.qrUrl = code_url;
      state.qrPayShow = true;
      qrPoll(180);
    }

    // 微信浏览器内支付
    function wechatPay(info) {
      WeixinJSBridge?.invoke("getBrandWCPayRequest", info, (res) => {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          goVipCenter();
        } else {
          state.show = true;
        }
      });
    }
    // PC二维码轮询
    async function qrPoll(count) {
      try {
        const { needPay } = await checkVipOrderPay({
          orderId: state.orderId,
        });
        if (needPay === 0) {
          // 已完成支付
          goVipCenter(); // 跳转支付引导页
        } else {
          //
          state.timer = window.setTimeout(() => {
            state.time++;
            if (state.time > count) {
              Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              return;
            }
            qrPoll(count);
          }, 1000);
        }
      } catch (error) {}
    }
    // 组件卸载前清除定时器
    onBeforeUnmount(() => {
      clearTimeout(state.timer);
      state.timer = null;
    });
    function qrConfirm() {
      state.qrPayShow = false;
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      qrPoll(1);
    }
    // 轮询查询支付状态
    async function poll(count, isConfirm) {
      if (!state.toast && state.time < 5) {
        state.toast = loadingToast("查询订单中...");
      }
      try {
        const { needPay } = await checkVipOrderPay({
          orderId: state.orderId,
        });
        if (needPay !== 1) {
          state.toast?.clear();
          goVipCenter();
        } else {
          state.timer = window.setTimeout(() => {
            state.time++;

            // 轮询到第5秒时清除loading 显示错误弹窗  但是继续轮询
            if (state.time === 5) {
              state.toast?.clear();
              state.toast = null;
              if (isConfirm) {
                Toast("暂未查询到支付订单，如已支付请关注公众号联系客服处理");
              } else {
                state.show = true;
              }
            }
            if (state.time > count) {
              return;
            }
            poll(count, isConfirm);
          }, 1000);
        }
      } catch (error) {
        state.toast?.clear();
      }
    }

    // 已完成支付
    async function confirm() {
      clearTimeout(state.timer);
      state.timer = null;
      state.time = 0;
      poll(5, true);
    }
    // 取消
    function cancel() {
      state.show = false;
    }
    // 获取分类列表
    async function init() {
      const {
        subjectClassifyList,
        userInfo,
        classifyList0,
        classifyList1,
        recommend,
        priceConfig,
      } = await getUserInfo();
      state.subjectClassifyList = subjectClassifyList;
      state.userInfo = userInfo;
      state.priceConfig = priceConfig;
    }

    function vipOpenShowCancel() {
      state.vipOpenShow = false;
    }
    // 获取商品的
    const currentPackage = computed(() => {
      return state.priceConfig.packageList.find(
        (v) => v.id == state.currentPackageId
      );
    });
    const currentSubject = computed(() => {
      if (Object.keys(state.priceConfig).length <= 0) {
        return;
      }
      return state.priceConfig.subjectTypeList.find(
        (v) => v.id == state.currentSubjectType
      );
    });
    const currentSubjectClassify = computed(() => {
      return state.subjectClassifyList.find(
        (v) => v.id == state.currentSubjectClassifyId
      );
    });

    function getPrice(subjectType) {
      let config = "";
      if (currentPackage.value.id == 3) {
        // 速学包 + 手卡
        config = state.priceConfig?.assembleList.find(
          (v) => v.subjectType == subjectType
        );
      } else if (currentPackage.value.id == 1) {
        // 速学包
        config = state.priceConfig?.contentList.find(
          (v) => v.subjectType == subjectType
        );
      } else if (currentPackage.value.id == 2) {
        // 手卡
        config = state.priceConfig?.cardList.find(
          (v) => v.subjectType == subjectType
        );
      }
      return config?.price;
    }
    // 获取原价
    function getOriginalPrice(packageId, subjectType) {
      let contentConfig1 = state.priceConfig?.contentList.find(
        (v) => v.subjectType == 1
      );
      let contentConfig2 = state.priceConfig?.contentList.find(
        (v) => v.subjectType == 2
      );
      let cardConfig1 = state.priceConfig?.cardList.find(
        (v) => v.subjectType == 1
      );
      let cardConfig2 = state.priceConfig?.cardList.find(
        (v) => v.subjectType == 2
      );
      if (packageId == 1) {
        // 速学包
        if (subjectType == 3) {
          // 双科
          return Number(contentConfig1.price) + Number(contentConfig2.price);
        } else if (subjectType == 1) {
          return Number(contentConfig1.price);
        } else if (subjectType == 2) {
          return Number(contentConfig2.price);
        }
      } else if (packageId == 2) {
        //  手卡
        if (subjectType == 3) {
          // 双科
          return Number(cardConfig1.price) + Number(cardConfig2.price);
        } else if (subjectType == 1) {
          return Number(cardConfig1.price);
        } else if (subjectType == 2) {
          return Number(cardConfig2.price);
        }
      } else if (packageId == 3) {
        //  速学包 + 手卡
        if (subjectType == 3) {
          // 双科
          return (
            Number(contentConfig1.price) +
            Number(contentConfig2.price) +
            Number(cardConfig1.price) +
            Number(cardConfig2.price)
          );
        } else if (subjectType == 1) {
          return Number(contentConfig1.price) + Number(cardConfig1.price);
        } else if (subjectType == 2) {
          return Number(contentConfig2.price) + Number(cardConfig2.price);
        }
      }
      return "";
    }
    // 保存地址
    async function onSaveAddress(newAddressInfo) {
      const {
        subjectClassifyList,
        userInfo,
        classifyList0,
        classifyList1,
        recommend,
        priceConfig,
      } = await saveAddress({
        address: newAddressInfo,
      });
      state.subjectClassifyList = subjectClassifyList;
      state.userInfo = userInfo;
      state.priceConfig = priceConfig;
      state.showAddressDialog = false;
    }
    // 人数  获取秒的时间戳后5位
    const getPeople = computed(() => {
      var date = new Date();
      var timestamp = date.getTime();
      var timestamp_str = timestamp.toString();
      var timestamp_str_last6 = timestamp_str.substring(5, 8);
      return "1" + timestamp_str_last6;
    });
    return {
      getPeople,
      qrConfirm,
      confirm,
      cancel,
      handlePay,
      areaList,
      getPrice,
      getOriginalPrice,
      currentPackage,
      currentSubject,
      currentSubjectClassify,
      vipOpenShowCancel,
      ...toRefs(state),
      onSaveAddress,
    };
  },
};
</script>

<style lang="less" scoped>
.popup-subject-set {
  .content-wrap {
    padding: 0px 20px 20px 20px;
    width: 100%;

    .title-head {
      text-align: center;
      font-size: 20px;
      line-height: 40px;
      font-weight: bold;
    }

    .site-wrap {
      margin-top: 20px;
      overflow: hidden;

      color: @gray-color;
      width: 100%;
      background-color: #f6f7f9;
      border-radius: 10px;
      display: flex;
      .space-between();
      padding: 10px 10px;

      span {
        font-size: @font-size-sm;
      }

      .left {
        i {
          margin-right: 5px;
          color: #fd4d4d;
          opacity: 0.7;
        }
      }

      .center {
        flex: 1;

        span {
          margin-left: 5px;
        }
      }

      .right {
        text-align: right;
        width: 40px;
        font-size: 11px;
      }
    }

    .price {
      margin-top: 20px;
      font-size: @font-size-lg;
      color: red;
      font-weight: bold;
      line-height: 30px;
    }

    .original-price {
      margin-left: 5px;
      font-size: 11px;
      color: @gray-color;
      text-decoration: line-through;
    }

    .price-desc {
      font-size: @font-size-sm;
      color: @gray-color;
      font-weight: bold;

      span {
        font-size: @font-size-sm;
        margin-left: 5px;
      }
    }

    .title {
      margin-top: 15px;
      font-size: @font-size-base;
      line-height: 30px;
    }

    .list-wrap {
      font-weight: 200;
      height: 25px;
      margin-top: 10px;

      .item {
        height: 100%;
        display: inline-block;
        background-color: #f7f7f7;
        padding: 0px 5px;
        border-radius: 3px;
        margin-right: 20px;
        line-height: 25px;
        color: @gray-color;
        font-size: @font-size-sm;
        border: 1px solid #f7f7f7;
        font-weight: 300;

        .price-sm {
          font-size: 11px;
        }

        &.current {
          border: 1px solid #e8767b;
          color: #e8767b;
          background-color: #fdf2ef;
        }
      }
    }

    .button {
      margin-top: 35px;
      width: 100%;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      text-align: center;
      background-color: #fd4d4d;
      border-radius: 20px;
      color: #fff;
    }
  }
}

.vip-open-wrap {
  position: relative;
  background-color: #ebf6fc;
  margin: 0 auto !important;
  width: 100%;

  .detail-wrap {
    width: 100%;
    height: auto;
    padding-bottom: 170px;
    position: relative;

    .back-wrap {
      position: absolute;
      left: 15px;
      top: 8px;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .fix-content-wrap {
    box-shadow: 0px 0px 4px #e8e8e8;
    border-radius: 15px 15px 0 0;
    padding: 10px 20px 20px 20px;
    position: fixed;
    width: 100%;
    overflow: hidden;
    bottom: 0;
    background-color: #fff;
    max-width: 380px !important;
    z-index: 999;
 

    .price-wrap {
      display: flex;
      align-items: center;
      .space-between();
      height: 50px;
      .left {
        .price {
          font-size: @font-size-lg;
          color: red;
          font-weight: bold;
        }

        .original-price {
          margin-left: 3px;
          font-size: @font-size-sm;
          color: @gray-color;
          text-decoration: line-through;
        }
      }

      .right {
        .desc {
          font-size: @font-size-sm;
          color: @gray-color;
        }
      }
    }

    .select-wrap {
      margin-top: 10px;
      height: 25px;

      .item {
        font-size: @font-size-base;
        height: 100%;
        display: inline-block;
        background-color: #f7f7f7;
        padding: 0px 5px;
        border-radius: 3px;
        margin-right: 20px;
        line-height: 25px;
        font-weight: 300;
        color: @gray-color;
        border: 1px solid #f7f7f7;

        &.current {
          border: 1px solid #e8767b;
          color: #e8767b;
          background-color: #fdf2ef;
        }

        &.haveDiscountsTag {
          margin-right: 40px;
        }

        // background-image: url("@/assets/images/icon/selected.png");
        // background-size: auto 40px;
        // background-repeat: no-repeat;
        // background-position: center center;
        position: relative;

        .discounts-tag {
          // // border: 1px solid gold;
          // overflow: hidden;
          // background-image: url("@/assets/images/icon/discounts1.png");
          // background-size: auto 30px;
          // background-repeat: no-repeat;
          // background-position: center top;
          // position: absolute;
          // top: 0;
          // right: 0px;
          // width: 30px;
          // height: 40px;
          // transform: translateX(50%) translateY(-5px);
        }
      }
    }

    .subject-wrap {
      display: flex;
      align-items: center;
      .space-between();
      height: 40px;
      line-height: 40px;
      margin-top: 30px;

      .left {
        flex: 1;
        font-size: @font-size-sm;
        position: relative;

        i {
          margin-left: 5px;
          color: @gray-color;
          transform: translateY(-3px);
        }

        .home-warp {
          position: absolute;
          right: 40px;
          top: 0;
          width: auto;
          height: 100%;
          flex: 1;
          display: flex;
          align-items: center;

          img {
            width: auto;
            height: 20px;
          }
        }
      }

      .right {
        width: 50%;

        .button {
          width: 100%;
          height: 40px;
          font-size: 16px;
          line-height: 40px;
          text-align: center;
          background-color: #fe4a4b;
          border-radius: 20px;
          color: #fff;
        }
      }
    }
  }
}
</style>
