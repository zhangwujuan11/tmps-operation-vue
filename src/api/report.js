import request from '@/utils/request'

// 轮胎维护明细表
export function maintenanceDetailsList(data) {
    return request({
        url: '/v1/stats/maintenance/details/list',
        method: 'post',
        data: data
    })
}

// 轮胎维护明细表删除
export function delMaintenance(data) {
    return request({
        url: '/v1/stats/maintenance/' + data,
        method: 'delete'
    })
}

// 轮胎维护明细表导出
export function maintenanceExport(data) {
    return request({
        url: '/v1/stats/maintenance/details/export',
        method: 'get',
        params: data
    })
}

// 轮胎维护明细表修改数据
export function editMaintenance(data) {
    return request({
        url: '/v1/stats/maintenance/details/edit',
        method: 'put',
        data: data
    })
}

// 轮胎维护明细表详情
export function maintenanceDetail(data) {
    return request({
        url: '/v1/stats/maintenance/details/' + data,
        method: 'get',
    })
}

// 轮胎翻新明细表
export function refurbishmentDetailsList(data) {
    return request({
        url: '/v1/stats/refurbishment/details/list',
        method: 'post',
        data: data
    })
}

// 轮胎翻新明细表导出
export function refurbishmentExport(data) {
    return request({
        url: '/v1/stats/refurbishment/details/export',
        method: 'get',
        params: data
    })
}

// 报废轮胎明细表
export function scrapList(data) {
    return request({
        url: '/v1/stats/scrap/list',
        method: 'post',
        data: data
    })
}

// 报废轮胎列表导出
export function scrapExport(data) {
    return request({
        url: '/v1/stats/scrap/export',
        method: 'get',
        params: data
    })
}

// 报废轮胎列表详情
export function scrapDetail(data) {
    return request({
        url: '/v1/stats/scrap/details/' + data,
        method: 'get',
    })
}

// 报废轮胎列表修改数据
export function editScrap(data) {
    return request({
        url: '/v1/stats/scrap/edit',
        method: 'put',
        data: data
    })
}

// 报废轮胎列表饼图
export function scrapPie(data) {
    return request({
        url: '/v1/stats/scrap/pie',
        method: 'get',
        params: data
    })
}

// 报废轮胎列表柱状图
export function scrapBar(data) {
    return request({
        url: '/v1/stats/scrap/bar',
        method: 'get',
        params: data
    })
}