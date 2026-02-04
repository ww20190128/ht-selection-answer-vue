<template>
	<router-view></router-view>
	<Transition>

	</Transition>
</template>
<script>
import { onMounted, nextTick, useCssVars, inject } from "vue";
import { useAuth } from "@/hooks/useAuth";
import Cookies from 'js-cookie'

// import { useWindowSize } from "@vueuse/core";
import { useRoute } from "vue-router";

export default {
	name: "App",
	components: {},
	setup() {
		const state = {
			count: 0,
			imgs: [],
		};
		state.imgs.map((img) => {
			const image = new Image();
			image.onload = () => {
				state.count++;
			};
			image.src = img;
		});

		// 动态创建脚本 process.env.VUE_APP_BASE_API 为环境变量中的值
		// function createScript(type, el) {
		//   const script = document.createElement("script");
		//   script.setAttribute("type", "text/javascript");
		//   script.setAttribute(
		//     "src",
		//     `${process.env.VUE_APP_BASE_API}/v1/index/getSiteWebScript?type=${type}`
		//   );
		//   document[el].appendChild(script);
		// }
		// const { height } = useWindowSize();
		const height2 = document.documentElement?.clientHeight; //实时屏幕高度

		// console.log('%c [  ]-41', 'font-size:13px; background:pink; color:#bf2c9f;',height,height2 )
		useCssVars(() => ({
			"container-min-height": `${height2}px`,
		}));
		const route = useRoute()
		onMounted(() => {
			const key = route.query.clearCookie;
			key && Cookies.remove(key)
		})
		// useAuth(
		// 	{
		// 		auth_type: 2,
		// 	},
		// 	async () => {}
		// );

		return {}
	},
};
</script>

<style lang="less" scoped>
.pc-title {
	text-align: center;
	font-size: 30px;
	color: @theme-color;
	font-weight: bold;
	padding: 10px;
}
</style>