<template>
  <div class="pk-wrap">
    <div class="progress-wrap">
      <div class="back-wrap" @click="handleGoBack">
        <van-icon name="arrow-left" size="18" />
      </div>
    </div>
    <div class="question-wrap">
      <!--有材料-->
      <template v-if="question?.materialList?.length > 0">
        <div class="top-wrap">
          <van-tabs
            v-show="question?.materialList?.length > 0"
            v-model:active="activeMaterialIndex"
            class="material-list-wrap tabs-wrap"
            title-active-color="#51d5b7"
            line-color="#51d5b7"
            type="button"
            @change="changeMaterial"
          >
            <van-tab
              v-for="(material, materialIndex) in question.materialList"
              :key="material.id"
              :title="
                item.materialList.length > 1
                  ? `材料${materialIndex + 1}`
                  : '材料'
              "
            >
              <div
                class="material-wrap van-tab-wrap html-wrap"
                v-html="decodeTag(material.content, question.imgUrlBase)"
              ></div>
            </van-tab>
          </van-tabs>
        </div>
        <div class="bottom-wrap">
          <!-- 复合题 -->
          <van-tabs
            v-show="question?.matterList?.length > 0"
            v-model:active="activeMatterIndex"
            class="matter-list-wrap"
            title-active-color="#51d5b7"
            line-color="#51d5b7"
            type="button"
          >
            <van-tab
              v-for="(matterItem, matterIndex) in question.matterList"
              :key="matterItem.id"
              :title="
                item.matterList.length > 1 ? `问题${matterIndex + 1}` : '题目'
              "
            >
              <div class="matter-wrap van-tab-wrap">
                <div class="tag" v-if="matterItem?.questionTypeName">
                  {{ matterItem?.questionTypeName }}
                </div>
                <div class="knowledge" v-if="matterItem?.knowledgeName">
                  {{ matterItem?.knowledgeName }}
                </div>
                <!-- 题干 -->
                <div
                  class="html-wrap"
                  v-html="decodeTag(matterItem?.matter, item.imgUrlBase)"
                ></div>
              </div>
            </van-tab>
          </van-tabs>
          <div class="single-question-wrap">
            <div class="tag" v-if="question?.questionTypeName">
              {{ question?.questionTypeName }}
            </div>
            <div class="knowledge" v-if="question?.knowledgeName">
              {{ question?.knowledgeName }}
            </div>
            <div
              class="html-wrap"
              v-html="decodeTag(question?.matter, question.imgUrlBase)"
            ></div>
            <!-- 选项 -->
            <div
              class="selections-wrap"
              v-if="question?.selections && question.selections.length"
            >
              <div
                class="selection-wrap"
                v-for="(it, key) in question.selections"
                :key="key"
                :class="{
                  'correct-answer': question?.answer.includes(it.mark),
                }"
              >
                <!-- √ x  -->
                <div class="selection-key" v-text="it.mark"></div>
                <div class="selection-value">
                  <p
                    class="pre-wrap"
                    v-html="decodeTag(it.value, item.imgUrlBase, false)"
                  ></p>
                </div>

                <div class="selection-tag">
                  <span
                    class="correct-answer"
                    v-if="question?.answer.includes(it.mark)"
                    >√</span
                  >
                </div>
              </div>
            </div>
            <div class="box-wrap" v-if="question?.answer">
              <div class="box-text">
                答案：<span
                  class="answer"
                  v-html="
                    decodeTag(question.answer, question.imgUrlBase, false)
                  "
                ></span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <!-- 无材料 -->
      <template v-else>
        <div class="single-question-wrap">
          <div class="tag" v-if="question?.questionTypeName">
            {{ question?.questionTypeName }}
          </div>
          <div class="knowledge" v-if="question?.knowledgeName">
            {{ question?.knowledgeName }}
          </div>
          <div
            class="html-wrap"
            v-html="decodeTag(question?.matter, question.imgUrlBase)"
          ></div>
          <!-- 选项 -->
          <div
            class="selections-wrap"
            v-if="question?.selections && question.selections.length"
          >
            <div
              class="selection-wrap"
              v-for="(it, key) in question.selections"
              :key="key"
              :class="{
                'correct-answer': answer.includes(it.mark),
              }"
              @click="handleOption(it.mark)"
            >
              <!-- √ x  -->
              <div class="selection-key" v-text="it.mark"></div>
              <div class="selection-value">
                <p
                  class="pre-wrap"
                  v-html="decodeTag(it.value, question.imgUrlBase, false)"
                ></p>
              </div>

              <div class="selection-tag">
                <span class="correct-answer" v-if="answer.includes(it.mark)"
                  >√</span
                >
              </div>
            </div>
          </div>
          <div class="box-wrap" v-if="answer">
            <div class="box-text">
              答案：<span
                class="answer"
                v-html="decodeTag(answer, question.imgUrlBase, false)"
              ></span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="control-wrap">
      <div class="item" @click="handlePrev">上一题</div>
      <div class="item score-item">
        <!-- 最大100分 最小0分 只能为整数 -->
        <input type="number" v-model="score" min="0" max="100" />
      </div>
      <div class="item" @click="handleSubmit">提交</div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import CopyRight from "@/components/CopyRight";
import { getAnswerQuestion, doAnswer } from "@/api/selection";

import RemindDialog from "@/components/RemindDialog";
import { Toast } from "vant";

export default {
  name: "answer",
  components: {
    CopyRight,
    RemindDialog,
    Toast,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      currentSwipeIndex: 0, // 当前滑块的索引  从 0 开始
      screenWidth: "350",
      showRemindDialog: false,
      showRemindItem: {},
      showExitRemindDialog: false,
      question: {}, // 题目
      score: 0, // 答题得分
      answer: "", // 答案内容
      activeMatterIndex: 0, // 当前选中的tab索引
      activeMaterialIndex: 0, // 当前选中的材料tab索引
    });
    const { from, answerId } = route.query;

    // 获取内容串
    async function init() {
      state.screenWidth = window.innerWidth - 40;
      try {
        const { question, answer, score } = await getAnswerQuestion({
          answerId,
        });

        if (!question || !question.id) {
          router.push({
            path: "/home",
          });
          return;
        }
        // 进行排序
        state.question = question;
        state.answer = answer;
        state.score = score;
      } catch (error) {
        router.push({
          path: "/home",
        });
      }
    }

    onMounted(() => {
      init();
    });

    watch(
      () => state.currentSwipeIndex,
      () => {}
    );

    function formattedMaterialParagraphs(material = {}) {
      const paragraphs = material.paragraphs || [];
      const quotReg = /&quot;/g;
      const fontFamilyReg = /font-family:.*?;/g;
      const fontSizeReg = /font-size:.*?;/g;
      const lineHeightReg = /line-height:.*?;/g;
      const backgroundColorReg = /background(-color)*:.*?;/g;
      const paddingReg = /padding(-.*?)*:.*?;/g;
      const marginReg = /margin(-.*?)*:.*?;/g;
      const borderReg = /border(-.*?)*:.*?;/g;
      const pReg = /\<p\s?.*?\>([\s\S]*?)\<\/p\>/g;
      const divReg = /^\<div\s?.*?\>([\s\S]*?)\<\/div\>$/g;
      const headReg = /\<h([1-6])\s?.*?\>([\s\S]*?)\<\/h[1-6]\>/g;
      const aiPointReg = /\<aipoint(\s?.*?)\>([\s\S]*?)\<\/aipoint\>/g;
      const spanReg = /\<span(\s?.*?)\>([\s\S]*?)\<\/span\>/g;

      return paragraphs.map((it) => {
        let { content, type, level } = it;
        let className = "";
        content = content.replace(/^(\s|html0000)+/g, "");

        // 1. 如果type=1，则按照level值添加class（h1-h6）
        if (type == 1) {
          className = "h" + (level + 1);
        }

        // 2. 处理原生标题标签、div标签，按p标签渲染
        content = content.replace(headReg, function (str, level, content) {
          return "<p>" + content + "</p>";
        });

        content = content.replace(divReg, function (str, match) {
          return className
            ? '<div class="' + className + '">' + match + "</div>"
            : "<div>" + match + "</div>";
        });

        // 3. 添加className
        content = content.replace(pReg, function (str, match) {
          return className
            ? '<p class="' + className + '">' + match + "</p>"
            : "<p>" + match + "</p>";
        });

        // 4. 去除指定样式 font-family、font-size、line-height
        content = content.replace(quotReg, '"');
        content = content.replace(fontFamilyReg, "");
        content = content.replace(fontSizeReg, "");
        content = content.replace(lineHeightReg, "");

        // 5. 处理表格，去除单元格背景色、padding、border、margin
        content = content.replace(backgroundColorReg, "");
        content = content.replace(paddingReg, "");
        content = content.replace(borderReg, "");
        content = content.replace(marginReg, "");

        // 6. 去掉 aipoint 标签下的span标签以及前后的\n空格
        content = content.replace(
          aiPointReg,
          function (str, attr, content = "") {
            const spanText = content
              .trim()
              .replace(spanReg, function (str2, attr2, content2) {
                return `<span${attr2}>${content2.trim()}</span>`;
              });
            return `<aipoint${attr}>${spanText}</aipoint>`;
          }
        );
        content = content.replace(spanReg, function (str, attr, content = "") {
          if (content.trim() == "") {
            return "";
          }
          return str;
        });

        return content;
      });
    }

    // 题目点击
    async function handleOption(remark) {
      state.answer = remark;
    }

    // 题目点击
    async function handleSubmit() {
      if (state.answer === "") {
        Toast("请填写答案！");
        return;
      }
      if (state.score === 0) {
        Toast("请评分！");
        return;
      }
      const { nextAnswerId } = await doAnswer({
        answerId: answerId,
        answer: state.answer,
        score: state.score,
      });

      setTimeout(() => {
        router.push({
          path: "/answer",
          query: {
            answerId: nextAnswerId,
          },
        });
        Toast("请开始新一题评论！");
      }, 500);
    }
    //  返回上一题
    async function handlePrev() {
      router.go(-1);
    }
    function decodeTag(html, imgUrlBase = "", renderFormulaAsImg = true) {
      if (!html) {
        return "";
      }
      if (typeof html == "number") {
        html = html + "";
      }

      if (typeof html != "string" && html.join) {
        html = html.join("<br/><br/>");
      }

      let str = "";
      try {
        // json字符串处理， 目前只有简答填空答案是数组
        const array = JSON.parse(html);
        let result = "";
        array.forEach((item, index) => {
          let trunk = item.trunk.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
          trunk = trunk.replace(
            /&lt;red&gt;([\s\S]*?)&lt;\/red&gt;/g,
            "<span class='editor-red'>$1</span>"
          );
          result += index + 1 + "." + trunk + "<br/>";
        });
        str = result;
      } catch (e) {
        // 其他标签处理
        str = html.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
        str = str.replace(/\u00a0/g, " ");
        str = str.replace(/\n/g, "<br>");
        str = str.replace(
          /&lt;dot&gt;([\s\S]*?)&lt;\/dot&gt;/g,
          "<span class='editor-dot'>$1</span>"
        );
        str = str.replace(
          /&lt;line&gt;([\s\S]*?)&lt;\/line&gt;/g,
          "<span class='editor-line'>$1</span>"
        );
        str = str.replace(
          /&lt;red&gt;([\s\S]*?)&lt;\/red&gt;/g,
          "<span class='editor-red'>$1</span>"
        );
        str = str.replace(
          /&lt;tcenter&gt;([\s\S]*?)&lt;\/tcenter&gt;/g,
          "<p class='editor-tcenter'>$1</p>"
        );
        str = str.replace(/&lt;br\/?&gt;/g, "<br/>");
        str = str
          .replace(/&lt;img\s(.*?)&gt;/g, "<img $1>")
          .replace(/&lt;\/img&gt;/g, "</img>");
        // 处理公式
        if (renderFormulaAsImg && imgUrlBase) {
          // 转换成img标签
          str = str.replace(
            /&lt;formula\ssrc=(.*?)&gt;.*?&lt;\/formula&gt;/g,
            "&lt;!--[img]$1[/img]--&gt;"
          );
        } else {
          // 转换成formula标签
          str = str.replace(/&lt;formula(.*?)&gt;/g, "&lt;formula&gt;");
        }
        // 处理图片
        if (imgUrlBase) {
          str = str.replace(
            /&lt;\!--\[img\](.*?)\[\/img\]--&gt;/g,
            function (str, group) {
              let fileName = group.split(".")[0];
              // 图片的存储地址
              let subFolder =
                (fileName.substr(0, 1).charCodeAt() +
                  fileName.substr(1, 1).charCodeAt()) %
                8;

              // 获取显示宽高
              const imgInfo = {};
              group = group.replace(/\((.+)\)/g, function (group, info) {
                const infos = info.split(",");
                infos.forEach((item) => {
                  const attr = item.split(":");
                  if (attr[1]) {
                    imgInfo[attr[0]] = attr[1];
                  }
                });
                return "";
              });

              // 拼接属性
              let attr = "";
              if (imgInfo.t == "f") {
                attr += imgInfo.w ? " width=" + imgInfo.w : "";
                attr += imgInfo.h ? " height=" + imgInfo.h : "";
              }

              // 图片的url
              let url = imgUrlBase + subFolder + "/" + group;
              return "<img src='" + url + "' alt=''" + attr + " />";
            }
          );
        }
      }
      return str;
    }

    return {
      ...toRefs(state),
      formattedMaterialParagraphs,
      decodeTag,
      handleOption,
      handleSubmit,
      handlePrev,
    };
  },
};
</script>

<style lang="less" scoped>
.remind-content-wrap {
  text-align: center;
  font-size: 16px;
  line-height: 30px;

  .name {
    font-size: @font-size-lg;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc {
    color: @gray-color;
  }
}

.pk-wrap {
  margin: 0 auto !important;
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #ebf6fc;
  &.red {
    background-color: #fddde9 !important;
  }
  overflow: hidden;
  padding-top: 10px;
  .progress-wrap {
    position: relative;
    width: 100%;
    height: 35px;
    display: flex;
    justify-content: center;
    .back-wrap {
      position: absolute;
      left: 15px;
      width: 35px;
      height: 35px;
      line-height: 35px;
    }
    .head-wrap {
      height: 30px;
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      background-color: #fff;
      box-shadow: 0 0 6px #0000001f;
      .item {
        flex: 1;
        height: 100%;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        color: #666;
        border-radius: 15px;

        &.red {
          color: #fff;
          background-color: rgba(245, 94, 94, 0.2);
        }
        &.blue {
          background-color: rgba(81, 213, 183, 0.2);
          color: #51d5b7;
        }
        span {
          display: inline-block;
          width: 100%;
          height: 100%;
          line-height: 30px;
          border-radius: 15px;
          cursor: pointer;
          text-align: center;
        }
      }
    }
  }

  @keyframes blink {
    0% {
      left: -50px;
    }

    100% {
      left: 100%;
    }
  }
  .selection-button-wrap {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 0 6px #0000001f;
    cursor: pointer;
    border-radius: 50%;
    position: fixed;
    right: calc((100vw - 355px) / 2 + 20px);
    bottom: calc(100px + constant(safe-area-inset-bottom));
    bottom: calc(100px + env(safe-area-inset-bottom));
    z-index: 999;
    background-color: #fff;
    color: #51d5b7;
    &.red {
      color: #ee90cf;
    }
  }
  .button {
    box-shadow: 0px 0px 4px #e8e8e8;

    position: fixed;
    bottom: 15px;
    z-index: 999;
    left: 50%;
    text-align: center;
    height: 35px;
    width: 110px;
    font-size: 14px;
    line-height: 35px;
    text-align: center;
    background-color: #51d5b7;
    border-radius: 20px;
    color: #fff;
    transform: translateX(-50%);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      width: 100px;
      height: 3px;
      top: 50%;
      left: -100px;
      background-color: rgba(#fff, 0.1);
      transform: rotate(-50deg);
      animation: blink 1.3s ease-in-out 1s infinite;
    }
  }
  // 控制
  .control-wrap {
    position: fixed;
    bottom: 10px;
    z-index: 999;
    left: 50%;
    text-align: center;
    height: 40px;
    text-align: center;
    background-color: #fff;
    border-radius: 20px;
    color: #fff;
    transform: translateX(-50%);

    display: flex;
    justify-content: space-between;
    padding: 5px 5px;
    box-shadow: 0px 0px 4px #e8e8e8;

    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i {
        font-weight: 200;
        font-size: 12px;
      }

      .name {
        text-align: center;
        font-size: 11px;
        margin-top: 3px;
      }

      text-align: center;
      font-size: @font-size-sm;
      width: 55px;
      flex: 1;
      color: @light-black;
      font-style: italic;
      font-size: @font-size-base;
      font-weight: bold;

      &:first-child {
        color: #51d5b7;
        border-right: 1px solid #eee;
      }
      &:last-child {
        color: #51d5b7;
        border-left: 1px solid #eee;
      }
      &.score-item {
        input {
          width: 40px;
          height: 24px;
          text-align: center;
          border: 1px solid #eee;
          border-radius: 4px;
          font-size: @font-size-base;
        }
      }
    }
  }

  // 题目
  .question-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .van-tab-wrap {
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
        /*隐藏滚动条*/
      }
      margin-top: 10px;
      ::-webkit-scrollbar {
        display: none;
        /*隐藏滚动条*/
      }
    }
    .single-question-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0 20px 50px 20px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
        /*隐藏滚动条*/
      }
      margin-top: 10px;
      ::-webkit-scrollbar {
        display: none;
        /*隐藏滚动条*/
      }
    }
    .selections-wrap {
      margin-bottom: 20px;
      .selection-wrap {
        display: flex;
        padding: 10px 6px;
        line-height: 18px;
        align-items: center;
        border: 1px solid rgba(227, 229, 233, 1);
        border-radius: 8px;
        margin-bottom: 10px;
        color: #8a8a8a;

        &.correct-answer {
          background: rgba(13, 165, 135, 0.08);
          border: 1px solid rgba(13, 165, 135, 0.2);
        }

        &.error-answer {
          background: rgba(165, 13, 119, 0.08);
          border: 1px solid rgba(165, 13, 119, 0.2);
        }

        .selection-key {
          flex: 0 0 20px;
          margin-right: 6px;
          text-align: center;
        }

        .selection-value {
          &.showAnswer {
            padding-right: 20px;
          }
        }

        position: relative;

        .selection-tag {
          height: 100%;
          position: absolute;
          right: 0px;
          top: 0;
          width: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: 300;

          .correct-answer {
            color: rgba(13, 165, 135, 0.5);
          }

          .error-answer {
            color: rgba(165, 13, 119, 0.5);
          }
        }
      }
    }
    .box-wrap {
      padding: 14px 10px;
      // background: rgba(246, 247, 248, 1);
      border: 2px solid rgba(246, 247, 248, 1);
      border-radius: 6px;

      &.desc {
        margin-top: 20px;
      }

      .box-title {
        font-size: 13px;
        line-height: 18px;
        font-weight: 500;
        margin-bottom: 8px;
        font-weight: bold;
        position: relative;
        padding-left: 8px;

        &:before {
          content: "";
          display: block;
          height: 11px;
          width: 3px;
          background-color: rgba(13, 165, 135, 0.4);
          position: absolute;
          left: 0px;
          top: 3px;
        }
      }

      .box-text {
        font-size: 13px;
        color: #666;
        line-height: 24px;

        .answer {
          // color: rgba(13, 165, 135, 1);
        }

        .answer,
        .user-answer {
          // font-weight: bold;
          margin-left: 5px;
        }

        .user-answer {
          color: red;
        }
      }
    }
    .html-wrap {
      font-size: 13px;
      color: #666;
      line-height: 24px;
      margin-bottom: 10px;
      &::last-child {
        margin-bottom: 0 !important;
      }
    }
    .tag {
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      color: rgba(13, 165, 135, 1);
      background: rgba(210, 247, 242, 1);
      padding: 2px 4px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .knowledge {
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      color: rgba(13, 165, 135, 1);
      padding: 2px 4px;
      margin-bottom: 8px;
    }
    .title-tag {
      padding: 2px 4px;
      border-radius: 4px;
      margin-bottom: 8px;
      position: relative;
      &:before {
        content: "";
        display: block;
        height: 18px;
        width: 3px;
        background-color: #ffd427;
        position: absolute;
        left: 0px;
        top: 50%;
        transform: translateY(-50%);
      }
      span {
        color: rgba(13, 165, 135, 1);
        margin-left: 3px;
        font-weight: 500;
        font-size: 14px;
      }
    }
    .top-wrap {
      .material-list-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        .material-wrap {
          padding: 0px 10px 20px 10px;
          position: relative;
          width: 100%;
          height: 40vh !important;
        }
      }
    }
    .bottom-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50vh;
      background: #fff;
      padding: 16px 0;
      box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      &::after {
        position: absolute;
        top: 6px;
        left: 50%;
        content: "";
        width: 36px;
        height: 4px;
        margin-left: -18px;
        border-radius: 2px;
        background: #999;
      }
      .matter-list-wrap {
        position: relative;
        width: 100%;
        .matter-wrap {
          padding: 0px 10px 20px 10px;
          position: relative;
          width: 100%;
          height: 40vh;
        }
      }
    }
  }
}
</style>
