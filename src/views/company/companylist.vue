<template>
	<div class="maincon">
		<div class="treebox">
			<el-tree
			
			:highlight-current="true"
			:data="data" 
			:props="defaultProps" 
			:default-expand-all="true"
			@node-click="handleNodeClick" />
		</div>
		<div class="rightbox">
			<el-form label-width="75px" class="indexforn">
				<el-form-item label="组织名称">
				  <el-select
				  placeholder="请输入组织名称" 
				  v-model="ruleForm.keyWord"
				  filterable
				  :clearable="true"
				  :loading="loading"
				  >
				    <el-option :label="item.teamName" :value="item.teamName" v-for="(item,index) in carcompanydata" :key="index" />
				  </el-select>
				</el-form-item>
				<div style="text-align: center;">
				  <el-button type="primary" @click="getList">查询</el-button>
				   <el-button type="warning"  @click="addtrees" v-hasPermi="['tpms:fleets:add']">添加</el-button>
				</div>
			</el-form>
			<el-table :data="tableData" v-loading="loading">
			  <el-table-column label="序号" align="center" type="index" width="80px"/>
			  <el-table-column label="组织名称" align="center" prop="teamName"/>
			  <el-table-column label="组织简称" align="center" prop="teamShortName" />
			  <el-table-column label="联系人" align="center" prop="contacter" />
			  <el-table-column label="手机号" align="center"  width="120" prop="contacterPhone" ></el-table-column>
			  <el-table-column label="联系地址" align="center" prop="contacterAddress" />
			  <el-table-column label="创建时间" align="center" prop="createdTime" />
			    <el-table-column label="操作" align="center" class-name="small-padding" width="150">
				   <template #default="scope">
					   <el-button
					   link  type="primary"
					   @click="addtrees(scope.row)"
					    v-hasPermi="['tpms:fleets:edit']"
					><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑</el-button>
					  <el-button 
					   link  type="danger"
					    v-hasPermi="['tpms:fleets:remove']"
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
					<el-form-item label="上级组织">
					  {{form.parentFleetName}}
					</el-form-item>
			        <el-form-item label="组织名称" prop="teamName">
			          <el-input v-model="form.teamName"></el-input>
			        </el-form-item>
			       <el-form-item label="组织简称" prop="teamShortName">
			         <el-input v-model="form.teamShortName"></el-input>
			       </el-form-item>
				   <el-form-item label="联系人" prop="contacter">
				     <el-input v-model="form.contacter"></el-input>
				   </el-form-item>
				   <el-form-item label="手机号" prop="contacterPhone">
				     <el-input v-model="form.contacterPhone"></el-input>
				   </el-form-item>
			        <el-form-item label="联系地址" prop="contacterAddress">
			          <el-input v-model="form.contacterAddress"></el-input>
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
	import {treefleets, fleetslist, addfleets, seridfleets, updatafleets, detelfleets} from '@/api/company.js'
	import {carcompanylist} from '@/api/systensettings'
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
	  children: 'childFleet',
	  label: 'teamName',
	}
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
	const handleNodeClick = (data: Tree) => {
		teaname.value=data.teamName
		feelid.value=data.fleetId
		ruleForm.value.fleetId=data.fleetId
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
		if(row.fleetId){
			seridfleets(row.fleetId).then(res=>{
				if(res.code == 200){
					form.value=res.data
					title.value="修改组织信息"
					open.value=true
				}
			})
		}else{
			if(feelid.value == null){
				ElMessage.error("对不起，请先选择一个组织，才能添加新组织")
			}else{
				form.value=ref({})
				 title.value = "新建组织信息";
				 form.value.parentFleetName=teaname.value
				open.value=true
			}
		}
	}
	
	function adadtree(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  if(form.value.fleetId){
				updatafleets(form.value).then(res=>{
					if(res.code == 200){
						ElMessage.success("修改成功") 
						open.value=false
						getList()
					}else{
						 ElMessage.error(res.message)
					}
				})
			  }else{
				 form.value.fleetId=feelid.value
				addfleets(form.value).then(res=>{
					 if(res.code == 200){
						ElMessage.success("创建成功") 
						open.value=false
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
	      '确定删除' + row.teamName + "组织的相关信息吗？",
	      '注意',
	      {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning',
	      }
	    )
	      .then(() => {
			  detelfleets( row.fleetId ).then(res=>{
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
		 	data.value=res.data.items
		 })
	 }
	 
	
	onMounted(()=>{
		gettreedata()
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