<template>

    <van-pull-refresh class="point-wrap" v-model="isLoading" @refresh="onRefresh"
        :loosing-text="nextClassifyInfo?.id ? '加载下一节' : '已是最后一节'" loading-text="切换下一节">
        <div class="head-wrap" v-if="classifyInfo?.id">
     
            <div class="back-wrap" @click="$router.go(-1)"><van-icon name="arrow-left" size="18" /></div>
            <div class="other-wrap">
                <div class="title">
                    <div class="name"> {{ classifyInfo.name }}</div>
                    <div class="desc" v-if="nextClassifyInfo?.id">下拉查看下一节</div>
                </div>
                <div class="info">
                    <div class="left"> 本节整理了{{ pointList.length }}个考点</div>
                    <div class="right"> {{ classifyInfo?.completeNum }} / {{ pointList.length }} </div>
                </div>
            </div>
        </div>

        <div class="item-list-wrap">
            <div class="item" v-for="item in pointList" :key="item.id" @click="handleItem(item)">
                <div class="materials" v-if="classifyInfo?.materialShow">
                    <div class="title">
                        {{ item.name }}
                    </div>
                    <div class="info">
                        <div class="left"> <span class="tag" v-if="item?.desc">{{ item.desc }}</span></div>
                        <div class="right">
                            <p class="subscribe-tag" v-if="item?.lockStatus == 1 && item?.isSubscribe == 1">已预约明日解锁
                            </p>
                            <i class="fa fa-lock" v-else-if="item?.lockStatus == 1"></i>
                            <!-- 已完成 -->
                            <i class="fa fa-check"
                                v-else-if="item?.lockStatus == 0 && item?.record?.completeTime > 0"></i>
                            <!-- 未完成 -->
                            <span class="button-tag"
                                v-else-if="item?.lockStatus == 0 && item?.record?.createTime && item?.record?.completeTime == 0">继续学习</span>
                            <i v-else class="fa fa-angle-right"></i>
                        </div>
                    </div>
                </div>
                <div class="common" v-else>
                    <div class="left">
                        <div class="name"> {{ item.name }} </div>
                        <div class="desc-tag" v-if="item?.desc"><span>{{ item?.desc }}</span> </div>
                    </div>
                    <div class="right">
                        <p class="subscribe-tag" v-if="item?.lockStatus == 1 && item?.isSubscribe == 1">已预约明日解锁</p>
                        <i class="fa fa-lock" v-else-if="item?.lockStatus == 1"></i>
                        <!-- 已完成 -->
                        <i class="fa fa-check" v-else-if="item?.lockStatus == 0 && item?.record?.completeTime > 0"></i>
                        <!-- 未完成 -->
                        <span class="button-tag"
                            v-else-if="item?.lockStatus == 0 && item?.record?.createTime && item?.record?.completeTime == 0">继续学习</span>
                        <i v-else class="fa fa-angle-right"></i>
                    </div>
                </div>
            </div>
        </div>
    </van-pull-refresh>


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
import { reactive, toRefs, onMounted, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";


import { useWx } from "@/hooks/useWx";
import CopyRight from "@/components/CopyRight";
import { main, getPoints, subscribePoint } from "@/api/aiQuestion";
import RemindDialog from "@/components/RemindDialog";
import { useScrollBottom } from "@/hooks/useScroll";
import { Toast } from "vant";
import { PullRefresh, List } from 'vant';
import 'vant/lib/pull-refresh/style';
export default {
    name: "point",
    components: {
        CopyRight,
        RemindDialog,
        'van-pull-refresh': PullRefresh,
        'van-list': List
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            classifyInfo: {},
            pointList: [],
            showRemindDialog: false, // 显示提示弹窗
            showRemindItem: {},
            prevClassifyInfo: {},
            nextClassifyInfo: {},


            isLoading: false,
        });
        const { classifyId } = route.query;
        // 获取分类列表
        async function init() {
            const { list, classifyInfo, nextClassifyInfo, prevClassifyInfo } = await getPoints({ 'classifyId': classifyId });
            state.classifyInfo = classifyInfo;

            state.nextClassifyInfo = nextClassifyInfo;
            state.prevClassifyInfo = prevClassifyInfo;
            state.pointList = list;
        }
        onMounted(() => {
            init();
        });

        function handleItem(item) {
            if (item?.lockStatus == 1) {
                if (item?.isSubscribe == 1) { // 已预约
                    Toast("考点已标记明日免费，记得明天学习哦");
                    return;
                }
                state.showRemindDialog = true;
                state.showRemindItem = item;
                return;
            }
            router.push({
                path: "/contentGroup",
                query: {
                    pointId: item?.id, // 考点
                    classifyId: classifyId, // 关卡
                },
            });
        }

        async function handleSubscribeConfirm() {
            if (!state?.showRemindItem?.id) {
                return false;
            }
            const { changeSubscribe } = await subscribePoint({ 'pointId': state.showRemindItem.id });
            if (changeSubscribe == 1) {
                Toast("每日仅可预约一个，已为你更换");
            }
            const { list, classifyInfo } = await getPoints({ 'classifyId': classifyId });
            state.classifyInfo = classifyInfo;
            state.pointList = list;
            state.showRemindDialog = false;
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
        function handlePoints({ id }) {
            router.push({
                path: "/point",
                query: {
                    classifyId: id,
                },
            });
        }

        async function onRefresh() {
            if (!state.nextClassifyInfo?.id) {
                state.isLoading = false;
                return '';
            }
            setTimeout(() => {
                router.replace({
                    path: "/point",
                    query: {
                        classifyId: state.nextClassifyInfo?.id,
                    }
                });
                state.isLoading = false;
            }, 500);
        }
        return {
            onRefresh,
            handleOpenVip,
            handleSubscribeConfirm,
            ...toRefs(state),
            handleItem,
            handlePoints
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

.point-wrap {
    position: relative;
    width: 100%;
    background-color: #EBF6FC;
    height: calc(100vh - 50px);

    .back-wrap {
        position: relative;
        width: 100%;
        height: 40px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;
        align-items: center;

        .left {
            font-size: 22px;
        }
    }


    .head-wrap {
        position: relative;
        padding: 10px 20px 10px 30px;
        width: 100%;
        .back-wrap {
            position: absolute;
            left: 2px;
            top: 10px;
            width: 30px;
            font-size: 22px;
            color: @gray-color;

            i {
                margin-top: -10px;
            }
        }

        .other-wrap {

            position: relative;

            .title {
                .space-between();
                position: relative;
                width: 100%;
                .name {
                    position: relative;
                    font-size: 20px;
                    flex: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .desc {
                    text-align: right;
                    width: 80px !important;
                    display: flex;
                    align-items: flex-end;
                    color: @gray-color;
                    font-size: 11px;
                }
            }

            .info {
                margin-top: 10px;
                .space-between();
                position: relative;
                font-size: @font-size-sm;
                color: @gray-color;
            }
        }

    }

    .item-list-wrap {
        padding: 0px 20px 20px 20px;
        width: 100%;

        .item {
            margin-top: 15px;
            border-radius: 10px;
            background-color: #fff;
            width: 100%;

            .subscribe-tag {
                font-size: 11px;
                color: red;
            }

            .fa-check {
                color: #51D5B7 !important;
            }

            .button-tag {
                padding: 2px 5px;
                background-color: #51D5B7;
                border-radius: 20px;
                font-size: @font-size-sm;
                color: #fff;
            }

            .common {
                height: 50px;
                padding-left: 10px;
                padding-right: 10px;
                .space-between();

                .left {
                    overflow: hidden;
                    text-align: left;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-content: flex-start;

                    .name {
                        font-size: @font-size-base;
                        font-weight: 300;
                    }

                    .desc-tag {
                        margin-top: 5px;

                        span {
                            font-size: 10px;
                            background-color: #F7F7F7;
                            padding: 1px 4px;
                            border-radius: 3px;
                            color: @gray-color;
                        }
                    }
                }

                .right {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    width: 60px;
                    max-width: 80px;
                    height: 100%;
                    font-size: @font-size-sm;
                    color: @gray-color;
                }
            }

            .materials {
                width: 100%;
                height: auto;
                padding: 10px;

                .title {
                    font-size: @font-size-sm;
                    line-height: 20px;
                    color: @gray-color;

                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                }

                .info {
                    margin-top: 10px;
                    .space-between();
                    font-size: @font-size-sm;
                    color: @gray-color;

                    .left {
                        .tag {
                            display: inline-block;
                            font-size: 10px;
                            background-color: #F7F7F7;
                            padding: 1px 4px;
                            border-radius: 3px;
                            color: @gray-color;
                        }
                    }

                    .right {
                        display: flex;
                        justify-content: right;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>