<template>
    <div class="app-container">
        <el-form label-width="75px" class="indexforn">
            <el-form-item label="统计类型">
                <el-select v-model="queryform.dateType" filterable @change="getDefaultDate">
                    <el-option label="按年度统计" value="year" />
                    <el-option label="按月度统计" value="moth" />
                </el-select>
            </el-form-item>
            <el-form-item label="年度" v-if="queryform.dateType == 'year'">
                <el-date-picker format="YYYY" value-format="YYYY" v-model="queryform.startTime" type="year"
                    placeholder="请选择年度" />
            </el-form-item>
            <el-form-item label="月度" v-if="queryform.dateType == 'moth'">
                <el-date-picker format="YYYY-MM" value-format="YYYY-MM" v-model="queryform.startTime" type="month"
                    placeholder="请选择年度" />
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
                    <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in pinpai" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="轮胎规格">
                <el-select placeholder="请选择轮胎规格" v-model="queryform.specificationsId" filterable :clearable="true">
                    <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in guige" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="花纹型号">
                <el-select placeholder="请输入花纹型号" v-model="queryform.pattern" filterable :clearable="true">
                    <el-option :label="item.paramName" :value="item.paramName" v-for="(item, index) in xinhao"
                        :key="index" />
                </el-select>
            </el-form-item>
            <div style="text-align: center;">
                <el-button v-hasPermi="['tpms:scrap:query']" type="primary" @click='getList'><i class="el-icon-search"></i>
                    查询</el-button>
                <el-button v-hasPermi="['tpms:scrap:export']" @click="exportable"><i
                        class="el-icon-upload2"></i>导出</el-button>
            </div>
        </el-form>

        <div class="centerOperate">
            <el-radio-group v-model="queryform.type" @change="getList('init')">
                <el-radio-button label="">全部</el-radio-button>
                <el-radio-button label="1">正常报废</el-radio-button>
                <el-radio-button label="2">提前报废</el-radio-button>
                <el-radio-button label="3">报废原因待定库</el-radio-button>
            </el-radio-group>
        </div>
        <el-table v-hasPermi="['tpms:scrap:query']" :data="dataList" class="my-table" @cell-click="openDetail">
            <el-table-column class="aaaaaa" label="胎号" align="center" prop="tireNo" width="180" />
            <el-table-column label="品牌" align="center" prop="tireBrandName" />
            <el-table-column label="规格" align="center" prop="specificationsName" />
            <el-table-column label="花纹型号" align="center" prop="pattern" />
            <el-table-column label="新胎花纹深度(mm)" align="center" prop="depth" />
            <el-table-column label="安装日期" align="center" prop="installTime" />
            <el-table-column label="卸下日期" align="center" prop="uninstallTime" />
            <el-table-column label="卸下花纹深度(mm)" align="center" prop="measuredDepth" />
            <el-table-column label="累计里程(km)" align="center" prop="totalMileage" />
            <el-table-column label="报废类型" align="center" prop="scrappingType" :formatter="scrappingDetermine" />
            <el-table-column label="问题类型" align="center">
				<template #default="scope">
					<span v-if="scope.row.scrappingType == 1 && scope.row.questionContent">{{ ques(scope.row.questionType) }}</span>
					<el-button link type="primary" @click="handleUpdate(scope.row.scrapId,false)" v-if="!scope.row.questionContent"
						 v-hasPermi="['tpms:scrap:edit']">
						 <Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>补录
					 </el-button>
					<span v-if="scope.row.scrappingType == 0"> - </span>
				       <!-- <el-button link type="primary" @click="handleUpdate(scope.row.scrapId)"
				            v-hasPermi="['tpms:scrap:edit']">
				            <Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑
				        </el-button> -->
				    </template>
			</el-table-column>
            <el-table-column label="操作" align="center" prop="totalMileage">
                <template #default="scope">
                    <el-button link type="primary" @click="handleUpdate(scope.row.scrapId,true)"
                        v-hasPermi="['tpms:scrap:edit']">
                        <Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum" v-model:limit="queryform.pageSize"
            @pagination="getList" />


        <div v-if="queryform.type != 1" class="centerbox"
            style="display: flex;align-items: center;justify-content: center;">
            <div id="echaxone" ref="echaxone"></div>
        </div>
        <div v-if="queryform.type == 2" class="centerbox">
            <div style="display: flex;justify-content: flex-end;">问题类型选择：
                <el-select v-model="barType" clearable placeholder="请选择" :default-first-option="true" @change="barChange"
                    default-first-option>
                    <el-option :label="item.label" :value="item.value" v-for="(item, index) in barTypeList" :key="index" />
                </el-select>
            </div>
            <div id="echartLine" ref="echartLine"></div>
        </div>

        <!-- //详情 -->
        <el-dialog :title="dangan" v-model="xiangqing" width="85%" :close-on-click-modal="false">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="轮胎详情" name="first">
                    <cartirefrom :xinhao="xinhao" :updateform="updateform" :pinpai="pinpai" :houselist="houselist"
                        :gongyings="gongyings" :xiangqing="xiangqing" @onReceiveMsg="onReceiveMsg" @onReceive="onReceive">
                    </cartirefrom>
                </el-tab-pane>
                <el-tab-pane label="轮胎生命周期" name="second">
                    <carlive :tid="tid"></carlive>
                </el-tab-pane>
                <el-tab-pane label="GPS阶段里程" name="third">
                    <gpsfrom :tid="tid" :tireNo="tireNo"></gpsfrom>
                </el-tab-pane>
                <el-tab-pane label="维护记录" name="fourth">
                    <fourthfrom :tid="tid"></fourthfrom>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>

        <!-- 报废编辑 -->
        <el-dialog title="报废编辑" v-model="openEdit" width="70%" :close-on-click-modal="false">
            <el-form label-width="150px" :model="tableData" ref="menuRef" :validate-on-rule-change="false">
                <div>
                    <el-form-item label="轮胎去向" v-if="ishav">
                        <el-select placeholder="请选择拆去方向" v-model="tableData.stockStatusName" clearable>
                            <el-option v-for="dict in stockStatus_tire" :key="dict.value" :label="dict.label"
                                :value="dict.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="实测花纹深度(mm)" v-if="ishav">
                        <el-input style="width: 171px" placeholder="请输入实测花纹深度(mm)"
                            v-model="tableData.measuredDepth"></el-input>
                    </el-form-item>
                    <el-form-item label="胎号">
                        {{ tableData.tireNo }}
                    </el-form-item>
                    <el-form-item label="报废类型" v-if="tableData.stockStatusName == '50'">
                        <el-radio-group v-model="tableData.scrappingType">
                            <el-radio :label="0">正常报废</el-radio>
                            <el-radio :label="1">提前报废</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div v-if="tableData.scrappingType == 1 && tableData.stockStatusName == '50'">
                    <el-form-item label="问题类型">
                        <el-select placeholder="问题类型" v-model="tableData.questionType">
                            <el-option label="质量问题" value="lifecycle_tire_quality_problem"></el-option>
                            <el-option label="使用问题" value="lifecycle_tire_use_problem"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="质量问题" v-if="tableData.questionType == 'lifecycle_tire_quality_problem'">
                        <el-checkbox-group v-model="qualityQuestion">
                            <el-checkbox v-for="dict in lifecycle_tire_quality_problem" :key="dict.value"
                                :label="`${dict.value},${dict.label}`">{{ dict.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="使用问题" v-if="tableData.questionType == 'lifecycle_tire_use_problem'">
                        <el-checkbox-group v-model="useQuestion">
                            <el-checkbox v-for="dict in lifecycle_tire_use_problem" :key="dict.value"
                                :label="`${dict.value},${dict.label}`">{{ dict.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
                <el-form-item label="备注">
                    <el-input style="width: 80%" type="textarea" v-model="tableData.remark"></el-input>
                </el-form-item>
            </el-form>
            <div style="text-align: center;margin-top: 15px;" slot="footer" class="dialog-footer">
                <el-button type="warning" @click="submit">确定</el-button>
                <el-button @click="openEdit = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { ElMessage } from 'element-plus'
import { tirelist, exportxlxs, getTireBands, getSpecifications, getpatternmodel } from '@/api/carlive'
import { scrapList, scrapExport, scrapDetail, editScrap, scrapPie, scrapBar } from '@/api/report'
import { tireinfos } from '@/api/car.js'
import cartirefrom from '@/components/Carlive/cartirefrom.vue'
import carlive from '@/components/Carlive/carlive.vue'
import gpsfrom from '@/components/Carlive/gpsfrom.vue'
import fourthfrom from '@/components/Carlive/fourthfrom.vue'
import { supperlist } from "@/api/system/tenant";
import { warehouselist } from '@/api/warehouse'
const { proxy } = getCurrentInstance();
import * as echarts from 'echarts';
const { lifecycle_tire_quality_problem, lifecycle_tire_use_problem } = proxy.useDict("lifecycle_tire_quality_problem", "lifecycle_tire_use_problem");
const queryform = ref({
    dateType: 'year',
    pageNum: 1,
    pageSize: 10,
    vehicleNo: '',
    tireNo: '',
    type: ''
})
const queryformDetail = ref({
    date: '',
    stockStatus: "",
    pageNum: 1,
    pageSize: 10,
    vehicleNo: '',
    engineType: '',
    type: '0',
    way: "",
    quarter: ""
})
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号
const xiangqing = ref(false)//详情
const updateform = ref({})//胎压详情from
const dangan = ref('')//详情标题
const tid = ref(null)
const tireNo = ref('')
const gongyings = ref([])
const houselist = ref([])//仓库
const openEdit = ref(false)
const tableData = ref({})
const qualityQuestion = ref([])
const useQuestion = ref([])
const stockStatus_tire = ref([
    { value: '15', label: '恢复为待用' },
    { value: '30', label: '恢复为待修补' },
    { value: '50', label: '已报废' },
])
const ishav=ref(true)
const barType = ref('1')
const barTypeList = ref([{ value: '1', label: '质量问题' }, { value: '2', label: '使用问题' }])
// 获取table数据
function getList(val) {
    if (val == 'init') {
        queryform.value.pageNum = 1
        queryform.value.pageSize = 10
    }
    drawPie()
    drawLine()
    scrapList(queryform.value).then(res => {
        dataList.value = res.data.items
        total.value = res.data.total
    })
}
function ques(e){
	if(e=='lifecycle_tire_quality_problem'){
		return "质量问题"
	}else if(e=='lifecycle_tire_use_problem'){
		return "使用问题"
	}
}
function Nameblur(e) {
    queryform.value.tireNo = e.target.value
}
const drawPie = () => {
    let params = JSON.parse(JSON.stringify(queryform.value))
    if (!queryform.value.type) {
        params.type = '0'
    }
    if (queryform.value.type != 1) {
        scrapPie(params).then(res => {
            var myChart = echarts.init(document.getElementById("echaxone"), null, { devicePixelRatio: 2.5 });
            myChart.setOption({
                title: {
                    x: 'center',
                    text: params.type == '0' || params.type == '3' ? "报废类型统计" : "问题类型统计"
                },
                toolbox: {

                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    type: 'scroll',
                    bottom: 0,
                    left: 'center',
                    data: params.type == '0' || params.type == '3' ? ['正常报废', "提前报废"] : ['质量问题', '使用问题'],
                },
                series: [
                    {
                        name: '报废类型占比',
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: '{b} : {c} ({d}%)',
                                    fontSize: 15
                                },
                                labelLine: { show: true }
                            }
                        },
                        data: res.data.data
                    }
                ]
            })
            window.addEventListener("resize", function () {
                myChart.resize();
            });
        })
    }
};
const drawLine = () => {
    let params = JSON.parse(JSON.stringify(queryform.value))
    if (queryform.value.type == 2) {
        scrapBar(params).then((res) => {
            var myPie2 = echarts.init(document.getElementById("echartLine"));
            myPie2.setOption({
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {
                            show: true
                        },
                    }
                },
                title: {
                    x: 'center',
                    text:barType.value==1?"质量问题":"使用问题"
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: res.data[barType.value].xaxis,
                        axisLabel: {
                            interval: 0,
                            rotate: 40
                        }
                    }
                ],
                grid: {
                    top: '8%',
                    left: '3%',
                    right: '4%',
                    bottom: '15%',
                    containLabel: true
                },
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}次'
                        }
                    }
                ],
                series: [
                    {
                        name: '品牌数量占比',
                        type: 'bar',
                        data: res.data[barType.value].yaxis,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: 'black'
                                    }
                                }
                            }
                        },
                        color: '#5fa1ff',
                        barWidth: 30//柱图宽度
                    }
                ]
            });
            window.addEventListener("resize", function () {
                myPie2.resize();
            });
        })
    }
};
const barChange = (e) => {
    drawLine()
}
// 导出
function exportable() {
    let params = JSON.parse(JSON.stringify(queryform.value))
    params.pageNum = 1,
        params.pageSize = 100000
    scrapExport(params).then(res => {
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
        link.download = "报废轮胎列表.xlsx";
        link.click();
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        var blob = new Blob([data], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, "报废轮胎列表.xlsx");
    } else {
        // Firefox version
        var file = new File([data], "报废轮胎列表.xlsx", { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
    }
}
function getDefaultDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
	 const currentMonth = today.getMonth() + 1;
	if(queryform.value.dateType == "year"){
		queryform.value.startTime = currentYear.toString();
		queryformDetail.value.startTime = currentYear.toString();
	}else{
		queryform.value.startTime = currentYear + '-' + currentMonth.toString().padStart(2, '0');
		queryformDetail.value.startTime = currentYear + '-' + currentMonth.toString().padStart(2, '0');
	}
}
function scrappingDetermine(row) {
    return row.scrappingType == 0 ? "正常报废" : "提前报废"
}
function openDetail(row, column) {
    if (column.property == "tireNo") {
        dangan.value = "轮胎档案【" + row.tireNo + "】"
        tireinfos(row.tireId).then(res => {
            updateform.value = res.data
            tid.value = row.tireId
            xiangqing.value = true
        })
        tireNo.value = row.tireNo
    }
}
// 详情
const activeName = ref('first')
watch(() => xiangqing.value, value => {
    if (!value) {
        tid.value = ''
        getList()
    }
})
// 子组件触发的方法
const onReceiveMsg = (params) => {
    chuango(params.senderId, params.tireNo, params.tireId, params.senderType)
}
const onReceive = (params) => {
    xiangqing.value = params
    getList()
}
const handleUpdate = (id,is) => {
    scrapDetail(id).then((res) => {
			ishav.value=is
        res.data.stockStatusName = '50'
        tableData.value = res.data
        openEdit.value = true
        useQuestion.value = []
        qualityQuestion.value = []
        if (res.data.questionType == 'lifecycle_tire_use_problem') {
            let tempId = res.data.questionContent.split(',')
            let tempLabel = res.data.questionContentCn.split(',')
            tempId.forEach((item, index) => {
                useQuestion.value.push(`${item},${tempLabel[index]}`)
            })
        } else if (res.data.questionType == 'lifecycle_tire_quality_problem') {
            let tempId = res.data.questionContent.split(',')
            let tempLabel = res.data.questionContentCn.split(',')
            tempId.forEach((item, index) => {
                qualityQuestion.value.push(`${item},${tempLabel[index]}`)
            })
        }
    })
}
const submit = () => {
	if(tableData.value.scrappingType == 1 && !tableData.value.questionType){
		ElMessage({
		    type: 'error',
		    message: '问题类型不能为空',
		})
		return false
	}
	if(tableData.value.stockStatusName != '50' && tableData.value.measuredDepth<=1.6){
		ElMessage({
		    type: 'error',
		    message: '对不起，恢复轮胎状态时，花纹深度不能<=1.6mm',
		})
		return false
	}
	if(tableData.value.stockStatusName == '50' && tableData.value.measuredDepth>tableData.value.depth){
		ElMessage({
		    type: 'error',
		    message: '对不起，新胎花纹深度为【' + tableData.value.depth+'】mm,实测花纹深度，不能大于新胎花纹深度',
		})
		return false
	}
    if (tableData.value.questionType == 'lifecycle_tire_use_problem') {
        let tempId = []
        let tempLabel = []
		if(useQuestion.value.length == 0){
			ElMessage({
			    type: 'error',
			    message: '使用问题不能为空',
			})
			return false
		}else{
			for (var item of useQuestion.value) {
			    tempId.push(item.split(',')[0])
			    tempLabel.push(item.split(',')[1])
			}
			tableData.value.questionContent = tempId.join(',')
			tableData.value.questionContentCn = tempLabel.join(',')
		}
        
		
    } else if (tableData.value.questionType == 'lifecycle_tire_quality_problem') {
        let tempId = []
        let tempLabel = []
		if(qualityQuestion.value.length == 0){
			ElMessage({
			    type: 'error',
			    message: '质量问题不能为空',
			})
			return false
		}else{
			for (var item of qualityQuestion.value) {
			    tempId.push(item.split(',')[0])
			    tempLabel.push(item.split(',')[1])
			}
			tableData.value.questionContent = tempId.join(',')
			tableData.value.questionContentCn = tempLabel.join(',')
		}
        
    }
    editScrap(tableData.value).then((res) => {
        openEdit.value = false
        ElMessage({
            type: 'success',
            message: '修改成功',
        })
		 getList()
    })
}
onMounted(() => {
    getDefaultDate()
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
    // 仓库
    warehouselist({}).then(res => {
        houselist.value = res.data.items
    })
    // 供应商
    supperlist({ pageNum: 1, pageSize: 100000 }).then(res => {
        gongyings.value = res.data.items
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

.top {
    text-align: center;
    height: 60px;
}

.centerOperate {
    line-height: 50px;
}

.centerbox {
    margin: 20px 0;
}

#echaxone {
    height: 300px;
    width: 600px;
}

#echartLine {
    height: 400px;
    width: 80%;
    margin: 0 auto;
}

.titles {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

::v-deep .my-table .el-table__body td:first-child {
    color: #ffa500;
    cursor: pointer;

    :hover {
        color: #333;
    }
}
</style>
  