<template>
  <div class="pk-wrap" :class="{ red: currentSwipeIndex }">
    <div class="progress-wrap">
      <div class="back-wrap" @click="handleGoBack">
        <van-icon name="arrow-left" size="18" />
      </div>
      <div class="head-wrap">
        <div
          class="item"
          @click="changeSwipeIndex('A')"
          :class="{
            current: currentSwipeIndex == 0,
            blue: currentSwipeIndex == 0,
          }"
        >
          <span>蓝</span>
        </div>
        <div
          class="item"
          @click="changeSwipeIndex('B')"
          :class="{
            current: currentSwipeIndex != 0,
            red: currentSwipeIndex != 0,
          }"
        >
          <span>红</span>
        </div>
      </div>
    </div>
    <div class="content-wrap">
      <van-swipe
        indicator-color="#6EA9FB"
        class="swipe-wrap"
        :show-indicators="false"
        @change="handleSwipe"
        ref="swiperRef"
        type="card"
        :loop="false"
      >
        <van-swipe-item
          class="swipe-item"
          v-for="(item, index) in questionList"
          :key="index"
        >
          <div class="question-wrap">
            <!--有材料-->
            <template v-if="item?.materialList?.length > 0">
              <div class="top-wrap">
                <van-tabs
                  v-show="item?.materialList?.length > 0"
                  v-model:active="activeMaterialIndex"
                  class="material-list-wrap tabs-wrap"
                  title-active-color="#51d5b7"
                  line-color="#51d5b7"
                  type="button"
                  @change="changeMaterial"
                >
                  <van-tab
                    v-for="(material, materialIndex) in item.materialList"
                    :key="material.id"
                    :title="
                      item.materialList.length > 1
                        ? `材料${materialIndex + 1}`
                        : '材料'
                    "
                  >
                    <div
                      class="material-wrap van-tab-wrap html-wrap"
                      v-html="decodeTag(material.content, item.imgUrlBase)"
                    ></div>
                  </van-tab>
                </van-tabs>
              </div>
              <div class="bottom-wrap">
                <!-- 复合题 -->
                <van-tabs
                  v-show="item?.matterList?.length > 0"
                  v-model:active="activeMatterIndex"
                  class="matter-list-wrap"
                  title-active-color="#51d5b7"
                  line-color="#51d5b7"
                  type="button"
                >
                  <van-tab
                    v-for="(matterItem, matterIndex) in item.matterList"
                    :key="matterItem.id"
                    :title="
                      item.matterList.length > 1
                        ? `问题${matterIndex + 1}`
                        : '题目'
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
                      <div class="title-tag" v-if="matterItem?.analyze">
                        <span>答案解析</span>
                      </div>
                      <div
                        class="html-wrap"
                        v-if="matterItem?.analyze"
                        v-html="decodeTag(matterItem.analyze, item.imgUrlBase)"
                      ></div>
                      <div class="title-tag" v-if="matterItem?.analyzeExtra">
                        <span>拓展解析</span>
                      </div>
                      <div
                        class="html-wrap"
                        v-if="matterItem?.analyzeExtra"
                        v-html="
                          decodeTag(matterItem.analyzeExtra, item.imgUrlBase)
                        "
                      ></div>
                      <div class="title-tag" v-if="matterItem?.standard">
                        <span>评分标准</span>
                      </div>
                      <div
                        class="html-wrap"
                        v-if="matterItem?.standard"
                        v-html="decodeTag(matterItem.standard, item.imgUrlBase)"
                      ></div>
                      <div class="title-tag" v-if="matterItem?.notes">
                        <span>思维导图</span>
                      </div>
                      <div
                        v-if="matterItem?.notes"
                        class="html-wrap"
                        v-html="decodeTag(matterItem?.notes, item.imgUrlBase)"
                      ></div>
                    </div>
                  </van-tab>
                </van-tabs>
                <div class="single-question-wrap">
                  <div class="tag" v-if="item?.questionTypeName">
                    {{ item?.questionTypeName }}
                  </div>
                  <div class="knowledge" v-if="item?.knowledgeName">
                    {{ item?.knowledgeName }}
                  </div>
                  <div
                    class="html-wrap"
                    v-html="decodeTag(item?.matter, item.imgUrlBase)"
                  ></div>
                  <!-- 选项 -->
                  <div
                    class="selections-wrap"
                    v-if="item?.selections && item.selections.length"
                  >
                    <div
                      class="selection-wrap"
                      v-for="(it, key) in item.selections"
                      :key="key"
                      :class="{
                        'correct-answer': item?.answer.includes(it.mark),
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
                          v-if="item?.answer.includes(it.mark)"
                          >√</span
                        >
                      </div>
                    </div>
                  </div>
                  <div class="box-wrap" v-if="item?.answer">
                    <div class="box-text">
                      答案：<span
                        class="answer"
                        v-html="decodeTag(item.answer, item.imgUrlBase, false)"
                      ></span>
                    </div>
                  </div>
                  <div class="box-wrap desc" v-if="item?.analyze">
                    <div class="box-title">解析</div>
                    <div class="box-text" v-html="item.analyze"></div>
                  </div>
                  <div class="box-wrap desc" v-if="item?.analyzeExtra">
                    <div class="box-title">拓展</div>
                    <div class="box-text" v-html="item.analyzeExtra"></div>
                  </div>
                  <div class="box-wrap desc" v-if="item?.standard">
                    <div class="box-title">评分标准</div>
                    <div class="box-text" v-html="item.standard"></div>
                  </div>
                  <div class="box-wrap desc" v-if="item?.notes">
                    <div class="box-title">思维导图</div>
                    <div class="box-text" v-html="item.notes"></div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 无材料 -->
            <template v-else>
              <div class="single-question-wrap">
                <div class="tag" v-if="item?.questionTypeName">
                  {{ item?.questionTypeName }}
                </div>
                <div class="knowledge" v-if="item?.knowledgeName">
                  {{ item?.knowledgeName }}
                </div>
                <div
                  class="html-wrap"
                  v-html="decodeTag(item?.matter, item.imgUrlBase)"
                ></div>
                <!-- 选项 -->
                <div
                  class="selections-wrap"
                  v-if="item?.selections && item.selections.length"
                >
                  <div
                    class="selection-wrap"
                    v-for="(it, key) in item.selections"
                    :key="key"
                    :class="{
                      'correct-answer': item?.answer.includes(it.mark),
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
                        v-if="item?.answer.includes(it.mark)"
                        >√</span
                      >
                    </div>
                  </div>
                </div>
                <div class="box-wrap" v-if="item?.answer">
                  <div class="box-text">
                    答案：<span
                      class="answer"
                      v-html="decodeTag(item.answer, item.imgUrlBase, false)"
                    ></span>
                  </div>
                </div>
                <div class="box-wrap desc" v-if="item?.analyze">
                  <div class="box-title">解析</div>
                  <div class="box-text" v-html="item.analyze"></div>
                </div>
                <div class="box-wrap desc" v-if="item?.analyzeExtra">
                  <div class="box-title">拓展</div>
                  <div class="box-text" v-html="item.analyzeExtra"></div>
                </div>
              </div>
            </template>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div
      class="selection-button-wrap"
      @click="handleSelection()"
      :class="{ red: currentSwipeIndex }"
      v-if="showB"
    >
      <i class="fa fa-thumbs-up" aria-hidden="true" v-if="getSelectionStatus()">
      </i>
      <i v-else class="fa fa-thumbs-o-up"></i>
    </div>
    <!-- 评比 -->
    <div class="control-wrap" v-if="selectionId && showB">
      <div class="item" @click="handleGoBack">完成</div>
      <div class="item blue">
        <i class="fa fa-thumbs-o-up" v-if="selectionId == 0"> </i>
        <i
          class="fa fa-thumbs-up"
          v-else-if="selectionId == questionList[0].id"
        ></i>
        <i
          class="fa fa-thumbs-down"
          v-else-if="selectionId == questionList[1].id"
        ></i>
        <p class="name">蓝</p>
      </div>
      <div class="item vs">VS</div>
      <div class="item red">
        <i class="fa fa-thumbs-o-up" v-if="selectionId == 0"> </i>
        <i
          class="fa fa-thumbs-up"
          v-else-if="selectionId == questionList[1].id"
        ></i>
        <i
          class="fa fa-thumbs-down"
          v-else-if="selectionId == questionList[0].id"
        ></i>
        <p class="name">红</p>
      </div>
      <div class="item" @click="handleNext">继续评</div>
    </div>
    <RemindDialog
      v-model:show="showExitRemindDialog"
      :showTag="false"
      @confirm2="handleExit"
      @confirm1="handleCancelExit"
    >
      <div class="remind-content-wrap">
        <div class="name">不要走，请投上您神圣的一票吧！</div>
      </div>
      <template #button1>
        <span>继续投票</span>
      </template>
      <template #button2>
        <span>放弃投票</span>
      </template>
    </RemindDialog>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref, watch } from "vue";
import {
  useRouter,
  useRoute,
  onBeforeRouteLeave,
  createRouter,
} from "vue-router";
import CopyRight from "@/components/CopyRight";
import { getQuestions, doSelection } from "@/api/selection";

import RemindDialog from "@/components/RemindDialog";
import { Toast } from "vant";

export default {
  name: "contentGroup",
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
      questionList: [], // 题目列表
      selectionId: 0, // 选择的题目ID
      pkId: 0, // 投票Id
      showB: false, // 是否已经显示过B题
      activeMatterIndex: 0, // 当前选中的tab索引
      activeMaterialIndex: 0, // 当前选中的材料tab索引
    });
    const { treeId, from, type, pkId } = route.query;

    // 获取内容串
    async function init() {
      state.screenWidth = window.innerWidth - 40;

      try {
        const { questionList, selectionId, selectionPKId } = await getQuestions(
          {
            treeId,
            type: type,
            pkId: pkId ? pkId : 0,
          }
        );
        // 进行排序
        state.questionList = Object.values(questionList);
        state.questionList.sort((a, b) => a.index - b.index);
        state.pkId = selectionPKId;
        state.selectionId = selectionId;
        if (from == "userPK") {
          state.showB = true;
        }
      } catch (error) {
        router.push({
          path: "/home",
        });
      }
    }

    function handleHtml(html) {
      // 匹配字符串中标签, 匹配并替换所有双引号前的反斜杠
      const tagReg = /<(.*?)\s(.*?)\>/g;
      html = html.replace(tagReg, (match, p1) => {
        return match.replace(/\\\"/g, '"');
      });
      return html;
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
    function getSelectionStatus(item) {
      if (state.selectionId == 0) {
        return false;
      }
      if (state.selectionId == state.questionList[state.currentSwipeIndex].id) {
        return true;
      }
      return false;
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

    // 滑动内容
    function handleSwipe(index) {
      state.currentSwipeIndex = index;
      state.showB = true;
      state.activeMaterialIndex = 0;
      state.activeMatterIndex = 0;
    }

    const swiperRef = ref(null);
    function changeSwipeIndex(item) {
      if (item == "A") {
        swiperRef.value.swipeTo(0);
      } else if (item == "B") {
        swiperRef.value.swipeTo(1);
        state.showB = true;
      }
    }

    function handleCancelExit() {
      state.showExitRemindDialog = false;
    }
    function handleExit() {
      state.showExitRemindDialog = true;
      window.history.go(-1);
    }

    function handleGoBack() {
      if (state.selectionId === 0) {
        state.showExitRemindDialog = true;
        return;
      }
      window.history.go(-1);
    }
    async function handleSelection() {
      const userSelectionId = state.questionList[state.currentSwipeIndex].id;
      await doSelection({
        selectionId: userSelectionId,
        pkId: state.pkId,
      });

      if (state.selectionId == 0) {
        if (state.currentSwipeIndex == 0) {
          Toast("您已投票给蓝组题目！");
        } else {
          Toast("您已投票给红组题目！");
        }
      } else {
        if (state.currentSwipeIndex == 0) {
          Toast("您将票重新投给蓝组题目！");
        } else {
          Toast("您将票重新投给红组题目！");
        }
      }
      state.selectionId = userSelectionId;
    }
    async function handleNext() {
      if (state.selectionId === 0) {
        Toast("请投票！");
        return;
      }
      const { questionList, selectionPKId } = await getQuestions({
        treeId: treeId,
        type: type,
      });
      setTimeout(() => {
        state.questionList = Object.values(questionList);
        state.questionList.sort((a, b) => a.index - b.index);
        state.selectionId = 0;
        state.currentSwipeIndex = 0;
        state.showB = false;
        state.pkId = selectionPKId;
        swiperRef.value.swipeTo(0);
        Toast("请开始新一组评论！");
      }, 500);
    }
    async function changeMaterial(index) {
      state.activeMaterialIndex = 1;
      if (index != 0) {
      //  state.activeMaterialIndex = index;
      }
    }
    return {
      handleGoBack,
      handleExit,
      handleCancelExit,
      ...toRefs(state),
      handleHtml,
      formattedMaterialParagraphs,
      decodeTag,
      handleSwipe,
      changeSwipeIndex,
      swiperRef,
      handleSelection,
      getSelectionStatus,
      handleNext,
      changeMaterial,
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
      &.blue {
        color: #51d5b7;
      }
      &.red {
        color: #ee90cf;
      }
      &.vs {
        color: #999;
        font-weight: 400 !important;
      }
    }
  }
  // 内容
  .content-wrap {
    position: relative;
    width: 100%;
    height: calc(100vh - 45px);
    .swipe-wrap {
      border-radius: 10px;
      position: relative;
      width: 100%;
      height: 100%;
      background-color: transparent !important;
      :deep(.van-swipe__indicators) {
        bottom: 0px;
      }
      :deep(.van-swipe__indicator) {
        background-color: gray;
      }
      :deep(.van-swipe__indicator--active) {
        background-color: @theme-color;
      }
      .swipe-item {
        position: relative;
        background-color: #fff;
        border-radius: 10px;

        padding-top: 10px;

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
    }
  }
}
</style>
