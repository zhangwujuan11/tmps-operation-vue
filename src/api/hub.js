import request from '@/utils/request'

// 轮毂列表
export function hublist(data){
	return request({
		url:'/v1/hub/list',
		method:'get',
		params:data
	})
}

// 添加轮毂
export function hubadd(data){
	return request({
		url:'/v1/hub',
		method:'post',
		data:data
	})
}

// 轮毂详情
export function hubinfo(data){
	return request({
		url:'/v1/hub/' + data,
		method:"get"
	})
}

// 轮毂信息修改
export function hubupdate(data){
	return request({
		url:'/v1/hub',
		method:"put",
		data:data
	})
}

// 删除轮毂条件
export function hubdetelyes(data){
	return request({
		url:'/v1/hub/state/' + data,
		method:'DELETE'
	})
}

// 删除轮毂
export function hubdetel(data){
	return request({
		url:'/v1/hub/' + data,
		method:'DELETE'
	})
}


// 轮毂安装
export function hubaddbind(data){
	return request({
		url:'/v1/hub/install/' + data.vehicleId,
		method:'post',
		data:data
	})
}

// 轮毂拆卸
export function hubjie(data){
	return request({
		url:'/v1/hub/uninstall/' + data.vehicleId,
		method:'post',
		data:data.data
	})
}

// 轮毂绑定传感器
export function hunsendid(data){
	return request({
		url:'/v1/hub/actions/binds' ,
		method:'PUT',
		data:data
	})
}

// 轮毂生命周期
export function hublive(data){
	return request({
		url:'v1/hubHistory/list',
		method:'get',
		params:data
	})
}

// 轮毂调拨
export function companyhub(data){
	return request({
		url:'/v1/hub/actions/batch/warehouse/' + data.tids + '/' + data.companyId,
		method:'get'
	})
}