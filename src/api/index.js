import request from '@/utils/request'

export function onlicount (){
	return request({
		url:'/v1/home_page/actions/online/count',
		method:'get'
	})
}

export function yichan(){
	return request({
		url:'/v1/home_page/actions/tire/malfunction',
		method:'get'
	})
}

export function install(){
	return request({
		url:'/v1/home_page/actions/install/count',
		method:'get'
	})
}

export function exbarans(){
	return request({
		url:'/v1/home_page/actions/band/count',
		method:'get'
	})
}

export function nohavedata(){
	return request({
		url:'/v1/home_page/actions/pressureRecord/count',
		method:'get'
	})
}

export function echarttemp(){
	return request({
		url:'/v1/home_page/actions/alarm_echarts',
		method:'get'
	})
}