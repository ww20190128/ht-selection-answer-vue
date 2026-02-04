import { storage } from "@/utils/tools"
import _config from "@/config/_config.json"
import _getParam from "@/config/_getParam.json"

const state = {
	// wechatInfo: storage().get('wechatInfo') || {}, //网站配置信息
	// globalParams: storage().get('globalParams') || [], //自定义参数列表
	// hasParams: !!storage().get('globalParams'), //是否有自定义参数
	wechatInfo: _config, //网站配置信息
	globalParams: _getParam, //自定义参数列表
	hasParams: true, //是否有自定义参数
	weChatQrShow: false,
	error: false,
}

const mutations = {
	//更新网站配置信息
	SET_WECHATINFO: (state, wechatInfo) => {
		state.wechatInfo = wechatInfo
		storage().set('wechatInfo', wechatInfo)
	},
	//更新自定义参数列表
	SET_GLOBALPARAMS: (state, globalParams) => {
		state.globalParams = globalParams
		storage().set('globalParams', globalParams)
	},
	//更新是否有自定义参数
	SET_HASPARAMS: (state, hasParams) => {
		state.hasParams = hasParams
		storage().set('hasParams', hasParams)
	},
	SET_WECHATQRSHOW: (state, weChatQrShow) => state.weChatQrShow = weChatQrShow,
	SET_ERROR: (state, error) => state.error = error,
}

const actions = {
	// 获取网站配置信息
	getConfig({ commit, state }) {
		return new Promise(async (resolve, reject) => {

			try {
				// if (Object.keys(state.wechatInfo).length) {
				// 	resolve()
				// 	return
				// }
				// const { data } = await getConfig()
				// commit('SET_WECHATINFO', data)
				commit('SET_WECHATINFO', _config)
				// console.log(_config,'_config');
				window.__bl?.api('config接口调用(本地文件)', true, 0, 'success', `调用成功`)
				resolve()
			} catch (error) {
				window.__bl?.api('config接口调用(本地文件)', false, 0, 'error', `调用失败:${error}`)
				// reject(error)
				commit('SET_WECHATINFO', _config)

				resolve()
			}
		})
	},
	// 获取自定义参数配置
	getGlobalParam({ commit }) {
		return new Promise(async (resolve, reject) => {

			try {
				// if (state.hasParams) {
				// 	resolve()
				// 	return
				// }
				// const { data } = await getParam()
				// commit('SET_GLOBALPARAMS', data)
				// commit('SET_HASPARAMS', true)
				window.__bl?.api('getParam接口调用(本地文件)', true, 0, 'success', `调用成功`)
				// reject(error)
				// console.log(_getParam,'_getParam');
				commit('SET_GLOBALPARAMS', _getParam)
				commit('SET_HASPARAMS', true)
				resolve()
			} catch (error) {
				window.__bl?.api('getParam接口调用(本地文件)', false, 0, 'error', `调用失败:${error}`)
				// reject(error)
				commit('SET_GLOBALPARAMS', _getParam)
				commit('SET_HASPARAMS', true)
				resolve()
			}
		})
	}

}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
