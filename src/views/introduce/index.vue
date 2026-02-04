<template>
  <div class="company-wrap">
    <div class="about-wrap">
      <div class="content-wrap">
        <p class="title">活动介绍</p>
        <p>为选出优质题目，我们特开展此次题目评比活动，具体安排如下：</p>
        ​
        <p class="title">活动规模</p>
        <p>
          本次活动共有 1703 位老师参与，累积收集 4763
          道题目展开评比，最终将选出得分最高的题目。​
        </p>
        ​
        <p class="title">题目来源</p>
        <p>选题目由各学科位老师出题，每位老师贡献 3 道题目。​</p>
        ​
        <p class="title">评比规则</p>
        <p>
          1、
          评比过程中，评判老师可能是出题老师，但评判老师不会抽取出自己所出的题目进行评比。​
        </p>
        ​
        <p>
          2、 评比采用 PK 形式，每次会随机抽取 2
          道题进行较量，由评判老师从选中的两道题中，选出一道较好的题目点赞。同时，题目分为主观题和客观题两种类型，评比时遵循
          “同类评比” 原则，只能主观题和主观题比，客观题和客观题比。​
        </p>
        ​
        <p class="title">排名统计</p>
        <p>
          活动最终将对所有题目进行点赞数统计，点赞数排名前 N
          的题目就是本次评比的优秀题目啦！
        </p>
        ​
      </div>
    </div>
    <!-- <div class="service-wrap">
      <p>服务保障</p>
    </div>
    <div class="list-wrap">
      <div class="item" @click="suggest">
        <div class="left">
          <div class="icon"></div>
          <div>反馈建议</div>
        </div>
        <div class="right">
          <div>点击查看</div>
          <div class="icon"></div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";
export default {
  name: "company",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    document.title = "活动介绍";
    const state = reactive({
      list: [],
    });
    const config = computed(() => store.getters.config);
    function customerService() {
      router.push({
        path: "/customerService",
      });
    }
    function privacyPolicy() {
      router.push({
        path: "/privacyPolicy",
      });
    }
    function suggest() {
      router.push({
        path: "/suggest",
      });
    }
    return {
      ...toRefs(state),
      customerService,
      privacyPolicy,
      suggest,
    };
  },
};
</script>
<style lang="less" scoped>
.company-wrap {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;

  max-width: 1200px;
}

.about-wrap {
  padding: 10px 30px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f5ff 100%);
}

.title-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 25px;

  div {
    width: 5px;
    height: 35px;
    background: linear-gradient(to bottom, #4a6cf7, #82a0ff);
    border-radius: 3px;
    margin-right: 15px;
  }

  span {
    font-size: 28px;
    font-weight: 700;
    color: #1a2b6d;
    letter-spacing: 1px;
  }
}

.content-wrap {
  p {
    margin: 18px 0;
    font-size: 16px;
    color: #444;
    line-height: 1.8;
    text-align: justify;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: #1a2b6d;
    margin: 25px 0 15px;
    padding-left: 12px;
    border-left: 4px solid #4a6cf7;
  }
}

.service-wrap {
  padding: 25px 30px 15px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;

  p {
    font-size: 24px;
    font-weight: 700;
    color: #1a2b6d;
    text-align: center;
    position: relative;
    padding-bottom: 12px;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 70px;
      height: 4px;
      background: linear-gradient(to right, #4a6cf7, #82a0ff);
      border-radius: 2px;
    }
  }
}

.list-wrap {
  padding: 10px 30px 30px;
  background: #ffffff;

  .item {
    background: #f8f9ff;
    border-radius: 12px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    border: 1px solid #e6edff;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: #f0f5ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.15);
    }

    .left {
      display: flex;
      align-items: center;
      gap: 12px;

      .icon {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #4a6cf7, #82a0ff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 18px;
      }

      div:last-child {
        font-size: 17px;
        font-weight: 600;
        color: #1a2b6d;
      }
    }

    .right {
      display: flex;
      align-items: center;
      gap: 8px;

      div:first-child {
        color: #4a6cf7;
        font-size: 14px;
      }

      .icon {
        color: #4a6cf7;
        font-weight: bold;
      }
    }
  }
}
</style>
