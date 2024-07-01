<template>
    <div class="app-container">
        <div>
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="车牌号">
                    <el-select placeholder="请输入车牌号" v-model="queryform.vehicleNo" filterable :clearable="true">
                        <el-option :label="item" :value="item" v-for="(item, index) in vehicleNoo" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="胎号">
                    <el-select v-model="queryform.tireNo" filterable clearable placeholder="请选择" allow-create
                        :default-first-option="true" @blur="Nameblur($event)" default-first-option>
                        <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item, index) in chetai" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="轮胎品牌">
                    <el-select placeholder="请输入品牌" v-model="queryform.tireBrandId" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in pinpai"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="轮胎规格">
                    <el-select placeholder="请选择轮胎规格" v-model="queryform.specificationsId" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in guige"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="花纹型号">
                    <el-select placeholder="请输入花纹型号" v-model="queryform.pattern" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramName" v-for="(item, index) in xinhao"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="修补内容">
                    <el-select style="width: 100%;" placeholder="请选择修补内容" v-model="queryform.contentId" :clearable="true">
                        <el-option :label="item.label" :value="item.value" v-for="(item, index) in lifecycle_tire_repair"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="统计时间" style="margin-right: 30px;">
                    <el-date-picker v-model="searchDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                    <el-button v-hasPermi="['tpms:refurbishmentDetails:export']" @click="exportable"><i
                            class="el-icon-upload2"></i>导出</el-button>
                </div>
            </el-form>
            <el-table :data="dataList.items">
                <el-table-column label="胎号" align="center" prop="tireNo" width="180" />
                <el-table-column label="新胎号" align="center" prop="newTireNo" />
                <el-table-column label="胎体品牌" align="center" prop="tireBrandName" />
                <el-table-column label="新胎花纹深度" align="center" prop="depth" />
                <el-table-column label="翻新费用" align="center" prop="cost" />
                <el-table-column label="翻新去向" align="center" prop="stockStatusCn" />
                <el-table-column label="经办人" align="center" prop="maintainer" />
                <el-table-column label="翻新厂家" align="center" prop="manufacturer" />
                <el-table-column label="翻新日期" align="center" prop="maintenanceDate" :formatter="dateFormatter" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
                v-model:limit="queryform.pageSize" @pagination="getList" />

            <p class="titles">
                <span>
                    <img src="@/assets/r_icon1.png">
                    翻新轮胎数：{{ dataList.tireCount }}条 &emsp;翻新总次数：{{ dataList.totalNumber }}次 &emsp;总金额：￥{{ dataList.allPrice }}
                </span>
            </p>
        </div>

    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { tirelist, exportxlxs, getTireBands, getSpecifications, getpatternmodel } from '@/api/carlive'
import { refurbishmentDetailsList, refurbishmentExport } from '@/api/report'
const { proxy } = getCurrentInstance();
const { lifecycle_tire_repair } = proxy.useDict("lifecycle_tire_repair");
const queryform = ref({
    pageNum: 1,
    pageSize: 10,
    vehicleNo: '',
    tireNo: '',
    tireBrandId: '',
    specificationsId: '',
    pattern: '',
    manufacturer: '',
    maintainer: '',
    contentId: '',
    startTime: '',
})
const searchDate = ref([])
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号

// 获取table数据
function getList() {
    if (searchDate.value && searchDate.value.length > 0) {
        queryform.value.startTime = searchDate.value[0]
        queryform.value.endTime = searchDate.value[1]
    } else {
        queryform.value.startTime = ''
        queryform.value.endTime = ''
    }

    refurbishmentDetailsList(queryform.value).then(res => {
        dataList.value = res.data
        total.value = res.data.total
    })
}
function Nameblur(e) {
    queryform.value.tireNo = e.target.value
}
// 导出
function exportable() {
    let params = JSON.parse(JSON.stringify(queryform.value))
    params.pageNum = 1,
    params.pageSize = 100000
    refurbishmentExport(params).then(res => {
        exportxlxs(res.data).then(respon => {
            downloadFiles(respon)
        })
    })
}
// 解码下载方法
function downloadFiles(data) {
    if (typeof window.chrome !== 'undefined') {
        // Chrome version
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = "轮胎翻新明细表.xlsx";
        link.click();
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        var blob = new Blob([data], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, "轮胎翻新明细表.xlsx");
    } else {
        // Firefox version
        var file = new File([data], "轮胎翻新明细表.xlsx", { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
    }
}

const dateFormatter = (row) => {
    return getDefaultDate(row.maintenanceDate)
}
function getDefaultDate(date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate()
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0') + ' ' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
}
onMounted(() => {
    vehicleNo().then(res => {
        if (res.code == 200) {
            vehicleNoo.value = res.data.items
        }
    })
    // 车胎
    tirelist({ pageNum: 1, pageSize: 10000 }).then(res => {
        if (res.code == 200) {
            chetai.value = res.data.items
        }
    })
    // 品牌
    getTireBands().then(res => {
        pinpai.value = res.data
    })
    // 规格
    getSpecifications().then(res => {
        guige.value = res.data
    })
    // 花纹型号
    getpatternmodel().then(res => {
        xinhao.value = res.data
    })
    getList()
})

</script>
<style scoped lang="scss">
.indexforn {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}

:deep(.el-date-editor--daterange.el-input__inner) {
    width: auto;
    max-width: 209px;
}

.pagedove {
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #606266;
    padding-right: 8px;
    margin-top: 10px;
}

:deep(.pagination-container) {
    margin: 0;
    padding: 0;
}

.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner {
    width: 230px !important;
}

.mb8 {
    margin-top: 20px;
}

.formdiv {
    width: 45%;
}

.line {
    width: 100%;
    border-bottom: 1px solid #ccc;
    margin: 20px 0;
    font-size: 14px;
    color: #ccc;
    display: flex;
    align-items: center;
}

:deep(.el-form-item__content) {
    display: flex;
    align-items: center;
}

:deep(.el-input) {
    width: 80%;
}

.marri {
    margin-right: 30px;
}

.closr {
    font-size: 16px;
    line-height: 34px;
}

.closr span {
    margin-right: 15px;
}

.pagination-container .el-pagination {
    right: 20px;
}

.titles {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: red;
    margin-top: 20px;
    font-weight: bold;
    align-items: center;
}
</style>
  