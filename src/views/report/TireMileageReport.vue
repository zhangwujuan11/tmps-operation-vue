<template>
    <div class="app-container">
            <el-form label-width="75px" class="indexforn">
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
					<el-form-item label="状态">
						<el-select
						 placeholder="请选择状态" 
						 v-model="queryform.isApply"
						 filterable
						 :clearable="true"
						>
						 <el-option label="行驶中轮胎" :value="0" />
						 <el-option label="已卸下轮胎" :value="1" />
						</el-select>
					</el-form-item>
            		<div style="text-align: center;">
            		  <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 查询</el-button>
            		  <el-button @click="exportable"  v-hasPermi="['tpms:mileageStatistics:export']" ><i class="el-icon-upload2"></i>导出</el-button>
            		</div>
                </el-form>
            <el-table :data="dataList">
               <el-table-column label="胎号" align="center" prop="tireNo" width="180">
               		<template #default="scope">
               		    <span @click="goxiang(scope.row)" style="cursor: pointer;">
               				 {{scope.row.tireNo}}
               		    </span>
               		</template>
               </el-table-column>
                <el-table-column label="轮胎分类" align="center" prop="categoryName" width="180" />
                <el-table-column label="状态" align="center" prop="stockStatusName" width="180" />
                <el-table-column label="品牌" align="center" prop="tireBrandName" />
                <el-table-column label="规格" align="center" prop="specificationsName" />
                <el-table-column label="花纹型号" align="center" prop="pattern" />
                <el-table-column label="实测花纹深度(mm)" align="center" prop="measuredDepth" />
                <el-table-column label="累计里程(km)" align="center" prop="totalMileage" />
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
                v-model:limit="queryform.pageSize" @pagination="getList" />
		<!-- //详情 -->
		<el-dialog :title="dangan" v-model="xiangqing" width="85%" :close-on-click-modal="false">
		    <el-tabs v-model="activeName" class="demo-tabs">
		       <el-tab-pane label="轮胎详情" name="first">
				  <cartirefrom :xinhao="xinhao" :updateform="updateform" :pinpai="pinpai" :houselist="houselist" :gongyings="gongyings" :xiangqing="xiangqing" @onReceiveMsg="onReceiveMsg" @onReceive="onReceive"></cartirefrom>
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
		<!-- 传感器id -->
		<el-dialog title="绑定传感器" v-model="chuanid" width="480" append-to-body :close-on-click-modal="false">
		    <el-form label-width="150px" style="flex-wrap: wrap;" :rules="rules" ref="menuRef" :model="chuanfrom">
		        <el-form-item label="胎号" >
					<el-input v-model="chuanfrom.tireNo" disabled></el-input>
				</el-form-item>
				<el-form-item label="传感器ID" prop="senderId">
					<el-input v-model="chuanfrom.senderId" :disabled="!jiebangma"></el-input>
				</el-form-item>
				<el-form-item label="绑定方式" prop="senderType">
		          <el-select
				   :disabled="!jiebangma"
		          placeholder="请选择绑定方式" 
		          v-model="chuanfrom.senderType"
		           filterable
		            :clearable="true"
		          >
		            <el-option :label="item.label" :value="item.value"  v-for="(item,index) in lifecycle_tire_sendertype" :key="index" />
		          </el-select>
		        </el-form-item>
		    </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer">
		      <el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
			  <el-button type="primary" v-if="!jiebangma" @click="jiebangfun">解绑</el-button>
		      <el-button @click="chuanid=false">取消</el-button>
		    </div>
		</el-dialog>
    </div>
</template>
  
<script setup name="TireMonthlyCost" lang="ts">
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { listDept } from "@/api/system/dept";
import { mileageStatistics, mileageStatisticsexport } from "@/api/reop";
import { tirelist, expotires, exportxlxs, getTireBands, getSpecifications, getpatternmodel, bangding,jiebang } from '@/api/carlive'
// new
	import { warehouselist } from '@/api/warehouse'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { supperlist } from "@/api/system/tenant";
	import { tireinfos} from '@/api/car.js'
	import cartirefrom from '@/components/Carlive/cartirefrom.vue'
	import carlive from '@/components/Carlive/carlive.vue'
	import gpsfrom from '@/components/Carlive/gpsfrom.vue'
	import fourthfrom from '@/components/Carlive/fourthfrom.vue'
	// new
const { proxy } = getCurrentInstance();
const { lifecycle_tire_status, car_power } = proxy.useDict("lifecycle_tire_status", "car_power");
import * as echarts from 'echarts';
const queryform=ref({
		pageNum:1,
		pageSize:10,
	})
const deptOptions=ref([])
// const queryformDetail = ref({
//     date: '',
//     stockStatus: "",
//     pageNum: 1,
//     pageSize: 10,
//     install: 0,
//     vehicleNo: '',
//     engineType: '',
//     type: '0',
//     way: "",
//     quarter: ""
// })
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号
const report = ref('detail')

// new
	const dangan=ref('')//详情标题
	const xiangqing=ref(false)//详情
	const activeName = ref('first')
	const updateform=ref({})//胎压详情from
	const houselist=ref([])//仓库
	const gongyings=ref([])
	const tireNo=ref('')
	const tid=ref(null)
	const chuanfrom=ref({
		senderId:null,
		senderType:null
	})
	const rules=({
		senderId: [{ required: true, message: "传感器ID不能为空", trigger: "blur" }],
		senderType: [{ required: true, message: "绑定方式不能为空", trigger: "blur" }],
	  })
	const chuanid=ref(false)
	const jiebangma=ref(false)
	function goxiang(i){
		dangan.value="轮胎档案【"+i.tireNo+"】"
		tireinfos(i.tireId).then(res=>{
			updateform.value=res.data
			tid.value = i.tireId
			xiangqing.value=true
		})
		tireNo.value=i.tireNo
	} 
	function jiebangfun (){
		jiebang(chuanfrom.value.tireId).then(res=>{
			if(res.code == 200){
				ElMessage.success("解绑成功")
				chuanid.value=false
				xiangqing.value=false
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	
	function bangdingfun (){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 bangding(chuanfrom.value).then(res=>{
			 	if(res.code == 200){
			 	ElMessage.success("绑定成功")
			 		chuanid.value=false
			 		xiangqing.value=false
			 	}
			 })
		  }
		})
	}
	// 传感器id
	function chuango(i,tire,d,sendid){
		chuanid.value=true
		if(i == null){//绑定
			chuanfrom.value={}
			jiebangma.value=true
		}else{
			jiebangma.value=false
		}
		chuanfrom.value.tireNo=tire
		chuanfrom.value.tireId=d
		chuanfrom.value.senderId=i
		chuanfrom.value.senderType=sendid
	}
	const onReceiveMsg = (params:string) => {
		chuango(params.senderId,params.tireNo,params.tireId,params.senderType)
	}
	const onReceive = (params) => {
		xiangqing.value=params
	}
	// new
// 获取table数据
function getList() {
    mileageStatistics(queryform.value).then(res => {
        dataList.value = res.data.items
        total.value = res.data.total
    })
}
function Nameblur(e) {
    queryform.value.tireNo = e.target.value
}

// 导出
function exportable() {
	queryform.value.pageNum=1
	queryform.value.pageSize=1000000
    mileageStatisticsexport(queryform.value).then(res => {
        exportxlxs(res.data).then(respon => {
            downloadFiles(respon)
			 queryform.value.pageSize=10
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
// function getDefaultDate() {
//     const today = new Date();
//     const currentYear = today.getFullYear();
//     queryform.value.date = currentYear.toString();
//     queryformDetail.value.date = currentYear.toString();
// }
onMounted(() => {
    // getDefaultDate()
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
	// new
	// 仓库
	warehouselist({}).then(res=>{
		houselist.value=res.data.items
	})
	// 供应商
	supperlist({pageNum:1,pageSize:100000}).then(res=>{
		gongyings.value=res.data.items
	})
	// new
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
	width: 300px;
}
.titles {
	width: 100%;
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
}
</style>
  