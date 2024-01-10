<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
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
			<el-select
			placeholder="请输入胎号" 
			v-model="queryform.tireNo"
			filterable
			:clearable="true"
			>
			  <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
			</el-select>
		  </el-form-item>
		<div style="text-align: center;">
		  <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="exportable" v-hasPermi="['tpms:maintenance:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
   <el-table :data="dataList">
     <el-table-column label="胎号" sortable align="center" prop="tireNo" width="180"/>
     <el-table-column label="车牌号" sortable align="center" prop="vehicleNo"/>
     <el-table-column label="品牌" sortable align="center" prop="tireBrandName" />
     <el-table-column label="规格" sortable align="center" prop="specificationsName" />
     <el-table-column label="花纹型号" sortable align="center" prop="pattern"/>
     <el-table-column label="新胎花纹深度(mm)" sortable align="center" prop="depth" />
     <el-table-column label="实测花纹深度(mm)" sortable align="center" prop="measuredDepth" />
     <el-table-column label="累计里程(km)" sortable align="center" prop="totalMileage" />
     <el-table-column label="预测里程(km)" sortable align="center" prop="predictionMileage"/>
     <el-table-column label="预测剩余里程(km)" sortable align="center" prop="residueMileage"/>
   </el-table>
   <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryform.pageNum"
      v-model:limit="queryform.pageSize"
      @pagination="getList"
   />
  </div>
</template>

<script setup lang="ts" name="Tiremileageestimatelist">
	import { onMounted, ref } from 'vue';
	// import { ElMessage, ElMessageBox } from 'element-plus'
	import { vehicleNo } from '@/api/systensettings'
	import { tirelist, expotires, exportxlxs } from '@/api/carlive'
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		install:0,
		vehicleNo:'',
		tireNo:'',
		type:'10'
	})
	const dataList=ref([])
	const total=ref(0)
	const vehicleNoo=ref([])
	const chetai=ref([])
	
	// 获取table数据
	function getList(){
		tirelist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 导出
	function exportable(){
		expotires(queryform.value).then(res=>{
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
	onMounted(()=>{
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
		getList()
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
  .pagination-container .el-pagination{
	  right: 20px;
  }
</style>
