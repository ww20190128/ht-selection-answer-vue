<template>
  <div class="privacy-policy-wrap">
    <div class="title-wrap">《AI智题库售后服务协议》</div>
    <div class="content-wrap">
      <p class="title">一、服务范围</p>
      <div>
        <p>适用产品：比邻科技 “AI 智题库”</p>
        <p>小程序及配套学习服务（含题库更新、智能测评、课程关联功能）。</p>
        <p>服务对象：购买产品会员、付费课程或增值服务的学员。</p>
      </div>

      <p class="title">二、服务内容 技术支持</p>
      <div>
        <p>
          7×12小时（9:00-21:00）在线客服响应，解决账号登录、题库使用、系统报错等技术问题；
        </p>
        <p>
          定期推送系统升级通知，保障刷题功能、AI 测评算法持续优化。 内容保障；
        </p>
        <p>题库真题实时更新，同步教师资格证考试大纲变化；</p>
        <p>
          付费课程配套解析视频、考点笔记等资料终身可查（会员有效期内）。
          售后反馈
        </p>
        <p>
          设立专属反馈通道（公众号内
          “意见反馈”或客服邮箱），48小时内响应学员建议；
        </p>
        <p>每季度开展用户调研，根据反馈优化产品功能。</p>
      </div>

      <p class="title">三、服务流程</p>
      <div>
        <p>
          问题提交：学员通过公众号客服或电话提交问题，需提供订单号、账号信息及问题描述；
        </p>
        <p>响应时效： 技术故障：2 小时内初步响应，24 小时内出具解决方案；</p>
        <p>内容咨询：1个工作日内答疑；</p>
        <p>售后跟进：问题解决后 24小时内回访，确认学员满意度。</p>
      </div>

      <p class="title">四、免责条款</p>
      <div>
        <p>
          因学员个人设备故障、网络问题或非官方渠道登录导致的服务异常，公司不承担责任；
        </p>
        <p>
          产品会员到期未续费、账号违规使用（如共享、倒卖）时，售后服务自动终止；
        </p>
        <p>
          不可抗力（如政策变更、系统攻击）导致的服务中断，公司将及时修复但不承担赔偿。
        </p>
      </div>
      <p class="title">五、联系方式</p>
      <div>
        <p>服电话：13971198127（工作日 9:00-21:00）</p>
      </div>
      <p class="title">六、协议说明</p>
      <div>
        <p>
          本协议自学员购买产品起生效，最终解释权归武汉爱彼邻科技有限公司所有。服务条款调整时，将通过小程序公告或短信通知学员。
        </p>
        <p>本平台非常重视保护您的个人隐私。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";

import { useStore } from "@/store";
export default {
  name: "privacyPolicy",
  components: {},
  setup() {
    document.title = "隐私政策";
    const store = useStore();
    const state = reactive({
      applyFrom: {
        phone: "",
        nickname: "",
        weChat: "",
        accounts: "",
      },
    });
    onMounted(async () => {});
    const wechatInfo = computed(() => store.getters.wechatInfo);

    return {
      ...toRefs(state),
      wechatInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.privacy-policy-wrap {
  padding: 10px 20px 20px 20px;
  background: #fff;
  .title-wrap {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .content-wrap {
    font-size: 14px;
    line-height: 2;
    p {
      margin-bottom: 10px;

      &.no-indent {
        text-indent: 0 !important;
      }
    }
  }
}
</style>
