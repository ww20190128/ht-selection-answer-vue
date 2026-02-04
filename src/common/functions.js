import { getTestOrderInfo } from "@/api/testPaper";

// 获取最近一次订单详情
async function getTestOrderInfoById() {
	const {
		testOrderInfo
	} = await getTestOrderInfo({
		testOrderId: state.testOrderId,
	});
	state.tipsShow = true
	state.lastTestOrderInfo = testOrderInfo;
}