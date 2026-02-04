

import { store } from "@/store"
import { useParams } from '@/hooks/useParams'
import { getToken } from '@/utils/auth'
import { useAgent } from '@/hooks/useAgent'
// import { h } from "vue"
import { Dialog } from "vant"
import axios from "axios"
import NProgress from 'nprogress' // 进度条
function formatSearchParams(query) {
	for (const key in query) {
		if (Array.isArray(query[key])) {
			console.log(query);
			query[key] = query[key].pop();
		}
	}
	return {
		...query
	}
}



export const createRouterGuards = (router) => {
const { getParams } = useParams()
	router.beforeEach(async (to, from, next) => {

		NProgress.start()
		// try {

		// 	if (process.env.NODE_ENV !== 'development') {
		// 		const { VUE_APP_PUBLIC_PATH } = process.env
		// 		const path = VUE_APP_PUBLIC_PATH === '/' ? '/' : `${VUE_APP_PUBLIC_PATH}/`
		// 		const { data } = await axios.get(`${path}version.json?t=${new Date().getTime()}`)
		// 		const version = document.getElementById("version-meta").content

		// 		if (data.version !== version) {

		// 			Dialog.alert({
		// 				title: '发现新版本',
		// 				message: '检测到最新版本，刷新后立即使用',
		// 				theme: 'round-button',
		// 				showCancelButton: false,
		// 				confirmButtonText: '立即刷新',
		// 				confirmButtonColor: '#ff5d7d',
		// 				onConfirm: () => {
		// 					window.location.reload()
		// 				},

		// 			})
		// 		}
		// 	}

		// } catch (error) {
		// 	console.log(error);
		// }




		// if(to.path === '/goods' && from.path === '/pay'){

		//     return next(false)
		// }



		// 解决IOS浏览器后退后出现白屏现象
		if (history?.scrollRestoration) {
			history.scrollRestoration = 'manual'
		}

		try {

			// 未获取网站配置信息 则获取网站配置信息

			await store.dispatch("app/getConfig");

			// 动态title的页面
			const noTitlePathList = ['/article', '/exam', '/exam2', 'goodsExam',' /detail', '/pay', '/report', ' / errorRecord']
			if (noTitlePathList.includes(to.path)) {
				document.title = ""
			} else {
				switch (to.path) {
					case '/home':
						// 首页title
						document.title = store.getters.wechatInfo?.index_title
						break;
					// 分类页title
					case '/classify':
						document.title = '测评分类'
						break;
					// 其他页面 title 都设置为网站名称
					default:
						document.title = store.getters.wechatInfo?.slogan
						break;
				}
			}
			document
				.querySelector('meta[name="description"]')?.setAttribute("content", store.getters.wechatInfo?.slogan);
		} catch (error) {
			console.log(error);
			store.commit('app/SET_ERROR', true)
		}

		// 需要动态传递参数的路由
		// const paramsPathList = ['/goods', '/pay', '/exam', '/report', '/vipOpened', '/chooseYear', '/chooseGender', '/topic']
		// 微信环境下 不需要获取用户信息的页面
		const whiteList = ["/home", "/classify", "/mindfulness", "/mindfulness"];
		const { isWeChat } = useAgent();

		// 微信端获取用户信息
		if (isWeChat) {
			// 未获取用户信息并且有token的情况下获取用户信息
			if (!store.getters.hasUserInfo && getToken()) {
				// 白名单内的路由不获取
				if (!whiteList.includes(to.path)) {
					await store.dispatch("user/getUserInfo");
				}
			}
		}

		try {
			// 获取自定义参数
			// if (paramsPathList.includes(to.path)) {
			// 没有自定义参数获取自定义参数
			// if (!store.getters.hasParams) {
			await store.dispatch("app/getGlobalParam");
			// }
			// 有自定义参数直接进入路由
			if (to.query.hasParams) {
				if (to.query.pmerch || !from.query.pmerch) {
					if (Object.values(to.query).some(item => Array.isArray(item))) {
						next({
							...to,
							query: formatSearchParams(to.query)
						})
					} else {
						next()
					}
				} else {

					next({
						...to,
						query: formatSearchParams({
							...to.query,
							pmerch: from.query.pmerch
						})
					})

				}
			} else {
				// 没有自定义参数  传递自定义参数
				const query = getParams(store.getters.globalParams, from);
				const formatQuery = {}
				for (const key in query) {
					if (!Object.keys(to.query).includes(key)) {
						formatQuery[key] = query[key]
					}
				}
				next({
					...to,
					query: formatSearchParams({
						...to.query,
						...formatQuery,
						pmerch: from.query.pmerch
					})
				})
			}
			// }
			// else {


			//     if (to.query.pmerch || !from.query.pmerch) {
			//         next()
			//     } else {
			//         next({
			//             path: to.path,
			//             query: {
			//                 ...to.query,
			//                 pmerch: from.query.pmerch
			//             }
			//         })

			//     }

			// }
		} catch (error) {
			console.log(error);
			next();

			// Dialog.alert({
			//     title: '提示',
			//     message: '网络错误~',
			//     theme: 'round-button',
			//     confirmButtonText: '刷新'
			// }).then(() => {
			//     window.location.reload()
			// });


		}

	})
	router.afterEach(async () => {
		NProgress.done()
		window.scrollTo(0, 0)
		// 版本检测

	})
}
