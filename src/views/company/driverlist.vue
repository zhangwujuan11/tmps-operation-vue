<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
        <el-form-item label="司机姓名">
         <el-input placeholder="请输入司机姓名" v-model="from.driverName"></el-input>
        </el-form-item>
       <el-form-item label="手机号">
         <el-input placeholder="请输入手机号" v-model="from.mobile"></el-input>
		</el-form-item>
		<el-form-item label="身份证号">
		  <el-input placeholder="请输入身份证号" v-model="from.idCard"></el-input>
		</el-form-item>
		<el-form-item>
		  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button><i class="el-icon-upload2"></i>导出</el-button>
		</el-form-item>
    </el-form>
	<el-row :gutter="10" class="mb8">
	  <el-col :span="1.5">
	    <el-button type="primary" plain  @click="handleAdd">新增司机</el-button>
	  </el-col>
	</el-row>

    <el-table :data="tabledata" v-loading="loading">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="登录账号" align="center" prop="loginName">
      </el-table-column>
      <el-table-column label="司机姓名" align="center" prop="driverName" />
      <el-table-column label="性别" align="center" prop="gender" />
      <el-table-column label="手机号"  align="center" prop="mobile"></el-table-column>
      <el-table-column label="身份证号" align="center" prop="idCardNumber" />
      <el-table-column label="所属组织" align="center" prop="teamName" />
	   <el-table-column label="驾驶证号" align="center" prop="driverLicense" />
      <el-table-column label="创建时间" align="center" prop="createdTime" />
        <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button link  type="primary" @click="handleAdd(scope.row)"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>编辑</el-button>
				<el-button link  type="danger" @click="handledetel(scope.row)"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
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
    <!-- 新增司机 -->
    <el-dialog :title="title" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
       <el-form label-width="100px" :model="ruleForm">
           <el-form-item label="登录名" required v-if="isnew">
              <el-input placeholder="请输入登录名" v-model="ruleForm.loginName"></el-input>
           </el-form-item>
		   <el-form-item label="密码" required  v-if="isnew">
		    <el-input placeholder="请输入密码" v-model="ruleForm.loginPassword"></el-input>
		   </el-form-item>
		   <el-form-item label="司机姓名" required>
		    <el-input placeholder="请输入司机姓名" v-model="ruleForm.driverName"></el-input>
		   </el-form-item>
		   <el-form-item label="司机性别" placeholder="请选择" required>
		    <el-select v-model="ruleForm.gender">
		      <el-option label="请选择" value="" />
		      <el-option label="男" :value="1" />
		      <el-option label="女" :value="0" />
		    </el-select>
		   </el-form-item>
		   <el-form-item label="手机号" required>
		    <el-input  placeholder="请输入手机号" v-model="ruleForm.mobile"></el-input>
		   </el-form-item>
		   <el-form-item label="身份证号">
		    <el-input placeholder="请输入身份证号" v-model="ruleForm.idCardNumber"></el-input>
		   </el-form-item>
		   <el-form-item label="所属组织" required>
			<el-select
			placeholder="请输入所属组织" 
			v-model="ruleForm.fleetId"
			filterable
			:clearable="true"
			:loading="loading"
			>
			  <el-option :label="item.teamName" :value="Number(item.fleetId) " v-for="(item,index) in carcompanydata" :key="index" />
			</el-select>
		   </el-form-item>
		   <el-form-item label="驾驶证号">
		    <el-input placeholder="请输入驾驶证号" v-model="ruleForm.driverLicense"></el-input>
		   </el-form-item>
		   <el-form-item label="驾驶证类型"  placeholder="请选择">
		    <el-select v-model="ruleForm.driverType">
		      <el-option label="请选择" value="" />
		      <el-option label="A1" :value="10" />
		      <el-option label="A2" :value="20" />
			  <el-option label="B1" :value="30" />
			  <el-option label="B2" :value="40" />
			  <el-option label="C1" :value="50" />
			  <el-option label="C2" :value="60" />
		    </el-select>
		   </el-form-item>
		   <el-form-item label="短信提醒">
			<el-select v-model="ruleForm.smsAlarm">
			  <el-option label="请选择" value="" />
			  <el-option label="是" :value="1" />
			  <el-option label="否" :value="0" />
			</el-select>
		   </el-form-item>
		   <el-form-item label="微信提醒">
			<el-select v-model="ruleForm.wxAlarm">
			  <el-option label="请选择" value="" />
			  <el-option label="是" :value="1" />
			  <el-option label="否" :value="0" />
			</el-select>
		   </el-form-item>
       </el-form>
       <div style="text-align: center;" slot="footer" class="dialog-footer">
         <el-button type="primary" @click="subfrom">确定</el-button>
         <el-button @click="open=false">取消</el-button>
       </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox, ElLoading  } from 'element-plus'
	import {actionslist, driversid, adddrivers, updatadrivers,deteldrivers} from '@/api/company.js'
	import {carcompanylist} from '@/api/systensettings'
	const open=ref(false)
	const loading = ref(false)
	const ruleForm=ref({})
	const from=ref({
		driverName:'',
		idCard:"",
		mobile:'',
		pageNum: 1,
		pageSize: 10
	})
	const title=ref('')
	const isnew=ref(true)
	const handleAdd=function(row){
		if(row.driverId == undefined){
			ruleForm.value=ref({})
			title.value="新增司机"
			isnew.value=true
			open.value=true
		}else{
			const loadingInstance = ElLoading.service({ fullscreen: true })
			driversid(row.driverId).then(res=>{
				title.value="修改司机"
				isnew.value=false
				ruleForm.value=res.data
				open.value=true
				loadingInstance.close()
			})
		}
	}
	const carcompanydata=ref([])
	const tabledata=ref([])
	const total=ref(0)
	function getList(){
		 loading.value = true
		actionslist(from.value).then(res=>{
			if(res.code == 200){
				tabledata.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.msg)
				loading.value = false
			}
		}).catch(err=>{
			console.log(err)
		})
	}
	// 提交表单
	 function subfrom(){
		const loadingInstance = ElLoading.service({ fullscreen: true })
		 if(ruleForm.value.driverId != undefined){
			 updatadrivers(ruleForm.value).then(res=>{
				 if(res.code == 200){
					 ElMessage.success("编辑成功")
					 open.value=false
					 getList()
				 }else{
					ElMessage.error(res.msg) 
				 }
			 })
			 loadingInstance.close()
		 }else{
			adddrivers(ruleForm.value).then(res=>{
				if(res.code == 200){
					loadingInstance.close()
					 ElMessage.success("添加成功")
					 open.value=false
					 getList()
				}else{
					loadingInstance.close()
					ElMessage.error(res.message) 
				}
			})
		 }
	 }
	 const handledetel=function(row){
	 		 ElMessageBox.confirm(
	 		    '确定删除' + row.driverName + "的数据？",
	 		    '注意',
	 		    {
	 		      confirmButtonText: '确定',
	 		      cancelButtonText: '取消',
	 		      type: 'warning',
	 		    }
	 		  )
	 		    .then(() => {
					deteldrivers(row.driverId).then(res=>{
						if(res.code == 200){
							ElMessage({
							  type: 'success',
							  message: '删除成功',
							})
							 getList()
						}else{
							ElMessage({
							  type: 'error',
							  message: res.msg
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
	onMounted(()=>{
		getList()
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data.items
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
  .indexforn {
    width: 100%;
    display: flex;
    justify-content: start;
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
  :deep(.el-select){
	  width: 98%;
  }
  
</style>
