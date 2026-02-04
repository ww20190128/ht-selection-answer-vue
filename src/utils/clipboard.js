import Clipboard from 'clipboard'
import { Toast } from 'vant';
// 复制 方法
export default function clipboard(text, event) {
    const clipboard = new Clipboard(event.target, {
        text: () => text
    })
    clipboard.on('success', () => {
        Toast('复制成功');
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        Toast('复制失败');
        clipboard.destroy()
    })
    clipboard.onClick(event)
}
