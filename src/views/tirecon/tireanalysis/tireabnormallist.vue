<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="系统胎号">
		 <el-select
		 placeholder="请输入胎号" 
		 v-model="queryform.tireNo"
		 filterable
		 :clearable="true"
		 >
		   <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
		 </el-select>
		</el-form-item>
		<el-form-item label="实物胎号">
		  <el-input placeholder="实物胎号"  v-model="queryform.moTireNo"></el-input>
		</el-form-item>
		<div style="text-align: center;">
		  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="expor" v-hasPermi="['tpms:abnormal:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
	
	
    <el-table :data="dataList">
      <el-table-column label="系统胎号" sortable align="center" prop="tireNo"/>
      <el-table-column label="所属组织" sortable align="center" prop="companyName">
      </el-table-column>
	  <el-table-column label="系统车牌号" sortable align="center" prop="vehicleNo">
	  </el-table-column>
      <el-table-column label="系统轮位" sortable align="center" prop="installPosition" />
	  <el-table-column label="系统传感器id" sortable align="center" prop="senderId"/>
	  <el-table-column label="实物胎号" sortable align="center" prop="moTireNo">
	  </el-table-column>
	  <el-table-column label="实物胎号所在车牌号" sortable align="center" prop="moVehicleNo">
	  </el-table-column>
	  <el-table-column label="实物胎号已绑传感器"  align="center" prop="moSenderId" />
	   <el-table-column label="卸下时间" align="center" prop="uninstallTime">
		   <template #default="scope">
		   	{{parseTime(scope.row.uninstallTime)}}
		   </template>
	   </el-table-column>
	  <!-- <el-table-column label="操作" align="center" class-name="small-padding" width="150">
	   		   <template #default="scope">
	   			   <el-button
	   			   link  type="primary"
	   			   @click="handleUpdate(scope.row)"
	   			  v-hasPermi="['system:dict:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>修改</el-button>
	   			  <el-button type="danger" link 
	   			  v-hasPermi="['system:dict:remove']" 
	   			  @click="handleDelete(scope.row)"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
	   			</template>
	     </el-table-column> -->
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

<script setup lang="ts" name="Tireabnormallist">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { tirelist, exportxlxs } from '@/api/carlive'
	import { tpmsbnormal, extpmsbnormal } from '@/api/tirecon'
	const chetai=ref([])
	const queryform=ref({
		tireNo:'',
		moTireNo:'',
		pageNum:1,
		pageSize:10
	})
	const total=ref(0)
	const dataList=ref([]) 
	function getList(){
		tpmsbnormal(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	// 导出
	function expor(){
		extpmsbnormal(queryform.value).then(res=>{
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
	        link.download = "拆卸位置异常列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "拆卸位置异常列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "拆卸位置异常列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	onMounted(()=>{
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		
		getList()
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	import type { UploadFile } from 'element-plus'
	// 上传图片
	const dialogImageUrl = ref('')
	const dialogVisible = ref(false)
	const disabled = ref(false)
	const handleRemove = (file: UploadFile) => {
	  console.log(file)
	}
	const datae=ref('')
	
	const textarea=ref('')
	
	const handlePictureCardPreview = (file: UploadFile) => {
	  dialogImageUrl.value = file.url!
	  dialogVisible.value = true
	}
	
	const handleDownload = (file: UploadFile) => {
	  console.log(file)
	}
	
	const radio1 =ref("1")
	const radio2 =ref("")
	const radio3 =ref("")
	const radio4 =ref("")
	const value1=ref('')
	const defaultTime = ref<[Date, Date]>([
	  new Date(2000, 1, 1, 0, 0, 0),
	  new Date(2000, 2, 1, 23, 59, 59),
	])
	const tableData = [
	  {
	    date: '2016-05-03',
	    name: 'Tom',
	    address: 'No. 189, Grove St, Los Angeles',
	  }
	]
	const list = ref<ListItem[]>([])
	const options = ref<ListItem[]>([])
	const value = ref<string[]>([])
	const loading = ref(false)
	const remoteMethod = (query: string) => {
	  if (query) {
	    loading.value = true
	    setTimeout(() => {
	      loading.value = false
	      options.value = dictList.value.filter((item) => {
	        return item.value.toLowerCase().includes(query.toLowerCase())
	      })
	    }, 200)
	  } else {
	    options.value = []
	  }
	}
	// 多选框选中数据
	const ids=ref([])
	const single=ref(true)  //单个
	const multiple=ref(true)//多个
	const handleSelectionChange=function(selection){
		ids.value = selection.map(item => item.dictCode)
		multiple.value = !selection.length
	}
	const dictList=ref([{
            name: "组织1",
            value: 1
          },
          {
            name: "组织1",
            value: 2
          },
          {
            name: "组织1",
            value: 3
          },
          {
            name: "组织1",
            value: 4
          },
          {
            name: "组织1",
            value: 6
          }
        ]) 
	const open=ref(false)
	const closr=ref(false)
	const pageNum=ref(1)
	const pagesize=ref(10)
	const ifbaofei=ref('1')
	const fenlei=ref('')
	const zhuangtai=ref('')
	const kunbang=ref('')
	
	const  title=ref('')
	 //详情
	 const handledetail=function(){
		open.value=true
	 }
	 /** 删除按钮操作 */
	const handleDelete=function (row) {
	   const idss = row.id || ids.value;
	   ElMessageBox.confirm(
	      '确定删除' + idss + "车辆的同时也解除了该车辆的轮胎匹配及其他相关操作，请谨慎删除，您确定要删除该车辆吗？",
	      '注意',
	      {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning',
	      }
	    )
	      .then(() => {
	        ElMessage({
	          type: 'success',
	          message: 'Delete completed',
	        })
	      })
	      .catch(() => {
	        ElMessage({
	          type: 'info',
	          message: 'Delete canceled',
	        })
	      })
	 }
	 // 解绑
	const jiabangba=function(i){
		console.log(i)
	 		 jiebang.value=true
	 }
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
