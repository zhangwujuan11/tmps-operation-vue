<template>
  <div class="app-container">
    <el-form label-width="75px" enctype="multipart/form-data">
       <!-- <el-form-item label="组织">
		  <el-tree-select
		     v-model="from.fleetId"
		     :data="deptOptions"
		     :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
		     value-key="deptId"
		     placeholder="选择组织"
		     check-strictly
		  />
        </el-form-item> -->
		<el-form-item label="仓库名称">
		  <el-input v-model="from.warehouseName"></el-input>
		</el-form-item>
		<div style="text-align: center;">
		  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="erpot" v-hasPermi="['tpms:warehouse:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
    <!-- 表格操作 -->
	<!-- <p class="flages">
		<img src="@/assets/images/iconfont-qicheyongpin.png" alt="">
		<span>仓库列表</span> -->
		<el-button type="success" plain  @click="handleUpdate()" v-hasPermi="['tpms:warehouse:add']" >增加</el-button>
	<!-- </p> -->
    <el-table :data="tabledata">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="仓库名称" align="center" prop="warehouseName">
      </el-table-column>
      <el-table-column label="上限库存数量" align="center" prop="maxCount" />
      <el-table-column label="下限库存数量" align="center" prop="minCount" />
      <el-table-column label="仓库类型"  align="center" style="cursor: pointer;" width="120">
		  <template #default="scope">
			  <div>
				  {{ filters(scope.row.warehouseType)}}
			  </div>
		  </template>
      </el-table-column>
      <!-- <el-table-column label="所属组织" align="center" prop="companyName" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="primary"
			   @click="handleUpdate(scope.row)"
			  v-hasPermi="['tpms:warehouse:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>修改</el-button>
			  <el-button type="danger" link 
			  v-hasPermi="['tpms:warehouse:remove']" 
			  @click="handleDelete(scope.row)"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
			</template>
        </el-table-column>
    </el-table>
  <pagination
     v-show="total > 0"
     :total="total"
     v-model:page="from.pageNum"
     v-model:limit="from.pageSize"
     @pagination="getList"
  />
    <!-- 轮胎详情 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body  :validate-on-rule-change="false"  @close="openclose" :close-on-click-modal="false">
        <el-form label-width="130px" :rules="rules" ref="menuRef" :model="form">
			<div style="width: 100%;">
				<!-- <el-form-item label="所属组织" prop='companyName'>
				  <el-tree-select
				  :default-expand-all="true"
				     v-model="form.companyId"
				     :data="deptOptions"
				     :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
				     value-key="deptId"
				     placeholder="选择组织"
				     check-strictly
					 @node-click="handleRoleChange"
				  />
				</el-form-item> -->
				<el-form-item label="仓库名称" prop="warehouseName">
				  <el-input placeholder="请输入仓库名称" v-model="form.warehouseName"></el-input>
				</el-form-item>
				<el-form-item label="上限库存数量" prop="maxCount">
				  <el-input type="number" placeholder="请输入上限库存数量" v-model="form.maxCount"></el-input>
				</el-form-item>
				<el-form-item label="下限库存数量" prop="minCount">
				  <el-input type="number" placeholder="请输入下限库存数量" v-model="form.minCount"></el-input>
				</el-form-item>
			</div>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform">确定</el-button>
          <el-button @click="openclose">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="Party">
	import { ref,onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { warehouselist, warehouseadd, serchwarehouse, updatawarehouse, deletewarehouse, exportwarehouse, exportxlxs } from '@/api/warehouse'
	import {  vehicleNo } from '@/api/systensettings'
	import { fleetslist } from '@/api/company'
	import { listDept } from "@/api/system/dept";
	const { proxy } = getCurrentInstance();
	// 搜索表单
	const loading = ref(false)
	const from=ref({
		warehouseName:'',
		companyName:'',
		pageNum: 1,
		pageSize: 10,
	})
	const tabledata=ref([])// table数据
	const total=ref(0)// 分页总条数
	// 表单数据获取
	function getList(){
		 loading.value = true
		warehouselist(from.value).then(res=>{
			if(res.code == 200){
				tabledata.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.message)
				  loading.value = false
			}
		})
	}
	// 所属组织
	const deptOptions = ref([]);
	const vehicleNoo=ref([])
	
	// 新增，修改表单
	const form =ref({
		warehouseType:1
	})
	const value=ref('')//表单所属组织
	function handleRoleChange(val){
		// carcompanydata.value.map(item=>{
		// 	if(item.fleetId == val){
		// 		form.value.companyName = item.teamName
		// 	}
		// })
		form.value.companyName = val.deptName
	}
	const  rules=({
	    // companyName: [{ required: true, message: "所属组织不能为空", trigger: "blur" }],
		maxCount: [{
		   pattern:/^[0-9]+(\.\d+)?$/,
		   message: "输入正确的上限库存数量",
		   trigger: "blur",
		}],
		minCount: [{
		   pattern:/^[0-9]+(\.\d+)?$/,
		   message: "输入正确的下限库存数量",
		   trigger: "blur",
		}],
		warehouseName: [{ required: true, message: "仓库名称不能为空", trigger: "blur" }],
	  }) 
  const  title=ref('')
 function filters(e: any){
    let txt = "";
    switch (e) {
      case "1":
        txt = "系统自定义";
        break;
      case "2":
        txt = "自定义";
        break;
    }
    return txt;
  }
	  
  // 车辆新增/修改
  const handleUpdate=function(row){
	  if(row){
		  serchwarehouse(row.id).then(res=>{
			  if(res.code == 200){
				  // value.value=res.data.companyId + ',' + res.data.companyName
				  form.value=res.data
				  form.value.companyId=form.value.companyId
				  title.value = "修改仓库管理";
				   open.value = true;
			  }
		  })
		  
	  }else{
		 form.value ={
		  	warehouseType:1
		  }
		  value.value=''
		   title.value = "新增仓库管理";
		    open.value = true;
	  }
  }
	  function subform(){
				form.value.sysUserid=localStorage.getItem('userid')
	  		  proxy.$refs["menuRef"].validate(valid => {
	  		    if (valid) {
					if(form.value.minCount == undefined || form.value.minCount == ''){
						form.value.minCount=0
					}
					if(form.value.maxCount ==  undefined || form.value.maxCount == ''){
						form.value.maxCount=0
					}
					if(Number(form.value.maxCount)  < Number(form.value.minCount) ){
						ElMessage.error("上限库存数量不能小于下限库存数量")
						return false
					}else{
						if(form.value.id){
							updatawarehouse(form.value).then(res=>{
								if(res.code == 200){
									 open.value=false
									 ElMessage.success("修改成功")
									 getList()
								}else{
									 ElMessage.error(res.message)
								}
							})
						}else{
							warehouseadd(form.value).then(res=>{
								if(res.code == 200){
									open.value=false
									 ElMessage.success("新增成功")
									 getList()
								}else{
									 ElMessage.error(res.message)
								}
							})
						}
					}
	  			}else{
				ElMessage.error("请完整填写信息")
				}
	  		})
	  }
	  // 取消
	  function openclose(){
	  	open.value=false
	  	proxy.$refs["menuRef"].clearValidate();
	  }
	  /** 删除按钮操作 */
	  const handleDelete=function (row) {
	     const idss = row.id || ids.value;
	     ElMessageBox.confirm(
	        '您确定要删除该信息吗？',
	        '注意',
	        {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning',
	        }).then(() => {
				deletewarehouse(idss).then(res=>{
					if(res.code == 200){
						ElMessage({
						  type: 'success',
						  message: '删除成功',
						})
						open.value=false
						 getList()
					}else{
						ElMessage({
						  type: 'error',
						  message: res.message,
						})
					}
				})
	        })
	        .catch(() => {
	          ElMessage({
	            type: 'info',
	            message: '已取消删除',
	          })
	        })
	   }
	   
   // 导出
   function erpot(){
	   exportwarehouse(from.value).then(res=>{
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
           link.download = "仓库数据.xlsx";
           link.click();
       } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
           // IE version
           var blob = new Blob([data], { type: 'application/force-download' });
           window.navigator.msSaveBlob(blob, "仓库数据.xlsx");
       } else {
           // Firefox version
           var file = new File([data], "仓库数据.xlsx", { type: 'application/force-download' });
           window.open(URL.createObjectURL(file));
       }
   }
	
	const open=ref(false)
	// mounted
	onMounted(()=>{
		getList()
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
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
  .el-form {
    width: 100%;
    display: flex;
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
  .flages{
	  display: flex;
	  align-items: center;
	    color:#515a6e;
		font-size: 14px;
		margin-bottom: 15px;
  }
  .flages span{
	  margin-right: 40px;
  }
  .flages img{
	  width:20px;
	margin-right: 10px;
  }
</style>
