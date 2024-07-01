<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		  <el-form-item label="修补单号">
			  <el-input placeholder="请输入修补单号"  v-model="queryform.mid"></el-input>
		  </el-form-item>
		  <el-form-item label="修补人">
		  		<el-input placeholder="请输入修补人"  v-model="queryform.maintainer"></el-input>
		  </el-form-item>
		  <el-form-item label="修补厂家">
		  		<el-input placeholder="请输入修补厂家"  v-model="queryform.manufacturer"></el-input>
		  </el-form-item>
		<el-button type="primary" @click="ifbaofei=2;changcheck()"><i class="el-icon-search"></i> 查询</el-button>
		<el-button @click="eportlist" v-hasPermi="['tpms:repair:export']"><i class="el-icon-upload2"></i>导出</el-button>
    </el-form>
	
	<el-radio-group v-model="ifbaofei" @change="changcheck">
	  <el-radio-button label="1">可修补轮胎列表</el-radio-button>
	  <el-radio-button label="2">修补记录</el-radio-button>
	</el-radio-group>
   
<!--   
 <el-row :gutter="10" class="mb8">
   <el-col :span="1.5">
     <el-button type="primary" plain @click="handleAdd"
       v-hasPermi="['tpms:maintenance:add']">修补登记</el-button>
   </el-col>
 </el-row> -->
 <el-row :gutter="10" class="mb8" v-if="table1">
   <el-col :span="1.5">
     <el-button type="primary" plain @click="handleAdd"  :disabled="multiple"
       v-hasPermi="['tpms:maintenance:add']" >修补登记</el-button>
   </el-col>
  <el-table :data="selecttable"  @selection-change="handleSelectionChange" ref="multipleTable" >
  		<el-table-column type="selection" width="55" align="center" />
  		 <el-table-column label="胎号" sortable align="center" prop="tireNo" />
  		 <!-- <el-table-column label="所属组织" sortable align="center" prop="companyName"/> -->
  		 <el-table-column label="所属仓库" sortable align="center" prop="warehouseName"/>
  		 <el-table-column label="品牌" sortable align="center" prop="tireBrandName" />
  		 <el-table-column label="花纹型号" sortable align="center" prop="pattern"/>
  		 <el-table-column label="状态" align="center" >
  		 	  <template #default="scope">
  		 		 <dict-tag :options="lifecycle_tire_status" :value="scope.row.stockStatus" />
  		 	  </template>
  		 </el-table-column>
  		  <el-table-column label="入库时间" sortable align="center" prop="createTime" width="180"/>
  		</el-table>
  		<p style="position: relative;left: 95%;">
  			<pagination
  			   v-show="selectform.total > 0"
  			   :total="selectform.total"
  			   v-model:page="selectform.pageNum"
  			   v-model:limit="selectform.pageSize"
  			/>
  		</p>
 </el-row>
 
 
 
 <el-table :data="dataList" v-if="!table1">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="修补单号" align="center" prop="mid"/>
      <el-table-column label="修补人" align="center" prop="maintainer" />
      <el-table-column label="修补厂家" align="center" prop="manufacturer" />
      <el-table-column label="修补日期"  align="center" style="cursor: pointer;" width="120" prop="maintenanceDate">
		<template #default="scope">
			{{parseTime(scope.row.maintenanceDate,'{y}-{m}-{d}')}}
		  		  <!-- <el-button
		  		   link  type="primary"
		  		   @click="handinfo(scope.row.)"
		  		  v-hasPermi="['system:dict:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button> -->
		</template>
	  </el-table-column>
      <el-table-column label="修补金额" align="center" prop="totalCost" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
	 <el-table-column label="操作" align="center" class-name="small-padding" width="150">
	   <template #default="scope">
		   <el-button
		   link  type="primary"
		   @click="handinfo(scope.row.id)"
		  ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button>
		</template>
	</el-table-column>
    </el-table>
	<pagination
	v-if="!table1"
		 v-show="total > 0"
		 :total="total"
		 v-model:page="queryform.pageNum"
		 v-model:limit="queryform.pageSize"
		 @pagination="getList"
	/>
	  
    <!-- 修补登记入库登记 -->
   <el-dialog title="修补登记入库登记" v-model="open" width="950" :close-on-click-modal="false" :show-close="false">
        <el-form label-width="100px" :rules="rules" ref="menuRef" :model="from" :validate-on-rule-change="false">
        	<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;">
        		<el-form-item label="修补单号" prop="mid" v-if="!ischange">
        		 <el-input v-model="from.mid"></el-input>
        		</el-form-item>
        		<el-form-item label="修补单号" prop="mid"  v-if="ischange">
        			<span>{{from.mid}}</span>
        		</el-form-item>
        		
        		<el-form-item label="修补厂家" prop="manufacturer"  v-if="!ischange">
        		  <el-input  v-model="from.manufacturer"></el-input>
        		</el-form-item>
        		<el-form-item label="修补厂家" prop="manufacturer" v-if="ischange">
        		  <span>{{from.manufacturer}}</span>
        		</el-form-item>
        		<el-form-item label="修补人" prop="maintainer"  v-if="!ischange">
        		  <el-input v-model="from.maintainer"></el-input>
        		</el-form-item>
        		<el-form-item label="修补人" prop="maintainer"  v-if="ischange">
        		  <span>{{from.maintainer}}</span>
        		</el-form-item>
        		<el-form-item label="修补日期"  prop="maintenanceDate" v-if="!ischange">
        		  <el-date-picker
        		      v-model="from.maintenanceDate"
        			   :disabled-date="pickerOptions"
        		      type="datetime"/>
        		</el-form-item>
        		<el-form-item label="修补日期"  prop="maintenanceDate" v-if="ischange">
        			  <span >{{parseTime(from.maintenanceDate)}}</span>
        		</el-form-item>
        	</div>
          <!-- <el-button type="primary" @click="serchtire" v-if="!ischange">
        	   新增修补轮胎
           </el-button> -->
        	<el-table :data="from.tireMaintenanceDetailBos" v-if="!ischange">
        		  <el-table-column label="胎号" align="center" prop="tireNo"/>
        		 <el-table-column label="品牌" align="center" prop="tireBrandName"/>
        		  <el-table-column label="规格" align="center" prop="specificationsName" />
        		  <el-table-column label="花纹" align="center" prop="pattern" />
				  <el-table-column label="修补金额" align="center" prop="cost ">
						<template #default="scope">
							<el-input v-model="scope.row.cost"  @change="goatao()" v-if="!ischange"  onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
							<!-- <span v-if="ischange">{{scope.row.cost}}</span> -->
						</template>
				  </el-table-column>
				  <el-table-column label="修补内容" align="center" prop="contentId" width="150">
					  <template #default="scope">
							<el-select
							v-if="!ischange"
							style="width: 100%;"
							placeholder="请选择修补内容" 
							@change="selectModel($event,scope.$index)"
							v-model="scope.row.contentId"
							:clearable="true"
							>
							  <el-option :label="item.label" :value="item.value" v-show="item.elTagClass!= 'null'"  v-for="(item,index) in lifecycle_tire_repair" :key="index" />
							</el-select>
							<!-- <span  v-if="ischange">{{scope.row.content}}</span> -->
					  </template>
				  </el-table-column>
				  <el-table-column label="修补去向" align="center" prop="stockStatus"  width="150">
					<template #default="scope">
						<el-select v-if="!ischange"  @change="selecstockStatusCn($event,scope.$index)" placeholder="轮胎去向" v-model="scope.row.stockStatus" clearable>
							<el-option
							   v-for="dict in stockStatus_tire"
							   :key="dict.value"
							   :label="dict.label"
							   :value="dict.value"
							   v-show="dict.value != 30"
							></el-option>
						</el-select>
						<!-- <span  v-if="ischange">{{scope.row.stockStatusCn}}</span> -->
				  </template>
				  </el-table-column>
        		 <el-table-column label="操作" align="center" class-name="small-padding" v-if="!ischange">
        		   <template #default="scope">
        			   <el-button
        			   link
        			   type="danger"
        			   @click="detelett(scope.$index)"
        			  >删除</el-button>
        			</template>
        		</el-table-column>
        	</el-table>
			<el-table v-if="ischange"  :data="from.tireMaintenanceDetailArrayResponse.items">
				  <el-table-column label="胎号" align="center" prop="tireNo"/>
				 <el-table-column label="品牌" align="center" prop="tireBrandName">
					 <template #default="scope">
						 {{pinpaich(scope.row.tireBrandId)}}
					 </template>
				</el-table-column>
				  <el-table-column label="规格" align="center" prop="specificationsName" />
				  <el-table-column label="花纹" align="center" prop="pattern" />
				  <el-table-column label="修补金额" align="center" prop="cost" >
				  <template #default="scope">
				  		<span  v-if="ischange">{{scope.row.cost}}</span>
				  </template>
				  </el-table-column>
				  <el-table-column label="修补内容" align="center" prop="contentId" width="150">
					  <template #default="scope">
							<span  v-if="ischange">{{scope.row.content}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="修补去向" align="center" prop="stockStatus"  width="150">
					<template #default="scope">
						<span  v-if="ischange">{{scope.row.stockStatusCn}}</span>
				  </template>
				  </el-table-column>
			</el-table>
			<pagination
			   v-if="ischange"
			   :total="totals"
			   v-model:page="pageNum"
			   v-model:limit="pageSize"
			    @pagination="handinfo(newid)"
			/>
        	<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;margin-top: 20px;">
        		<el-form-item label="总金额" prop="totalCost" v-if="!ischange">
        		  <el-input  v-model="from.totalCost"  onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
        		</el-form-item>
        		<el-form-item label="总金额" prop="totalCost" v-if="ischange">
        		  <span>{{from.totalCost}}</span>
        		</el-form-item>
        		<el-form-item label="备注" prop="remark">
        		  <el-input  v-model="from.remark" v-if="!ischange"></el-input>
        		  <span v-if="ischange">{{from.remark}}</span>
        		</el-form-item>
        	</div>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform" v-if="!ischange">确认</el-button>
          <el-button @click="openfalse">取消</el-button>
        </div>
    </el-dialog>
	
	<!-- 多选轮胎 -->
	<!-- <el-dialog title="轮胎列表" v-model="tiretable" width="80%" append-to-body :close-on-click-modal="false">
		<el-form label-width="75px" style="display: flex;flex-wrap: wrap; justify-content: left;">
		    <el-form-item label="轮胎规格">
			  <el-select
			  placeholder="请选择轮胎规格" 
			  v-model="selectform.specificationsId"
			  filterable
			  :clearable="true"
			  >
			    <el-option :label="item.paramName" :value="item.paramId"   v-for="(item,index) in guige" :key="index" />
			  </el-select>
		    </el-form-item>
		    <el-form-item label="质保周期">
		      <el-select placeholder="请选择" v-model="selectform.qualityPeriod" clearable>
		        <el-option label="正常" value="0" />
				<el-option label="即将过期" value="1" />
				<el-option label="已过期" value="-1" />
		      </el-select>
		    </el-form-item>
		    <el-form-item label="所属仓库">
		     <el-select
		     placeholder="请选择所属仓库" 
		     v-model="selectform.warehouseId"
		     filterable
		     :clearable="true"
		     >
		       <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
		     </el-select>
		    </el-form-item>
			 <el-button type="primary" @click="serchtire" style="margin-left: 20px;"><i class="el-icon-search"></i> 查询</el-button>
		</el-form>
		
		<div style="text-align: center;margin-top: 35px;" slot="footer" class="dialog-footer">
			<el-button type="warning" @click="tiretablebtn">确定</el-button>
			<el-button @click="clo">关闭</el-button>
		</div>
	</el-dialog> -->
  </div>
</template>

<script setup lang="ts" name="Repair">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { getTireBands, getSpecifications, tirelist, aintenancelist, getKeyXB, addtiretrue, maintenancinfotw ,exportxiubulist, exportxlxs} from "@/api/carlive"	
	import { vehicleNo } from '@/api/systensettings'
	import { warehouselist } from '@/api/warehouse'
	import Cookies from "js-cookie";
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, lifecycle_tire_repair ,stockStatus_tire} = proxy.useDict("lifecycle_tire_status", "lifecycle_tire_repair", "stockStatus_tire");
	
	const pinpai=ref([])//品牌
	const guige=ref([])//规格
	const houselist=ref([])//仓库
	const chetai=ref([])
	const vehicleNoo = ref([])//车牌号
	const queryform=ref({
		vehicleNo:null,
		tireNo:null,
		tireBrandId:null,
		specificationsId:null,
		pageNum:1,
		pageSize:10,
		type:4
	})
	const topfrom=ref({
		pageNum:1,
		pageSize:10,
		total:0,
		tableData:[]
	})
	const dataList=ref([]) 
	const total=ref(0)
	const from=ref({
		mid:null,
		maintainer:Cookies.get("username"),
		maintenanceDate:'',
		manufacturer:'',
		totalCost:null,
		remark:'',
		tireMaintenanceDetailBos:[]
	})
	const ininfi=ref(false)
	const ischange=ref(false)//详情或新增
	const selectform=ref({
		total:0,
		pageNum:1,
		pageSize:10,
		stockStatus:"30"
	})
	const pageNum=ref(1) 
	const pageSize=ref(10) 
	const totals=ref(0)
	const selecttable=ref([])
	const open=ref(false)
	const rules=({
		maintainer: [{ required: true, message: "经办人不能为空", trigger: "blur" }],
		maintenanceDate: [{ required: true, message: "翻新日期不能为空", trigger: "blur" }],
		manufacturer: [{ required: true, message: "翻新厂家不能为空", trigger: "blur" }],
		mid: [{ required: true, message: "翻新单号不能为空", trigger: "blur" }],
		totalCost: [
			{ required: true, message: "翻新总金额不能为空", trigger: "blur" },
			{
				pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
				message: "金额格式不正确",
				trigger: "blur"}
			],
	  }) 
	  const pickerOptions=(time)=> {
	  	  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
	  }
	  const tiretable=ref(false)
	// 列表
	function getList(){
		aintenancelist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	const ifbaofei=ref('1')
	const table1=ref(true)
	// tab切换表格
	const changcheck=function(){
		if(ifbaofei.value == "1"){
			queryform.value.type=30
			table1.value=true
			multiple.value=true
			serchtire()
		}else{
			queryform.value.type=4
			table1.value=false
				getList()
		}
	}
	// 新增
	function handleAdd(i){
		ischange.value=false
		from.value.cost=0
		topfrom.value.tableData=[]
		totals.value=0
		getKeyXB().then(res=>{
			from.value.mid=res.data//修补单号
			proxy.$refs["menuRef"].clearValidate();
		})
		from.value.maintainer= Cookies.get("username")//维护人
		from.value.tireMaintenanceDetailBos.map(ins=>{
			ins.stockStatus=null
		})
		open.value=true
	}
	// 多选框选中数据
	const multiple=ref(true)
	function handleSelectionChange(selection) {
		 multiple.value = !selection.length;
		from.value.tireMaintenanceDetailBos=selection.map(item => item)
		from.value.tireMaintenanceDetailBos.map(ins=>{
			ins.newTireNo=ins.tireNo + "-1"
			ins.newBrandName="翻新胎"
		})
	}
	// 新增翻新轮胎
	function serchtire(){
		tirelist(selectform.value).then(res=>{
			selecttable.value=res.data.items
			selectform.value.total=res.data.total
		})
		tiretable.value=true
	}
	function openfalse(){
		open.value=false
		changcheck()
	}
	 // const currentChange = (val: any) => {
	 //      topfrom.value.pageNum = val;
	 //      getTabelData2();
	 //    }
		
	  const getTabelData2 = () => {
	      let data = JSON.parse(JSON.stringify( from.value.tireMaintenanceDetailBos))
	       topfrom.value.tableData = data.splice(
	        ( topfrom.value.pageNum - 1) * topfrom.value.pageSize,
	       topfrom.value.pageSize
	      );
	      topfrom.value.total = from.value.tireMaintenanceDetailBos.length
	    }
	// function sizeChange(val: number) {
	// 	        topfrom.value.pageSize = val;
	// 	        topfrom.value.pageNum = 1;
	// 	        getTabelData2()
	// 	      }
		
	// 维护内容数据处理
	function selectModel(i,index){
		console.log(lifecycle_tire_repair.value,666)
		lifecycle_tire_repair.value.find((item)=>{
		  if(item.value === i){
			from.value.tireMaintenanceDetailBos[index].content=item.label
		  }
		})
	}
	function clo(){
		from.value.tireMaintenanceDetailBos=[]
		tiretable.value=false
	}
	function tiretablebtn(){
		from.value.tireMaintenanceDetailBos.map(item=>{
			return item.stockStatus=null
		})
		tiretable.value=false
	}
	// 删除当前选中记录
	function detelett(i){
		from.value.tireMaintenanceDetailBos.splice(i, 1)
		goatao()
	}
	// 计算总金额
	function goatao(){
		let toltanum=0
		from.value.tireMaintenanceDetailBos.map(ins=>{
			toltanum+= Number(ins.cost) 
		})
		from.value.totalCost=toltanum || ''
	}
	// 维护去向数据处理
	 function selecstockStatusCn(i,index){
		 
		stockStatus_tire.value.find((item)=>{
		  if(item.value === i){
			from.value.tireMaintenanceDetailBos[index].stockStatusCn=item.label
		  }
		})
		if(i == 50){
			from.value.tireMaintenanceDetailBos[index].isRenovate=1//不可翻新
		}
	}
	
	// 提交处理
	function subform(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  from.value.type=4
			let flag2 = from.value.tireMaintenanceDetailBos.every(item => !!item.stockStatus)
			let flag3 = from.value.tireMaintenanceDetailBos.every(item => !!item.cost)
			let flag4 = from.value.tireMaintenanceDetailBos.every(item => !!item.contentId)
			if(!flag2 || !flag3 || !flag4 ){
				ElMessage.error("修补金额，修补内容，修补去向为必填项")
				return false
			}else{
				addtiretrue(from.value).then(res=>{
					if(res.code == 200){
						ElMessage.success("新增修补成功")
						tiretable.value=false
						open.value=false
						getList()
						serchtire()
					}else{
						ElMessage.success(res.message)
					}
				})
			}
		  }
		})  
	}
	
	// 详情
	const newid=ref('')
	function handinfo(i){
		ischange.value=true
		newid.value=i
		let obj={
			id:i,
			data:{
					pageNum:pageNum.value,
					pageSize:pageSize.value,
			}
		}
		maintenancinfotw(obj).then(res=>{
			from.value=res.data
			totals.value=from.value.tireMaintenanceDetailArrayResponse.total
			open.value=true
		})
	}
	
	
	
	
	// 导出
	function eportlist(){
		queryform.value.pageNum=1
		queryform.value.pageSize=100000
		if(ifbaofei.value == 2){
			queryform.value.type=4
			exportxiubulist(queryform.value).then(res=>{
				exportxlxs(res.data).then(respon=>{
					queryform.value.pageNum=1
					queryform.value.pageSize=10
					 downloadFiles(respon,'轮胎修补列表.xlsx')
				})
			})
		}else{
			queryform.value.type=30
			exportxiubulist(queryform.value).then(res=>{
				exportxlxs(res.data).then(respon=>{
					queryform.value.pageNum=1
					queryform.value.pageSize=10
					 downloadFiles(respon,'可修补轮胎列表.xlsx')
				})
			})
		}
	}
	
	// 解码下载方法
	function downloadFiles(data,title) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = title
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob,title);
	    } else {
	        // Firefox version
	        var file = new File([data],title, { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	function pinpaich(e){
		for(let i=0;i<pinpai.value.length;i++){
			if(pinpai.value[i].paramId == e){
				return pinpai.value[i].paramName
			}
		}
	}
	
	onMounted(()=>{
		
		serchtire()
		// 品牌
		getTireBands().then(resss=>{
			pinpai.value=resss.data
		})
		// 规格
		getSpecifications().then(re=>{
			guige.value=re.data
		})
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		// 仓库
		warehouselist({}).then(ress=>{
			houselist.value=ress.data.items
		})
		// 车牌号
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
	})
</script>
<style scoped>
  .indexforn {
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
  .formdiv{
	  width: 45%;
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
  :deep(.el-input){
	  width: 80%;
  }
  .marri{
	  margin-right: 30px;
  }
  .closr{
	  font-size:16px ;
	  line-height: 34px;
  }
  .closr span{
	  margin-right: 15px;
  }
  /* /deep/.pagination-container .el-pagination{
	  left: 100%;
  } */
</style>
