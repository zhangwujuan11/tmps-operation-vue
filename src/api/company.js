import request from '@/utils/request'

// 获取司机列表
export function actionslist (data){
	return request({
		url:'/v1/drivers/actions/search',
		method:'get',
		params:data
	})
}

// 获取指定id的司机信息
export function driversid(data){
	return request({
		url:'/v1/drivers/' + data,
		method:'get'
	})
}

// 创建司机信息
export function adddrivers(data){
	return request({
		url:'/v1/drivers',
		method:'POST',
		data:data
	})
}

// 更新司机信息
export function updatadrivers(data){
	return request({
		url:'/v1/drivers/'+ data.driverId,
		method:'put',
		data:data
	})
}

// 删除司机
export function deteldrivers(data){
	return request({
		url:'/v1/drivers/'+ data,
		method:'DELETE'
	})
}

// 组织管理树形列表
export function treefleets(){
	return request({
		url:'/v1/fleets',
		method:'get'
	})
}

// 组织列表
export function fleetslist(data){
	return request({
		url:'/v1/fleets/actions/search',
		method:'get',
		params:data
	})
}

//创建组织
export function addfleets(data){
	return request({
		url:'/v1/fleets',
		method:'post',
		data:data
	})
}

// 查询指定id组织信息
export function seridfleets(data){
	return request({
		url:'/v1/fleets/' + data,
		method:'get'
	})
}

// 修改组织信息
export function updatafleets(data){
	return request({
		url:'/v1/fleets/' + data.fleetId,
		method:'put',
		data:data
	})
}
// 删除组织
export function detelfleets(data){
	return request({
		url:'/v1/fleets/' + data,
		method:'DELETE'
	})
}