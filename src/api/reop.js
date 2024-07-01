import request from '@/utils/request'

// 轮胎动态资产明细列表
export function assetDetailslist(data) {
    return request({
        url: '/v1/stats/assetDetails/list',
        method: 'post',
        data: data
    })
}
// 动态资产导出
export function assetexport(data){
	return request({
		url:'/v1/stats/assetDetails/list/export',
		method:'get',
		params:data
	})
}


// 轮胎里程统计表
export function mileageStatistics(data){
	return request({
		url:'/v1/stats/mileageStatistics/list',
		method:'post',
		data:data
	})
}
// 轮胎里程统计表导出
export function mileageStatisticsexport(data){
	return request({
		url:'/v1/stats/mileageStatistics/export',
		method:'get',
		params:data
	})
}

//轮胎成本报表
export function tierCostlist(data){
	return request({
		url:'/v1/stats/tierCost/list',
		method:'post',
		data:data
	})
}
// 月度季度年度明细表导出
export function expor(data){
	return request({
		url:'/v1/stats/tierCost/export',
		method:'get',
		params:data
	})
}
// 月度季度年度汇总表
export function contlist(data){
	return request({
		url:'/v1/stats/tierCostSum/list',
		method:'post',
		data:data
	})
}

// 月度季度年度汇总表导出
export function contlistexport(data){
	return request({
		url:'/v1/stats/tierCostSum/export',
		method:'get',
		params:data
	})
}
// 轮胎资产统计
export function tirecount (data){
	return request({
		url:'/v1/stats/vehicleTire/count',
		method:'get',
		data:data
	})
}
// 轮胎资产统计饼图
export function tireprice(){
	return request({
		url:'/v1/stats/vehicle/pie',
		method:'get'
	})
}
// 轮胎资产统计柱状图
export function tirezhu(){
	return request({
		url:'/v1/stats/tireBrand/line',
		method:'get'
	})
}