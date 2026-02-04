
import { useRoute } from 'vue-router'
import { recordParam } from "@/api/app";
import { useStore } from '@/store';

export const useParams = () => {
    const route = useRoute()
    const store = useStore()
    function getParams(globalParams, from) {
        // 获取自定义参数
        const query = {
            hasParams: 1
        }

        globalParams.map(v => {
            for (const key in from.query) {
                if (v.value === key) {
                    query[key] = from.query[key]
                }
            }
        });

        return query
    }
    // 发送自定义参数
    // page_type  页面类型，1商品详情，2做题页面，3支付引导页，4结果页

    function getAdParams() {
        const filterParams = store.getters.globalParams.filter(v => v.type === 1);

        const query = {};

        filterParams.map(v => {
            for (const key in route.query) {
                if (v.value === key) {
                    query[key] = route.query[key]
                }
            }
        })
        const keys = Object.keys(query)

        if (!keys.length) return //没有参数 直接return
        const queryData = {
            ...query,
            testOrderId: route.query.testOrderId,
            request_url: window.location.href
        }
        for (const key in queryData) {
            if (Array.isArray(queryData[key])) {
                queryData[key] = queryData[key].pop()
            }
        }
        return queryData
    }
    async function sendParams(pageType, params = {}) {

        await recordParam({
            ...getAdParams(),
            pageType,
            ...params
        })
    }


    return {
        getParams,
        sendParams,
        // sendParamsV2
    }
}