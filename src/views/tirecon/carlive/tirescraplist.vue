<template>
  <div class="app-container">
	  <div>
		  <el-form label-width="75px">
		     <!-- <el-form-item label="所属组织">
		        <el-select
		        placeholder="请输入组织" 
		        v-model="queryform.companyName"
		        filterable
		        :clearable="true"
		        >
		          <el-option :label="item.teamName" :value="item.teamName"  v-for="(item,index) in carcompanydata" :key="index" />
		        </el-select>
		      </el-form-item> -->
		  		  <!-- <el-form-item label="车牌号">
		  		  <el-select
		  		  placeholder="请输入车牌号" 
		  		  v-model="queryform.vehicleNo"
		  		  filterable
		  		  :clearable="true"
		  		  >
		  		    <el-option :label="item" :value="item"  v-for="(item,index) in vehicleNoo" :key="index" />
		  		  </el-select>
		  		  </el-form-item> -->
		  		  <el-form-item label="胎号">
		  			<el-select
		  			placeholder="请输入胎号" 
		  			v-model="queryform.tireNo"
		  			filterable
		  			:clearable="true"
		  			>
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
				  <div style="text-align: center;">
				    <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
				    <el-button @click="goexport" v-hasPermi="['tpms:maintenance:export']"><i class="el-icon-upload2"></i>导出</el-button>
				  </div>
		  </el-form>
	  </div>
	<el-table :data="dataList">
	  <el-table-column label="胎号" sortable align="center" prop="tireNo" />
	  <!-- <el-table-column label="所属组织" sortable align="center" prop="companyName"></el-table-column> -->
	  <el-table-column label="所属仓库" sortable align="center" prop="warehouseName">
	  </el-table-column>
	  <el-table-column label="品牌" sortable align="center" prop="tireBrandName" />
	  <el-table-column label="规格" sortable align="center" prop="specificationsName" />
	  <el-table-column label="花纹型号" sortable align="center" prop="pattern">
	  </el-table-column>
	  <el-table-column label="新胎花纹深度(mm)" sortable align="center" prop="depth" />
	  <el-table-column label="初测花纹深度(mm)" sortable align="center" prop="firstDepth" />
	 <el-table-column label="状态" align="center" >
		  <template #default="scope">
			 <dict-tag :options="lifecycle_tire_status" :value="scope.row.stockStatus" />
		  </template>
	</el-table-column>
	  <el-table-column label="入库时间" sortable align="center" prop="createTime" width="180">
	  </el-table-column>
	  <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="primary"
			   @click="gohandle(scope.row)"
			  v-hasPermi="['tpms:maintenance:add']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>点击处理</el-button>
			</template>
	  </el-table-column>
	</el-table>
	<pagination
	   v-show="total > 0"
	   :total="total"
	   v-model:page="queryform.pageNum"
	   v-model:limit="queryform.pageSize"
	   @pagination="getList"
	/>
    <el-dialog title="轮胎处理" v-model="open" width="500px" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px" ref="ruleFormRef" :model="form">
			<div style="width: 100%;">
				<el-form-item label="胎号">
				  <p>{{cartireNo}}</p>
				</el-form-item>
				<el-form-item label="轮胎去向" prop="stockStatus">
				  	<el-select @change="selecstockStatusCn($event)" placeholder="轮胎去向" v-model="form.tireMaintenanceDetailBos[0].stockStatus">
				  		<el-option
				  		   v-for="dict in stockStatus_tire"
				  		   :key="dict.value"
				  		   :label="dict.label"
				  		   :value="dict.value"
						   v-show="dict.value != 55"
				  		></el-option>
				  	</el-select>
				</el-form-item>
				<el-form-item label="报废类型" v-if="form.tireMaintenanceDetailBos[0].stockStatus == 50" prop="scrappingType">
					 <el-radio-group v-model="form.tireMaintenanceDetailBos[0].scrappingType">
					    <el-radio label="0">正常报废</el-radio>
					    <el-radio label="1">提前报废</el-radio>
					  </el-radio-group>
				</el-form-item>
				<el-form-item label="是否翻新" v-if="form.tireMaintenanceDetailBos[0].stockStatus == 50" prop="isRenovate">
					
					<el-radio-group v-model="form.tireMaintenanceDetailBos[0].isRenovate" @change="isRenovatechange($event)">
					   <el-radio :label="0">可翻新</el-radio>
					   <el-radio :label="1">不可翻新</el-radio>
					 </el-radio-group>
				</el-form-item>
				<el-form-item label="问题类型" v-if="form.tireMaintenanceDetailBos[0].scrappingType == '1'"  prop="questionType">
					<el-select placeholder="问题类型" v-model="form.tireMaintenanceDetailBos[0].questionType"  @change="questionTypeCN($event)" clearable>
						<el-option label="质量问题" value="lifecycle_tire_quality_problem" ></el-option>
						<el-option label="使用问题" value="lifecycle_tire_use_problem" ></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="质量问题"
				  prop="questionContent"
				 v-if="form.tireMaintenanceDetailBos[0].questionType == 'lifecycle_tire_quality_problem' && form.tireMaintenanceDetailBos[0].scrappingType == '1'">
					<el-checkbox-group v-model="questionContent" @change="questionContentone($event)">
					    <el-checkbox 
						v-for="dict in lifecycle_tire_quality_problem"
						:key="dict.value"
						:label="`${dict.value},${dict.label}`"
						>{{dict.label}}</el-checkbox>
					  </el-checkbox-group>
				</el-form-item>
				<el-form-item label="使用问题"
				 prop="questionContentt"
				 v-if="form.tireMaintenanceDetailBos[0].questionType == 'lifecycle_tire_use_problem' && form.tireMaintenanceDetailBos[0].scrappingType == '1'">
					<el-checkbox-group v-model="questionContentt" @change="questionContents($event)">
					    <el-checkbox 
						v-for="dict in lifecycle_tire_use_problem"
						:key="dict.value"
						:label="`${dict.value},${dict.label}`"
						>{{dict.label}}</el-checkbox>
					  </el-checkbox-group>
				</el-form-item>
				<el-form-item label="备注"  prop="remark">
				  <el-input placeholder="请输入备注"  v-model="form.tireMaintenanceDetailBos[0].remark"></el-input>
				</el-form-item>
			</div>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform">确定</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Tirescraplist">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import type { FormInstance, FormRules } from 'element-plus'
	import Cookies from "js-cookie";
	import {tirelist, getTireBands, getSpecifications,getKeyWX, addtiretrue,expotires,exportxlxs } from "@/api/carlive"
	import { vehicleNo, carcompanylist } from '@/api/systensettings'
	import {getTiresdaichuli} from '@/api/carlive'
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, 
			stockStatus_tire, 
			lifecycle_tire_quality_problem,
			lifecycle_tire_use_problem} = proxy.useDict("lifecycle_tire_status", "stockStatus_tire", "lifecycle_tire_quality_problem", "lifecycle_tire_use_problem");
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		stockStatus:"55"
	})
	// const baofeivalue=ref("1")
	const dataList = ref([])//列表数据
	const total = ref(0)
	const guige = ref([])       
	const pinpai = ref([])
	const chetai = ref([])
	const vehicleNoo = ref([])
	const carcompanydata = ref([])
	const open=ref(false)	
	const form=ref({
		stockStatus:null,//处理的表单
		mid:null,
		maintainer:null,
		maintenanceDate:null,
		tenantId:null,
		totalCost:0,//总金额
		type:3,
		tireMaintenanceDetailBos:[{
			content:'',//维护内容
			contentId:null,//维护内容id
			cost:0,//维护费用
			stockStatus:null,//轮胎状态
			stockStatusCn:null,//去向
			tireId:null,//轮胎id
			remark:null,
			questionContent:'',
			questionContentCN:'',
			questionTypeCN:'',
			questionType:'',
			isRenovate:null,
			scrappingType:''
		}],
	})
	const questionContent=ref([])//未处理的质量问题数据
	const questionContentt=ref([])//未处理的使用问题数据
	const newtirechangeneddata=ref({})
	const cartireNo=ref('')//点击处理当前的胎号
	// 获取table数据
	function getList(){
		getTiresdaichuli(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 维护去向数据处理
	 function selecstockStatusCn(i){
		stockStatus_tire.value.find((item)=>{
		  if(item.value === i){
			form.value.tireMaintenanceDetailBos[0].stockStatusCn=item.label
		  }
		})
	}
	// 为题类型数据处理
	function questionTypeCN(i){
		if(i == 'lifecycle_tire_quality_problem'){
			form.value.tireMaintenanceDetailBos[0].questionTypeCN="质量问题"
		}else if(i == 'lifecycle_tire_use_problem'){
			form.value.tireMaintenanceDetailBos[0].questionTypeCN="使用问题"
		}
	}
	// 使用问题数据处理
	function questionContentone(val){
		let arr=[]
		let arrt=[]
		form.value.tireMaintenanceDetailBos[0].questionContent=''
		form.value.tireMaintenanceDetailBos[0].questionContentCN=''
		val.map(item=>{
			let [id,name] = item.split(',')
			arr.push(id)
			arrt.push(name)
		})
		form.value.tireMaintenanceDetailBos[0].questionContent=arr.toString()
		form.value.tireMaintenanceDetailBos[0].questionContentCN=arrt.toString()
	}
	// 质量问题数据处理
	function questionContents(val){
		let arr=[]
		let arrt=[]
		form.value.tireMaintenanceDetailBos[0].questionContent=''
		form.value.tireMaintenanceDetailBos[0].questionContentCN=''
		val.map(item=>{
			let [id,name] = item.split(',')
			arr.push(id)
			arrt.push(name)
		})
		form.value.tireMaintenanceDetailBos[0].questionContent=arr.toString()
		form.value.tireMaintenanceDetailBos[0].questionContentCN=arrt.toString()
	}
	// 点击处理
	const ruleFormRef=ref(null)
	function resetForm(){
		form.value.tireMaintenanceDetailBos[0].stockStatus=null
		form.value.tireMaintenanceDetailBos[0].questionType=null
		form.value.tireMaintenanceDetailBos[0].scrappingType=null
	}
	
	// 可翻新数据
	function isRenovatechange(i){
		if(i == 0){
			// console.log(newtirechangeneddata.value)
			// form.value.tireMaintenanceDetailBos[0].newBrandId=newtirechangeneddata.value.tireBrandId//当是翻新的时候填写，品牌id
			// form.value.tireMaintenanceDetailBos[0].newBrandName=newtirechangeneddata.value.tireBrandName
			// form.value.tireMaintenanceDetailBos[0].newPattern=newtirechangeneddata.value.depth//当是翻新的时候填写，花纹深度
			// form.value.tireMaintenanceDetailBos[0].newTireNo=newtirechangeneddata.value.tireNo//当是翻新的时候填写，翻新胎号
		}
	}
	function gohandle(i){
		cartireNo.value=i.tireNo
		console.log(cartireNo.value)
		let stt=JSON.stringify(i)
		// 清空
		resetForm()
		questionContent.value=[]
		questionContentt.value=[]
		var date = new Date();
		newtirechangeneddata.value=i
		date.getFullYear();
		let mothod=''
		let day=''
		if(date.getMonth() < 10){
			mothod= "0" + (date.getMonth()+1)
		}else{
			mothod=date.getMonth()+1
		}
		if(date.getDate() <10){
			day= "0" +date.getDate();
		}else{
			day=date.getDate();
		}
		getKeyWX().then(res=>{//维护单号生成
			form.value.mid=res.data
		})
		form.value.maintainer = Cookies.get("username")//维护人
		form.value.maintenanceDate = date.getFullYear()+ '-' + mothod+ '-' + day//维护日期
		form.value.tenantId=i.tenantId//租户号
		form.value.tireMaintenanceDetailBos[0]=JSON.parse(stt)
		form.value.tireMaintenanceDetailBos[0].stockStatus=''
		open.value=true
	}
	// 提交处理
	function subform(){
		if(form.value.tireMaintenanceDetailBos[0].stockStatus == '' ||form.value.tireMaintenanceDetailBos[0].stockStatus == null){
			ElMessage.error("请选择轮胎去向")
			return false
		}else{
			addtiretrue(form.value).then(res=>{
				if(res.code ==200){
					ElMessage.success("处理成功")
					open.value=false
					getList()
				}else{
					ElMessage.error(res.message)
				}
			})
		}
	}
	// 导出
	function goexport(){
		expotires(queryform.value).then(res=>{
			exportxlxs(res.data).then(data=>{
				downloadFiles(data)
			})
		})
	}
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎待处理列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎待处理列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎待处理列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data
			}
		})
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		// 品牌
		getTireBands().then(res=>{
			pinpai.value=res.data
		})
		// 规格
		getSpecifications().then(res=>{
			guige.value=res.data
		})
		getList()
	})

</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
	justify-content: left;
	flex-wrap: wrap;
  }

  :deep(.el-date-editor--daterange.el-input__inner){
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
	margin-top:10px;
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
  .mb8{
	  margin-top: 20px;
  }
  .line{
	  width:100%;
	  border-bottom:1px solid #ccc;
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
  :deep(.el-form-item){
	   align-items: center;
  }
  :deep(.el-input){
	  width: 80%;
  }
  .flages{
	  display: flex;
	  align-items: center;
	    color:#515a6e;
		font-size: 14px;
		margin-bottom: 15px;
  }
  .flages span{
	  margin-right: 40px;
  }
  .flages img{
	  width:20px;
	margin-right: 10px;
  }
</style>
