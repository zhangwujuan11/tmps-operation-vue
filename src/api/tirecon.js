import request from '@/utils/request'


// 品牌搭配异常列表
export function abnormallist(data){
	return request({
		url:'/v1/tire/abnormal/info/list',
		method:'GET',
		params:data
	})
}

// 异常详情
export function abnormalinfo(data){
	return request({
		url:'/v1/tire/abnormal/info/detail/list',
		method:'get',
		params:data
	})
}

// 胎压剩余花纹列表
export function getTireslist(data){
	return request({
		url:'/v1/tire/lifecycle/getTires',
		method:'get',
		params:data
	})
}

// 查询轮胎位置拆卸异常列表
export function tpmsbnormal(data){
	return request({
		url:'/v1/tire/uninstallAbnormal/list',
		method:'get',
		params:data
	})
}

// 查询轮胎位置拆卸异常导出
export function extpmsbnormal(data){
	return request({
		url:'/v1/tire/uninstallAbnormal/export',
		method:'get',
		params:data
	})
}

// 轮胎异常导出
export function exporttire(data){
	return request({
		url:'/v1/tire/abnormal/info/export',
		method:'get',
		params:data
	})
}

// 加气异常列表
export function abarealist(data){
	return request({
		url:'/v1/aerate/vehicleList',
		method:'GET',
		params:data
	})
}

// 加气添加列表
export function abareaadd(data){
	return request({
		url:'/v1/aerate',
		method:'post',
		data:data
	})
}

// 加气删除
export function abareadel(data){
	return request({
		url:'/v1/aerate/' + data,
		method:'DELETE'
	})
}