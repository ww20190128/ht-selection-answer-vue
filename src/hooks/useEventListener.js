// 事件监听及事件监听移除钩子
export const useEventListener = () => {
    const on = function (element, event, handler, useCapture = false) {
        if (element && event && handler) {
            element.addEventListener(event, handler, useCapture);
        }
    };

    const off = function (element, event, handler, useCapture = false) {
        if (element && event && handler) {
            element.removeEventListener(event, handler, useCapture);
        }
    };
    return {
        on,
        off
    }
}