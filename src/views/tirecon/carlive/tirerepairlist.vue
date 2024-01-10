<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<!-- <el-form-item label="所属组织">
		  <el-select
		  placeholder="请输入组织" 
		  v-model="queryform.tireMaintenanceDetailBos[0].companyId"
		  filterable
		  :clearable="true"
		  >
		    <el-option :label="item.teamName" :value="item.companyId"  v-for="(item,index) in carcompanydata" :key="index" />
		  </el-select>
		</el-form-item> -->
		<el-form-item label="维护单号">
		 <el-input placeholder="请输入维护单号" v-model="queryform.mid"></el-input>
		</el-form-item>
		<el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		<el-button @click="eportlist" v-hasPermi="['tpms:maintenance:export']"><i class="el-icon-upload2"></i>导出</el-button>
    </el-form>
	
   <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
       <el-button type="primary" plain @click="handleAdd"
         v-hasPermi="['tpms:maintenance:add']">维护登记</el-button>
     </el-col>
   </el-row>
    <el-table :data="dataList">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="维护单号" sortable align="center" prop="mid">
      </el-table-column>
	  <!-- <el-table-column label="所属组织" align="center" prop="dictLabel"/> -->
      <el-table-column label="维护人" sortable align="center" prop="maintainer" />
      <el-table-column label="维护厂家" sortable align="center" prop="manufacturer" />
      <el-table-column label="维护日期" sortable align="center" style="cursor: pointer;" width="120" prop="maintenanceDate"></el-table-column>
      <el-table-column label="维护金额" sortable align="center" prop="totalCost" />
      <el-table-column label="创建时间" sortable align="center" prop="createTime" />
	 <el-table-column label="操作" align="center" class-name="small-padding" width="150">
	   <template #default="scope">
		   <el-button
		   link  type="primary"
		   @click="handinfo(scope.row)"
		  ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button>
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
    <!-- 维护登记 -->
    <el-dialog title="轮胎维护" v-model="open" width="950" :close-on-click-modal="false">
        <el-form label-width="100px" :rules="rules" ref="menuRef" :model="from" :validate-on-rule-change="false">
			<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;">
				<el-form-item label="维护单号" prop="mid" v-if="!ischange">
				 <el-input v-model="from.mid"></el-input>
				</el-form-item>
				<el-form-item label="维护单号" prop="mid"  v-if="ischange">
					<span>{{from.mid}}</span>
				</el-form-item>
				
				<el-form-item label="维护厂家" prop="manufacturer"  v-if="!ischange">
				  <el-input  v-model="from.manufacturer"></el-input>
				</el-form-item>
				<el-form-item label="维护厂家" prop="manufacturer" v-if="ischange">
				  <span>{{from.manufacturer}}</span>
				</el-form-item>
				<el-form-item label="维护人" prop="maintainer"  v-if="!ischange">
				  <el-input v-model="from.maintainer"></el-input>
				</el-form-item>
				<el-form-item label="维护人" prop="maintainer"  v-if="ischange">
				  <span>{{from.maintainer}}</span>
				</el-form-item>
				<el-form-item label="维护日期"  prop="maintenanceDate" v-if="!ischange">
				  <el-date-picker
				      v-model="from.maintenanceDate"
					   :disabled-date="pickerOptions"
				      type="datetime"/>
				</el-form-item>
				<el-form-item label="维护日期"  prop="maintenanceDate" v-if="ischange">
					  <span >{{parseTime(from.maintenanceDate)}}</span>
				</el-form-item>
			</div>
           <el-button type="primary" @click="serchtire" v-if="!ischange">
			   新增维护轮胎
		   </el-button>
			<el-table :data="from.tireMaintenanceDetailBos" v-if="!ischange">
				  <el-table-column label="胎号" align="center" prop="tireNo"/>
				  <el-table-column label="品牌" align="center" prop="tireBrandName"/>
				  <el-table-column label="规格" align="center" prop="specificationsName" />
				  <el-table-column label="花纹" align="center" prop="pattern" />
				  <el-table-column label="维护金额"  align="center" prop="cost">
					  <template #default="scope">
						  <el-input v-model="scope.row.cost" @change="goatao()" v-if="!ischange"></el-input>
						  <span v-if="ischange">{{scope.row.cost}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="维护内容" align="center" prop="contentId" width="150">
					  <template #default="scope">
							<el-select
							v-if="!ischange"
							style="width: 100%;"
							placeholder="请选择维护内容" 
							@change="selectModel($event,scope.$index)"
							v-model="scope.row.contentId"
							:clearable="true"
							>
							  <el-option :label="item.label" :value="item.value"  v-for="(item,index) in lifecycle_tire_repair" :key="index" />
							</el-select>
							<span  v-if="ischange">{{scope.row.content}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="维护去向" align="center" prop="stockStatus"  width="150">
					  <template #default="scope">
							<el-select placeholder="拆去方向" 
							v-if="!ischange"
							v-model="scope.row.stockStatus" 
							@change="selecstockStatusCn($event,scope.$index)"
							style="width: 100%;" clearable>
								<el-option
								   v-for="dict in stockStatus_tire"
								   :key="dict.value"
								   :label="dict.label"
								   :value="dict.value"
								></el-option>
							</el-select>
							<span v-if="ischange">{{scope.row.stockStatusCn}}</span>
					  </template>
					  </el-table-column>
				 <el-table-column label="操作" align="center" class-name="small-padding" width="150" v-if="!ischange">
				   <template #default="scope">
					   <el-button
					   link
					   type="danger"
					   @click="detelett(scope.$index)"
					  >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<el-table :data="from.tireMaintenanceDetailArrayResponse.items" v-if="ischange">
				  <el-table-column label="胎号" align="center" prop="tireNo"/>
				  <el-table-column label="品牌" align="center" prop="tireBrandName"/>
				  <el-table-column label="规格" align="center" prop="specificationsName" />
				  <el-table-column label="花纹" align="center" prop="pattern" />
				  <el-table-column label="维护金额"  align="center" prop="cost">
					  <template #default="scope">
						  <el-input v-model="scope.row.cost" @change="goatao()" v-if="!ischange"></el-input>
						  <span v-if="ischange">{{scope.row.cost}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="维护内容" align="center" prop="contentId" width="150">
					  <template #default="scope">
							<el-select
							v-if="!ischange"
							style="width: 100%;"
							placeholder="请选择维护内容" 
							@change="selectModel($event,scope.$index)"
							v-model="scope.row.contentId"
							:clearable="true"
							>
							  <el-option :label="item.label" :value="item.value"  v-for="(item,index) in lifecycle_tire_repair" :key="index" />
							</el-select>
							<span  v-if="ischange">{{scope.row.content}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="维护去向" align="center" prop="stockStatus"  width="150">
					  <template #default="scope">
							<el-select placeholder="拆去方向" 
							v-if="!ischange"
							v-model="scope.row.stockStatus" 
							@change="selecstockStatusCn($event,scope.$index)"
							style="width: 100%;" clearable>
								<el-option
								   v-for="dict in stockStatus_tire"
								   :key="dict.value"
								   :label="dict.label"
								   :value="dict.value"
								></el-option>
							</el-select>
							<span v-if="ischange">{{scope.row.stockStatusCn}}</span>
					  </template>
					  </el-table-column>
				 <el-table-column label="操作" align="center" class-name="small-padding" width="150" v-if="!ischange">
				   <template #default="scope">
					   <el-button
					   link
					   type="danger"
					   @click="detelett(scope.$index)"
					  >删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;margin-top: 20px;">
				<el-form-item label="总金额" prop="totalCost" v-if="!ischange">
				  <el-input  v-model="from.totalCost" ></el-input>
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
          <el-button type="primary" @click="subfrom" v-if="!ischange">确认</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
	
	<!-- 多选轮胎 -->
	<el-dialog title="轮胎列表" v-model="tiretable" width="80%" append-to-body :close-on-click-modal="false">
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
		   <!-- <el-form-item label="质保周期">
		      <el-select placeholder="请选择" v-model="selectform.qualityPeriod" clearable>
		        <el-option label="正常" value="0" />
				<el-option label="即将过期" value="1" />
				<el-option label="已过期" value="-1" />
		      </el-select>
		    </el-form-item> -->
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
			<el-form-item label="胎号">
				<el-input v-model="selectform.tireNo"  placeholder="请输入胎号" ></el-input>
			 <!-- <el-select
			 placeholder="请选择所属仓库" 
			 v-model="selectform.warehouseId"
			 filterable
			 :clearable="true"
			 >
			   <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
			 </el-select> -->
			</el-form-item>
			 <el-button type="primary" @click="serchtire" style="margin-left: 20px;"><i class="el-icon-search"></i> 查询</el-button>
		</el-form>
		<el-table :data="selecttable"  @selection-change="handleSelectionChange" ref="multipleTable"> 
		 <el-table-column type="selection" width="55" align="center" />
		 <el-table-column label="胎号" align="center" prop="tireNo" />
		 <el-table-column label="所属组织" align="center" prop="companyName"/>
		 <el-table-column label="所属仓库" align="center" prop="warehouseName"/>
		 <el-table-column label="品牌" align="center" prop="tireBrandName" />
		 <el-table-column label="花纹型号" align="center" prop="pattern"/>
		 <el-table-column label="状态" align="center" >
		 	  <template #default="scope">
		 		 <dict-tag :options="lifecycle_tire_status" :value="scope.row.stockStatus" />
		 	  </template>
		 </el-table-column>
		  <el-table-column label="入库时间" align="center" prop="createTime" width="180"/>
		</el-table>
		<p style="position: relative;">
			<pagination
			   v-show="selectform.total > 0"
			   :total="selectform.total"
			   v-model:page="selectform.pageNum"
			   v-model:limit="selectform.pageSize"
			/>
		</p>
		<div style="text-align: center;margin-top: 35px;" slot="footer" class="dialog-footer">
			<el-button type="warning" @click="tiretableclos" >确定</el-button>
			<el-button @click="clo">关闭</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Tirerepairlist">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { carcompanylist } from '@/api/systensettings'
	import { warehouselist } from '@/api/warehouse'
	import { aintenancelist, getKeyWX, tirelist, getTireBands, getSpecifications, addtiretrue, maintenancinfo, exportmainlist, exportxlxs } from "@/api/carlive"
	import Cookies from "js-cookie";
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, lifecycle_tire_repair ,stockStatus_tire} = proxy.useDict("lifecycle_tire_status", "lifecycle_tire_repair", "stockStatus_tire");
	
	const total=ref(0)
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		mid:''
	})
	const dataList=ref([])//维护登记列表数据
	const carcompanydata = ref([])//组织
	const closr=ref(false)
	const open=ref(false)//新增登记
	const from=ref({
		mid:null,
		maintainer:Cookies.get("username"),
		maintenanceDate:'',
		manufacturer:'',
		totalCost:null,
		remark:'',
		type:6,
		tireMaintenanceDetailBos:[]
	})
	const rules=({
		maintainer: [{ required: true, message: "维护人不能为空", trigger: "blur" }],
		maintenanceDate: [{ required: true, message: "维护日期不能为空", trigger: "blur" }],
		manufacturer: [{ required: true, message: "维护厂家不能为空", trigger: "blur" }],
		mid: [{ required: true, message: "维护单号不能为空", trigger: "blur" }],
		totalCost: [
			{ required: true, message: "维护总金额不能为空", trigger: "blur" },
			{
				pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
				message: "金额格式不正确",
				trigger: "blur"}
			],
	  }) 
	const pickerOptions=(time)=> {
		  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
	}
	const selecttable=ref([])//选中的轮胎维护列表
	const selectform=ref({
		total:0,
		pageNum:1,
		pageSize:10
	})
	const pinpai=ref([])//品牌
	const guige=ref([])//规格
	const houselist=ref([])//仓库
	const tiretable=ref(false)
	const ischange=ref(false)//详情或新增
	function getList(){
		aintenancelist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 维护内容数据处理
	function selectModel(i,index){
		lifecycle_tire_repair.value.find((item)=>{
		  if(item.value === i){
			from.value.tireMaintenanceDetailBos[index].content=item.label
		  }
		})
	}
	
	// 维护去向数据处理
	 function selecstockStatusCn(i,index){
		stockStatus_tire.value.find((item)=>{
		  if(item.value === i){
			from.value.tireMaintenanceDetailBos[index].stockStatusCn=item.label
		  }
		})
		if(i == 50){
			from.value.tireMaintenanceDetailBos[index].isRenovate=1
		}
	}
	// 计算总金额
	function goatao(){
		let toltanum=0
		from.value.tireMaintenanceDetailBos.map(ins=>{
			toltanum+= Number(ins.cost) 
		})
		from.value.totalCost=toltanum || ''
	}
	// 新增
	function handleAdd(i){
		ischange.value=false
		from.value={
			mid:null,
			maintainer:Cookies.get("username"),
			maintenanceDate:'',
			manufacturer:'',
			totalCost:null,
			remark:'',
			type:6,
			tireMaintenanceDetailBos:null
		}
		getKeyWX().then(res=>{
			from.value.mid=res.data//维护单号
			proxy.$refs["menuRef"].clearValidate();
		})
		from.value.maintainer= Cookies.get("username")//维护人
		open.value=true
		// 品牌
		getTireBands().then(resss=>{
			pinpai.value=resss.data.items
		})
		// 规格
		getSpecifications().then(re=>{
			guige.value=re.data
		})
		// 仓库
		warehouselist({}).then(ress=>{
			houselist.value=ress.data.items
		})
	}
	// 新增维护轮胎
	function serchtire(){
		// 车胎
		tirelist(selectform.value).then(res=>{
			selecttable.value=res.data.items
			selectform.value.total=res.data.total
		})
		tiretable.value=true
	}
	// 多选框选中数据
	function handleSelectionChange(selection) {
		// selection.map(item => {
		// 	return item.stockStatus=null
		// })
		from.value.tireMaintenanceDetailBos=selection.map(item => item)
	}
	function tiretableclos(){
		from.value.tireMaintenanceDetailBos.map(item => {
			return item.stockStatus=null
		})
		tiretable.value=false
	}
	// 提交新增
	function subfrom(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			let flag = from.value.tireMaintenanceDetailBos.every(item => !!item.stockStatusCn)
			let flag2 = from.value.tireMaintenanceDetailBos.every(item => !!item.content)
			let flag3 = from.value.tireMaintenanceDetailBos.every(item => !!item.cost)
			if(!flag || !flag2 || !flag3){
				ElMessage.error("维护金额，维护去向，维护内容为必填项")
				return false
			}else{
				addtiretrue(from.value).then(res=>{
					if(res.code == 200){
						ElMessage.success("新增维护成功")
						tiretable.value=false
						open.value=false
						getList()
					}else{
						ElMessage.success(res.message)
					}
				})
			}
		  }
		})  
	}
	function clo(){
		from.value.tireMaintenanceDetailBos=[]
		tiretable.value=false
	}
	// 删除当前选中记录
	function detelett(i){
		from.value.tireMaintenanceDetailBos.splice(i, 1)
		goatao()
	}
	// 详情
	function handinfo(i){
		ischange.value=true
		maintenancinfo(i.id).then(res=>{
			from.value=res.data
			open.value=true
		})
	}
	
	// 导出
	function eportlist(){
		exportmainlist(queryform.value).then(res=>{
			exportxlxs(res.data).then(respon=>{
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
	        link.download = "轮胎维护列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎维护列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎维护列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	onMounted(()=>{
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data.items
			}
		})
		getList()
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
</style>
