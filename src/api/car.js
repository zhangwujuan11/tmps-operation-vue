import request from '@/utils/request'
const baseurl = import.meta.env.VITE_APP_BASE_API

export function carlistlist(data){
	return request({
		url:"/v1/tireMonitor/vehicles/list",
		method:'get',
		params:data
	})
}

export function addcar(data){
	return request({
		url:"/v1/vehicles",
		method:'post',
		data:data
	})
}

// 查询指定车辆信息
export function carinfo(data){
	return request({
		url:'/v1/vehicles/' + data,
		method:'get'
	})
}

// 修改指定车辆信息
export function updatecar(data){
	return request({
		url:'/v1/vehicles/' + data.vehicleId,
		method:'put',
		data:data
	})
}


// 判断车辆是否可以删除
export function detalcaryes(data){
	return request({
		url:'/v1/vehicles/state/' + data,
		method:'DELETE'
	})
}
// 删除指定车辆信息
export function detalcar(data){
	return request({
		url:'/v1/vehicles/'+ data,
		method:'DELETE'
	})
}
// 车辆列表
export function carlist(data){
	return request({
		url:'/v1/vehicles/actions/search',
		method:'get',
		params:data
	})
}

// 根据车辆id返回所有轮位
export function gettirepicture(data){
	return request({
		url:'/v1/vehicles/actions/generate/' + data.id,
		method:'get',
		params:{tireStatus:data.tireStatus}
	})
}

// 根据车辆id获取车辆轮胎信息
export function getalltire(data){
	return request({
		url:'/v1/tire/lifecycle/tireChanger/' + data,
		method:'get',
	})
}

// 车辆调拨
export function gofeedi(data){
	return request({
		url:'/v1/vehicles/actions/allot/' +data.array,
		method:'put',
		params:{fleetId:data.vehicleIds }
	})
}

// 车辆列表导出
export function exportcarlist(data){
	return request({
		url:'/v1/vehicles/actions/export',
		method:'get',
		params:data,
		responseType:'blob'
	})
}

// 接收器绑定，解绑
export function binds(data){
	return request({
		url:'/v1/vehicles/actions/binds/' + data.vehicleId,
		method:'put',
		params:data.info
	})
}


// 车辆报废列表
export function paperlist (data){
	return request({
		url:'/v1/disposals/actions/search',
		method:'get',
		params:data
	})
}

// 报废登记
export function paperadd(data){
	return request({
		url:'/v1/disposals',
		method:'post',
		data:data
	})
}

// 导出报废数据
export function exportpaerlist(data){
	return request({
		url:'/v1/disposals/export',
		method:'get',
		params:data,
		responseType:'blob'
	})
}

// 获取指定车辆报废信息
export function getparelist(data){
	return request({
		url:'/v1/disposals/' + data,
		method:'get'
	})
}

// 修改报废车辆信息
export function updatepare(data){
	return request({
		url:'/v1/disposals/' + data.id,
		method:'put',
		data:data
	})
}

// 删除报废车辆数据
export function detelpare(data){
	return request({
		url:'/v1/disposals/' + data,
		method:'DELETE'
	})
}


// 根据车辆id获取车辆轮毂信息
export function getallhub(data){
	return request({
		url:'/v1/hub/list',
		method:'get',
		params:{vehicleId:data}
	})
}


// 轮胎拆装异常列表导出
export function nullexport(data){
	return request({
		url:'/tpms/abnormal/export',
		method:'get',
		params:data
	})
}

// 轮胎详情
export function tireinfos(data){
	return request({
		url:'/v1/tire/lifecycle/' +  data,
		method:'get'
	})
}