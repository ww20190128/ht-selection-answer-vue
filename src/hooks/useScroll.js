import { debounce } from "lodash";
import { onMounted, onBeforeUnmount, onDeactivated } from 'vue'
import { useEventListener } from "@/hooks/useEventListener";
// 滚动触底事件
export const useScrollBottom = (callback) => {
    const { on, off } = useEventListener()

    onBeforeUnmount(() => {
        off(window, "scroll", onReachBottom)
    })
    onDeactivated(() => {
        off(window, "scroll", onReachBottom)
    })
    const onReachBottom = debounce(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        if (scrollTop + clientHeight + 300 >= scrollHeight) {
            callback()
        }
    }, 50, { maxWait: 300 })
    onMounted(() => {
        on(window, "scroll", onReachBottom)

    });
}
