<template>
  <div class="suggest-wrap">
    <div class="title-wrap">投诉建议</div>

    <div class="content-wrap">
      <div>
        <p class="no-indent">尊敬的学员：</p>
        <p>
          我们非常重视每一位学员的反馈与体验，如果您在使用我们的课程或享受服务过程中遇到了任何问题，或对我们的服务有任何不满与投诉，我们诚挚地邀请您通过以下渠道向我们提出，我们将迅速响应并积极处理您的投诉。
        </p>
      </div>
      <div class="apply-wrap">
        <div class="head">投诉反馈</div>
        <!-- 手机号栏 只允许输入手机号 -->
        <div class="from-wrap">
          <div class="input-item">
            <van-field
              v-model="applyFrom.phone"
              rows="1"
              autosize
              type="tel"
              placeholder="手机号"
              maxlength="11"
              :rules="[
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
              ]"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.weChat"
              rows="1"
              autosize
              type="textarea"
              placeholder="微信（选填）"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.nickname"
              rows="1"
              autosize
              type="textarea"
              placeholder="姓名（选填）"
            />
          </div>
          <div class="input-item">
            <van-field
              v-model="applyFrom.accounts"
              rows="2"
              autosize
              type="textarea"
              placeholder="投诉建议"
            />
          </div>
        </div>
        <div
          class="button"
          :class="{ 'show-submit': applyFrom.phone || applyFrom.weChat }"
          @click="handleSubmit"
        >
          提交
        </div>
      </div>
    </div>

    <div class="content-wrap">
      <p class="no-indent">投诉处理流程</p>
      <p class="no-indent">
        1. 接收投诉: 收到您的投诉后，我们会立即进行登记并确认投诉内容。
      </p>
      <p class="no-indent">
        2. 初步核守: 我们团队对投诉内突进行初步核实，了解具体情况。
      </p>
      <p class="no-indent">
        3. 沟通反馈:
        在核实过程中，我们可能会与您联系，进一步了解问题细节，并告知处理进度。
      </p>
      <p class="no-indent">
        4. 解决方案:
        根据投诉内容，我们会制定相应的解决方案，并尽快与您沟通确认。
      </p>
      <p class="no-indent">
        5. 执行与跟踪:
        确认解决方案后，我们将迅速执行，并持续跟踪处理结果，确保问题得到妥善解决。
      </p>
      <p class="no-indent">
        6. 满意度调查:
        问题解决后，我们会邀请您参与满意度调查，以便我们不断改进服务质量。
      </p>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { Toast } from "vant";
import { useStore } from "@/store";

import { recordParam } from "@/api/app";
export default {
  name: "suggest",
  components: {},
  setup() {
    document.title = "投诉建议";
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
    async function handleSubmit() {
      try {
        await recordParam({
          phone: state.applyFrom.phone,
          nickname: state.applyFrom.nickname,
          weChat: state.applyFrom.weChat,
          accounts: state.applyFrom.accounts,
        });
        Toast("登记成功！");
      } catch (error) {}
    }
    return {
      ...toRefs(state),
      handleSubmit
    };
  },
};
</script>

<style lang="less" scoped>
.apply-wrap {
  width: calc(100% - 40px);
  margin: 10px auto;
  .head {
    width: 100%;
    height: 30px;
    background: linear-gradient(135deg, #4158d0, #c850c0);
    border-radius: 10px 10px 0 0;
    position: relative;
    font-size: 15px;
    text-align: center;
    color: #ebe6e6;
    line-height: 30px;
    font-weight: 400;
    &:before {
      content: "";
      display: block;
      height: 10px;
      width: 10px;
      border-radius: 50px;
      background-color: #68b0f3;
      border: 1px solid #fff;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    &::after {
      content: "";
      display: block;
      height: 10px;
      width: 10px;
      border-radius: 50px;
      background-color: #c850c0;
      border: 1px solid #fff;
      position: absolute;
      left: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .from-wrap {
    border-left: 1px solid #ebe6e6;
    border-right: 1px solid #ebe6e6;
    padding: 0 10px;
    .input-item {
      font-size: 11px;
      border-bottom: 1px solid #ebe6e6;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .button {
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
    color: #fff;
    border-radius: 0 0 10px 5px;
    &.show-submit {
      background: linear-gradient(135deg, #317cf5, #317cf5);
    }
  }
}
.suggest-wrap {
  padding: 10px 20px 20px 20px;
  background: #fff;
  .title-wrap {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  .content-wrap {
    font-size: 14px;
    line-height: 2;
    p {
      margin-bottom: 10px;
      text-indent: 1.4em;
      &.no-indent {
        text-indent: 0 !important;
      }
    }
  }
}
</style>
