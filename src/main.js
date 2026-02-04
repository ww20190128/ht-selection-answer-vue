import { createApp, ref, provide } from 'vue'
import App from './App.vue'
import { setupRouter, router } from './router'

// vuex
import { setupStore } from './store'
// 阿里的rem适配 (和下方我们自己写的作用一样，建议用这个)
// import "amfe-flexible"

// rem适配
import '@/utils/rem'

import '@/styles/index.less'

// 字体图表
import 'font-awesome/css/font-awesome.min.css';
import 'nprogress/nprogress.css' // 引入样式

// vant组件
import { setupVantPlugins } from '@/plugins/vant'
// ww添加
import 'vant/lib/index.css' // 引入vant组件样式

import BrowserLogger from "alife-logger"

import "polyfill-object.fromentries"
import 'core-js/actual/array/flat-map'
import 'url-search-params-polyfill';
const app = createApp(App);

// 注册全局过滤器
// $filters.formatDate(item.createTime)
import {
	formatDate
} from '@/utils/filters'

app.config.globalProperties.$filters = {
	formatDate
};

const conClickDirective = {
	bind(el, binding, vnode) {
		el.addEventListener('click', async e => {
			let hasCb = false;
			el.classList.add('is-disabled');
			el.disabled = true;
			// 这里写点击事件的逻辑
			if (binding.value instanceof Function) {
				const res = await binding.value(e);
				if (res instanceof Function) {
					const d = res(() => {
						el.disabled = false;
						el.classList.remove('is-disabled');
					})
					if (!(d instanceof Promise)) {
						hasCb = true;
					} else {
						await d;
					}
				}
			}
			if (!hasCb) {
				el.disabled = false;
				el.classList.remove('is-disabled');
			}
		});
	}
};
// 全局注册自定义指令 防止按钮重复点击
app.directive('con-click', conClickDirective);


// 全局注册vant组件
setupVantPlugins(app)

// vuex
setupStore(app)

// 路由
setupRouter(app)

// 路由准备就绪后挂载APP实例
router.isReady().then(() => app.mount('#app'))

// const isDev = process.env.NODE_ENV === 'development'
const isDev = process.env.NODE_ENV === 'development'

if (!isDev) {
	window.__bl = BrowserLogger.singleton({
		// pid: "bfg0o1dacl@cbab96d5ac84525",
		// pid: "bfg0o1dacl@b628e70b3d1efda",
		pid: "g1byysrioi@0e86f631d1610a8",
		appType: "web",
		imgUrl: "https://arms-retcode.aliyuncs.com/r.png?",
		sendResource: true,
		behavior: true,
		enableLinkTrace: true,
		enableConsole: true,
		disabledHook: true,
	});
} else {
	window.__bl = BrowserLogger.singleton({ pid: "g1byysrioi@0e86f631d1610a8", appType: "web", imgUrl: "https://arms-retcode.aliyuncs.com/r.png?", sendResource: true, enableLinkTrace: true, behavior: true });
}