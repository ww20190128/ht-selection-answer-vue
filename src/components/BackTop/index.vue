<template>
  <transition name="el-fade-in" v-if="false">
    <div v-show="visible" class="backtop" @click.stop="onClick">
      <slot>
        <van-icon name="arrow-up" />
      </slot>
    </div>
  </transition>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { throttle } from "lodash";
import { useEventListener } from "@/hooks/useEventListener";

const cubic = (value) => Math.pow(value, 3);

const easeInOutCubic = (value) =>
  value < 0.5 ? cubic(value * 2) / 2 : 1 - cubic((1 - value) * 2) / 2;

export default {
  name: "BackTop",
  props: {
    visibilityHeight: {
      type: Number,
      default: 200,
    },
    target: {
      type: String,
      default: "",
    },
  },
  emits: ["click"],
  setup(props, ctx) {
    const el = ref(null);

    const visible = ref(false);

    const { on, off } = useEventListener();

    const scrollToTop = () => {
      const beginTime = Date.now();
      const beginValue = el.value.scrollTop;
      const rAF =
        window.requestAnimationFrame || ((func) => setTimeout(func, 16));
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500;
        if (progress < 1) {
          el.value.scrollTop = beginValue * (1 - easeInOutCubic(progress));
          rAF(frameFunc);
        } else {
          el.value.scrollTop = 0;
        }
      };
      rAF(frameFunc);
    };
    const onScroll = () => {
      visible.value = el.value.scrollY >= props.visibilityHeight;
    };
    const onClick = (event) => {
      // scrollToTop();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      ctx.emit("click", event);
    };

    const throttledScrollHandler = throttle(onScroll, 300);

    onMounted(() => {
      // const value = document.documentElement.scrollTop ? document.documentElement : document.body

      el.value = window;
      on(el.value, "scroll", throttledScrollHandler);
    });
    onBeforeUnmount(() => {
      off(el.value, "scroll", throttledScrollHandler);
    });

    return {
      el,
      visible,
      onClick,
    };
  },
};
</script>
<style lang="less" scoped>
.backtop {
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
}
</style>