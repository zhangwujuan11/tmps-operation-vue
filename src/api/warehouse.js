import request from '@/utils/request'

// 仓库列表搜索
export function warehouselist (data){
	return request({
		url:'/v1/warehouse/getList',
		method:'post',
		data:data
	})
}

// 新增仓库
export function warehouseadd(data){
	return request({
		url:'/v1/warehouse/add',
		method:'post',
		data:data
	})
}

// 查询指定仓库信息
export function serchwarehouse(data){
	return request({
		url:'/v1/warehouse/' + data,
		method:'get'
	})
}

// 修改c仓库信息
export function updatawarehouse(data){
	return request({
		url:'/v1/warehouse/update',
		method:'POST',
		data:data
	})
}


// 删除仓库
export function deletewarehouse(data){
	return request({
		url:'/v1/warehouse/' + data,
		method:'DELETE'
	})
}

// 仓库导出
export function exportwarehouse(data){
	return request({
		url:"/v1/warehouse/export",
		method:'get',
		params:data
	})
}
// 下载附件
export function exportxlxs(data){
	return request({
		url:"/common/download?fileName=" + data,
		method:'get',
		responseType:'blob',
	})
}

// 获取轮胎调拨明细表
export function transferDetaillist(data){
	return request({
		url:'/v1/transferDetail/list',
		method:'get',
		params:data
	})
}

// 获取轮胎调拨明细表导出
export function exportDetaillist(data){
	return request({
		url:'/v1/transferDetail/export',
		method:'get',
		params:data
	})
}


// 月度进销存明细
export function detail(data){
	return request({
		url:'/v1/tireInOutWarehouse/monthly/detail',
		method:'get',
		params:data
	})
}

// 月度进销存导出
export function exdtrail(data){
	return request({
		url:"/v1/tireInOutWarehouse/monthlyDetail/export",
		method:'get',
		params:data,
	})
}

// 月度进销存汇总表
export function monthlysummary(data){
	return request({
		url:'v1/tireInOutWarehouse/monthly/summary',
		method:'get',
		params:data
	})
}

// 结算表
export function mothquer(data){
	return request({
		url:'v1/tireInOutWarehouse/monthly/balance',
		method:'post',
		data:data
	})
}