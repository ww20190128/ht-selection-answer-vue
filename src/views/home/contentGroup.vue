<template>
    <div class="content-group-wrap">
        <div class="progress-wrap">

            <div class="back-wrap" @click="handleGoBack"><van-icon name="arrow-left" size="18" /></div>
            <div class="part" v-for="it in currentConfig" :key="it.part" @click="changeSwipeIndex(it)">
                <div class="name" :class="getPartClass(it.part)" v-if="it?.part">{{
                    it.part
                }}</div>
                <div class="steps" v-if="it?.part && partModelList[it.part] && partModelList[it.part].length">
                    <template v-if="it.merge">
                        <div class="step" :class="getStepClass('', it.merge, it.part)"></div>
                    </template>
                    <template v-else>
                        <div class="step" v-for="it in partModelList[it.part]" :key="it.id"
                            :class="getStepClass(it.id)"><i class="fa fa-caret-up"></i>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div class="content-wrap">
            <van-swipe indicator-color="#6EA9FB" class="swipe-wrap" :show-indicators="false" @change="handleSwipe"
                ref="swiperRef" style="height: 100%;width: 100%;" type="card" :loop="false">
                <van-swipe-item class="swipe-item" v-for="(item, index) in list" :key="index"
                    :style="{ width: screenWidth + 'px' }">
                    <div class="material-preview"
                        :class="{ 'split': item.showSplit && item.aiPoints && item.aiPoints.length, 'small-h1': item.smallH1 }"
                        v-if="item.resourceType == '素材'">
                        <template v-if="item.showSplit && item.aiPoints && item.aiPoints.length">
                            <div class="split-box split-top">
                                <div v-for="(it, key) in formattedMaterialParagraphs(item.resourceModel)" :key="key"
                                    v-html="it"></div>
                            </div>
                            <div class="split-box split-bottom">
                                <div class="hd merge-hd" v-if="item.merge && item.stepLength > 1">
                                    <div v-for="(it, index) in partModelList[item.part]" :key="index" class="merge-tab"
                                        :class="{ 'on': it.id == item.id }" @click="handleClickMergeTab(it)">问题{{ index
                                            +
                                            1 }}考点</div>
                                </div>
                                <div class="hd" v-else>
                                    <div class="bold">对应考点</div>
                                    <div class="tips">材料和对应的考点颜色相同</div>
                                </div>
                                <div class="bd">
                                    <div v-for="(it, index) in item.aiPoints" :key="it.id"
                                        :style="'color:' + textColors[index]">
                                        {{ index + 1 }}. {{ it.name }}
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="tag" v-if="item.part == '题目'">{{ type }}</div>
                            <div v-for="(it, key) in formattedMaterialParagraphs(item.resourceModel)" :key="key"
                                v-html="it">
                            </div>
                        </template>
                    </div>
                    <div class="question-preview" :class="{ 'split': item.showSplit }"
                        v-else-if="item.resourceType == '题目' && item.resourceModel">
                        <!--需要显示材料的题目且有材料-->
                        <template v-if="item.showSplit && item.resourceModel.material">
                            <div class="split-box split-top">
                                <div class="tag" v-if="item.resourceModel?.typeInfo &&
                                    item.resourceModel?.typeInfo?.name">{{ item.resourceModel?.typeInfo &&
                                        item.resourceModel?.typeInfo?.name }}
                                </div>
                                <div class="tag" v-else-if="item.part == '题目'"> {{
                                    type }} </div>
                                <div class="tag" v-else> {{
                                    type }}</div>
                                <div class="material"
                                    v-html="decodeTag(item.resourceModel.material, item.resourceModel.imgUrlBase)">
                                </div>
                            </div>
                            <div class="split-box split-bottom">
                                <div class="hd">
                                    <div class="bold">问题</div>
                                </div>
                                <div class="bd">
                                    <div class="matter"
                                        v-html="decodeTag(item.resourceModel.matter, item.resourceModel.imgUrlBase)">
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="tag" v-if="item.resourceModel?.typeInfo &&
                                item.resourceModel?.typeInfo?.name">{{ item.resourceModel?.typeInfo &&
                                    item.resourceModel?.typeInfo?.name }}
                            </div>
                            <div class="tag" v-else-if="item.part == '题目'"> {{
                                type }} </div>
                            <div class="tag" v-else> {{
                                type }}</div>
                            <div class="matter"
                                v-html="decodeTag(item.resourceModel.matter, item.resourceModel.imgUrlBase)">
                            </div>
                            <div class="selections"
                                v-if="item.resourceModel.selections && item.resourceModel.selections.length">
                                <div class="selection" v-for="(it, key) in item.resourceModel.selections" :key="key"
                                    @click="handleOption(item.resourceModel, it.mark)"
                                    :class="{ 'correct-answer': item.resourceModel.answer.includes(it.mark) && currentOptionAnswer, 'error-answer': !item.resourceModel.answer.includes(it.mark) && currentOptionAnswer && currentOptionAnswer?.answer.includes(it.mark) }">
                                    <!-- √ x  -->
                                    <div class="selection-key" v-text="it.mark"></div>
                                    <div class="selection-value" :class="{ 'showAnswer': currentOptionAnswer }">
                                        <p class="pre-wrap"
                                            v-html="decodeTag(it.value, item.resourceModel.imgUrlBase, false)"></p>
                                    </div>

                                    <div class="selection-tag" v-if="currentOptionAnswer">
                                        <span class="correct-answer"
                                            v-if="item.resourceModel.answer.includes(it.mark)">√</span>
                                        <span class="error-answer"
                                            v-if="!item.resourceModel.answer.includes(it.mark) && currentOptionAnswer?.answer.includes(it.mark)">x</span>
                                        <!-- <i class="correct-answer fa fa-check"
                                            v-if="item.resourceModel.answer.includes(it.mark)"></i>
                                        <i class="error-answer fa fa-close"
                                            v-if="!item.resourceModel.answer.includes(it.mark) && currentOptionAnswer?.answer.includes(it.mark)"></i> -->
                                    </div>
                                </div>
                            </div>
                            <div class="box"
                                v-if="item.resourceModel.answer && currentOptionAnswer && item.resourceModel.answer != currentOptionAnswer.answer">
                                <div class="box-title">回答错误</div>
                                <div class="box-text">正确答案是<span class="answer">{{ item.resourceModel.answer }}</span>,
                                    您的答案是<span class="user-answer">{{ currentOptionAnswer.answer }}</span></div>
                            </div>
                            <div class="box desc" v-if="item.desc && currentOptionAnswer">
                                <div class="box-title">考点点拨</div>
                                <div class="box-text" v-html="item.desc"></div>
                            </div>
                        </template>
                    </div>
                </van-swipe-item>
            </van-swipe>
            <div class="control-wrap" v-if="record?.completeTime >= 0 && pointInfo?.classifyInfo?.type == 1">
                <div class="item">已完成</div>
                <div class="item">
                    <i class="fa fa-rotate-right" @click="handleReset"></i>
                    <p class="name">重学</p>
                </div>
                <div class="item" @click="handleItem" v-if="pointInfo?.nextInfo?.id">
                    <i class="fa fa-forward"></i>
                    <p class="name">下一个考点</p>
                </div>
                <!-- <i class="fa fa-wpforms"></i> -->
                <div class="item" @click="handleGoToEnd">
                    <i class="fa fa-map-o"></i>
                    <p class="name"> 查看总结</p>
                </div>
            </div>
            <div class="button" v-else-if="jumpButtonTxt" @click="handlejump">
                {{ jumpButtonTxt }}
            </div>
        </div>
    </div>
    <RemindDialog v-model:show="showRemindDialog" @confirm1="handleOpenVip" @confirm2="handleSubscribeConfirm">
        <div class="remind-content-wrap">
            <div class="name">{{ showRemindItem.name }}</div>
            <div class="desc">解锁后可学习</div>
        </div>
        <template #button1>
            <span>马上解锁</span>
        </template>
        <template #button2>
            <span>预约明天免费学</span>
        </template>
    </RemindDialog>

    <RemindDialog v-model:show="showExitRemindDialog" :showTag="false" @confirm2="handleExit"
        @confirm1="handleCancelExit">
        <div class="remind-content-wrap">
            <div class="name">坚持一下，不到一首歌的时间就可以搞定这个考点！</div>
        </div>
        <template #button1>
            <span>继续学习</span>
        </template>
        <template #button2>
            <span>一会再学</span>
        </template>
    </RemindDialog>
</template>
<script>
import { store } from "@/store"
import { reactive, toRefs, onMounted, onActivated, computed, ref, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";

import { useScrollBottom } from "@/hooks/useScroll";
import { useWx } from "@/hooks/useWx";
import CopyRight from "@/components/CopyRight";
import { getContentGroupInfo, submitAnswers, subscribePoint } from "@/api/aiQuestion";

import RemindDialog from "@/components/RemindDialog";
import { Toast } from "vant";
const textColors = [
    '#01A584',
    '#2781D5',
    '#AE6AF2',
    '#ED875B',
    '#F6C000'
]
const backgroundColors = [
    'linear-gradient(180deg, rgba(52, 229, 195, 0) 50%, rgba(37, 222, 186, .5) 100%)',
    'linear-gradient(180deg, rgba(108, 184, 255, 0) 50%, rgba(108, 184, 255, .5) 100%)',
    'linear-gradient(180deg, rgba(231, 206, 255, 0) 50%, rgba(231, 206, 255, .6) 100%)',
    'linear-gradient(180deg, rgba(255, 214, 196, 0) 50%, rgba(255, 224, 211, .7) 100%)',
    'linear-gradient(180deg, rgba(255, 243, 182, 0) 50%, rgba(255, 243, 182, .7) 100%)'
]
const groupTypeConfig = {
    '客观题': [
        {
            part: '考点技巧',
            resourceType: '素材',
            remarkName: '素材',
        },
        {
            part: '例题',
            resourceType: '题目',
            remarkId: '1',
            remarkName: '母题',
            showDesc: true,  // 显示过渡
        },
        {
            part: '举一反三',
            resourceType: '题目',
            remarkId: '2',
            remarkName: '子题',
        }
    ],
    '简答题': [
        {
            part: '题目',
            resourceType: '素材',
            remarkId: '3',
            remarkName: '题目',
            smallH1: true,
        },
        {
            part: '辅记',
            resourceType: '题目',
            remarkId: '4',
            remarkName: '辅记',
        }
    ],
    '论述题': [
        {
            part: '题目',
            resourceType: '素材',
            remarkId: '3',
            remarkName: '题目',
            smallH1: true,
        },
        {
            part: '辅记',
            resourceType: '题目',
            remarkId: '4',
            remarkName: '辅记',
        }
    ],
    '材料分析题': [
        {
            part: '题目',
            resourceType: '题目',
            remarkId: '3',
            remarkName: '题目',
            showSplit: true,
        },
        {
            part: '考点',
            resourceType: '素材',
            remarkId: '5',
            remarkName: '考点',
        },
        {
            part: '标注',
            resourceType: '素材',
            remarkId: '9',
            remarkName: '标注',
            showSplit: true,
            merge: true,  // 合并显示，在进度条处始终显示为1格
            max: 2,  // 最多配置两条，超过提醒
        },
        {
            part: '答案',
            resourceType: '素材',
            remarkId: '6',
            remarkName: '答案',
        },
        {
            part: '总结',
            resourceType: '素材',
            remarkId: '7',
            remarkName: '总结',
        }
    ],
    '辨析题': [
        {
            part: '题目',
            resourceType: '题目',
            remarkId: '3',
            remarkName: '题目',
            showSplit: true,
        },
        {
            part: '考点',
            resourceType: '素材',
            remarkId: '5',
            remarkName: '考点',
        },
        {
            part: '标注',
            resourceType: '素材',
            remarkId: '9',
            remarkName: '标注',
            showSplit: true,
        },
        {
            part: '答案',
            resourceType: '素材',
            remarkId: '6',
            remarkName: '答案',
        },
        {
            part: '总结',
            resourceType: '素材',
            remarkId: '7',
            remarkName: '总结',
        }
    ],
    '教学设计题': [
        {
            part: '题目',
            resourceType: '素材',
            remarkId: '3',
            remarkName: '题目',
        },
        {
            part: '模版',
            resourceType: '素材',
            remarkId: '8',
            remarkName: '模版',
        },
        {
            part: '答案',
            resourceType: '素材',
            remarkId: '6',
            remarkName: '答案',
        }
    ],
    '活动设计题': [
        {
            part: '题目',
            resourceType: '素材',
            remarkId: '3',
            remarkName: '题目',
        },
        {
            part: '模版',
            resourceType: '素材',
            remarkId: '8',
            remarkName: '模版',
        },
        {
            part: '答案',
            resourceType: '素材',
            remarkId: '6',
            remarkName: '答案',
        }
    ],
}
export default {
    name: "contentGroup",
    components: {
        CopyRight,
        RemindDialog
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            pointInfo: [],
            contentGroup: {},
            aiPointsMap: {},
            partModelList: [],
            currentConfig: [],
            currentSwipeIndex: 0, // 当前滑块的索引  从 0 开始
            maxPartIndex: 0,
            list: [],
            jumpButtonTxt: '下一页',
            answerList: [],// 已回答的题目
            record: {},
            screenWidth: '350',
            showRemindDialog: false,
            showRemindItem: {},
            type: '题目',
            showExitRemindDialog: false,
        });
        const { pointId, classifyId, from } = route.query;

        // 获取内容串
        async function init() {
            state.screenWidth = window.innerWidth - 40;
            const { contentGroup, contentlist, pointInfo, record } = await getContentGroupInfo({ pointId, classifyId });
            state.contentGroup = contentGroup;
            state.pointInfo = pointInfo;
            document.title = state.pointInfo?.info?.name

            if (from == 'relearn' || from == 'error') { // 重学 或 错题集
                state.answerList = [];
            } else {
                state.record = record;
                state.answerList = record?.answerList || [];
            }

            // 对内容进行排序
            const list = Object.values(contentlist)
            list.sort((a, b) => a.index - b.index)
            const object = {
                'question': '题目',
                'doc': '素材'
            }
            state.currentConfig = groupTypeConfig[state.contentGroup?.type || '客观题'] || [];
            const resourceModelList = list.reduce((result, it) => {
                const resourceModel = it.resourceModels && it.resourceModels[0] || {}
                result.push({
                    id: it.id,
                    resourceType: object[it.resourceType],
                    resourceId: it.resourceIds[0] || '',
                    resourceName: it.resourceType == 'doc' ? resourceModel.name : resourceModel.matter,
                    resourceModel: resourceModel,
                    remark: it.remark && it.remark != '0' ? it.remark : '',
                    desc: handleHtml(it.desc),
                    createTime: it.createTime,
                    index: it.index,
                    type: 'normal'
                })
                if (it.desc) {
                    result.push({
                        type: 'desc',
                        desc: handleHtml(it.desc),
                    })
                }
                return result
            }, [])
            state.partModelList = [];
            state.currentConfig.forEach(it => {
                state.partModelList[it.part] = resourceModelList.filter(item => item.type != 'desc').filter(item => {
                    return (!it.resourceType || (item.resourceType == it.resourceType)) &&
                        (!it.remarkId || (item.remark == it.remarkId))
                })
            })

            // currentConfig 中resourceType为素材且showSplit为true时，获取对应素材的AI考点列表
            let aiPointsIds = []
            state.currentConfig.forEach(it => {
                if (it.resourceType == '素材' && it.showSplit) {
                    const materialList = state.partModelList[it.part] || [];
                    const materialIds = materialList.map(it => it.resourceId)
                    aiPointsIds = aiPointsIds.concat(materialIds)
                }
            })
            // aiPointsIds.forEach(id => {
            //     if (!self.aiPointsMap[id]) {
            //         const self = this
            //         common.libraryApi({
            //             api: '/doc/' + id + '/ai/focus',
            //             type: 'GET',
            //             param: {},
            //             success(res) {
            //                 const { data = [] } = res
            //                 data.forEach(it => {
            //                     it.name = it.content
            //                 })
            //                 self.aiPointsMap[id] = data
            //                 self.aiPointsMap = JSON.parse(JSON.stringify(self.aiPointsMap))
            //             },
            //             error(errorCode) {
            //                 self.$message({
            //                     message: "" + errorCode,
            //                     type: "warning"
            //                 })
            //             }
            //         })
            //     }
            // })

            // self.isMoved = false
            // self.isLoading = false

            let result = []
            let partIndex = -1
            state.currentConfig.forEach(it => {
                if (state.partModelList[it.part] && state.partModelList[it.part].length) {
                    partIndex++
                    const partArray = state.partModelList[it.part].map((row, stepIndex) => {
                        row.part = it.part
                        row.showDesc = it.showDesc || false
                        row.smallH1 = it.smallH1 || false
                        row.merge = it.merge || false
                        row.showSplit = it.showSplit || false
                        row.stepLength = state.partModelList[it.part].length
                        row.stepIndex = stepIndex
                        row.partIndex = partIndex
                        if (it.showSplit && it.resourceType == '题目') {
                            const materialInfo = row.resourceModel.materialInfo || { material: [] }
                            row.resourceModel.material = materialInfo.material && materialInfo.material.join('<br>')
                        } else if (it.showSplit && it.resourceType == '素材') {
                            row.aiPoints = state.aiPointsMap && state.aiPointsMap[row.resourceId] || []
                        }
                        return row
                    })
                    result = result.concat(partArray)
                }
            })
            state.maxPartIndex = partIndex
            state.list = result;
        }

        function handleHtml(html) {
            // 匹配字符串中标签, 匹配并替换所有双引号前的反斜杠
            const tagReg = /<(.*?)\s(.*?)\>/g
            html = html.replace(tagReg, (match, p1) => {
                return match.replace(/\\\"/g, '"')
            })
            return html
        }

        onMounted(() => {
            init();
        });

        watch(
            () => state.currentSwipeIndex,
            () => {
                const { merge, stepLength, stepIndex, part } = state.list[state.currentSwipeIndex] || ''
                let nextIndex = state.currentSwipeIndex;
                if (merge) {
                    nextIndex = state.currentSwipeIndex + stepLength - stepIndex
                } else {
                    nextIndex++
                }
                let buttonTxt = '';
                let nextPart = ''; // 下一部分
                if (state.list[nextIndex]) {
                    nextPart = state.list[nextIndex]?.part || '';
                }
                if (nextPart == part) { // 相同
                    if (nextPart == '例题' || nextPart == '举一反三') {
                        buttonTxt = '下一题'
                    } else {
                        buttonTxt = '下一页'
                    }
                } else if (nextPart != '') { // 有下一章
                    if (nextPart == '举一反三') {
                        buttonTxt = '试试' + nextPart
                    } else {
                        buttonTxt = '学习' + nextPart
                    }
                }
                state.jumpButtonTxt = buttonTxt;

                const result = state.list[state.currentSwipeIndex]
                if (result && result.aiPoints && result.aiPoints.length) {
                    updateAiPointCss(result.aiPoints)
                }

                if (state.currentSwipeIndex == state.list.length - 1 && from != 'lookBack') { // 最后一个
                    state.jumpButtonTxt = '完成考点';
                    // setTimeout(() => {
                    //     if (from == 'error') {
                    //         router.push({
                    //             path: "/errorQuestion",
                    //             query: {
                    //                 pointId: state.pointInfo.info.id,
                    //             },
                    //         });
                    //     } else {
                    //         router.push({
                    //             path: "/complete",
                    //             query: {
                    //                 pointId: state.pointInfo.info.id, // 考点
                    //                 classifyId: classifyId, // 关卡
                    //             },
                    //         });
                    //     }

                    // }, 30000);
                }
            }
        )

        // 跳转下一栏目
        function handlejump() {
            const { merge, stepLength, stepIndex } = state.list[state.currentSwipeIndex] || ''
            let nextIndex = state.currentSwipeIndex;
            if (merge) {
                nextIndex = state.currentSwipeIndex + stepLength - stepIndex
            } else {
                nextIndex++
            }
            if (!state.list[nextIndex] && state.pointInfo?.info?.id) {
                setTimeout(() => {
                    if (from == 'error') {
                        router.push({
                            path: "/errorQuestion",
                            query: {
                                pointId: state.pointInfo.info.id,
                            },
                        });
                    } else {
                        router.push({
                            path: "/complete",
                            query: {
                                pointId: state.pointInfo.info.id, // 考点
                                classifyId: classifyId, // 关卡
                            },
                        });
                    }

                }, 500);
                return '';
            }
            const currentSwipeData = state.list[state.currentSwipeIndex] || ''
            if (currentSwipeData.resourceType == '题目' && currentSwipeData?.resourceModel?.typeInfo?.subjective != '主观题') {

                const val = state.answerList.find((v) => v.id == currentSwipeData.resourceId)
                if (!val) {
                    return Toast("请选择您的答案");
                }
            }

            state.currentSwipeIndex = nextIndex;
            swiperRef.value.swipeTo(state.currentSwipeIndex);
        }


        function getStepClass(id, merge, part) {
            const currentIds = merge ? state.partModelList[part].map(it => it.id) : [id]
            const stepIndex = state.list.findIndex(it => currentIds.includes(it.id))
            return stepIndex < state.currentSwipeIndex ? 'on' : stepIndex == state.currentSwipeIndex ? 'on current' : ''
        }

        function getPartClass(part) {
            const list = state.partModelList[part] || []
            const ids = list.map(it => it.id)
            const currentSwipeData = state.list[state.currentSwipeIndex] || ''
            return ids.includes(currentSwipeData?.id) ? 'on' : ''
        }

        function updateAiPointCss(aiPointList) {
            if (!aiPointList.length) return
            let textContent = ''
            let ueditorTextContent = ''
            aiPointList.forEach((it, index) => {
                if (it.id) {
                    // 目前只在showSplit下显示AI考点标注
                    // 如果以后新增ShowSplit场景，则新增个配置字段和类名区分是否显示AI考点标注
                    textContent += `.split aipoint[data-id="${it.id}"] { background: ${backgroundColors[index]}; } `
                    ueditorTextContent += `.split aipoint[data-id="${it.id}"] { background: ${backgroundColors[index]}; cursor: pointer; } `
                }
            })
            let style = document.getElementById('content-ai-point-style')
            if (!style) {
                style = document.createElement('style');
                style.id = 'content-ai-point-style'
                style.textContent = textContent
                document.head.appendChild(style);
            } else {
                style.textContent = textContent
            }
        }

        function formattedMaterialParagraphs(material = {}) {
            const paragraphs = material.paragraphs || []
            const quotReg = /&quot;/g
            const fontFamilyReg = /font-family:.*?;/g
            const fontSizeReg = /font-size:.*?;/g
            const lineHeightReg = /line-height:.*?;/g
            const backgroundColorReg = /background(-color)*:.*?;/g
            const paddingReg = /padding(-.*?)*:.*?;/g
            const marginReg = /margin(-.*?)*:.*?;/g
            const borderReg = /border(-.*?)*:.*?;/g
            const pReg = /\<p\s?.*?\>([\s\S]*?)\<\/p\>/g
            const divReg = /^\<div\s?.*?\>([\s\S]*?)\<\/div\>$/g
            const headReg = /\<h([1-6])\s?.*?\>([\s\S]*?)\<\/h[1-6]\>/g;
            const aiPointReg = /\<aipoint(\s?.*?)\>([\s\S]*?)\<\/aipoint\>/g
            const spanReg = /\<span(\s?.*?)\>([\s\S]*?)\<\/span\>/g

            return paragraphs.map(it => {
                let { content, type, level } = it
                let className = ''
                content = content.replace(/^(\s|html0000)+/g, '')

                // 1. 如果type=1，则按照level值添加class（h1-h6）
                if (type == 1) {
                    className = 'h' + (level + 1)
                }

                // 2. 处理原生标题标签、div标签，按p标签渲染
                content = content.replace(headReg, function (str, level, content) {
                    return '<p>' + content + '</p>'
                })

                content = content.replace(divReg, function (str, match) {
                    return className ? '<div class="' + className + '">' + match + '</div>' : '<div>' + match + '</div>'
                })

                // 3. 添加className
                content = content.replace(pReg, function (str, match) {
                    return className ? '<p class="' + className + '">' + match + '</p>' : '<p>' + match + '</p>'
                })

                // 4. 去除指定样式 font-family、font-size、line-height
                content = content.replace(quotReg, '\"')
                content = content.replace(fontFamilyReg, '')
                content = content.replace(fontSizeReg, '')
                content = content.replace(lineHeightReg, '')

                // 5. 处理表格，去除单元格背景色、padding、border、margin
                content = content.replace(backgroundColorReg, '')
                content = content.replace(paddingReg, '')
                content = content.replace(borderReg, '')
                content = content.replace(marginReg, '')

                // 6. 去掉 aipoint 标签下的span标签以及前后的\n空格
                content = content.replace(aiPointReg, function (str, attr, content = '') {
                    const spanText = content.trim().replace(spanReg, function (str2, attr2, content2) {
                        return `<span${attr2}>${content2.trim()}</span>`
                    })
                    return `<aipoint${attr}>${spanText}</aipoint>`
                })
                content = content.replace(spanReg, function (str, attr, content = '') {
                    if (content.trim() == '') {
                        return ''
                    }
                    return str
                })

                return content
            })
        }

        function handleClickMergeTab(it) {
            const currentSwipeData = state.list[state.currentSwipeIndex] || ''
            state.currentSwipeIndex += (it.stepIndex - currentSwipeData?.stepIndex)
        }
        function decodeTag(html, imgUrlBase = '', renderFormulaAsImg = true) {
            if (!html) {
                return ''
            }
            if (typeof html == 'number') {
                html = html + ''
            }

            if (typeof html != 'string' && html.join) {
                html = html.join('<br/><br/>')
            }

            let str = ''
            try {
                // json字符串处理， 目前只有简答填空答案是数组
                const array = JSON.parse(html)
                let result = ''
                array.forEach((item, index) => {
                    let trunk = item.trunk.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                    trunk = trunk.replace(/&lt;red&gt;([\s\S]*?)&lt;\/red&gt;/g, "<span class='editor-red'>$1</span>")
                    result += index + 1 + '.' + trunk + '<br/>'
                })
                str = result
            } catch (e) {
                // 其他标签处理
                str = html.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
                str = str.replace(/\u00a0/g, ' ')
                str = str.replace(/\n/g, '<br>')
                str = str.replace(/&lt;dot&gt;([\s\S]*?)&lt;\/dot&gt;/g, "<span class='editor-dot'>$1</span>")
                str = str.replace(/&lt;line&gt;([\s\S]*?)&lt;\/line&gt;/g, "<span class='editor-line'>$1</span>")
                str = str.replace(/&lt;red&gt;([\s\S]*?)&lt;\/red&gt;/g, "<span class='editor-red'>$1</span>")
                str = str.replace(/&lt;tcenter&gt;([\s\S]*?)&lt;\/tcenter&gt;/g, "<p class='editor-tcenter'>$1</p>")
                str = str.replace(/&lt;br\/?&gt;/g, "<br/>")
                str = str.replace(/&lt;img\s(.*?)&gt;/g, "<img $1>").replace(/&lt;\/img&gt;/g, "</img>")
                // 处理公式
                if (renderFormulaAsImg && imgUrlBase) {
                    // 转换成img标签
                    str = str.replace(/&lt;formula\ssrc=(.*?)&gt;.*?&lt;\/formula&gt;/g, "&lt;!--[img]$1[/img]--&gt;")
                } else {
                    // 转换成formula标签
                    str = str.replace(/&lt;formula(.*?)&gt;/g, "&lt;formula&gt;")
                }
                // 处理图片
                if (imgUrlBase) {
                    str = str.replace(/&lt;\!--\[img\](.*?)\[\/img\]--&gt;/g, function (str, group) {
                        let fileName = group.split('.')[0];
                        // 图片的存储地址
                        let subFolder =
                            (fileName.substr(0, 1).charCodeAt() +
                                fileName.substr(1, 1).charCodeAt()) %
                            8;

                        // 获取显示宽高
                        const imgInfo = {}
                        group = group.replace(/\((.+)\)/g, function (group, info) {
                            const infos = info.split(',')
                            infos.forEach(item => {
                                const attr = item.split(':')
                                if (attr[1]) {
                                    imgInfo[attr[0]] = attr[1]
                                }
                            })
                            return ''
                        })

                        // 拼接属性
                        let attr = ''
                        if (imgInfo.t == 'f') {
                            attr += imgInfo.w ? (' width=' + imgInfo.w) : ''
                            attr += imgInfo.h ? (' height=' + imgInfo.h) : ''
                        }

                        // 图片的url
                        let url = imgUrlBase + subFolder + "/" + group;
                        return "<img src='" + url + "' alt=''" + attr + " />"
                    });
                }
            }
            return str
        }

        // 滑动内容
        function handleSwipe(index) {
            const currentSwipeData = state.list[state.currentSwipeIndex] || ''
            if (currentSwipeData.resourceType == '题目' && index > state.currentSwipeIndex && currentSwipeData?.resourceModel?.typeInfo?.subjective != '主观题') {
                const val = state.answerList.find((v) => v.id == currentSwipeData.resourceId)
                if (!val) {
                    swiperRef.value.swipeTo(state.currentSwipeIndex);
                    return Toast("请选择您的答案");
                }
            }
            state.currentSwipeIndex = index;
        }

        const swiperRef = ref(null);
        function changeSwipeIndex(it) {
            const modelList = state.partModelList[it.part];
            swiperRef.value.swipeTo(modelList['0'].index - 1);
        }

        // 题目点击
        async function handleOption(item, remark) {
            const val = state.answerList.find((v) => v.id == item.id)
            if (val) { // 判断已回答列表中是否有该题目 没有则将答案及试卷id push进去
                return false
                val.answer = remark;
            } else {
                state.answerList.push({
                    id: item.id,
                    answer: remark,
                });
            }
            // 提交答案
            const { record } = await submitAnswers({
                pointId: pointId,
                classifyId: classifyId,
                answerList: state.answerList,
            });
            state.record = record;
        }

        // 当前题目答案
        const currentOptionAnswer = computed(() => {
            const currentSwipeData = state.list[state.currentSwipeIndex] || ''
            if (currentSwipeData.resourceType != '题目' || currentSwipeData?.resourceModel?.typeInfo?.subjective == '主观题') {
                return '';
            }
            return state.answerList.find((v) => v.id == currentSwipeData?.resourceId)
        })

        // 下一个考点
        function handleItem() {
            if (state?.pointInfo?.nextInfo?.id) {
                if (state?.pointInfo?.nextInfo?.lockStatus == 1) { // 锁定
                    state.showRemindItem = state?.pointInfo?.nextInfo;
                    state.showRemindDialog = true;
                    return;
                }
                router.push({
                    path: "/contentGroup",
                    query: {
                        pointId: state.pointInfo.nextInfo.id, // 考点
                        classifyId: state.pointInfo.nextInfo?.stride == 1 && state.pointInfo.nextInfo?.classifyId != 0
                            ? state.pointInfo.nextInfo?.classifyId : classifyId, // 关卡
                    },
                });
            }
        }
        // 重学
        function handleReset() {
            state.answerList = [];
            state.currentSwipeIndex = 0;
            swiperRef.value.swipeTo(state.currentSwipeIndex);
        }

        // 查看总结
        function handleGoToEnd() {
            state.currentSwipeIndex = state.list.length - 1;
            swiperRef.value.swipeTo(state.currentSwipeIndex);
        }
        async function handleOpenVip(item) {
            if (!state?.showRemindItem?.id) {
                return false;
            }
            router.push({
                path: "/vipOpened",
                query: {

                },
            });
            state.showRemindDialog = false;
        }
        async function handleSubscribeConfirm() {
            if (!state?.showRemindItem?.id) {
                return false;
            }
            const { changeSubscribe } = await subscribePoint({ 'pointId': state.showRemindItem.id });
            if (changeSubscribe == 1) {
                Toast("每日仅可预约一个，已为你更换");
            }
            state.showRemindDialog = false;
        }
        function handleCancelExit() {
            state.showExitRemindDialog = false;
        }
        function handleExit() {
            state.showExitRemindDialog = true;
            window.history.go(-1);
        }
        function handleGoBack() {
            if (state.currentSwipeIndex == state.list.length - 1 && from != 'lookBack') { // 最后一个
                window.history.go(-1);
            } else {
                state.showExitRemindDialog = true;
            }
        }
        return {
            handleGoBack,
            handleExit,
            handleCancelExit,
            handleSubscribeConfirm,
            handleOpenVip,
            handleGoToEnd,
            handleReset,
            handleItem,
            handleOption,
            ...toRefs(state),
            handleHtml,
            getStepClass,
            getPartClass,
            updateAiPointCss,
            formattedMaterialParagraphs,
            handleClickMergeTab,
            decodeTag,
            handlejump,
            handleSwipe,
            changeSwipeIndex,
            swiperRef,
            currentOptionAnswer
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

.content-group-wrap {
    position: relative;
    width: 100%;
    height: 100vh;
    background-color: #EBF6FC;
    overflow: hidden;
    padding-top: 10px;

    .progress-wrap {
        position: relative;
        width: 100%;
        height: 35px;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;

        .back-wrap {
            position: absolute;
            left: 15px;
            width: 30px;
            height: 30px;
            line-height: 30px;
        }

        .part {
            flex: 0 1 70px;
            text-align: center;

            .name {
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #666;
                margin-bottom: 3px;

                &.on {
                    border-radius: 10px;
                    color: rgba(23, 220, 182, 1);
                    background: rgba(232, 250, 248, 1);
                }
            }

            .steps {
                margin-top: 7px;
                display: flex;

                .step {
                    flex: 1;
                    height: 1.5px;
                    margin: 0 2px;
                    border-radius: 1px;
                    background: #fff;

                    i {
                        margin-top: 1px;
                        display: none;
                        font-size: 10px;
                        color: #fff;
                        vertical-align: top;
                    }

                    &.on {
                        background: linear-gradient(90deg, #33E4C2 50%, #00DCB2 100%);
                    }

                    &.current {
                        i {
                            display: block;
                            color: #33E4C2;
                        }
                    }
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

    .button {
        box-shadow: 0px 0px 4px #e8e8e8;

        position: fixed;
        bottom: 40px;
        z-index: 999;
        left: 50%;
        text-align: center;
        height: 35px;
        width: 110px;
        font-size: 14px;
        line-height: 35px;
        text-align: center;
        background-color: #51D5B7;
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

    .control-wrap {
        position: fixed;
        bottom: 40px;
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
            width: 65px;
            flex: 1;
            color: @light-black;

            &:first-child {
                font-style: italic;
                color: #51D5B7;
                font-weight: bold;
                font-size: @font-size-base;
                border-right: 1px solid #e3eeeb;
            }
        }
    }

    .content-wrap {
        position: relative;
        width: 100%;
        height: calc(100vh - 75px);

        .swipe-wrap {
            padding: 10px 0px;
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
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
                padding: 10px;
                margin: auto;
                position: relative;
                height: 100%;

                background-color: #fff;
                border-radius: 10px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    display: none;
                    /*隐藏滚动条*/
                }

                ::-webkit-scrollbar {
                    display: none;
                    /*隐藏滚动条*/
                }

                .material-preview {
                    padding: 12px 12px 45px 12px;

                    &.split {
                        height: 100%;
                        overflow-y: hidden;
                        position: relative;
                        background: #fffffe;

                        .split-top {
                            height: 100%;
                            padding-bottom: 115px;
                            overflow-y: auto;
                        }

                        .split-bottom {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 150px;
                            background: #fff;
                            padding: 18px 12px 16px 12px;
                            box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.1);
                            border-radius: 10px 10px 0 0;
                            overflow: hidden;

                            &::after {
                                position: absolute;
                                top: 6px;
                                left: 50%;
                                content: '';
                                width: 36px;
                                height: 4px;
                                margin-left: -18px;
                                border-radius: 2px;
                                background: #999;
                            }

                            .hd {
                                margin-bottom: 12px;
                                line-height: 16px;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;

                                &.merge-hd {
                                    justify-content: flex-start;
                                    margin-bottom: 10px;

                                    .merge-tab {
                                        position: relative;
                                        cursor: pointer;
                                        margin-right: 15px;
                                        color: #999;
                                        line-height: 1.4;

                                        &.on {
                                            color: #222;

                                            &::after {
                                                position: absolute;
                                                content: '';
                                                bottom: -5px;
                                                left: 50%;
                                                margin-left: -8px;
                                                width: 16px;
                                                height: 2px;
                                                border-radius: 1px;
                                                background: #17DCB6;
                                            }
                                        }
                                    }
                                }

                                .bold {
                                    font-weight: bold;
                                }

                                .tips {
                                    font-size: 11px;
                                    color: #999;
                                }
                            }

                            .bd {
                                height: calc(100% - 28px);
                                padding-bottom: 30px;
                                overflow-y: auto;
                            }
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

                    /deep/ p {
                        font-size: 13px;
                        line-height: 2;
                        margin-bottom: 8px;
                        color: #666;
                        white-space: pre-wrap;
                    }

                    /deep/ .h1 {
                        font-size: 16px;
                        font-weight: bold;
                        line-height: 2;
                        margin-bottom: 8px;
                        color: #666;
                    }

                    &.small-h1 /deep/ .h1 {
                        font-size: 15px;
                        line-height: 1.5;
                    }

                    /deep/ .h2 {
                        font-size: 13px;
                        font-weight: bold;
                        line-height: 2;
                        margin-bottom: 8px;
                        color: #666;
                        text-indent: 20px;
                        // background: url("../../../../assets/images/arrow.png") no-repeat left -3px;
                        background-size: 16px 32px;
                    }

                    /deep/ img {
                        max-width: 100%;
                        margin-top: 8px;
                        margin-bottom: 8px;

                        &:first-child {
                            margin-top: 0;
                        }

                        &:last-child {
                            margin-bottom: 0;
                        }
                    }

                    /deep/ table {
                        width: 100%;
                        max-width: 100%;
                        border-color: rgba(212, 212, 212, 1);
                        border-collapse: collapse;
                        font-size: 12px;
                        line-height: 2;
                        margin-bottom: 8px;

                        td {
                            vertical-align: middle;
                            padding: 5px;
                        }

                        p {
                            margin: 0;
                        }
                    }
                }

                .question-preview {
                    padding: 12px 12px 45px 12px;

                    &.split {
                        height: 100%;
                        overflow-y: hidden;
                        position: relative;
                        background: #fffffe;

                        .split-top {
                            height: 100%;
                            padding-bottom: 115px;
                            overflow-y: auto;
                        }

                        .split-bottom {
                            position: absolute;
                            bottom: 0;
                            left: 0;
                            width: 100%;
                            height: 150px;
                            background: #fff;
                            padding: 16px 12px 16px 12px;
                            box-shadow: 0px -4px 20px 0px rgba(0, 0, 0, 0.1);
                            border-radius: 10px 10px 0 0;
                            overflow: hidden;

                            &::after {
                                position: absolute;
                                top: 6px;
                                left: 50%;
                                content: '';
                                width: 36px;
                                height: 4px;
                                margin-left: -18px;
                                border-radius: 2px;
                                background: #999;
                            }

                            .hd {
                                margin-bottom: 12px;
                                line-height: 16px;

                                .bold {
                                    font-weight: bold;
                                }
                            }

                            .bd {
                                height: calc(100% - 28px);
                                padding-bottom: 30px;
                                overflow-y: auto;
                            }
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

                    .matter {
                        font-size: 13px;
                        color: #666;
                        line-height: 24px;
                        margin-bottom: 20px;
                    }

                    .material {
                        font-size: 13px;
                        color: #666;
                        line-height: 24px;
                    }

                    .selections {
                        margin-bottom: 20px;
                    }

                    .selection {
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
                            border: 1px solid rgba(13, 165, 135, 0.2)
                        }

                        &.error-answer {
                            background: rgba(165, 13, 119, 0.08);
                            border: 1px solid rgba(165, 13, 119, 0.2)
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

                    .box {
                        padding: 14px 10px;
                        background: rgba(246, 247, 248, 1);
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
                                content: '';
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
                                color: rgba(13, 165, 135, 1);
                            }

                            .answer,
                            .user-answer {
                                font-weight: bold;
                                margin-left: 5px;
                            }

                            .user-answer {
                                color: red;
                            }
                        }
                    }
                }
            }
        }
    }

}
</style>