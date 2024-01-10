<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		  <el-form-item label="经办人">
				<el-input placeholder="请输入经办人" v-model="queryform.maintainer" ></el-input>
		  </el-form-item>
		  <el-form-item label="翻新日期" width="100px">
		    <el-date-picker
				v-model="queryform.maintenanceDate"
				type="date"
				placeholder="翻新日期"
				format="YYYY/MM/DD"
				value-format="YYYY-MM-DD"
			  />
		  </el-form-item>
		  <el-form-item label="翻新单号">
		  		<el-input placeholder="请输入翻新单号" v-model="queryform.mid" ></el-input>
		  </el-form-item>
		<el-button type="primary" @click="ifbaofei=2;changcheck()"><i class="el-icon-search"></i> 查询</el-button>
		<el-button @click="eportlist" v-hasPermi="['tpms:refurbishment:export']"><i class="el-icon-upload2"></i>导出</el-button>
    </el-form>
	
	<el-radio-group v-model="ifbaofei" @change="changcheck">
	  <el-radio-button label="1">可翻新轮胎列表</el-radio-button>
	  <el-radio-button label="2">翻新记录</el-radio-button>
	</el-radio-group>
  
   
   
 <el-row :gutter="10" class="mb8" v-if="table1">
   <el-col :span="1.5">
     <el-button type="primary" plain @click="handleAdd"  :disabled="multiple"
       v-hasPermi="['tpms:maintenance:add']" >翻新登记入库</el-button>
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
			    @pagination="changcheck"
  			/>
  		</p>
   	 
 </el-row>
 <el-row :gutter="10" class="mb8" v-if="!table1">
  <el-table :data="dataList">
        <el-table-column label="序号" align="center" type="index" width="80px"/>
        <el-table-column label="翻新单号" align="center" prop="mid"/>
        <el-table-column label="经办人" align="center" prop="maintainer" />
        <el-table-column label="翻新厂家" align="center" prop="manufacturer" />
        <el-table-column label="翻新日期"  align="center" style="cursor: pointer;" width="120" prop="maintenanceDate">
   		<template #default="scope">
   			{{parseTime(scope.row.maintenanceDate,'{y}-{m}-{d}')}}
   		  		  <!-- <el-button
   		  		   link  type="primary"
   		  		   @click="handinfo(scope.row.)"
   		  		  v-hasPermi="['system:dict:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button> -->
   		</template>
   	  </el-table-column>
        <el-table-column label="翻新金额" align="center" prop="totalCost" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
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
</el-row>




    <!-- 翻新登记入库登记 -->
	
   <el-dialog title="翻新登记入库登记" v-model="open" width="1000"  :close-on-click-modal="false" :show-close="false">
        <el-form label-width="100px" :rules="rules" ref="menuRef" :model="from" :validate-on-rule-change="false">
        	<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;">
        		<el-form-item label="翻新单号" prop="mid" v-if="!ischange">
        		 <el-input v-model="from.mid"></el-input>
        		</el-form-item>
        		<el-form-item label="翻新单号" prop="mid"  v-if="ischange">
        			<span>{{from.mid}}</span>
        		</el-form-item>
        		
        		<el-form-item label="翻新厂家" prop="manufacturer"  v-if="!ischange">
        		  <el-input  v-model="from.manufacturer"></el-input>
        		</el-form-item>
        		<el-form-item label="翻新厂家" prop="manufacturer" v-if="ischange">
        		  <span>{{from.manufacturer}}</span>
        		</el-form-item>
        		<el-form-item label="经办人" prop="maintainer"  v-if="!ischange">
        		  <el-input v-model="from.maintainer"></el-input>
        		</el-form-item>
        		<el-form-item label="经办人" prop="maintainer"  v-if="ischange">
        		  <span>{{from.maintainer}}</span>
        		</el-form-item>
        		<el-form-item label="翻新日期"  prop="maintenanceDate" v-if="!ischange">
        		  <el-date-picker
        		      v-model="from.maintenanceDate"
        			   :disabled-date="pickerOptions"
        		      type="datetime"/>
        		</el-form-item>
        		<el-form-item label="翻新日期"  prop="maintenanceDate" v-if="ischange">
        			  <span >{{parseTime(from.maintenanceDate)}}</span>
        		</el-form-item>
        	</div>
          <!-- <el-button type="primary" @click="serchtire" v-if="!ischange"  >
        	   新增翻新轮胎
           </el-button> -->
        	<el-table :data="from.tireMaintenanceDetailBos" v-if="!ischange">
        		  <el-table-column label="胎号" align="center" prop="tireNo"/>
        		 <el-table-column label="品牌" align="center" prop="tireBrandName"/>
        		  <!-- <el-table-column label="规格" align="center" prop="specificationsName" /> -->
        		  <!-- <el-table-column label="花纹" align="center" prop="pattern" /> -->
        		  <el-table-column label="翻新胎号"  align="center" prop="newTireNo" width="250">
        			  <template #default="scope">
        				  <el-input v-model="scope.row.newTireNo"  v-if="!ischange"></el-input>
        				  <span v-if="ischange">{{scope.row.newTireNo}}</span>
        			  </template>
        		  </el-table-column>
        		  <el-table-column label="花纹深度" align="center" prop="newDepth" >
        			 <template #default="scope">
						  <el-input v-model="scope.row.newDepth" v-if="!ischange" onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
						  <span v-if="ischange">{{scope.row.newDepth}}</span>
        			 </template>
        		  </el-table-column>
        		  <el-table-column label="胎体品牌" align="center" prop="newBrandId"  width="150">
        			  <template #default="scope">
        					<el-select placeholder="请选择" 
        					v-if="!ischange"
        					v-model="scope.row.newBrandId" 
        					style="width: 100%;" clearable>
        						<el-option
        						   label="翻新胎"
        						   :value="92"
        						></el-option>
        					</el-select>
        					<span v-if="ischange">翻新胎</span>
        			  </template>
        			  </el-table-column>
					  <el-table-column label="翻新去向" align="center" prop="stockStatus"  width="150">
						<template #default="scope">
							<el-select placeholder="请选择" v-model="scope.row.stockStatus"  v-if="!ischange" @change="cnstockstatus($event,scope.$index)"> 
							<el-option label="库存翻新胎" :value="11"></el-option>
							<el-option label="彻底报废" :value="50" ></el-option>
							</el-select>
							<span v-if="ischange">{{scope.row.stockStatus == 11? '库存翻新胎':'彻底报废'}}</span>
					  </template>
					  </el-table-column>
					  <el-table-column label="翻新金额" align="center" prop="cost ">
						<template #default="scope">
							<el-input v-model="scope.row.cost"  @change="goatao()" v-if="!ischange"  onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
							<span v-if="ischange">{{scope.row.cost}}</span>
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
			
			<el-table :data="from.tireMaintenanceDetailArrayResponse.items" v-if="ischange">
				  <el-table-column label="胎号" align="center" prop="tireNo"/>
				 <el-table-column label="品牌" align="center" prop="tireBrandName"/>
				  <!-- <el-table-column label="规格" align="center" prop="specificationsName" /> -->
				  <!-- <el-table-column label="花纹" align="center" prop="pattern" /> -->
				  <el-table-column label="翻新胎号"  align="center" prop="newTireNo" width="250">
					  <template #default="scope">
						  <el-input v-model="scope.row.newTireNo"  v-if="!ischange"></el-input>
						  <span v-if="ischange">{{scope.row.newTireNo}}</span>
					  </template>
				  </el-table-column>
				  <el-table-column label="花纹深度" align="center" prop="newDepth" >
					 <template #default="scope">
						  <el-input v-model="scope.row.newDepth" v-if="!ischange"  onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
						  <span v-if="ischange">{{scope.row.newDepth}}</span>
					 </template>
				  </el-table-column>
				  <el-table-column label="胎体品牌" align="center" prop="newBrandId"  width="150">
					  <template #default="scope">
							<el-select placeholder="请选择" 
							v-if="!ischange"
							v-model="scope.row.newBrandId" 
							style="width: 100%;" clearable>
								<el-option
								   label="翻新胎"
								   :value="92"
								></el-option>
							</el-select>
							<span v-if="ischange">翻新胎</span>
					  </template>
					  </el-table-column>
					  <el-table-column label="翻新去向" align="center" prop="stockStatus"  width="150">
						<template #default="scope">
							<el-select placeholder="请选择" v-model="scope.row.stockStatus"  v-if="!ischange" @change="cnstockstatus($event,scope.$index)"> 
							<el-option label="库存翻新胎" :value="11"></el-option>
							<el-option label="彻底报废" :value="50" ></el-option>
							</el-select>
							<span v-if="ischange">{{scope.row.stockStatus == 11? '库存翻新胎':'彻底报废'}}</span>
					  </template>
					  </el-table-column>
					  <el-table-column label="翻新金额" align="center" prop="cost ">
						<template #default="scope">
							<el-input v-model="scope.row.cost"  @change="goatao()" v-if="!ischange"  onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
							<span v-if="ischange">{{scope.row.cost}}</span>
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
			
        	<div style="width: 100%;display: flex;justify-content: left;flex-wrap: wrap;margin-top: 20px;">
        		<el-form-item label="总金额" prop="totalCost" v-if="!ischange">
        		  <el-input  v-model="from.totalCost"   onkeyup="value=this.value.replace(/\D+/g,'')"></el-input>
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
	<!-- <el-dialog title="轮胎列表" v-model="tiretable" width="80%" append-to-body>
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
			<el-button type="warning" @click="tiretable=false" >确定</el-button>
			<el-button @click="clo">关闭</el-button>
		</div>
	</el-dialog> -->
  </div>
</template>

<script setup lang="ts" name="Tireretreadlist">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { getTireBands, getSpecifications, tirelist, aintenancelist, getKeyFX, addtiretrue, maintenancinfo,exportfanxinlist, exportxlxs  } from "@/api/carlive"	
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
		maintainer:'',
		maintenanceDate:'',
		mid:'',
		type:5,
		pageNum:1,
		pageSize:10
	})
	const quertwo=ref({
		pageNum:1,
		pageSize:10,
		type:5
	})
	const table1=ref(true)
	const dataList=ref([]) 
	const total=ref(0)
	const from=ref({
		mid:null,
		maintainer:Cookies.get("username"),
		maintenanceDate:'',
		manufacturer:'',
		totalCost:null,
		remark:'',
		type:5,//维护类型
		tireMaintenanceDetailBos:[]
	})
	const ischange=ref(false)//详情或新增
	const selectform=ref({
		total:0,
		pageNum:1,
		pageSize:10,
		stockStatus:"40"
	})
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
	  const ifbaofei=ref('1')
	  // tab切换表格
	  	const changcheck=function(){
	  		if(ifbaofei.value == "1"){
	  			table1.value=true
				serchtire()
	  		}else{
	  			table1.value=false
				getList()
	  		}
	  	}
	function openfalse(){
			open.value=false
			changcheck()
		}
	  
	  
	  
	// 列表
	function getList(){
		aintenancelist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	function getListtwo(){
		aintenancelist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 新增
	function handleAdd(i){
		ischange.value=false
		from.value.cost=0
		getKeyFX().then(res=>{
			from.value.mid=res.data//维护单号
			proxy.$refs["menuRef"].clearValidate();
		})
		from.value.tireMaintenanceDetailBos.map(ins=>{
			ins.stockStatus=null
		})
		from.value.maintainer= Cookies.get("username")//维护人
		open.value=true
	}
	// 多选框选中数据
	const multiple = ref(true);
	function handleSelectionChange(selection) {
		  multiple.value = !selection.length;
			from.value.tireMaintenanceDetailBos=selection.map(item => item)
			from.value.tireMaintenanceDetailBos.map(ins=>{
			ins.newTireNo=ins.tireNo + "-1"
			ins.newBrandName="翻新胎"
		})
	}
	// 可翻新轮胎列表
	function serchtire(){
		tirelist(selectform.value).then(res=>{
			selecttable.value=res.data.items
			selectform.value.total=res.data.total
		})
	}
	// 翻新去向数据处理
	function cnstockstatus(i,index){
		if(i == 50){
			from.value.tireMaintenanceDetailBos[index].stockStatusCn='彻底报废'
		}else{
			from.value.tireMaintenanceDetailBos[index].stockStatusCn='库存翻新'
		}
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
	// 计算总金额
	function goatao(){
		let toltanum=0
		from.value.tireMaintenanceDetailBos.map(ins=>{
			toltanum+= Number(ins.cost) 
		})
		from.value.totalCost=toltanum || ''
	}
	
	
	// 提交处理
	function subform(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			let flag5= from.value.tireMaintenanceDetailBos.every(item => item.newTireNo != item.tireNo)
			let flag = from.value.tireMaintenanceDetailBos.every(item => !!item.newBrandId)
			let flag2 = from.value.tireMaintenanceDetailBos.every(item => !!item.newDepth)
			let flag3 = from.value.tireMaintenanceDetailBos.every(item => !!item.cost)
			let flag4 = from.value.tireMaintenanceDetailBos.every(item => !!item.newTireNo)
			if(!flag || !flag2 || !flag3 || !flag4 ){
				ElMessage.error("翻新金额，翻新去向，花纹深度，胎体品牌为必填项")
				return false
			}else if(!flag5){
				ElMessage.error("新胎号与旧胎号不可相同")
				return false
			} else{
				// console.log(from.value)
				addtiretrue(from.value).then(res=>{
					if(res.code == 200){
						ElMessage.success("新增翻新成功")
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
	function handinfo(i){
		ischange.value=true
		maintenancinfo(i.id).then(res=>{
			from.value=res.data
			open.value=true
		})
	}
	// 导出
	function eportlist(){
		exportfanxinlist(queryform.value).then(res=>{
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
	        link.download = "轮胎翻新列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎翻新列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎翻新列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	onMounted(()=>{
		serchtire()
		// 品牌
		getTireBands().then(resss=>{
			pinpai.value=resss.data.items
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
	  left:100%;
  } */
</style>
