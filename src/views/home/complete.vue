<template>
    <div class="complete-wrap" :class="{ 'show-info': classifyInfo?.completeNum > 0 }">
        <div class="icon">
            <img src="@/assets/images/icon/good.gif" />
        </div>
        <div class="title">
            太棒啦，已学习完本节考点
        </div>
        <div class="list-wrap" v-if="info.id && classifyInfo?.completeNum > 0">
            <div class="item">
                <div class="left">{{ info.name }}</div>
                <div class="right"><img src="@/assets/images/icon/point.png" />
                </div>
            </div>
            <div class="item" v-if="info?.completeUseTime">
                <div class="left"> {{ info.completeUseTime }}</div>
                <div class="right" v-if="classifyInfo?.completeNum > 0"><img src="@/assets/images/icon/use-time.png" />
                </div>
            </div>
            <div class="progress-wrap" v-if="classifyInfo?.name && classifyInfo?.completeNum > 0">
                <div class="info">
                    <div class="left"> {{ classifyInfo.name }}</div>
                    <div class="right">章节进度{{ classifyInfo.completeNum }}/{{ classifyInfo.pointNum }}</div>
                </div>
                <div class="progress-bar" v-if="classifyInfo?.completeNum > 0">
                    <van-progress class="progress-item" :percentage="currentPercentage" stroke-width="5"
                        :show-pivot="false" />
                </div>
            </div>
        </div>
        <div class="next-button button" v-if="nextInfo?.name" @click="handleNext()">
            开始下一节：{{ nextInfo.name }}
        </div>
        <div class="look-back-button button" @click="handleLookBack">
            回看考点
        </div>
        <div class="relearn-button button" @click="handleRelearn">
            重新学习
        </div>
    </div>
    <RemindDialog v-model:show="showRemindDialog" :showTag="true" @confirm1="handleOpenVip" @confirm2="handleSubscribeConfirm">
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
</template>
<script>
import { reactive, toRefs, onMounted, onActivated, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useScrollBottom } from "@/hooks/useScroll";
import { useWx } from "@/hooks/useWx";
import CopyRight from "@/components/CopyRight";
import { main, getPoints, getPointInfo, subscribePoint } from "@/api/aiQuestion";
import RemindDialog from "@/components/RemindDialog";
import { Toast } from "vant";
export default {
    name: "complete",
    components: {
        CopyRight,
        RemindDialog
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            classifyInfo: {},
            info: {},
            nextInfo: {},
            showRemindDialog: false,
            showRemindItem: {},
        });
        const { classifyId, pointId } = route.query;
        // 获取分类列表
        async function init() {
            const { classifyInfo, info, nextInfo } = await getPointInfo({ 'pointId': pointId, 'classifyId': classifyId });
            state.classifyInfo = classifyInfo;
            state.info = info;
            state.nextInfo = nextInfo;

            document
                .querySelector('meta[name="description"]')
                ?.setAttribute("content", state.classifyInfo?.name);
            document.title = state.classifyInfo?.name;
        }
        onMounted(() => {
            init();
        });

        function handleNext() {
            if (state?.nextInfo?.id && state.nextInfo?.classifyId) {
                if (state?.nextInfo?.lockStatus == 1) { // 锁定
                    state.showRemindItem = state?.nextInfo;
                    state.showRemindDialog = true;
                    return;
                }
                router.push({
                    path: "/contentGroup",
                    query: {
                        pointId: state.nextInfo.id,
                        classifyId: state.nextInfo.classifyId,
                    },
                });
            }


        }
        // 回顾
        function handleLookBack() {
            router.push({
                path: "/contentGroup",
                query: {
                    pointId: state.info.id,
                    classifyId: state.info.classifyId,
                    from: 'lookBack',  // 重新学习
                },
            });
        }
        // 重新学习
        function handleRelearn() {
            router.push({
                path: "/contentGroup",
                query: {
                    pointId: state.info.id,
                    classifyId: state.info.classifyId,
                    from: 'relearn',  // 重新学习
                },
            });
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
        const currentPercentage = computed(() => {
            if (state.classifyInfo?.pointNum <= 0) {
                return 0;
            }
            let value = Number(state.classifyInfo?.completeNum) * 100 / Number(state.classifyInfo.pointNum);
            return Math.round(value);
        });
        return {
            currentPercentage,
            handleOpenVip,
            handleSubscribeConfirm,
            ...toRefs(state),
            handleNext,
            handleLookBack,
            handleRelearn
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

.complete-wrap {
    width: 100%;
    padding: 120px 30px 0 30px;
    background-color: #EBF6FC;
    height: calc(100vh - 50px);

    &.show-info {
        padding: 30px 30px 0 30px;
    }

    .icon {
        margin: 0 auto;
        width: 120px;
        height: auto;
    }

    .title {
        line-height: 30px;
        font-size: @font-size-lg;
        font-weight: bold;
        text-align: center;
    }

    .list-wrap {
        background-color: #fff;
        border-radius: 10px;
        margin: 20px 0px 30px 0px;
        padding: 0px 10px 20px 10px;

        .item {
            display: flex;
            align-items: center;
            .space-between();
            height: 60px;
            border-bottom: 1px solid #fafafa;

            .left {
                flex: 1;
                font-size: @font-size-base;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .right {
                width: 30px;

                img {
                    width: 30px;
                    height: auto;
                }
            }
        }

        .progress-wrap {
            margin-top: 20px;

            .info {
                display: flex;
                align-items: center;
                .space-between();

                .left {
                    font-size: @font-size-base;
                }

                .right {
                    font-size: @font-size-sm;
                }
            }

            .progress-bar {
                margin-top: 15px;
                height: 2px;
                width: 100%;
                background-color: aquamarine;
                border-radius: 5px;
            }

        }
    }

    .button {
        text-align: center;
        height: 40px;
        width: 100%;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
        border-radius: 20px;
        font-weight: 300;
        padding: 0 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        &.next-button {
            background-color: #51D5B7;
            color: #fff;
            margin-top: 20px;
        }

        &.look-back-button {
            background-color: #fff;
            color: #51D5B7;
            margin-top: 15px;
        }

        &.relearn-button {
            margin-top: 10px;
            color: @gray-color;
        }
    }
}
</style>