<template>
  <van-overlay :show="show">
    <div class="pc-wechat-pay-wrapper">

      <img
        :src="wechatPay"
        class="pc-wechat-pay"
      >

      <div class="pc-wrapper">
        <div class="pc-title">请使用微信扫码完成支付</div>
        <VueQr
          :text="url"
          :size="250"
        />
      </div>
      <div class="pc-buttons">
        <div
          class="pc-left"
          @click="$emit('cancel')"
        >取消</div>
        <div
          class="pc-right"
          @click="$emit('confirm')"
        >已支付</div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import wechatPay from "@/assets/images/wechat-pay.png";
import VueQr from "vue-qr/src/packages/vue-qr";
export default {
  name: "WeChatPayQr",
  components: {
    VueQr,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      default: "",
    },
  },
  setup() {
    return {
      wechatPay,
    };
  },
};
</script>

<style lang="less" scoped>
.pc-wechat-pay-wrapper {
  width: 300px;
  text-align: center;
  position: fixed;
  top: 50vh;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  border-radius: 15px;
  overflow: hidden;
  img {
    width: 100%;
    vertical-align: middle;
  }

  .pc-wrapper {
   
    background-color: #fff;
    margin-top: -1px;
    .pc-title {
      padding-bottom: 20px;
      font-size: 22px;
    }
    img {
      margin-bottom: 20px;
      width: 220px;
      height: 220px;
      display: block;
    }
  }
  .pc-buttons {
    .space-between();
    border-top: 1px solid #dddddd;
    height: 50px;
    line-height: 50px;
    background-color: #ffffff;
    cursor: pointer;
    .pc-left,
    .pc-right {
      flex: 1;
      font-size: 16px;
    }
    .pc-right {
      flex: 1;
      color: #5cb655;
      border-left: 1px solid #dddddd;
    }
  }
}
</style>