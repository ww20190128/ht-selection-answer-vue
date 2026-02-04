// 基准大小
const baseSize = 37.5
const maxWidth = 750;
// 设置 rem 函数
function setRem() {
	// 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
	const scale = (document.documentElement.clientWidth || document.body.clientWidth) / 375
	// 设置页面根节点字体大小
	const fontSize = Math.min(baseSize * Math.min(scale, 2), maxWidth / 10)
	document.documentElement.style.fontSize = `${fontSize}px`
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
	setRem()
}

export function px2rem(value) {
	if (/%/gi.test(value)) return value;
	return `${parseFloat(value) / baseSize}rem`;
}
export function px2number(number) {
	const rootFontSize = parseInt(document.documentElement.style.fontSize);
	return (number / baseSize) * rootFontSize;
}
