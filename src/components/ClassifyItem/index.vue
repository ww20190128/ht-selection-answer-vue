<template>
  <div class="classify-Item-wrap" v-if="item?.id">
    <div
      class="top-wrap"
      :class="{ objective1: item.type == 2, spread: spread }"
      @click="spread = !spread"
    >
      <!--  v-show="item.type != 1" -->
      <div class="left">
        <div class="icon">
          <i class="fa fa-angle-up" v-if="spread"> </i
          ><i class="fa fa-angle-down" v-else> </i>
        </div>
      </div>
      <div class="center">
        <div class="name">{{ item.name }}</div>
      </div>
    </div>

    <div
      class="sub-list-wrap"
      v-if="item?.subList && item?.subList?.length > 0 && spread == 1"
      :class="{ objective1: item.type == 1 }"
    >
      <div
        class="sub-item"
        v-for="subItem in item?.subList"
        :key="item.id"
        @click="handleItem(subItem)"
      >
        <div class="left">
          <div class="icon"></div>
        </div>
        <div class="center">
          <div class="name">{{ subItem?.typeName }}</div>
          <div class="tag" :class="{ 'required ': 1 }">
            共{{ subItem?.questionNum }}题
          </div>
        </div>
        <div class="right">
          <div class="common">
            <div class="pk-button">投票</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { reactive, toRefs } from "vue";
export default {
  name: "ClassifyItem",
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      spread: 0,
    });
    function handleItem({ id, treeId }) {
      router.push({
        path: "/pk",
        query: {
          treeId: treeId,
          type: id,
        },
      });
    }

    return {
      handleItem,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.classify-Item-wrap {
  background-color: #ffff;
  width: 100%;
  margin-top: 10px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  padding: 10px 10px 10px 5px;
  border-radius: 10px;

  .fa-check {
    color: #51d5b7 !important;
  }

  .top-wrap {
    height: 30px;
    width: 100%;
    display: flex;
    align-items: center;
    .space-between();
    position: relative;

    &.objective {
      padding-left: 10px !important;

      &::after {
        display: none !important;
      }
    }

    &.spread {
      &::after {
        z-index: 10;
        content: "";
        display: block;
        height: 30px;
        width: 1px;
        background-color: #d4f5f2;
        opacity: 0.4;
        position: absolute;
        left: 15px;
        bottom: -7px;
        transform: translateY(50%) translateX(-50%);
      }
    }

    .left {
      height: 100%;
      text-align: center;
      width: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 2;

      .icon {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        text-align: center;
        background-color: #d4f5f2;
        // opacity: 0.5;
        font-size: 11px;

        i {
          color: #60c5bd;

          &.fa-angle-up {
            transform: translateY(-1px);
          }
        }
      }
    }

    .center {
      text-align: left;
      flex: 1;
      font-size: @font-size-base;
      font-weight: bold;
      display: flex;
      align-items: center;

      .name {
        display: inline-block;
        font-size: @font-size-lg;
        font-weight: bold;
      }

      .tag {
        display: inline-block;
        font-size: 10px;
        background-color: #f7f7f7;
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: 5px;
        color: @gray-color;
        border: 1px solid #f7f7f7;
      }

      .stage-user-tag {
        display: inline-block;
        font-size: 10px;
        background-color: #d4f5f2;
        opacity: 0.7;
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: 5px;
        color: #51d5b7;
      }
    }

    .right {
      text-align: center;
      font-size: @font-size-sm;
      color: @gray-color;

      .tag {
        display: inline-block;
        font-size: 10px;
        background-color: #f7f7f7;
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: 5px;
        color: @gray-color;
      }
    }
  }

  // 关卡信息
  .stage-wrap {
    padding-left: 30px;
    color: @gray-color;

    .tag-list-wrap {
      height: 25px;
      width: 100%;
      display: flex;
      align-items: center;

      .score-tag,
      type_desc-tag {
        display: inline-block;
        background-color: #f7f7f7;
        padding: 0px 5px;
        border-radius: 2px;
        font-size: 10px;
      }

      .type_desc-tag {
        margin-left: 5px;
        font-size: 10px;
      }
    }

    .desc-wrap {
      line-height: 25px;
    }
  }

  // 子类
  .sub-list-wrap {
    position: relative;
    width: 100%;

    &.objective {
      padding-left: 10px !important;

      &::after {
        display: none !important;
      }
    }

    .sub-item {
      color: @gray-color;
      height: 55px;
      width: 100%;
      .space-between();
      position: relative;

      &:not(:last-child) {
        &::after {
          z-index: 1;
          content: "";
          display: block;
          height: 55px;
          width: 1px;
          background-color: #d4f5f2;
          opacity: 0.4;
          position: absolute;
          left: 15px;
          bottom: 25px;
          transform: translateY(100%) translateX(-50%);
        }
      }

      .left {
        text-align: center;
        height: 100%;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;

        .icon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          text-align: center;
          background-color: #d4f5f2;
        }
      }

      &:not(:last-child) {
        .center,
        .right {
          border-bottom: 1px solid #fafafa;
        }
      }

      .center {
        height: 100%;
        text-align: left;
        flex: 1;
        font-size: @font-size-base;
        font-weight: bold;
        display: flex;
        align-items: center;

        .name {
          display: inline-block;
          font-size: 13px;
          font-weight: 400;
        }

        .tag {
          height: 15px;
          line-height: 15px;
          display: inline-block;
          font-size: 10px;
          background-color: #f7f7f7;
          padding: 0px 2px;
          border-radius: 3px;
          margin-left: 5px;
          color: @gray-color;
          font-weight: 300;

          &.required {
            background-color: #d4f5f2 !important;
          }
        }
      }

      .right {
        height: 100%;
        text-align: center;
        font-size: @font-size-sm;
        color: @gray-color;
        display: flex;
        justify-content: center;
        align-items: center;

        .common {
          width: 50px;

          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 400;

          .point-info {
            font-weight: 300;
            font-size: @font-size-sm;

            .complete {
              font-size: @font-size-sm;
            }
          }
          .pk-button {
            padding: 2px 5px;
            font-size: 12px;
            background-color: #51d5b7;
            border-radius: 20px;
            color: #fff;
          }

          i {
            margin-left: 8px;
          }
        }

        .button {
          border: 1px solid #51d5b7;
          height: 20px;
          line-height: 20px;
          text-align: center;
          padding: 0px 5px;
          background-color: #51d5b7;
          border-radius: 20px;
          color: #fff;
          font-size: @font-size-sm;

          .complete {
            font-size: @font-size-sm;
          }
        }
      }
    }
  }
}
</style>
