<template>
  <div class="user-pk-wrap">
    <div class="top-wrap">
      <div class="info-wrap">
        <div class="left item">
          <div class="title">累积投票</div>
          <div class="info">
            <span class="num">{{ userInfo?.userSelectionNum || 0 }}</span
            ><span class="unit">次</span>
          </div>
        </div>
        <div class="right item">
          <div class="title">今日投票</div>
          <div class="info">
            <span class="num">{{ userInfo?.userSelectionTodayNum || 0 }}</span
            ><span class="unit">次</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-wrap">
      <!--  @click="handleItem(item?.id)" -->
      <div class="item" v-for="item in list" :key="item.id">
        <div
          class="classify-top"
          @click="item.spread = !item?.spread"
          :class="{ spread: item?.spread }"
        >
          <div class="left">
            <div class="icon">
              <i class="fa fa-angle-up" v-if="item?.spread"> </i>
              <i class="fa fa-angle-down" v-else></i>
            </div>
          </div>
          <div class="center">
            <div class="name">{{ item.name }}</div>
          </div>
          <div class="right">
            <!-- <div
              class="button-tag"
              v-if="item?.spread == 1"
              @click="handleGoToPK(item)"
            >
              快速投票
            </div> -->
            <div class="tag">共{{ item?.selectionNum }}次</div>
          </div>
        </div>
        <!--  && spread == 1 -->
        <div
          class="sub-list-wrap"
          v-if="item?.subList && item?.subList?.length > 0 && item?.spread == 1"
          :class="{ objective1: item.type == 1 }"
        >
          <div
            class="sub-item"
            v-for="subItem in item?.subList"
            :key="item.id"
            @click="handleGoToPK(subItem)"
          >
            <!-- v-show="item.type != 1" -->
            <div class="left">
              <div class="icon"></div>
            </div>
            <div class="center">
              <div class="name">{{ subItem?.name }}</div>
            </div>
            <div class="right">
              <div class="tag">{{ subItem?.selectionType }}</div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
import { userPkInfo } from "@/api/selection";
import { useAuth } from "@/hooks/useAuth";
export default {
  name: "userPK",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    document.title = "投票记录";
    const state = reactive({
      list: [],
      userInfo: {},
    });
    async function init() {
      const { list, userInfo } = await userPkInfo();
      state.userInfo = userInfo;
      state.list = list;
    }

    onMounted(() => {
      init();
    });
    const userInfo = computed(() => store.getters.userInfo);
    const config = computed(() => store.getters.config);

    function handleGoToPK(item) {
      router.push({
        path: "/pk",
        query: {
          pkId: item.id,
          treeId: item.treeId,
          type: item.type,
          from: "userPK",
        },
      });
    }
    return {
      handleGoToPK,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="less" scoped>
.other-wrap {
  width: 100%;
  bottom: 0px;
  height: 300px;
  position: absolute;
  left: 0px;
  background: #4bcbbe;
  .title {
  }
}
.user-pk-wrap {
  position: relative;
  width: 100%;
  background-color: #ebf6fc;
  height: calc(100vh - 50px);

  .top-wrap {
    position: fixed;
    background-color: #ebf6fc;
    width: 100%;
    height: 80px;
    top: 0px;

    z-index: 997;
    max-width: 370px !important;
    padding: 0 20px 10px 20px;

    .back-wrap {
      position: absolute;
      top: 8px;
      left: 15px;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }

    .info-wrap {
      height: 100%;
      margin-top: 10px;
      .space-between();
      font-size: @font-size-sm;

      .left {
        border-right: 1px solid #fafafa;
      }

      .right {
        display: flex;
        justify-content: right;
        align-items: center;
      }

      .item {
        display: flex;
        text-align: left;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-content: flex-start;

        .info {
          margin-top: 5px;

          .num {
            font-size: 22px;
          }

          .unit {
            font-size: @font-size-sm;
            margin-left: 3px;
            color: @gray-color;
          }
        }

        .title {
          color: @gray-color;
        }
      }
    }
  }

  .content-wrap {
    position: relative;
    width: 100%;

    padding-left: 20px;
    padding-right: 20px;
    // height: calc(100vh - 170px);
    padding-top: 90px;
    padding-bottom: 20px;

    .item {
      background-color: #ffff;
      width: 100%;
      margin-top: 15px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      // padding: 10px 10px 10px 5px;
      border-radius: 5px;

      .fa-check {
        color: #51d5b7 !important;
      }

      .classify-top {
        height: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        .space-between();
        position: relative;
        padding-right: 0px;
        border-radius: 5px 5px 0 0;

        &.spread {
          background-color: #e7faf8;
        }

        .left {
          height: 100%;
          text-align: center;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;

          .icon {
            border: 1px solid #4bcbbe;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            background-color: #e2f5f3;
            // opacity: 0.5;
            font-size: 18px;
            line-height: 20px;

            i {
              color: #60c5bd;

              &.fa-angle-up {
                transform: translateY(-2px);
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
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .name {
            display: inline-block;
            font-size: @font-size-lg;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          padding-left: 5px;
        }

        .right {
          text-align: center;
          font-size: @font-size-sm;
          color: @gray-color;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;

          .button-tag {
            font-size: 11px;
            border-radius: 3px;
            text-align: center;
            line-height: 18px;
            height: 18px;
            border: 1px solid #4bcbbe;
            color: #60c5bd;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }

      // 子类
      .sub-list-wrap {
        position: relative;
        width: 100%;

        .sub-item {
          // color: @gray-color;
          height: 40px;
          width: 100%;
          .space-between();
          position: relative;
          padding-right: 10px;

          &:not(:last-child) {
            &::after {
              z-index: 1;
              content: "";
              display: block;
              height: 40px;
              width: 1px;
              background-color: #d4f5f2;
              opacity: 0.4;
              position: absolute;
              left: 20px;
              bottom: 25px;
              transform: translateY(100%) translateX(-50%);
            }
          }

          .left {
            text-align: center;
            height: 100%;
            width: 40px;
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
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            .name {
              display: inline-block;
              font-size: 13px;
              font-weight: 400;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
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

            i {
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
