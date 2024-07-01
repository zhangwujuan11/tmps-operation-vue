import request from '@/utils/request'


export function tirelist (data){
	return request({
		url:'/v1/tire/lifecycle/getTires',
		method:'post',
		data:data
	})
}

export function tirelistOT (data){
	return request({
		url:'/v1/tire/lifecycle/getTireList',
		method:'post',
		data:data
	})
}

// 品牌获取
export function getTireBands(data){
	return request({
		url:'/v1/param/type/data/paramType/tpms_tire_brand_param',
		method:"get"
	})
}

// 轮胎规格获取
export function getSpecifications(){
	return request({
		url:'/v1/param/type/data/paramType/tire_specification_param',
		method:'get'
	})
}

// 轮胎花纹型号
export function getpatternmodel(){
	return request({
		url:'/v1/param/type/data/paramType/tire_pattern_model',
		method:'get'
	})
}

// 车辆品牌
export function carbands(){
	return request({
		url:'/v1/param/type/data/paramType/vehicle_brand_param',
		method:'get'
	})
}

// 轮胎入库
export function addtire(data){
	return request({
		url:'/v1/tire/lifecycle/addTire',
		method:'post',
		data:data
	})
}

// 判断是否可以删除轮胎
export function deteltireyes(data){
	return request({
		url:'/v1/tire/lifecycle/state/' + data,
		method:'DELETE'
	})
}
// 删除轮胎
export function deteltire(data){
	return request({
		url:'/v1/tire/lifecycle/' + data,
		method:'DELETE'
	})
}

//批量仓库调拨
export function companyId(data){
	return request({
		url:'/v1/tire/lifecycle/actions/batch/warehouse/' + data.tids + '/' + data.companyId,
		method:'get'
	})
}

//批量组织调拨
export function warehouseId(data){
	return request({
		url:'/v1/tire/lifecycle/actions/batch/company/' + data.tids + '/' + data.companyId,
		method:'get'
	})
}

// 批量修改轮胎信息
export function updatatires(data){
	return request({
		url:'/v1/tire/lifecycle/actions/batch/update/' + data.tids,
		method:'post',
		data:data.data
	})
}

// 轮胎信息导出
export function expotires(data){
	 return request({
		url:'/v1/tire/lifecycle/export',
		method:'post',
		data:data
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
// 解绑传感器
export function jiebang(data){
	return request({
		url:'/v1/tire/lifecycle/actions/ubbinding/sender/' + data,
		method:'POST',
	})
}

// 绑定传感器
export function bangding(data){
	return request({
		url:'/v1/tire/lifecycle/actions/binding/sender/'+data.tireId+'/'+data.senderId+'/' + data.senderType,
		method:'post'
	})
}

export function bangdinghub(data){
	return request({
		url:'/v1/tire/lifecycle/actions/binding/sender/'+data.id+'/'+data.senderId+'/' + data.senderType,
		method:'post'
	})
}

// 胎号随机生成
export function getKeyNA(){
	return request({
		url:'/v1/common/tpms/getKey/NA',
		method:'get'
	})
}

export function getKeyWX(){
	return request({
		url:'/v1/common/tpms/getKey/WX',
		method:'get'
	})
}

export function getKeyFX(){
	return request({
		url:'/v1/common/tpms/getKey/FX',
		method:'get'
	})
}
export function getKeyXB(){
	return request({
		url:'/v1/common/tpms/getKey/XB',
		method:'get'
	})
}
// 轮胎详情修改
export function updatacartireid(data){
	return request({
		url:'/v1/tire/lifecycle/updateTire',
		method:'post',
		data:data
	})
}
// rfid解绑
export function ubbindingrfid(data){
	return request({
		url:'/v1/tire/lifecycle/actions/ubbinding/rfid/' + data,
		method:'POST'
	})
}

// rfid绑定
export function bindrfid(data){
	return request({
		url:'/v1/tire/lifecycle/actions/binding/rfid/' +data.tireId + '/' + data.rfidCode,
		method:'POST'
	})
}
// 获取轮胎生命周期
export function gethistorylist(data){
	return request({
		url:'/v1/tire/history/list',
		method:'get',
		params:data
	})
}

// 获取
export function gethistor(data){
	return request({
		url:'/v1/tire/history/list',
		method:'get',
		params:data
	})
}

// gps里程列表
export function gpslist(data){
	return request({
		url:'/v1/tire/gps/list',
		method:'get',
		params:data
	})
}

// 维护记录列表
export function aintenance(data){
	return request({
		url:'/v1/tire/maintenance/detail',
		method:'get',
		params:data
	})
}


// 轮胎待处理
export function getTiresdaichuli(data){
	return request({
		url:'/v1/tire/lifecycle/getTires',
		method:'post',
		data:data
	})
}

// 轮胎安装
export function tireinstall (data){
	return request({
		url:'/v1/tire/lifecycle/tireChanger/install/' + data.vehicleId,
		method:'post',
		data:data
	})
}

// 轮胎拆卸
export function tiredetail(data){
	return request({
		url:'/v1/tire/lifecycle/tireChanger/uninstall/' + data.vehicleId,
		method:'post',
		data:data
	})
}

// 指定车辆信息
export function carinfo(data){
	return request({
		url:'/v1/tireMonitor/vehicles/position/'+ data,
		method:'get'
	})
}

// 维订单列表（即全部列表）
export function aintenancelist(data){
	return request({
		url:'/v1/tire/maintenance/list',
		method:'post',
		data:data
	})
}

// 新增轮胎维护
export function addtiretrue(data){
	return request({
		url:'/v1/tire/maintenance/add',
		method:'post',
		data:data
	})
}

// 维护详情
export function maintenancinfo (data){
	return request({
		url:'/v1/tire/maintenance/' + data,
		method:'get'
	})
}
// 维护详情
export function maintenancinfotw (data){
	return request({
		url:'/v1/tire/maintenance/' + data.id,
		method:'get',
		params:data.data
	})
}

// 维护列表导出
export function exportmainlist(data){
	return request({
		url:'/v1/tire/maintenance/export',
		method:'get',
		params:data
	})
}

// 修补列表导出
export function exportxiubulist(data){
	return request({
		url:'/v1/tire/maintenance/repairExport',
		method:'get',
		params:data
	})
}

// 翻新列表导出
export function exportfanxinlist(data){
	return request({
		url:'/v1/tire/maintenance/refurbishmentExport',
		method:'get',
		params:data
	})
}


// 轮胎检查
export function inspectlist(data){
	return request({
		url:'/v1/tire/inspection/list',
		method:'get',
		params:data
	})
}

// 人工里程登记列表
export function lichenlist(data){
	return request({
		url:'/v1/tire/register/list',
		method:'get',
		params:data
	})
}

// 人工里程提交
export function licehn(data){
	return request({
		url:'/v1/tire/register',
		method:'post',
		data:data
	})
}


// 轮胎检查详情
export function tirecherkinfo(data){
	return request({
		url:'/v1/tire/inspection/' + data,
		method:'get'
	})
}

// 轮胎检查处理
export function ijtirecherk(data){
	return request({
		url:'/v1/tire/inspection',
		method:'put',
		data:data
	})
}

// 轮胎检查导出
export function exportchetireinfo(data){
	return request({
		url:'/v1/tire/inspection/export',
		method:'get',
		params:data
	})
}

// 人工里程导出
export function exlichen(data){
	return request({
		url:'/v1/tire/register/export',
		method:'get',
		params:data
	})
}

// 里程总里程
export function zlic(data){
	return  request({
		url:'/v1/tire/gps/mileageSum',
		method:'get',
		params:data
	})
}
