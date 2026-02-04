<template>
	<BaseDialog
		v-bind="$attrs"
		:showConfirmButton="false"
	>
		<div class="dialog-content">
			<div class="title">{{ title }}</div>
			<slot name="subhead"> </slot>
			<div class="qr">
				<img :src="wechatInfo?.wechat_qrcode" />
			</div>
			<slot>
				<p>为了保障您的安全，请使用微信登录用户中心</p>
				<p class="pink">扫码登录后即可查看您所有的评测结果和报告</p>
			</slot>
			<slot name="button"> </slot>
			<div
				class="icon"
				@click="close"
			>
				<van-icon name="close" />
			</div>
		</div>
	</BaseDialog>
</template>

<script>
import { computed } from "vue";
import { useStore } from "@/store";
import BaseDialog from "@/components/BaseDialog"
export default {
	components: { BaseDialog },
	props: {
		title: {
			type: String,
			default: "请先关注公众号",
		},
	},
	setup(_, ctx) {
		function close() {
			ctx.emit("close");
			ctx.emit("update:show", false);
		}
		const store = useStore();
		const wechatInfo = computed(() => store.getters.wechatInfo || {});
		return {
			close,
			wechatInfo,
		};
	},
};
</script>

<style lang="less" scoped>

.dialog-content {
	padding: 20px;
	font-size: @font-size-base;
	position: relative;
	text-align: center;

	.button {
		height: 40px;
		border-radius: 40px;
		background-color: @theme-color;
		color: #fff;
		margin-top: @padding-base;
		line-height: 40px;
		text-align: center;
		cursor: pointer;
	}

	.qr {
		width: 180px;
		height: 180px;
		margin: 0 auto;
		padding-bottom: @padding-sm;
		box-sizing: content-box;

		img {
			width: 100%;
			height: 100%;
			pointer-events: auto;
		}
	}

	p {
		font-size: @font-size-sm;
	}

	.pink {
		color: @theme-color;
	}

	.title {
		font-size: 20px;
		text-align: center;
		padding: 5px 0;
	}

	.icon {
		font-weight: bold;
		font-size: 20px;
		position: absolute;
		top: 15px;
		right: 15px;
	}
}</style>