<template>
  <div class="app-container">
    <el-form label-width="75px">
		<el-form-item label="调拨时间" style="width: 22.5vw;">
		  <el-date-picker
			  v-model="time"
			 type="daterange"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			 format="YYYY/MM/DD"
			 value-format="YYYY-MM-DD"
			  @change="wetiem"
			/>
		</el-form-item>
       <el-form-item label="调出仓库">
         <el-select 
         placeholder="请输入调出仓库" 
			v-model="queryform.oldWarehouseId"
          filterable
          remote
		  :clearable="true"
          reserve-keyword
         >
           <el-option :label="item.warehouseName" :value="item.id" v-for="(item,index) in houselist" :key="index" />
         </el-select>
       </el-form-item>
	   <el-form-item label="调入仓库">
	     <el-select 
	     placeholder="请输入调入仓库" 
	     v-model="queryform.newWarehouseId"
	      filterable
	      remote
		  :clearable="true"
	      reserve-keyword
	     >
	       <el-option :label="item.warehouseName" :value="item.id" v-for="(item,index) in houselist" :key="index" />
	     </el-select>
	   </el-form-item>
	   <div style="text-align: center;">
	     <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	     <el-button @click="exp" v-hasPermi="['tpms:detail:export']" ><i class="el-icon-upload2"></i>导出</el-button>
	   </div>
    </el-form>
   
	
    <el-table :data="dataList">
		<el-table-column label="序号" align="center" type="index" width="80"/>
		<el-table-column label="胎号" align="center" prop="tireNo" width="80"/>
      <el-table-column label="品牌" align="center" prop="tireBrandName" />
	   <el-table-column label="规格" align="center" prop="specificationsName" />
      <el-table-column label="花纹" align="center" prop="pattern">
      </el-table-column>
      <el-table-column label="调出仓库" align="center" prop="oldWarehouseName" />
      <el-table-column label="调入仓库" align="center" prop="newWarehouseName" />
      <el-table-column label="操作人" align="center" prop="createBy">
      </el-table-column>
      <el-table-column label="调拨时间" align="center" prop="createTime" />
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

<script setup lang="ts" name="Transfertirelist">
	import { ref, onMounted } from 'vue';
	import {transferDetaillist,warehouselist, exportDetaillist, exportxlxs} from '@/api/warehouse'
	
	const queryform=ref({
		pageNum:1,
		pageSize:10
	})
	const time=ref('')
	function wetiem(){
		if(time.value){
			queryform.value.startTime=time.value[0] + " 00:00:00"
			queryform.value.endTime=time.value[1] + " 59:59:59"
		}else{
			queryform.value.startTime=''
			queryform.value.endTime=''
		}
	}
	
	const total=ref(0)
	const dataList=ref([])
	function getList(){
		transferDetaillist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	
	function exp(){
		exportDetaillist(queryform.value).then(res=>{
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
	        link.download = "轮胎调拨明细表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎调拨明细表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎调拨明细表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	const houselist=ref([])
	
	// mounted
	onMounted(()=>{
		getList()
		warehouselist({
			pageNum:1,
			pageSize:1000
		}).then(res=>{
			houselist.value=res.data.items
		})
	})
	
	// const radio1 =ref("1")
	// const radio2 =ref("")
	// const radio3 =ref("")
	// const radio4 =ref("")
	// const value1=ref('')
	// const defaultTime = ref<[Date, Date]>([
	//   new Date(2000, 1, 1, 0, 0, 0),
	//   new Date(2000, 2, 1, 23, 59, 59),
	// ])
	
	// const open=ref(false)
	// const pageNum=ref(1)
	// const pagesize=ref(10)
	// const ifbaofei=ref('可用轮胎')
	// const fenlei=ref('')
	// const zhuangtai=ref('')
	// const kunbang=ref('')
	
	// const  ids=ref([])
	// const single=ref(true) //单个
	// const multiple=ref(true)//多个
	// const  title=ref('')
	// const from1=ref(false) //单个
	// const from2=ref(false)
	//  /** 批量修改轮胎信息 */
	//  const handleUpdate=function(row){
	// 	 from1.value = true
	// 	 open.value = true;
	// 	 title.value = "批量修改轮胎信息";
	//  }
	//  // 仓库轮胎调拨
	//  const handleAdd=function(row){
	// 	 from2.value = true
	// 	 open.value = true;
	// 	 title.value = "仓库轮胎调拨";
	//  }
	//  /** 删除按钮操作 */
	// const handleDelete=function (row) {
	//    const idss = row.id || ids.value;
	//   console.log(row)
	//  }
</script>
<style scoped>
  /*
  /deep/.el-select > .el-input{
    width: 100%;
  } */
  /* /deep/.el-input{
    width: 80%;
  } */
  .el-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
