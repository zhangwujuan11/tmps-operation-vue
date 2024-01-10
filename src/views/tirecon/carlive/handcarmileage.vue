<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="车牌号">
		  <el-select 
		  placeholder="请输入车牌号" 
		  v-model="querfrom.vehicleNo"
		   filterable
		   remote
		   reserve-keyword
		   :loading="loading"
		  :clearable="true"
		  >
		    <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
		  </el-select>
		</el-form-item>
    </el-form>
	<div style="text-align: center;">
	  <el-button type="primary" @click="changcheck"><i class="el-icon-search"></i> 查询</el-button>
	  <el-button @click="eportlist" v-hasPermi="['tpms:register:export']"><i class="el-icon-upload2"></i>导出</el-button>
	</div>
	
	<el-radio-group v-model="querfrom.registerType" @change="changcheck">
	  <el-radio-button :label="2">甩挂车辆里程登记</el-radio-button>
	  <el-radio-button :label="1">人工里程补录</el-radio-button>
	</el-radio-group>
   
   
   <el-row :gutter="10" class="mb8" v-if="querfrom.registerType == 2">
     <el-col :span="1.5">
       <el-button type="primary" plain  @click="handleAdd"
         v-hasPermi="['tpms:register:add']">登记</el-button>
     </el-col>
   </el-row>
   

<div v-if="!table1">
    <el-table :data="dataList">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="车牌号" sortable align="center" prop="vehicleNo">
      </el-table-column>
	  <el-table-column label="所属组织" sortable align="center" prop="fleetName">
	  </el-table-column>
      <el-table-column label="里程表读数" sortable align="center" prop="mileage" />
      <el-table-column label="状态" sortable align="center" prop="status" >
			<template #default="scope">
				{{fiiter(scope.row.status)}}
	  		</template>
	  </el-table-column>
      <el-table-column label="运行里程" sortable  align="center" prop="operatingMileage"></el-table-column>
      <el-table-column label="登记时间" sortable align="center" prop="registerTime" />
    </el-table>
</div>

<div v-if="table1">
    <el-table :data="dataListtwo">
     <el-table-column label="序号" align="center" type="index" width="80px"/>
     <el-table-column label="车牌号" align="center" prop="vehicleNo">
     </el-table-column>
     <el-table-column label="所属组织" align="center" prop="fleetName">
     </el-table-column>
	 <el-table-column label="轮位" align="center" prop="installPositionDesc">
	 </el-table-column>
	 <el-table-column label="胎号" align="center" prop="tireNo">
	 </el-table-column>
     <!-- <el-table-column label="里程表读数" align="center" prop="mileage" /> -->
    <!-- <el-table-column label="状态" align="center" prop="status" >
     			<template #default="scope">
     				{{fiiter(scope.row.status)}}
     		</template>
     </el-table-column> -->
     <el-table-column label="运行里程"  align="center" prop="operatingMileage"></el-table-column>
     <el-table-column label="安装时间" align="center" prop="installTime" />
     <el-table-column label="拆卸时间" align="center" prop="uninstallTime" />
	  <el-table-column label="操作" align="center" class-name="small-padding" width="150">
	  		   <template #default="scope">
	  			   <el-button
	  			   link  type="primary"
				   v-if="scope.row.status==20"
	  			   @click="handledetail(scope.row)"
	  			  v-hasPermi="['tpms:register:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>补录</el-button>
	  			<span v-if="scope.row.status==21">已补录</span>
				</template>
	    </el-table-column>
    </el-table>
</div>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="querfrom.pageNum"
       v-model:limit="querfrom.pageSize"
       @pagination="changcheck"
    />
    <!-- 甩挂里程登记 -->
    <el-dialog title="甩挂里程登记" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
		<p style="color: red;margin-bottom: 20px;">车辆选择只能选择：里程统计方式是【以手工录入为准】的车辆</p>
        <el-form label-width="100px" :model="form" :rules="rules" ref="menuRef">
           <!-- <el-form-item label="甩挂车牌号">
             <el-input></el-input>
            </el-form-item>
			<el-form-item label="里程表读数">
			  <el-input placeholder="单位km"></el-input>
			</el-form-item> -->
			<el-form-item label="车牌号" prop="vehicleNost">
			 <el-select
			 placeholder="请输入车牌号" 
			 v-model="form.vehicleNost"
			 :clearable="true"
			 filterable
			 :loading="loading"
			 @change="caridchange($event)"
			 >
			   <el-option :label="item.vehicleNo" :value="item.vehicleId" v-for="(item,index) in veh" :key="index" />
			 </el-select>
			</el-form-item>
			<el-form-item label="里程表读数" prop="mileage">
			  <el-input v-model="form.mileage"></el-input>
			</el-form-item>
			<el-form-item label="里程表读数">
			  {{form.status == 10? '上挂' :'下挂'}}
			</el-form-item>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sub()">确认</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
	
	<!-- 补录 -->
	<el-dialog title="人工里程补录" v-model="closr" width="600" append-to-body :close-on-click-modal="false">
	    <div class="closr">
			<p>车牌号：{{gochangeform.vehicleNo}}</p>
			<p>胎号：{{gochangeform.tireNo}}</p>
			<p>	补录时间段：{{gochangeform.installTime}} 至 {{gochangeform.uninstallTime}}</p>
			<p style="display: flex;">补录里程数：<el-input style="width: 60%;" v-model="gochangeform.operatingMileage"></el-input>km</p>
		</div>
	    <div style="text-align: center;margin-top: 20px;" slot="footer" class="dialog-footer">
	      <el-button @click="closr=false">关闭</el-button>
		  <el-button type="primary" @click="sublu">确定</el-button>
	    </div>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Handcarmileage">
	import { ref, onMounted } from 'vue';
	import { ElMessage } from 'element-plus'
	import {vehicleNo, vehicleNoid, updatadengji,guashuai } from '@/api/systensettings'
	import { lichenlist, licehn ,exportxlxs ,exlichen}from '@/api/carlive'
	import { carinfo }from '@/api/car'
	const { proxy } = getCurrentInstance();
	const querfrom=ref({
		pageNum:1,
		pageSize:10,
		vehicleNo:'',
		registerType:2
	})
	const gochangeform=ref({})
	const vehicleNoo=ref([])
	const loading = ref(false)
	const table1=ref(true)
	const dataList=ref([])
	const veh=ref([])
	const form=ref({
		mileage:'',
		vehicleNost:''
	})
	const dataListtwo=ref([])
	// tab切换表格
	
	function sublu(){
		let flage=/^[0-9]+(.[0-9]{1,3})?$/
		if(!flage.test(gochangeform.value.operatingMileage)){
			ElMessage.error("补录里程不正确")
		}else{
			gochangeform.value.status=21
			updatadengji(gochangeform.value).then(res=>{
				if(res.code == 200){
					 closr.value =false
					 ElMessage.success("补录成功")
					 getList()
				}
			})
		}
	}
	const changcheck=function(){
		if(querfrom.value.registerType == 1){
			table1.value=true
			lichenlist(querfrom.value).then(res=>{
				dataListtwo.value=res.data.items
				total.value=res.data.total
			})
		}else{
			lichenlist(querfrom.value).then(res=>{
				dataList.value=res.data.items
				total.value=res.data.total
			})
			table1.value=false
		}
	}
	const open=ref(false)
	const closr=ref(false)
	const total=ref(0)
	const  rules=({
		vehicleNost: [{ required: true, message: "请选择车牌", trigger: "blur" }],
		mileage: [{ required: true, message: "请输入里程", trigger: "blur" }],
	  }) 
	
	function getList(){
		lichenlist(querfrom.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	//详情
	 function handledetail(i){
		gochangeform.value=i
		 closr.value=true
	 }
	// 维护登记
	function handleAdd(row){
		open.value=true
	 }
	 // 格式化日期格式如：2017-9-19 18:04:33
	 function formatDate(value, type) {
	     // 计算日期相关值
	     let time = typeof value == 'number' ? new Date(value) : value;
	     let Y = time.getFullYear();
	     let M = time.getMonth() + 1;
	     let D = time.getDate();
	     let h = time.getHours();
	     let m = time.getMinutes();
	     let s = time.getSeconds();
	     let week = time.getDay();
	     // 如果传递了type的话
	     if (type === undefined) {
	         return Y + '-' + (M < 10 ? '0' + M : M) + '-' + (D < 10 ? '0' + D : D) + ' ' + (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
	     } else if (type === 'week') {
	         // 在quartz中 1为星期日
	         return week + 1;
	     }
	 }
	 
	 function fiiter(e){
		 if(e == 10){
			 return "上挂"
		 }else if(e == 20){
			 return "未补录"
		 }else if(e== 21){
			  return "已补录"
		 }else if(e == 11){
			 return "下挂"
		 }
	 }
	 
	 // 车辆id查询
	 function caridchange(i){
		 let time = new Date();
		 let format = formatDate(time)
		 carinfo(i).then(res=>{
			 form.value.fleetId=res.data.fleetId
			 form.value.fleetName=res.data.fleetName
			 form.value.operatingMileage=res.data.totalMileage
			 form.value.registerTime=format
			 form.value.registerType=1
			 form.value.vehicleNo=res.data.vehicleNo
			 guashuai(res.data.vehicleNo).then(res=>{
				 form.value.status=res.data
			 })
		 })
	 }
	 function sub(){
		 proxy.$refs["menuRef"].validate(valid => {
		   if (valid) {
			   form.value.registerType=querfrom.value.registerType
			   licehn(form.value).then(res=>{
				 if(res.code == 200){
					 open.value =false
					 ElMessage.success("登记成功")
					 form.value.vehicleNost=''
					 form.value.mileage=''
					 getList()
				 }
			   })
			}
		   })
	 }
	 
	 // 导出
	 function eportlist(){
		 querfrom.value.pageNum=1
		 querfrom.value.pageSize=100000
	 	exlichen(querfrom.value).then(res=>{
	 		exportxlxs(res.data).then(respon=>{
	 			 downloadFiles(respon)
				 querfrom.value.pageNum=1
				 querfrom.value.pageSize=10
	 		})
	 	})
	 }
	 
	 // 解码下载方法
	 function downloadFiles(data) {
	     if (typeof window.chrome !== 'undefined') {
	         // Chrome version
	         var link = document.createElement('a');
	         link.href = window.URL.createObjectURL(data);
	         link.download = "人工里程登记.xlsx";
	         link.click();
	     } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	         // IE version
	         var blob = new Blob([data], { type: 'application/force-download' });
	         window.navigator.msSaveBlob(blob, "人工里程登记.xlsx");
	     } else {
	         // Firefox version
	         var file = new File([data], "人工里程登记.xlsx", { type: 'application/force-download' });
	         window.open(URL.createObjectURL(file));
	     }
	 }
	 
	onMounted(()=>{
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		vehicleNoid({mileageStatType:2003}).then(res=>{
			if(res.code == 200){
				veh.value=res.data.items
			}
		})
		lichenlist(querfrom.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			table1.value=false
		})
	})
</script>
<style scoped>
  /*
  /deep/.el-select > .el-input{
    width: 100%;
  } */
  /* /deep/.el-input{
    width: 80%;
  } */
  .indexforn {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
