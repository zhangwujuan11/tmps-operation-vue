import request from '@/utils/request'
const baseurl = import.meta.env.VITE_APP_BASE_API

import axios from 'axios'


// 实时胎压车牌列表
export function getalltire(data,monitorStatus){
	if(monitorStatus==undefined){
		monitorStatus="";
	}
	return request({
		url:'/v1/tireMonitor/vehicles/'+ data + '/tires?monitorStatus='+monitorStatus,
		method:'get'
	})
}
// 指定车辆信息
export function getcarinfo(data){
	return request({
		url:'/v1/tireMonitor/vehicles/position/' + data,
		method:'get'
	})
}


// 高德地图最后上报定位点
export function lastpointer(data){
	return request({
		url:'/v1/tireMonitor/actions/gps_positionLatest?vehicleId=' + data,
		method:'get'
	})
}


// 胎压监控echarts图
export function getecharts (data){
	return request({
		url:'/v1/tireMonitor/actions/pressure/curve',
		method:'get',
		params:data
	})
}

// 胎压监控echarts图app
export function getechartsapp (data,token){
	return axios({
		url:import.meta.env.VITE_APP_BASE_API+'/v1/tireMonitor/actions/pressure/curve',
		method:'get',
		params:data,
		headers:{
			"Authorization": 'Bearer ' + token
		}
	})
}


// 轮胎报警记录获取
export function getalarmlist (data){
	return request({
		url:"/v1/tireMonitor/alarmRecords",
		method:'get',
		params:data
	})
}


// 胎温胎压报警记录列表
export function alarmRecordslist(data){
	return request({
		url:'/v1/tireMonitor/alarmRecords',
		method:'get',
		params:data
	})
}
// 胎温胎压报警记录明细
export function alarmRecordsinfo(data){
	return request({
		url:'/v1/tireMonitor/history/alarmRecords',
		method:'get',
		params:data
	})
}

// 定位
// 轮胎定位数据
export function actionsearch(data){
	return request({
		url:'/v1/tireMonitor/positions/actions/search',
		method:'get',
		params:data
	})
}
// 定位统计
export function positionactiontotal(data){
	return request({
		url:'/v1/tireMonitor/positions/actions/count',
		method:'get',
		params:data
	})
}




// 导出当前轮胎报警记录
export function exportactionposition(data){
	return request({
		url:'/v1/tireMonitor/alarmRecords/actions/export',
		method:'get',
		params:data,
		responseType:'blob'
	})
}

// [实时胎压]获取指定轮胎的详细信息
export function tirestireId(data){
	return request({
		url:'/v1/tireMonitor/vehicles/tires/'+ data,
		method:'get'
	})
}

// [实时胎压]获取指定车辆的所有轮位信息和设备编号
export function echartshowinfo(data){
	return request({
		url:'/v1/tireMonitor/vehicles/tires/position/' + data,
		method:'get'
	})
}
// [实时胎压]获取指定车辆的所有轮位信息和设备编号
export function echartshowinfoapp(data,token){
	return axios({
		url:import.meta.env.VITE_APP_BASE_API+'/v1/tireMonitor/vehicles/tires/position/' + data,
		method:'get',
		headers:{
			"Authorization": 'Bearer ' + token
		}
	})
}


// 当前安装轮胎信息，历史安装轮胎信息
export function detailtab(data){
	return request({
		url:'/v1/tireMonitor/tire/install/' + data.id,
		method:'get',
		params:data
	})
}


// 消息告警列表

export function newslist(data){
	return request({
		url:'/v1/alarmMsg/list',
		method:'get',
		params:data
	})
}

//gps轨迹
export function gpsguiji(data){
	return request({
		url:'/v1/tireMonitor/actions/gps_position',
		method:'get',
		params:data
	})
}



//gps轨迹
export function gpsguijiapp(data,token){
	return axios({
		url:import.meta.env.VITE_APP_BASE_API+'/v1/tireMonitor/actions/gps_position',
		method:'get',
		params:data,
		headers:{
			"Authorization": 'Bearer ' + token
		},
		async:true
	})
}

// gps最后定位点
export function gpsguijiapplast(data,token){
	return axios({
		url:import.meta.env.VITE_APP_BASE_API+'/v1/tireMonitor/actions/gps_positionLatest?vehicleId=' + data,
		method:'get',
		headers:{
			"Authorization": 'Bearer ' + token
		},
		async:true
	})
}


// ,海拔速度曲线图
export function getechangtte(data){
	return request({
		url:'/v1/tireMonitor/actions/altitude/curve',
		method:'get',
		params:data
	})
}


// 故障跟踪列表
export function malfunctionslist(data){
	return request({
		url:'/v1/tireMonitor/malfunctions',
		method:'get',
		params:data
	})
}

// 故障跟踪分类统计
export function countmal(data){
	return request({
		url:'/v1/tireMonitor/malfunctions/actions/count',
		method:'get',
		params:data
	})
}

// 车辆轮位自动跟踪列表
export function autoPositionslist(data){
	return request({
		url:'/v1/tireMonitor/autoPositions/actions/search',
		method:'POST',
		data: data
	})
}

// 导出报警明细
export function exmingxi(data){
	return request({
		url:'/v1/tireMonitor/alarmRecords/actions/history/export',
		method:'get',
		params:data,
		responseType:'blob'
	})
}

// 自动定位跟踪导出
export function exautoPositions(data){
	return request({
		url:'/v1/tireMonitor/autoPositions/actions/export',
		method:'post',
		data:data,
		responseType:'blob'
	})
}


// 故障跟踪导出
export function fuzgz(data){
	return request({
		url:'/v1/tireMonitor/malfunctions/actions/export',
		method:'get',
		params:data,
		responseType:'blob'
	})
}

// 我的消息详情
export function newinfo(data){
	return request({
		url:'v1/alarmMsg/handel/msg/' + data,
		method:'get'
	})
}

// 我的消息处理
export function newsinfodo(data){
	return request({
		url:'/v1/alarmMsg/handel/editState',
		method:'put',
		data:data
	})
}

// 经纬度翻译
export function readlocotion(data){
	return axios({
		url:'https://restapi.amap.com/v3/geocode/regeo?key=6fec58f500992fabb2970c691438ef91&location=' + data,
		method:'GET'
	})
}

// 定位数据导出
export function gpsporintexport (data){
	return request({
		url:'/v1/tireMonitor/actions/export/gps_position',
		method:'get',
		params:data,
		responseType:'blob'
	})
}