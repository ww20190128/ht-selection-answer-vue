<template>
	<van-dialog
		v-bind="$attrs"
		class="base-dialog"
		transition="bounce"
	>
		<slot></slot>
	</van-dialog>
</template>
<style lang="less">
.base-dialog {
	max-width: 100vw;
	background-color: #fff;
}


.bounce-enter-from {
	transform: translate3d(-50%, -50%, 0) scale(0.3);
	opacity: 0;
}

.bounce-leave-active {
	transform: translate3d(-50%, -50%, 0) scale(0.3);
	opacity: 0;
}
</style>
