<template>
  <div class="login-wrap">
    <div class="login-container">
      <div class="logo-area">
        <div class="logo-icon">
          <i class="fa fa-graduation-cap"></i>
        </div>
        <p class="title">师资风采大赛-初赛</p>
        <h2>请用企微真实信息-登录</h2>
      </div>

      <form class="form-content" @submit.prevent="handleLogin">
        <!-- 姓名输入框 -->
        <div class="form-group">
          <!-- <label for="userName">姓名</label> -->
          <div
            class="input-wrapper"
            :class="{ focused: userNameFocused, error: userNameError }"
          >
            <i class="fa fa-user"></i>
            <input
              type="text"
              id="userName"
              v-model="userName"
              placeholder="您的真实姓名"
              required
              @focus="userNameFocused = true"
              @blur="
                userNameFocused = false;
                validateUserName();
              "
              @input="validateUserName()"
            />
          </div>
          <p class="error-text" v-if="userNameError">{{ userNameErrorMsg }}</p>
        </div>

        <!-- 工号输入框（新增验证规则） -->
        <div class="form-group">
          <!-- <label for="jobNumber">企微工号</label> -->
          <div
            class="input-wrapper"
            :class="{ focused: jobNumberFocused, error: jobNumberError }"
          >
            <i class="fa fa-id-card"></i>
            <input
              type="text"
              id="jobNumber"
              v-model="jobNumber"
              placeholder="企微工号，6位数字，如085796"
              required
              @focus="jobNumberFocused = true"
              @blur="
                jobNumberFocused = false;
                validateJobNumber();
              "
              @input="validateJobNumber()"
              minlength="6"
              maxlength="6"
            />
          </div>
          <p class="error-text" v-if="jobNumberError">
            {{ jobNumberErrorMsg }}
          </p>
        </div>

        <!-- 手机号输入框 + 发送验证码按钮 -->
        <div class="form-group">
          <!-- <label for="phone">手机号</label> -->
          <div class="input-with-btn">
            <div
              class="input-wrapper"
              :class="{ focused: phoneFocused, error: phoneError }"
            >
              <i class="fa fa-phone"></i>
              <input
                type="text"
                id="phone"
                v-model="phone"
                placeholder="企微绑定的手机号"
                required
                @focus="phoneFocused = true"
                @blur="
                  phoneFocused = false;
                  validatePhone();
                "
                @input="validatePhone()"
                maxlength="11"
              />
            </div>
            <!-- <button
              type="button"
              class="send-code-btn"
              @click="handleSendCode"
              :disabled="!canSendCode || phoneError || !phone"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : "发送验证码" }}
            </button> -->
          </div>

          <p class="error-text" v-if="phoneError">{{ phoneErrorMsg }}</p>
          <!-- <p class="hint-text" v-else>请填写真实手机号用于接收验证码</p> -->
        </div>

        <!-- 验证码输入框（新增） -->
        <div class="form-group" v-if="false">
          <label for="verifyCode">验证码</label>
          <div
            class="input-wrapper"
            :class="{ focused: verifyCodeFocused, error: verifyCodeError }"
          >
            <i class="fa fa-shield"></i>
            <input
              type="text"
              id="verifyCode"
              v-model="verifyCode"
              placeholder="收到的6位数字验证码"
              required
              @focus="verifyCodeFocused = true"
              @blur="
                verifyCodeFocused = false;
                validateVerifyCode();
              "
              @input="validateVerifyCode()"
              maxlength="6"
            />
          </div>

          <p class="error-text" v-if="verifyCodeError">
            {{ verifyCodeErrorMsg }}
          </p>
          <!-- <p class="hint-text" v-else>请输入收到的6位数字验证码</p> -->
        </div>

        <!-- 学科选择 -->
        <div class="form-group">
          <!-- <label for="subject">学科</label> -->
          <div class="select-wrapper" :class="{ focused: isSelectFocused }">
            <i class="fa fa-book"></i>
            <select
              v-model="selectedSubject"
              id="subject"
              required
              @focus="isSelectFocused = true"
              @blur="isSelectFocused = false"
            >
              <option value="" disabled selected>请选择您所属的学科</option>
              <option
                v-for="subject in subjects"
                :value="subject.id"
                :key="subject.id"
              >
                {{ subject.title }}
              </option>
            </select>
            <div class="select-arrow">
              <i class="fa fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <!-- 登录按钮 -->
        <button class="login-btn" @click="handleLogin" :disabled="isLoading">
          <span v-if="!isLoading">登录</span>
          <span v-else><i class="fa fa-spinner fa-spin"></i> 登录中...</span>
        </button>
      </form>

      <div class="footer-text">
        <p class="action">© 2025 师资风采大赛-题目投票系统</p>
        <p class="action">
          为确保投票的公平，请用真实个人信息投票，非真实信息投票无效！
        </p>
        <p class="action">
          系统使用过程中如有疑问请企微联系：基础研究总院-王伟
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { getSubjects, sendCode } from "@/api/selection";
import { useStore } from "@/store";
export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = reactive({
      // 基础信息
      userName: "", // 姓名
      jobNumber: "", // 工号
      phone: "", // 手机号
      verifyCode: "110000", // 验证码
      selectedSubject: "", // 选中的学科
      subjects: [], // 学科列表

      // 状态控制
      isLoading: false,
      isSelectFocused: false,
      // 每个输入框单独的聚焦状态（修复原共用状态问题）
      userNameFocused: false,
      jobNumberFocused: false,
      phoneFocused: false,
      verifyCodeFocused: false,

      // 错误信息
      userNameError: false,
      userNameErrorMsg: "",
      jobNumberError: false,
      jobNumberErrorMsg: "",
      phoneError: false,
      phoneErrorMsg: "",
      verifyCodeError: true,
      verifyCodeErrorMsg: "",

      // 验证码倒计时
      countdown: 0,
      canSendCode: true, // 是否允许发送验证码
    });

    // 表单是否整体有效（用于控制登录按钮禁用状态）
    const isFormValid = ref(false);

    // 初始化学科列表
    async function init() {
      try {
        const { knowledgeTreeList } = await getSubjects();
        state.subjects = knowledgeTreeList || [];
      } catch (error) {
        Toast("获取学科列表失败，请刷新页面重试");
      }
    }

    onMounted(() => {
      init();
    });

    // 验证姓名（支持少数民族姓名，2-20个字符，可包含汉字和·）
    function validateUserName() {
      const _userName = state.userName.trim();
      // 允许汉字和·，长度2-20个字符
      const nameReg = /^[\u4e00-\u9fa5·]{2,10}$/;
      // 确保·不能出现在开头或结尾，且不能连续出现
      const invalidDotReg = /^·|·$|·{2,}/;

      if (!_userName) {
        state.userNameError = false;
        state.userNameErrorMsg = "";
        updateFormValid();
        return true;
      }

      if (!nameReg.test(_userName) || invalidDotReg.test(_userName)) {
        state.userNameError = true;
        state.userNameErrorMsg = "请输入2~10个汉字的真实姓名";
        updateFormValid();
        return false;
      } else {
        state.userNameError = false;
        state.userNameErrorMsg = "";
        updateFormValid();
        return true;
      }
    }
    // 验证工号（6位数字，最大090000）
    function validateJobNumber() {
      const _jobNumber = state.jobNumber.trim();
      const numReg = /^\d{6}$/; // 6位数字

      if (!_jobNumber) {
        state.jobNumberError = false;
        state.jobNumberErrorMsg = "";
        updateFormValid();
        return true;
      }
      if (!numReg.test(_jobNumber)) {
        state.jobNumberError = true;
        state.jobNumberErrorMsg = "工号必须为0开头的6位数字";
        updateFormValid();
        return false;
      }

      // 检查是否超过最大限制（090000 → 90000）
      if (Number(_jobNumber) > 90000) {
        state.jobNumberError = true;
        state.jobNumberErrorMsg = "整输入正确的工号";
        updateFormValid();
        return false;
      }
      state.jobNumberError = false;
      state.jobNumberErrorMsg = "";
      updateFormValid();
      return true;
    }

    // 验证手机号（11位数字，以1开头）
    function validatePhone() {
      const _phone = state.phone.trim();
      const phoneReg = /^1\d{10}$/; // 手机号规则
      if (!_phone) {
        state.phoneError = false;
        state.phoneErrorMsg = "";
        updateFormValid();
        return true;
      }
      if (!phoneReg.test(_phone)) {
        state.phoneError = true;
        state.phoneErrorMsg = "请输入正确的11位手机号";
        updateFormValid();
        return false;
      }

      state.phoneError = false;
      state.phoneErrorMsg = "";
      updateFormValid();
      return true;
    }

    // 验证验证码（6位数字）
    function validateVerifyCode() {
      const code = state.verifyCode.trim();
      const codeReg = /^\d{6}$/; // 6位数字

      if (!code) {
        state.verifyCodeError = false;
        state.verifyCodeErrorMsg = "";
        updateFormValid();
        return true;
      }

      if (!codeReg.test(code)) {
        state.verifyCodeError = true;
        state.verifyCodeErrorMsg = "验证码必须为6位数字";
        updateFormValid();
        return false;
      }

      state.verifyCodeError = false;
      state.verifyCodeErrorMsg = "";
      updateFormValid();
      return true;
    }

    // 更新表单整体有效性
    function updateFormValid() {
      isFormValid.value =
        !state.userNameError &&
        !state.jobNumberError &&
        !state.phoneError &&
        state.userName.trim() &&
        state.jobNumber.trim() &&
        state.phone.trim() &&
        state.selectedSubject;
    }

    // 发送验证码
    async function handleSendCode() {
      // 先验证手机号
      if (!validatePhone() || state.phoneError) {
        Toast("请输入正确的手机号");
        return;
      }
      // 禁用发送按钮
      state.canSendCode = false;
      state.countdown = 60; // 60秒倒计时

      try {
        await sendCode({ phone: state.phone.trim() });
        Toast("验证码已发送，请注意查收");

        // 倒计时逻辑
        const timer = setInterval(() => {
          state.countdown--;
          if (state.countdown <= 0) {
            clearInterval(timer);
            state.canSendCode = true;
          }
        }, 1000);
      } catch (error) {
        Toast("发送失败，请重试");
        state.canSendCode = true;
        state.countdown = 0;
      }
    }

    // 登录处理
    async function handleLogin() {
      // 全量验证
      const isUserNameValid = validateUserName();
      const isJobNumberValid = validateJobNumber();
      const isPhoneValid = validatePhone();
      if (!isUserNameValid || !isJobNumberValid || !isPhoneValid) {
        Toast("请填写真实的信息");
        return;
      }

      if (!state.selectedSubject) {
        Toast("请选择您的学科");
        return;
      }

      state.isLoading = true;

      try {
        // 调用登录接口
        await store.dispatch("user/login", {
          userName: state.userName.trim(),
          jobNumber: state.jobNumber.trim(),
          phone: state.phone.trim(),
          subject: state.selectedSubject,
        });

        // 登录成功跳转
        router.push({
          path: "/home",
          query: {
            userName: state.userName.trim(),
            jobNumber: state.jobNumber.trim(),
            subject: state.selectedSubject,
            userId: store.state.user.userId || 0,
          },
        });
      } catch (error) {
        Toast(error || "登录失败，请稍后再试");
      } finally {
        state.isLoading = false;
      }
    }

    return {
      ...toRefs(state),
      isFormValid,
      handleLogin,
      handleSendCode,
      validateUserName,
      validateJobNumber,
      validatePhone,
      validateVerifyCode,
    };
  },
};
</script>

<style lang="less" scoped>
@primary-color: #409eff;
@secondary-color: #66b1ff;
@text-color: #333;
@light-text-color: #606266;
@border-color: #dcdfe6;
@bg-color: #f5f7fa;
@error-color: #f56c6c;
@btn-gray: #c0c4cc;

.login-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eaf2 100%);
  padding: 10px 20px;

  .login-container {
    width: 100%;
    max-width: 400px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
    }
    .title {
      margin-bottom: 5px;
      text-align: center;
      color: #409eff;
      font-weight: 600;
      font-size: 16px;
    }
    .logo-area {
      text-align: center;
      .logo-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(
          135deg,
          @primary-color 0%,
          @secondary-color 100%
        );
        border-radius: 50%;
        margin: 0 auto 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
      }

      h2 {
        color: @text-color;
        font-size: 20px;
        font-weight: 600;
      }
    }

    .form-content {
      padding: 10px 30px 30px;
      .form-group {
        margin-bottom: 5px;
        label {
          display: block;
          color: @light-text-color;
          font-size: 14px;
          margin-bottom: 8px;
          font-weight: 500;
        }

        // 手机号输入框+发送按钮容器
        .input-with-btn {
          display: flex;
          gap: 10px;
          align-items: center;

          .input-wrapper {
            flex: 1; // 输入框占主要宽度
          }

          .send-code-btn {
            width: 110px;
            height: 35px;
            border-radius: 8px;
            border: 1px solid @primary-color;
            background-color: transparent;
            color: @primary-color;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s;

            &:not(:disabled):hover {
              background-color: @primary-color;
              color: white;
            }

            &:disabled {
              border-color: @btn-gray;
              color: @btn-gray;
              cursor: not-allowed;
            }
          }
        }

        // 提示文本样式
        .hint-text {
          margin: 5px 0 0;
          font-size: 12px;
          color: #909399;
          line-height: 1.5;
        }

        // 错误提示样式
        .error-text {
          margin: 5px 0 0;
          font-size: 12px;
          color: @error-color;
          line-height: 1.5;
        }

        .input-wrapper,
        .select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          border: 1px solid @border-color;
          border-radius: 8px;
          padding: 0 15px;
          transition: all 0.3s;

          &:hover {
            border-color: darken(@border-color, 10%);
          }

          &.focused {
            border-color: @primary-color;
            box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          }

          // 错误状态样式
          &.error {
            border-color: @error-color;
            &.focused {
              box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.2);
            }
          }

          i {
            color: #a7a9af;
            width: 20px;
            margin-right: 10px;
            transition: color 0.3s;
          }

          input,
          select {
            flex: 1;
            height: 44px;
            border: none;
            outline: none;
            font-size: 16px;
            color: @text-color;
            background-color: transparent;

            &::placeholder {
              color: #c0c4cc;
            }
          }

          select {
            appearance: none;
            padding-right: 30px;
            background: none;
            font-size: 16px;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }

          select::-webkit-scrollbar {
            display: none; /* 隐藏滚动条 */
          }

          select::-webkit-calendar-picker-indicator {
            display: none;
          }

          select:-internal-list-box {
            border: none !important;
            box-shadow: none !important;
            outline: none !important;
          }

          select option {
            border: none;
            font-size: 16px;
            height: 40px;
            padding: 10px;
            outline: none !important;
          }

          .select-arrow {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            transition: transform 0.3s;

            i {
              color: @light-text-color;
              font-size: 12px;
            }
          }
        }
      }

      .login-btn {
        width: 100%;
        height: 48px;
        background: linear-gradient(
          135deg,
          @primary-color 0%,
          @secondary-color 100%
        );

        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
        box-shadow: 0 5px 15px rgba(64, 158, 255, 0.3);
        text-align: center;
        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(64, 158, 255, 0.4);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 3px 10px rgba(64, 158, 255, 0.3);
        }

        &:disabled {
          background: #e0efff;
          color: #a0cfff;
          cursor: not-allowed;
          box-shadow: none;
        }
      }
      span {
        text-align: center !important;
      }
    }

    .footer-text {
      padding: 15px 10px;
      text-align: center;
      color: #909399;
      font-size: 12px;
      border-top: 1px solid #f5f7fa;
      .action {
        color: @primary-color;
        font-size: 12px;
        padding-bottom: 5px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
    border-radius: 12px;
  }

  .logo-area {
    padding: 30px 20px 15px !important;
  }

  .form-content {
    padding: 15px 20px 25px !important;
  }

  .logo-icon {
    width: 60px !important;
    height: 60px !important;
    font-size: 28px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  .form-group {
    margin-bottom: 15px !important;
  }

  .input-wrapper,
  .select-wrapper {
    padding: 0 10px !important;
  }

  .input-with-btn {
    gap: 5px !important;

    .send-code-btn {
      width: 90px !important;
      font-size: 12px !important;
    }
  }

  input,
  select {
    height: 40px !important;
    font-size: 14px !important;
  }

  .login-btn {
    height: 44px !important;
    font-size: 15px !important;
  }
}
</style>
