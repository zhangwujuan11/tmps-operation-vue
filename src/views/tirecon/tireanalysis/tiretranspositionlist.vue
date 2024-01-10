<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="车牌号">
		  <el-select 
		  placeholder="请输入车牌号" 
		  v-model="queryform.vehicleNo"
		   filterable
		   remote
		   reserve-keyword
		   :clearable="true"
		   :loading="loading"
		  >
		    <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
		  </el-select>
		</el-form-item>
		<div style="text-align: center;">
		  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="eportlist" v-hasPermi="['tpms:maintenance:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
	
	
	<p>超过【{{tatopdata}}】个月未换位轮胎</p>
    <el-table :data="lidatas">
    <el-table-column label="序号" align="center" type="index" width="80px"/>
    <el-table-column label="胎号" sortable align="center" prop="tireNo"/>
    <el-table-column label="车牌号" sortable align="center" prop="vehicleNo"/>
    <el-table-column label="品牌" sortable align="center" prop="tireBrandName"/>
     <el-table-column label="规格" sortable align="center" prop="specificationsName" />
     <el-table-column label="花纹型号" sortable align="center" prop="pattern" />
     <el-table-column label="新胎花纹深度(mm)" sortable align="center" prop="depth" />
     <el-table-column label="实测花纹深度(mm)" sortable align="center" prop="measuredDepth" />
     <el-table-column label="累计里程(km)" sortable align="center" prop="totalMileage" />
     <el-table-column label="安装时间" sortable align="center" prop="installTime" />
    </el-table>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="queryform.pageNum"
       v-model:limit="queryform.pageSize"
       @pagination="getList"
    />
    <!-- 本车轮胎信息 -->
   <el-dialog title="本车轮胎信息" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
   	<el-table :data="dictList">
   	  <el-table-column label="序号" align="center" type="index" width="80px"/>
   	  <el-table-column label="胎号" align="center" prop="tireNo"/>
   	  <el-table-column label="车牌号" align="center" prop="vehicleNo"/>
   	  <el-table-column label="品牌" align="center" prop="tireBrandName"/>
	   <el-table-column label="规格" align="center" prop="specificationsName" />
	   <el-table-column label="花纹型号" align="center" prop="pattern" />
	   <el-table-column label="新胎花纹深度(mm)" align="center" prop="depth" />
	   <el-table-column label="实测花纹深度(mm)" align="center" prop="measuredDepth" />
	   <el-table-column label="累计里程(km)" align="center" prop="totalMileage" />
	   <el-table-column label="安装时间" align="center" prop="installTime" />
   	</el-table>
   	<pagination
   	   v-show="totals > 0"
   	   :total="totals"
   	   v-model:page="querytable.pageNum"
   	   v-model:limit="querytable.pageSize"
   	   @pagination="handledetail"
   	/>
       <div style="text-align: center;margin-top: 28px;" slot="footer" class="dialog-footer">
         <el-button @click="open=false">关闭</el-button>
       </div>
   </el-dialog>
	
  </div>
</template>

<script setup lang="ts" name="Tiretranspositionlist">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {abnormalinfo} from '@/api/tirecon.js'
	import {vehicleNo,parameter} from '@/api/systensettings'
	import {tirelist , exportxlxs, expotires} from '@/api/carlive'
	
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		vehicleNo:'',
		installEndTime:''
	})
	const total=ref(0)
	const lidatas=ref([])
	const vehicleNoo=ref([])//车牌号下拉框
	const dictList=ref([])
	const querytable=ref({
		pageNum:1,
		pageSize:10
	})
	const tatopdata=ref('')
	const loading=ref(false)
	const open=ref(false)
	const totals=ref(0)
	function getList(){
		const today = new Date().toISOString().slice(0, 19).replace("T", " "); //当天日期
		// 获取三个月前的日期时间
		 const threeMonthsAgo = new Date();
		 threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - Number(tatopdata.value));
		 const datetimeThreeMonthsAgo = threeMonthsAgo.toISOString().slice(0, 19) .replace("T", " ");
		queryform.value.installEndTime=datetimeThreeMonthsAgo.split(" ")[0]
		tirelist(queryform.value).then(res=>{
			lidatas.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 详情
	const handledetail=function(i){
		querytable.value.caiId=i
		abnormalinfo(querytable.value).then(res=>{
			dictList.value=res.data.items
			totals.value=res.data.total
			open.value=true
		})
	}
	
	// 导出
	function eportlist(){
		expotires(queryform.value).then(res=>{
			exportxlxs(res.data).then(respon=>{
				 downloadFiles(respon)
			})
		})
	}
	
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎换位异常提醒列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎换位异常提醒列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎换位异常提醒列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	
	onMounted(()=>{
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		parameter().then(res=>{
			if(res.code == 200){
				tatopdata.value=res.data.alertCycle
				// queryform.value.tipDepth=res.data.remainingPatternThreshold
				getList()
			}
		})
	})
	
	
	
	
	
</script>
<style scoped>
  .indexforn {
    width: 100%;
    display: flex;
    justify-content:left;
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
