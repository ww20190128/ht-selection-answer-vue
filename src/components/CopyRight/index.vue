<template>
  <div
    class="copy-right"
    :style="{backgroundColor}"
  >
    <slot>
      {{wechatInfo?.copyright}}
    </slot>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "@/store";
export default {
  name: "CopyRight",
  props: {
    backgroundColor: {
      type: String,
      default: "#F9F9F9",
    },
  },

  setup() {
    const store = useStore();
    const wechatInfo = computed(() => store.getters.wechatInfo);
    return {
      wechatInfo,
    };
  },
};
</script>

<style lang="less" scoped>
.copy-right {
  width: 100%;
  text-align: center;
  font-size: @font-size-sm;
  color: #c7c7c7;
  margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS < 11.2 */
  margin-bottom: env(safe-area-inset-bottom); /* 兼容 iOS >= 11.2 */
  padding: 10px 0;
}
</style>