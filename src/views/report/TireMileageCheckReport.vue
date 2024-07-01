<template>
    <div class="app-container">
            <el-form label-width="75px" class="indexforn">
				<el-form-item label="轮胎品牌">
				  <el-select
				  placeholder="请输入品牌" 
				  v-model="queryform.tireBrandId"
				  filterable
				  :clearable="true"
				  >
				    <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in pinpai" :key="index" />
				  </el-select>
				</el-form-item>
				<el-form-item label="轮胎规格">
				  <el-select
				  placeholder="请选择轮胎规格" 
				  v-model="queryform.specificationsId"
				  filterable
				  :clearable="true"
				  >
				    <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in guige" :key="index" />
				  </el-select>
				</el-form-item>
				<el-form-item label="花纹型号">
					<el-select
					 placeholder="请输入花纹型号" 
					 v-model="queryform.pattern"
					 filterable
					 :clearable="true"
					>
					 <el-option :label="item.paramName" :value="item.paramName"  v-for="(item,index) in xinhao" :key="index" />
					</el-select>
				</el-form-item>
				<el-form-item label="动力类型">
					<el-select v-model="queryform.engineType" clearable>
					    <el-option v-for="dict in car_power" :key="dict.value" :label="dict.label"
					        :value="dict.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="轴位">
					<el-select v-model="queryform.zhou" clearable>
					    <el-option label="1轴" value="1"></el-option>
					    <el-option label="2轴" value="2"></el-option>
					    <el-option label="3轴" value="3"></el-option>
					    <el-option label="4轴" value="4"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="组织">
					   <el-tree-select
					    :default-expand-all="true"
					      v-model="queryform.fleetId"
					      :data="deptOptions"
					      :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
					      value-key="deptId"
					      placeholder="选择组织"
					      check-strictly
					   />
				</el-form-item> -->
				<el-form-item label="车牌号">
				  <el-select
				  placeholder="请输入车牌号" 
				  v-model="queryform.vehicleNo"
				  filterable
				  :clearable="true"
				  >
				    <el-option :label="item" :value="item"  v-for="(item,index) in vehicleNoo" :key="index" />
				  </el-select>
				  </el-form-item>
				  <el-form-item label="胎号">
				    <el-select v-model="queryform.tireNo"
				    	filterable clearable placeholder="请选择"
				    	allow-create
				    	:default-first-option="true"
				    	@blur="Nameblur($event)"
				    	default-first-option>
				    	<el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
				     </el-select>
				    </el-form-item>
					
            		<div style="text-align: center;">
            		  <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 查询</el-button>
            		  <el-button @click="exportable"><i class="el-icon-upload2"></i>导出</el-button>
            		</div>
                </el-form>
				<div class="downbox">
					<div class="titles">
						<p>
							<img src="@/assets/r_icon1.png">
							轮胎里程考核统计
							<span>(注：列表仅显示正常报废轮胎，如未设置考核里程，请到 [系统管理]->[考核里程设置] 去设置参数)</span>
						</p>
					</div>
					<div id="echaxtwo" ref="echaxtwo"></div>
				</div>
            <el-table :data="dataList">
                <el-table-column label="胎号" align="center" prop="tireNo" width="180" />
                <!-- <el-table-column label="组织" align="center" prop="tireNo" width="180" /> -->
                <el-table-column label="品牌" align="center" prop="tireBrandName" />
                <el-table-column label="规格" align="center" prop="specificationsName" />
                <el-table-column label="花纹型号" align="center" prop="pattern" />
                <el-table-column label="实测花纹深度(mm)" align="center" prop="depth" />
                <el-table-column label="单价" align="center" prop="depth" />
                <el-table-column label="考核里程(km)" align="center" prop="depth" />
                <el-table-column label="实际行驶里程(km)" align="center" prop="depth" />
                <el-table-column label="相差里程(km)" align="center" prop="depth" />
                <el-table-column label="考核金额" align="center" prop="measuredDepth" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
                v-model:limit="queryform.pageSize" @pagination="getList" />
    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { listDept } from "@/api/system/dept";
import { tirelist, expotires, exportxlxs, getTireBands, getSpecifications, getpatternmodel } from '@/api/carlive'
const { proxy } = getCurrentInstance();
const { car_power } = proxy.useDict("car_power");
import * as echarts from 'echarts';
const queryform=ref({
		type:'year',
		pageNum:1,
		pageSize:10,
		install:0,
		vehicleNo:'',
		tireNo:'',
	})
const deptOptions=ref([])
const queryformDetail = ref({
    date: '',
    stockStatus: "",
    pageNum: 1,
    pageSize: 10,
    install: 0,
    vehicleNo: '',
    engineType: '',
    type: '0',
    way: "",
    quarter: ""
})
const optionsWay = [
    {
        value: 'Option1',
        label: '按品牌统计',
    },
    {
        value: 'Option2',
        label: '按规格统计',
    },
    {
        value: 'Option3',
        label: '按花纹统计',
    },
]
const tableData = [
    {
        date: '2016-05-03',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-08',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-06',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
    {
        date: '2016-05-07',
        name: 'Tom',
        state: 'California',
        city: 'Los Angeles',
        address: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    },
]
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号
const report = ref('detail')
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
    queryform.value.date = currentYear.toString();
    queryformDetail.value.date = currentYear.toString();
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
	listDept().then(response => {
	  deptOptions.value = proxy.handleTree(response.data, "deptId");
	});
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
    margin-top: 20px;
    font-weight: bold;
    align-items: center;
}
.titles span{
	color: red;
	font-size: 14px;
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
		width: 300px;
	}
	.titles {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
</style>
  