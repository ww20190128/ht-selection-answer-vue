<template>
  <div class="tab-warper">
    <!-- active-color="#6EA9FB" inactive-color="#A7A7A7" -->
    <van-tabbar route placeholder @change="onTabChange" class="tab-list">
      <van-tabbar-item
        v-for="(item, index) in tabBarList"
        :key="item.to"
        :to="item.to"
        :icon="item.icon"
        active-color="#6EA9FB"
        inactive-color="#A7A7A7"
      >
        <template #icon>
          <img
            :src="isActiveTab(index) ? item.iconOn : item.iconOff"
            alt="icon"
            style="width: 24px; height: 24px"
          />
        </template>
        <p>{{ item.name }}</p>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import homeOnImg from "@/assets/images/icon/icon-home-on.png";
import homeOffImg from "@/assets/images/icon/icon-home-off.png";
import classifyOnImg from "@/assets/images/icon/icon-classify-on.png";
import classifyOffImg from "@/assets/images/icon/icon-classify-off.png";

import mineOnImg from "@/assets/images/icon/icon-mine-on.png";
import mineOffImg from "@/assets/images/icon/icon-mine-off.png";
export default {
  name: "TabBar",
  data() {
    return {
      tabBarList: [
        //...你的 tabBarList 数据
      ],
      activeTabIndex: 0,
    };
  },

  methods: {
    isActiveTab(index) {
      return this.activeTabIndex === index;
    },
    onTabChange(index) {
      this.activeTabIndex = index;
    },
  },
  setup() {
    const tabBarList = [
      {
        name: "首页",
        to: "/home",
        iconOn: homeOnImg,
        iconOff: homeOffImg,
      },

      {
        name: "活动规则",
        to: "/introduce",
        iconOn: classifyOnImg,
        iconOff: classifyOffImg,
      },
      {
        name: "我的",
        to: "/userPK",
        iconOn: mineOnImg,
        iconOff: mineOffImg,
      },
    ];
    return {
      tabBarList,
      homeOnImg,
      homeOffImg,
      classifyOnImg,
      classifyOffImg,
      mineOnImg,
      mineOffImg,
    };
  },
};
</script>
<style lang="less" scoped>
.tab-warper {
  width: 100%;
}
</style>
