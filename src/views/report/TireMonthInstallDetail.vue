<template>
    <div class="app-container">
        <div>
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="所属仓库" prop="warehouseName">
                    <el-select placeholder="请输入所属仓库" v-model="queryform.warehouseName" filterable remote :clearable="true">
                        <el-option :label="item.warehouseName" :value="item.warehouseName"
                            v-for="(item, index) in houselist" :key="index" />
                    </el-select>
                </el-form-item>
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
                <el-form-item label="统计时间" style="margin-right: 30px;">
                    <el-date-picker v-model="queryform.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                    <el-button @click="exportable"><i class="el-icon-upload2"></i>导出</el-button>
                    <el-button v-if="printList.length == 0" @click="beforePrint"><i
                            class="el-icon-upload2"></i>打印出库单</el-button>
                    <el-button v-else v-print="printOne"><i class="el-icon-upload2"></i>打印出库单</el-button>
                </div>
            </el-form>
            <el-table :data="dataList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />
                <el-table-column label="胎号" align="center" prop="tireNo" width="180" />
                <el-table-column label="品牌" align="center" prop="tireBrandName" />
                <el-table-column label="规格" align="center" prop="specificationsName" />
                <el-table-column label="花纹型号" align="center" prop="pattern" />
                <el-table-column label="翻新内容" align="center" prop="depth" />
                <el-table-column label="翻新厂家" align="center" prop="depth" />
                <el-table-column label="翻新费用" align="center" prop="depth" />
                <el-table-column label="翻新人" align="center" prop="firstDepth" />
                <el-table-column label="翻新日期" align="center" prop="measuredDepth" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
                v-model:limit="queryform.pageSize" @pagination="getList" />

            <p class="titles">
                <span>
                    <img src="@/assets/r_icon1.png">
                    翻新轮胎数：12条 &emsp;翻新总次数：12次 &emsp;总金额：￥584.00
                </span>
            </p>
        </div>
        <div class="print" v-show="false">
            <div id="printOne">
                <h2 class="title">轮胎出库单</h2>
                    <table cellpadding="0" cellspacing="0" class="tableo">
                        <tbody>
                            <tr>
                                <th width="10%" style="text-align: center;height:50px">
                                    出库单号
                                </th>
                                <td width="20%">
                                    CKD-20240202184557
                                </td>
                                <th width="10%">
                                    开单时间
                                </th>
                                <td width="20%">
                                    2024-02-02 18:45:57
                                </td>
                                <th width="10%">
                                    开单员
                                </th>
                                <td width="20%">
                                    张炳辉
                                </td>
                            </tr>
                            <tr>
                                <th width="10%" style="text-align: center;height: 40px;">
                                    车牌号
                                </th>
                                <td>CES8*8</td>
                                <th width="10%">
                                    公里数
                                </th>
                                <td>0.00km</td>
                                <th width="10%">
                                    线路
                                </th>
                                <td>1</td>
                            </tr>

                            <tr>
                                <td colspan="6" style="text-align: center;padding-bottom:10px">
                                    <div style="margin-top:10px;text-align:center;font-size:16px;font-weight:bold">出库轮胎明细
                                    </div>
                                    <table cellpadding="0" cellspacing="0" class="tableo tablist">
                                        <tbody>
                                            <tr>
                                                <th width="5%" class="tdl">
                                                    序号
                                                </th>
                                                <th class="tdl">
                                                    胎号
                                                </th>
                                                <th class="tdl">
                                                    品牌
                                                </th>
                                                <th class="tdl">
                                                    规格
                                                </th>
                                                <th class="tdl">
                                                    花纹型号
                                                </th>
                                                <th class="tdl">
                                                    新胎花纹深度
                                                </th>
                                                <th class="tdl">
                                                    安装轮位
                                                </th>
                                                <th class="tdl">
                                                    出库人
                                                </th>
                                                <th class="tdl">
                                                    出库时间
                                                </th>
                                            </tr>
                                            <tr>
                                                <td>1</td>
                                                <td>NA|240131140444140</td>
                                                <td>贝力通</td>
                                                <td>10.00R20 OE-18</td>
                                                <td>283/RX</td>
                                                <td>10.00</td>
                                                <td>主车 1轴 左前</td>
                                                <td>张炳辉</td>
                                                <td>2024-01-31 14:06:24</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th width="10%" style="text-align: center;height:60px">
                                    备注
                                </th>
                                <td colspan="5"></td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { warehouselist } from '@/api/warehouse'
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { ElMessage } from 'element-plus'
import { tirelist, expotires, exportxlxs, getTireBands, getSpecifications, getpatternmodel } from '@/api/carlive'
const { proxy } = getCurrentInstance();
const queryform = ref({
    pageNum: 1,
    pageSize: 10,
    install: 0,
    vehicleNo: '',
    engineType: '',
    date: ''
})
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号
const houselist = ref([])//仓库
var printList = ref([])//打印列表
const printOne = ref({
    id: "printOne",
    popTitle: '&nbsp;',
})
// 获取table数据
function getList() {
    tirelist(queryform.value).then(res => {
        dataList.value = res.data.items
        total.value = res.data.total
    })
}
function Nameblur(e) {
    queryform.value.tireNo = e.target.value
}
// 导出
function exportable() {
    expotires(queryform.value).then(res => {
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
        link.download = "轮胎里程预测列表.xlsx";
        link.click();
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        var blob = new Blob([data], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, "轮胎里程预测列表.xlsx");
    } else {
        // Firefox version
        var file = new File([data], "轮胎里程预测列表.xlsx", { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
    }
}
function getDefaultDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()
    queryform.value.date = [currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-' + '01',
    currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-' + lastDay.toString().padStart(2, '0')];
}
const handleSelectionChange = (val) => {
    printList.value = val
}
const beforePrint = () => {
    ElMessage.error('对不起，您还没有勾选需要打印的出库单！')
}
onMounted(() => {
    getDefaultDate()
    // 仓库
    warehouselist({}).then(res => {
        houselist.value = res.data.items
    })
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
    // getList()
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

@media print {
    #printOne {
        .title {
            text-align: center;
        }

        table {
            width: 100%;
            margin: 10px 0 0 0;
            border-collapse: collapse;
            font-size: 13px;
        }

        table th,
        table td {
            border: 1px solid black;
            text-align: left;
            padding: 0 5px;
            text-align: center;
        }

        .tablist th,
        .tablist td {
            height: 40px;
            text-align: center;
        }
    }
}
</style>
  