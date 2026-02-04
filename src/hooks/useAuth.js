import { onMounted, onBeforeUnmount } from "vue";
import { parseQueryString } from "@/utils/tools";
import { useStore } from "@/store";
import { useAgent } from '@/hooks/useAgent'
import { useRoute, useRouter } from "vue-router"
import { getToken } from '@/utils/auth'
import { useEventListener } from "@/hooks/useEventListener";
import qs from "qs";
import { Toast } from 'vant'
export const useAuth = (authType, hook) => {
	const { on, off } = useEventListener();

	const store = useStore();
	const route = useRoute()
	const router = useRouter()
	const { isWeChat } = useAgent()
	async function auth() {
		try {
			let { code } = parseQueryString(window.location.href);
			// 有code 调用登录接口
			if (code) {
				try {
					if (Array.isArray(code)) {
						code = code[code.length - 1]
					}
					await store.dispatch("user/login", { code });
					// 登录完毕清除微信回调过来的code和state
					const query = {
						...route.query,
						code: undefined,
						state: undefined
					}
					const search = qs.stringify(query) ? `?${qs.stringify(query)}` : ''
					window.history.replaceState(null, null,
						`${window.location.origin + route.path + search}`)
					// 执行授权页的获取数据钩子
					hook()
				} catch (error) {
					// 登录失败 回退上一页
					Toast("登录失败，请重新登录！")
					setTimeout(() => {
						// router.go(-1)
					}, 1000);
				}
				// 登录完成 没有用户信息  获取用户信息
				if (!store.getters.hasUserInfo && store.getters.token) {
					await store.dispatch("user/getUserInfo");
				}
			} else {
				// 没有code 跳转授权页
				await store.dispatch("user/auth", { authType });
			}
		} catch (error) {
			console.log(error);
		}
	}

	function reload(e) {
		// 如果页面是通过进入时是通过缓存加载 则刷新当前页面(解决IOS微信授权后返回空白问题)
		if (e.persisted) {
			window.location.reload();
		}
	}
	onBeforeUnmount(() => {
		// 组件卸载后移除该事件监听
		off(window, "pageshow", reload)
	});
	onMounted(async () => {
		// 事件监听
		on(window, "pageshow", reload)
		// 微信环境下执行登录操作
		if (isWeChat) {
			// 没有token 进行授权操作
			if (!getToken()) {
				await auth()
			} else {
				// 有token直接 执行授权页的获取数据钩子
				hook()
			}
		} else {
			hook()
		}
	});
}