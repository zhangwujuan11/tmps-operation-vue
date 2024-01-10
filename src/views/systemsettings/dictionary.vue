<template>
	<div class="maincon">
		<div class="treebox">
			<el-tree
			v-if="treeid"
			:data="data"
			:props="defaultProps"
			:default-expand-all="true"
			:highlight-current="true"
			node-key="id"
			:current-node-key="treeid"
			@node-click="handleNodeClick"></el-tree>
		</div>
		<div class="rightbox">
			<el-form label-width="75px" class="indexforn">
				<el-form-item label="名称">
					<el-input placeholder="请输入名称"  v-model="ruleForm.paramName"></el-input>
				</el-form-item>
				<div style="text-align: center;">
				  <el-button type="primary" @click="getList">查询</el-button>
				   <el-button type="warning"  @click="add" v-hasPermi="['tpms:data:add']">添加</el-button>
				</div>
			</el-form>
			<el-row :gutter="10" class="mb8">
			   <right-toolbar  @queryTable="getListupdate"></right-toolbar>
			 </el-row>
			<el-table :data="tableData" v-loading="loading">
			  <el-table-column label="序号" align="center" type="index" width="80px"/>
			  <!-- <el-table-column label="参数类型" align="center" prop="paramType"/> -->
			  <el-table-column label="名称" align="center" prop="paramName" />
			  <!-- <el-table-column label="编号" align="center" prop="paramCode" /> -->
			  <el-table-column label="备注" align="center"  width="120" prop="remark" ></el-table-column>
			  <!-- <el-table-column label="联系地址" align="center" prop="contacterAddress" /> -->
			  <el-table-column label="创建时间" align="center" prop="createTime" />
			    <el-table-column label="操作" align="center" class-name="small-padding" width="150">
				   <template #default="scope">
					   <el-button
					   link  type="primary"
					   @click="addtrees(scope.row)"
					    v-hasPermi="['tpms:data:edit']"
					><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑</el-button>
					  <el-button 
					   link  type="danger"
					    v-hasPermi="['tpms:data:remove']"
					   @click="handleDelete(scope.row)"
					><DeleteFilled style="width: 1em; height: 1em; margin-right: 2px"></DeleteFilled>删除</el-button>
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
			<!-- 组织信息维护 -->
			<el-dialog :title="title" v-model="open" width="40%" append-to-body :close-on-click-modal="false">
			    <el-form label-width="100px" :model="form" :rules="rules" ref="menuRef">
					<el-form-item label="上级:">
					  {{paramName}}
					</el-form-item>
			        <!-- <el-form-item label="参数类型" prop="paramType">
			          <el-input v-model="form.paramType" disabled></el-input>
			        </el-form-item> -->
			      <!-- <el-form-item label="编号" prop="paramCode">
			         <el-input v-model="form.paramCode"></el-input>
			       </el-form-item> -->
				   <el-form-item label="名称" prop="paramName">
				     <el-input v-model="form.paramName"></el-input>
				   </el-form-item>
			        <el-form-item label="备注" prop="remark">
			          <el-input v-model="form.remark"></el-input>
			        </el-form-item>
			    </el-form>
			    <div style="text-align: center;" slot="footer" class="dialog-footer">
			      <el-button type="primary" @click="adadtree">保存</el-button>
			      <el-button @click="open=false">取消</el-button>
			    </div>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts" setup>
	interface Tree {
	  label: string
	  children?: Tree[]
	}
	import { ref, onMounted  } from 'vue';
	import { ElMessage, ElMessageBox, UploadFile } from 'element-plus'
	import {treefleets,fleetslist,addfleets,seridfleets,updatafleets,detelfleets, sollistupdata,     carcompanylist} from '@/api/systensettings'
	const carcompanydata=ref([])
	const ruleForm=ref({
		fleetId:'',
		pageNum: 1,
		pageSize: 10
	})
	const data=ref([]) //树形菜单数据
	const loading = ref(false)
	const total=ref(0)
	const defaultProps = {
	  children: 'children',
	  label: 'label',
	}
	const treeid=ref('')
	const tableData =ref([]) 
	// table数据
	function getList(){
		fleetslist(ruleForm.value).then(res=>{
			tableData.value=res.data.items
			total.value=res.data.total
		})
	}
	// 树状菜单点击
	const feelid=ref(null)
	const teaname=ref('')
	const paramName=ref('')
	const handleNodeClick = (data: Tree) => {
		console.log(data)
		paramName.value=data.label
		teaname.value=data.value
		form.value.typeId=data.id
		ruleForm.value.paramType=data.value

		getList()
	}
	// 添加组织列表
	const open=ref(false)
	
	const { proxy } = getCurrentInstance();
	const datas = reactive({
	  form: {},
	  rules: {
	    contacterPhone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
		teamName: [{ required: true, message: "组织名称不能为空", trigger: "blur" }],
		contacter: [{ required: true, message: "联系人不能为空", trigger: "blur" }],
		contacterAddress: [{ required: true, message: "联系地址不能为空", trigger: "blur" }],
		teamShortName: [{ required: true, message: "组织简称不能为空", trigger: "blur" }],
	  },
	});
	
	const { form, rules } = toRefs(datas);
	const title=ref('')
	function addtrees(row){
		 form.value.paramCode=''
		 form.value.paramName=''
		 form.value.remark=''
		 seridfleets(row.paramId).then(res=>{
		 	if(res.code == 200){
		 		form.value=res.data
		 		title.value="修改字典信息"
		 		open.value=true
		 	}
		 })
	}
	
	// 新增
	function add(){
		form.value.paramCode=''
		form.value.paramName=''
		form.value.remark=''
		if(form.value.typeId == null){
			ElMessage.error("对不起，请先选择一个列表项，才能添加参数")
		}else{
			title.value = "新建字典信息";
			form.value.paramType=teaname.value
			open.value=true
		}
	}
	
	// 刷新
	function getListupdate(){
		sollistupdata().then(res=>{
			console.log(res)
		})
	}
	
	function adadtree(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  if(form.value.paramId){
				updatafleets(form.value).then(res=>{
					if(res.code == 200){
						ElMessage.success("修改成功") 
						open.value=false
						form.value.paramCode=''
						form.value.paramName=''
						form.value.paramId=''
						form.value.paramType=''
						getList()
					}else{
						 ElMessage.error(res.message)
					}
				})
			  }else{
				addfleets(form.value).then(res=>{
					 if(res.code == 200){
						ElMessage.success("创建成功") 
						open.value=false
						form.value.paramCode=''
						form.value.paramName=''
						form.value.paramId=''
						form.value.paramType=''
						gettreedata()
						getList()
					 }else{
						 ElMessage.error(res.message)
					 }
				})
			  }
		  }
		})
	}
	
	/** 删除按钮操作 */
	const handleDelete=function (row) {
	   ElMessageBox.confirm(
	      '确定删除' + row.paramName + "的相关信息吗？",
	      '注意',
	      {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning',
	      }
	    )
	      .then(() => {
			  detelfleets( row.paramId ).then(res=>{
				  if(res.code == 200){
					 ElMessage({
					   type: 'success',
					   message: '删除成功',
					 }) 
					 gettreedata()
					  getList()
				  }else{
					  ElMessage.error(res.message)
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
	 
	 // 树形菜单数据获取
	 function gettreedata(){
		 treefleets().then(res=>{
		 	data.value=res.data
			treeid.value=res.data[0].children[0].id
			console.log(treeid.value)
		 })
	 }
	 
	
	onMounted(()=>{
		gettreedata()
		ruleForm.value.paramType='tire_pitch_row_param'
		getList()
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data.items
			}
		})
	})
</script>


<style scoped>
	.maincon{
		width: 100%;
		display: flex;
		justify-content: space-between;
		/* background-color: #f0f1f6; */
	}
	.maincon .treebox{
		width: 20%;
		height: 100%;
		background-color: white;
	}
	.rightbox{
		width: 79%;
		background: white;
	}
	.indexforn {
	   width: 100%;
	   display: flex;
	   justify-content:start;
		flex-wrap: wrap;
		margin-top: 20px;
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
</style>