<template>
  <div class="app-container">
    <el-form label-width="75px">
	  <el-form-item label="月度" style="width: 22.5vw;">
	     <el-date-picker
		  v-model="queryfrom.queryMonth"
		  type="month"
		  format="YYYY-MM"
		  value-format="YYYY-MM"
		/>
	   </el-form-item>
	  <el-form-item label="所属仓库">
	   <el-select
	   placeholder="请选择所属仓库" 
	   v-model="queryfrom.warehouseId"
	   filterable
	   :clearable="true"
	   >
	     <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
	   </el-select>
	  </el-form-item>
	   <div style="text-align: center;margin-left: 15px;">
	     <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	     <el-button @click="exportlist"><i class="el-icon-upload2"></i>导出</el-button>
	   </div>
    </el-form>
   
    <div class="chekbox">
      <el-radio-group v-model="queryfrom.queryType" @change="getList">
        <el-radio-button :label="101">上月结存明细表</el-radio-button>
        <el-radio-button :label="201">本月调入明细表</el-radio-button>
        <el-radio-button :label="301">本月入库明细表</el-radio-button>
        <el-radio-button :label="202">本月调出明细表</el-radio-button>
        <el-radio-button :label="302">本月出库明细表</el-radio-button>
        <el-radio-button :label="102">本月结存明细表</el-radio-button>
      </el-radio-group>
    </div>
	
    <el-table :data="dataList">
		<el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="所属仓库" align="center" prop="warehouseName" />
      <el-table-column label="胎号" align="center" prop="tireNo" />
      <el-table-column label="品牌" align="center" prop="tireBrandName" />
      <el-table-column label="规格" align="center" prop="specificationsName" />
      <el-table-column label="花纹型号" align="center" prop="pattern" />
      <el-table-column label="新胎花纹深度(mm)" align="center" prop="depth" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="分类" align="center" prop="category">
		  <template #default="scope">
		  	 <dict-tag :options="lifecycle_tire_category" :value="scope.row.category" />
		  </template>
	  </el-table-column>
      <el-table-column label="入库时间" align="center" prop="createTime" />
    </el-table>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="queryfrom.pageNum"
       v-model:limit="queryfrom.pageSize"
       @pagination="getList"
    />
	<div class="pagedove">
	  <!-- <p style="color: red;font-weight: 800;">*合计总数：{{total}}条    合计总金额：17088.00元</p> -->
	</div>
  </div>
</template>

<script setup lang="ts">
	
	import { ref, onMounted } from 'vue';
	import {detail, warehouselist, exdtrail, exportxlxs} from '@/api/warehouse'
	import { listDept } from "@/api/system/dept";
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_category } = proxy.useDict("lifecycle_tire_category");
	const queryfrom=ref({
		queryType:101,
		pageNum:1,
		pageSize:10,
		queryMonth:''
	})
	const houselist=ref([])
	const total=ref(0)
	const deptOptions = ref([]);//组织下拉框
	const dataList=ref([]) 
	function getList(){
		detail(queryfrom.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	function exportlist(){
		exdtrail(queryfrom.value).then(res=>{
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
	        link.download = "轮胎列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		// 仓库
		warehouselist({}).then(res=>{
			houselist.value=res.data.items
		})
		// 组织
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		const now = new Date();
		const year = now.getFullYear();
		const month = ('0' + (now.getMonth() + 1)).slice(-2);
		queryfrom.value.queryMonth = year+'-' + month
		getList()
	})
</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
    justify-content:left;
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
  .chekbox{
	  margin-top: 15px;
	  display: flex;
	  align-items: center;
	  margin-top: 15px;
  }
  .chekbox span{
	  font-size: 14px;
	  color: #606266;
  }
</style>
