import request from '@/utils/request'
const baseurl = import.meta.env.VITE_APP_BASE_API

// 所属组织
export function carcompanylist (){
	return request({
		url:'/v1/fleets/actions/fleet/all',
		method:'get'
	})
}

// 导出阈值
export function exportdata(data){
	return request({
		 url: '/v1/system/actions/threshold_value/export',
		 method: 'get',
		 params:data,
		 responseType:'blob'
	})
}


// 导出里程统计方式
export function exportmileage(data){
	return request({
		method: 'get',
		url: '/v1/system/actions/mileage_type/export',
		responseType:'blob',
		params:data
	})
}
// 车牌号
export function vehicleNo(data){
	return request({
		url:'/v1/vehicles/actions/all',
		method:'get',
		params:data
	})
}

// 车牌号加id
export function vehicleNoid(data){
	return request({
		url:'/v1/vehicles/actions/allVehicle',
		method:'get',
		params:data
	})
}

// 提醒
export function remind(){
	return request({
		url:'/v1/system/remind',
		method:'get'
	})
}

export function remindupdate(data){
	return request({
		url:'/v1/system/' + data.id,
		method:'put',
		data:data
	})
}

/* 阈值列表 */
export function carsetlist(data){
	return request({
		url:'/v1/system/actions/threshold_value/search',
		method:'get',
		params:data
	})
}
// 批量-单个更新阈值
export function thresholdupdate(data){
	return request({
		url:'/v1/system/actions/threshold_value/'+ data.ids,
		method:'put',
		data:data.list
	})
}

// 指点id查询阈值
export function therserch(data){
	return request({
		url:'/v1/system/actions/threshold_value/'+ data,
		method:'get'
	})
}
// 获取里程统计方式列表
export function mileagelist(data){
	return request({
		url:'/v1/system/actions/mileage_type/search',
		method:'get',
		params:data
	})
}
//获取指定id的里程统计数据
export function mileageserch(data){
	return request({
		url:'/v1/system/actions/mileage_type/'+ data,
		method:'get'
	})
}
//修改里程统计数据
export function mileageupdate(data){
	return request({
		url:'/v1/system/actions/mileage_type/'+ data.id,
		method:'put',
		data:data
	})
}

// 参数设置查询
export function parameter(){
	return request({
		url:'/v1/system/actions/parameter/search',
		method:'get'
	})
}

//修改参数设置
export function parameterupdate(data){
	return request({
		url:'/v1/system/actions/parameter/'+ data.id,
		method:'put',
		data:data
	})
}

// 考核里程列表
export function mileagesst(data){
	return request({
		url:'/v1/system/actions/mileage/search',
		method:'get',
		params:data
	})
}

// 获取标准考核里程设置
export function bioahunshe(){
	return request({
		url:'/v1/system/actions/mileage_stand/search',
		method:'get',
		 headers: {
		        'Content-Type': 'application/x-www-form-urlencoded'
		    }
	})
}
// 添加考核里程设置
export function biaoadd(data){
	return request({
		url:'/v1/system/actions/mileage',
		method:'post',
		data:data
	})
}

// 修改标准设置
export function mileage_stand(data){
	return request({
		url:'/v1/system/actions/mileage_stand',
		method:'put',
		data:data
	})
}
// 删除考核里程设置
export function mileage_detel(data){
	return request({
		url:'/v1/system/actions/mileage/' + data,
		method:'DELETE'
	})
}

// 字典参数 树形列表
export function treefleets(){
	return request({
		url:'/v1/param/type/treeSelect',
		method:'get'
	})
}

// 参数列表
export function fleetslist(data){
	return request({
		url:'/v1/param/type/data/list',
		method:'get',
		params:data
	})
}

// 参数列表添加
export function addfleets(data){
	return request({
		url:'/v1/param/type/data',
		method:'post',
		data:data
	})
}

// 参数详情
export function seridfleets(data){
	return request({
		url:'/v1/param/type/data/' + data,
		method:'get'
	})
}

// 参数修改
export function updatafleets(data){
	return request({
		url:'/v1/param/type/data',
		method:'put',
		data:data
	})
}

// 删除参数
export function detelfleets(data){
	return request({
		url:'/v1/param/type/data/' + data,
		method:'DELETE'
	})
}

// 参数字典筛查
export function soucollist(data){
	return request({
		url:'v1/param/type/data/paramType/' + data.paramType,
		method:"get"
	})
}

// 刷新字典
export function sollistupdata(){
	return request({
		url:'v1/param/type/data/refresh',
		method:'DELETE'
	})
}

// 人工登记补录接口
export function updatadengji(data){
	return request({
		url:'v1/tire/register',
		method:'put',
		data:data
	})
}

// 轮胎列表导出冷态气压
export function coldexpoprt (data){
	return request({
		 url: 'v1/tire/lifecycle/coldPressure/export',
		 method: 'post',
		 data:data
		 // responseType:'blob'
	})
}

// 挂甩登记上挂，下挂登记
export function guashuai(data){
	return request({
		url:'v1/tire/register/status',
		method:'post',
		data:{
			"vehicleNo":data
		}
	})
}
