<template>
    <BaseDialog v-bind="$attrs" :showConfirmButton="false">
        <div class="dialog-content">

            <img src="@/assets/images/icon/remind.gif">
            <div class="text">
                <slot>
                </slot>
            </div>

            <div class="button-wrap button1-wrap" @click="confirm1">
                <slot name="button1">
                </slot>
            </div>
            <div class="button-wrap button2-wrap" @click="confirm2">
                <slot name="button2">
                </slot>
                <div class="tag" v-if="showTag">福利</div>
            </div>
            <div class="icon" @click="close">
                <van-icon name="close" color="#898989" />
            </div>
        </div>
    </BaseDialog>
</template>

<script>
import BaseDialog from '@/components/BaseDialog'
export default {
    components: { BaseDialog },
    props: {
        showTag: {
            type: Boolean,
            default: false,
        },

    },
    setup(props, cxt) {
        function close() {
            cxt.emit("update:show", false);
        }
        function confirm1() {
            cxt.emit("confirm1");
        }
        function confirm2() {
            cxt.emit("confirm2");
        }
        return {
            close,
            confirm1,
            confirm2,
        };
    },
};
</script>

<style lang="less" scoped>
.dialog-content {
    padding: 0px 30px 30px 30px;
    font-size: @font-size-base;
    position: relative;
    text-align: center;
    background-color: #D9EEFF;

    img {
        width: 120px;
    }

    .button-wrap {
        height: 38px;
        margin-top: @padding-base;
        line-height: 38px;
        border-radius: 38px;
        font-size: 18px;

        &.button1-wrap {
            color: #fff;
            background-color: #18DCB6;
        }

        &.button2-wrap {
            color: @light-black;
            margin-top: 20px;
            background-color: #F6F7F9;
            position: relative;

        }

        &.button3-wrap {
            margin-top: 20px;
        }
    }

    .tag {
        position: absolute;
        right: -5px;
        top: -5px;
        height: 20px;
        width: 35px;
        line-height: 20px;
        text-align: center;
        border-radius: 10px;
        color: #fff;
        background-color: red;
        font-size: 12px;
    }

    .text {
        color: @light-black;
        font-size: @font-size-base;
        text-align: left;
        padding-bottom: @padding-base;
        line-height: 25px;
    }

    .icon {
        font-weight: bold;
        font-size: 20px;
        position: absolute;
        top: 15px;
        right: 15px;
        color: #000;
    }
}
</style>