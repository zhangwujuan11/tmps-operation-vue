<template>
  <div class="app-container">
    <el-form label-width="75px">
        <el-form-item label="车牌号">
			<el-select
			 placeholder="请输入车牌号" 
			 v-model="ruleForm.mainNumber"
			 :clearable="true"
			 filterable
			 :loading="loading"
			 >
				<el-option :label="item.vehicleNo" :value="item.vehicleNo" v-for="(item,index) in vehicleNoo" :key="index" />
			</el-select>
        </el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
      <el-button @click="exportlist" v-hasPermi="['tpms:disposals:export']" ><i class="el-icon-upload2"></i>导出</el-button>
    </div>

    <!-- 表格操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" plain  @click="handleUpdate()"  v-hasPermi="['tpms:disposals:add']">报废登记</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" v-loading="loading">
		<el-table-column label="序号" align="center" type="index"  width="55"/>
		<el-table-column label="车牌号" sortable align="center" prop="plateNumber"/>
		<el-table-column label="车辆品牌" sortable align="center" prop="brand" />
		<el-table-column label="所属组织" sortable align="center" prop="fleetName" />
		<el-table-column label="GPS累计里程(km)" sortable align="center" prop="gpsTotalMileage" />
		<el-table-column label="报废日期" sortable align="center" prop="disposalDate">
			<template #default="scope">
				{{parseTime(scope.row.disposalDate,'{y}-{m}-{d}')}}
			</template>
		</el-table-column>
		<el-table-column label="报废人" align="center" prop="disposalPerson" />
		<el-table-column label="报废说明" align="center" prop="disposalReason" />
		<el-table-column label="登记时间" sortable align="center" prop="createdTime">
			<template #default="scope">
				{{parseTime(scope.row.createdTime)}}
		  	</template>
		</el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding" width="150">
			<template #default="scope">
			   <el-button
			   link  type="primary"
			   @click="hadeledite(scope.row.id)"
			  v-hasPermi="['tpms:disposals:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑</el-button>
			  <el-button
			   link  type="danger"
			   @click="hadeledetel(scope.row.id)"
			  v-hasPermi="['tpms:disposals:remove']"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
			</template>
        </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="ruleForm.pageNum"
      v-model:limit="ruleForm.pageSize"
      @pagination="getList"
    />
    <!-- 轮胎详情 -->
    <el-dialog title="报废登记" v-model="open" width="40%" append-to-body :close-on-click-modal="false">
        <el-form label-width="130px" :model="form" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
			<el-form-item label="报废车牌号" prop="vehicleId">
				<el-select
				 placeholder="请输入车牌号" 
				 v-model="form.vehicleId"
				 :clearable="true"
				 filterable
				 :loading="loading"
				>
					<el-option :label="item.vehicleNo" :value="item.vehicleId" v-for="(item,index) in vehicleNoo" :key="index" />
				</el-select>
			</el-form-item>
			<el-form-item label="报废日期" prop="disposalDate">
				 <el-date-picker
				 v-model="form.disposalDate"
				 format="YYYY/MM/DD"
				 value-format="x"
				 type="date"/>
			</el-form-item>
			<el-form-item label="报废说明" prop="disposalReason">
				<el-input  placeholder="请输入报废说明"  v-model="form.disposalReason"></el-input>
			</el-form-item>
			<el-form-item label="报废人" prop="disposalPerson">
				<el-input  placeholder="请输入报废人"  v-model="form.disposalPerson" ></el-input>
			</el-form-item>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform" v-if="isnew">确定</el-button>
		  <el-button type="primary" @click="ipdateform" v-if="!isnew">提交修改</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Paper">
	import { ref, onMounted, watch } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {paperlist, paperadd, exportpaerlist, getparelist,updatepare, detelpare } from '@/api/car.js'
	import {vehicleNoid} from '@/api/systensettings'
	import { getToken } from "@/utils/auth";
	const { proxy } = getCurrentInstance();
	const carcompanydata=ref([])//组织下拉框
	const vehicleNoo=ref([])//车牌号下拉框
	const carClass=ref('')//未处理的车型
	const trailCarType=ref('')//未处理的gua车型
	const changfid=ref('')
	const ruleForm=ref({
		pageNum:1,
		pageSize: 10,
		mainNumber:''
	})//搜索框表单
	const total=ref(0)
	const open=ref(false)
	const loading=ref(false)
	const tableData=ref([])
	const isnew=ref(true)
	
	// table数据
	function getList(){
		 loading.value = true
		paperlist(ruleForm.value).then(res=>{
			if(res.code ==200){
				tableData.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.message)
				loading.value = false
			}
		})
	}
	
	// 蒙城表单
	const form=ref({
		vehicleId:'',
		disposalDate:'',
		disposalReason:'',
		disposalPerson:''
	})
	const rules=({
	    vehicleId: [{ required: true, message: "报废车辆不能为空", trigger: "blur" }],
		disposalDate: [{ required: true, message: "报废日期不能为空", trigger: "blur" }],
		disposalPerson: [{ required: true, message: "报废人不能为空", trigger: "blur" }],
	  }) 
	  // 点击新增
	  function handleUpdate(){
		  if(form.value.vehicleId != ''){
			  proxy.$refs["menuRef"].clearValidate();
			  form.value={
			  	vehicleId:'',
			  	disposalDate:'',
			  	disposalReason:'',
			  	disposalPerson:''
			  }
			  isnew.value=true
			  open.value=true
		  }else{
			 open.value=true 
		  }
				
	  }
	  
	  // 点击编辑
	  function hadeledite(i){
		 isnew.value=false
		  getparelist(i).then(res=>{
			  form.value=res.data
			  
			  open.value=true
			  proxy.$refs["menuRef"].clearValidate();
		  })
	  }
	  // 新增报废车辆
	  function subform(){
	  		  proxy.$refs["menuRef"].validate(valid => {
	  		    if (valid) {
	  				paperadd(form.value).then(res=>{
	  					if(res.code == 200){
	  						ElMessage.success("添加报废车辆成功")
	  						open.value=false
	  						getList()
	  					}else{
	  						ElMessage.error(res.message)
	  					}
	  				})
	  			
	  			}
	  		})
	  }
	  // 修改
	  function ipdateform(){
		  proxy.$refs["menuRef"].validate(valid => {
		    if (valid) {
				updatepare(form.value).then(res=>{
				  if(res.code == 200){
					  ElMessage.success("修改成功")
					  open.value=false
					  getList()
				  }else{
					  ElMessage.error(res.message)
				  }
				})
			}
			})
		  
	  }
	  
	  // 删除
	  function hadeledetel(i){
		  ElMessageBox.confirm('确定删除该数据？', '提示', {
		    confirmButtonText: '确定',
		    cancelButtonText: '取消',
		    type: 'warning'
		  }).then(() => {
		   detelpare(i).then(res=>{
		   		if(res.code == 200){
					ElMessage.success("删除成功")
					getList()
				}else{
					ElMessage.error(res.message)
				}  
		   })
		  }).catch(() => { });
		  
		  
		 
	  }
	  
	  
	  	// 导出车辆列表
	  	function exportlist(){
	  		exportpaerlist(ruleForm.value).then(res=>{
	  			downloadFiles(res)
	  		})
	  	}
	  // 解码下载方法
	  	function downloadFiles(data) {
	  	    if (typeof window.chrome !== 'undefined') {
	  	        // Chrome version
	  	        var link = document.createElement('a');
	  	        link.href = window.URL.createObjectURL(data);
	  	        link.download = "车辆报废列表.xls";
	  	        link.click();
	  	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	  	        // IE version
	  	        var blob = new Blob([data], { type: 'application/force-download' });
	  	        window.navigator.msSaveBlob(blob, "车辆报废列表.xls");
	  	    } else {
	  	        // Firefox version
	  	        var file = new File([data], "车辆报废列表.xls", { type: 'application/force-download' });
	  	        window.open(URL.createObjectURL(file));
	  	    }
	  	}
	onMounted(()=>{
		getList()
		vehicleNoid().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
	})
	 
	
</script>
<style scoped>
  .el-form {
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
  :deep(.el-select){
	  width:100% !important;
  }
  
</style>
