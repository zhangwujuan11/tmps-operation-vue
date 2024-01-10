<template>
  <div class="app-container">
    <el-form label-width="200px" class="indexforn">
		<el-form-item label="考核里程标准设置">
		      <el-checkbox  v-model="from.brand" border>品牌</el-checkbox>
		      <el-checkbox  v-model="from.specification" border>规格</el-checkbox>
			  <el-checkbox  v-model="from.patternModel" border>花纹型号</el-checkbox>
			  <el-checkbox  v-model="from.axisPosition" border>轴位</el-checkbox>
			  <el-checkbox  v-model="from.powerType" border>动力类型</el-checkbox>
		</el-form-item>
		<div style="text-align: center;margin-left: 12px;">
		  <el-button type="primary" @click="checkboxupdata">保存设置</el-button>
		</div>
    </el-form>
   <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
       <el-button type="primary" plain @click="handleAdd" v-hasPermi="['tpms:mileage:add']">添加设置</el-button>
     </el-col>
   </el-row>
<div>
    <el-table :data="tabledata" v-loading="loading">
      <el-table-column label="动力类型" align="center" prop="powerTypeName">
      </el-table-column>
	  <el-table-column label="品牌" align="center" prop="tireBrandName">
	  </el-table-column>
      <el-table-column label="规格" align="center" prop="specificationsName" />
      <el-table-column label="花纹型号" align="center" prop="patternModel" />
      <el-table-column label="轴位"  align="center" prop="softPosition"></el-table-column>
      <el-table-column label="考核里程(km)" align="center" prop="checkMileage" />
      <el-table-column label="所属组织" align="center" prop="fleetName" />
      <el-table-column label="时间" align="center" prop="createTime" />
	  <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link type="primary"
			   v-hasPermi="['tpms:mileage:remove']"
			   @click="handledetel(scope.row)"
			 ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>删除</el-button>
			</template>
	    </el-table-column>
    </el-table>
</div>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="pagedata.pageNum"
       v-model:limit="pagedata.pageSize"
       @pagination="getList"
    />
    <!-- 考核里程设置 -->
    <el-dialog title="考核里程设置" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
			<el-form-item label="所属组织" prop="fleetId" >
				<el-tree-select
				 :default-expand-all="true"
				   v-model="ruleForm.fleetId"
				   :data="deptOptions"
				   :props="{ value: 'deptId', label:'deptName', children: 'children' }"
				   value-key="deptId"
				   placeholder="选择组织"
				   check-strictly
					@node-click="teamNamechange"
				/>
			</el-form-item>
			<el-form-item label="品牌" prop="tireBrandId" >
			 <el-select
			 placeholder="请输入品牌" 
			 v-model="ruleForm.tireBrandId"
			 filterable
			 remote
			 :clearable="true"
			@change="brandr"
			 >
			 <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in pinpai" :key="index" />
			 </el-select>
			</el-form-item>
			<el-form-item label="规格" prop='specificationsId'>
			 <el-select
			 placeholder="请输入规格"
			 v-model="ruleForm.specificationsId"
			 filterable
			 @change="specificati"
			 :clearable="true"
			 :loading="loading"
			 >
			   <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in guige" :key="index" />
			 </el-select>
			</el-form-item>
            <el-form-item label="花纹型号" prop="patternModel">
			 <el-select
			  placeholder="请输入花纹型号" 
			  v-model="ruleForm.patternModel"
			  filterable
			  :clearable="true"
			 @change="brandrxinhaovalue"
			 >
			  <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in xinhao" :key="index" />
			 </el-select>
            </el-form-item>
			<el-form-item label="轴位" prop="softPosition">
			 <el-select placeholder="请选择" v-model="ruleForm.softPosition" >
			  <el-option label="请选择" value=""/>
			  <el-option label="1轴" value="1轴"/>
			  <el-option label="2轴" value="2轴"/>
			  <el-option label="3轴" value="3轴"/>
			  <el-option label="4轴" value="4轴"/>
			 </el-select>
			</el-form-item>
			<el-form-item label="动力类型"  prop="powerType" >
				 <el-checkbox-group v-model="ruleForm.powerType">
					 <el-checkbox label="101">燃油车</el-checkbox>
					 <el-checkbox label="102">燃气车</el-checkbox>
					 <el-checkbox label="103">油电混合</el-checkbox>
					 <el-checkbox label="104">气电混合</el-checkbox>
					 <el-checkbox label="105">纯电动</el-checkbox>
					 <el-checkbox label="106">氢能源</el-checkbox>
					 <el-checkbox label="107">其他</el-checkbox>
				 </el-checkbox-group>
			</el-form-item>
			<el-form-item label="考核里程" prop="checkMileage" >
			 <el-input  v-model="ruleForm.checkMileage"  placeholder="单位km"></el-input>
			</el-form-item>
			<el-form-item label="适用所有车辆"  prop="apply">
			 <el-radio-group v-model="ruleForm.apply">
			   <el-radio :label="1" size="large">是</el-radio>
			   <el-radio :label="0" size="large">否</el-radio>
			 </el-radio-group>
			</el-form-item>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subfromt(ruleFormRef)">确认</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {getSpecifications, getTireBands,getpatternmodel} from '@/api/carlive'
	import { listDept } from "@/api/system/dept";
	import { mileagesst, bioahunshe,carcompanylist,biaoadd,mileage_stand, mileage_detel } from '@/api/systensettings'
	import { getCurrentInstance } from "vue";
	let {ctx:that, proxy} = getCurrentInstance()
	// 考核里程标准设置
	const from=ref({
		"axisPosition": false,
		"brand": false,
		"patternModel": false,
		"powerType": false,
		"specification":false
		})
	const specification=ref('')
	const deptOptions = ref([]);
	const brand =ref('')
	const guige=ref([])//规格
	const pinpai=ref([])//品牌
	const xinhao=ref('')//未处理的花纹型号
	const ruleForm = ref({
		 apply:1,
		 })
	 const rules=ref({
	    fleetId: [{ required: true, message: "所属组织不能为空", trigger: "blur" }],
		tireBrandId: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
		specificationsId: [{ required: true, message: "规格不能为空", trigger: "blur" }],
		patternModel:[{ required: true, message: "花纹型号不能为空", trigger: "blur" }],
		powerType: [{ required: true, message: "动力类型不能为空", trigger: "blur" }],
		checkMileage: [{ required: true, message: "考核里程不能为空", trigger: "blur" }],
	  })
	// 组织数据处理
	function teamNamechange(val) {
		ruleForm.value.fleetName=val.deptName
		ruleForm.value.fleetId=val.deptId
	}
	// 规格数据处理
	function specificati(val){
		guige.value.map(item=>{
			if(item.paramId == val){
				ruleForm.value.specificationsName = item.paramName
			}
		})
	}
	// 品牌数据处理
	function brandr(val){
		pinpai.value.map(item=>{
			if(item.paramId == val){
				ruleForm.value.tireBrandName=item.paramName
			}
		})
	}
	function checkboxupdata(){
		let obj ={
			axisPosition:Number(from.value.axisPosition) ,
			brand:Number(from.value.brand),
			patternModel:Number(from.value.patternModel),
			powerType:Number(from.value.powerType),
			specification:Number(from.value.specification)
		}
		mileage_stand(obj).then(res=>{
			if(res.code == 200){
				ElMessage.success("保存设置成功")
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	
	const pagedata=ref({
		pageNum: 1,
		pageSize: 10
	})
	const tabledata=ref([])// table数据
	const total=ref(0)// 分页总条数
	// 表单数据获取
	function getList(){
		 loading.value = true
		mileagesst(pagedata.value).then(res=>{
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
	
	// 删除
	function handledetel(row){
		ElMessageBox.confirm('你确定要删除该条数据?',{
		      confirmButtonText: '确定',
		      cancelButtonText: '取消',
		      type: 'warning',
		    }).then(() => {
				mileage_detel(row.id).then(res=>{
					if(res.code ==200){
						ElMessage({
						  type: 'success',
						  message: '删除成功',
						})
						getList()
					}else{
						ElMessage.error(res.message)
					}
				})
		    }).catch(() => {
		      ElMessage({
		        type: 'info',
		        message: '已取消删除',
		      })
		    })
	}
	// 添加
	const open=ref(false)
	// 添加的表单验证
	const handleAdd=function(){
		open.value=true
	 }
	 // 提交修改
	 const subfromt = function(){
		 proxy.$refs["menuRef"].validate(valid => {
		   if (valid) {
			   biaoadd(ruleForm.value).then(res=>{
			   	 if(res.code == 200){
			   	 ElMessage.success("添加成功")
			   	 open.value=false
			   	ruleForm.value.apply=1
			   	ruleForm.value.fleetName=null
			   	ruleForm.value.fleetId=null
			   	ruleForm.value.specificationsId=null
			   	ruleForm.value.specificationsName=null
			   	ruleForm.value.tireBrandId=null
			   	ruleForm.value.tireBrandName=null
			   	ruleForm.value.patternModel=null
			   	ruleForm.value.softPosition=''
			   	ruleForm.value.checkMileage=null
			   	ruleForm.value.powerType=[]
			   	 brand.value=''
			   	 specification.value=''
			   	 getList()
			   	 }else{
			   		ElMessage.error(res.message)
			   	 }
			   })
		   }
		   })
		  
	 }

	 
	 // 所属组织
	 const loading = ref(false)
	 function brandrxinhaovalue(){
		 
	 }
	 
	// mounted
	onMounted(()=>{
		getList()
		bioahunshe().then(res=>{
			if(res.code == 200){
				let obj ={
					axisPosition:Boolean(res.data.axisPosition) ,
					brand:Boolean(res.data.brand),
					patternModel:Boolean(res.data.patternModel),
					powerType:Boolean(res.data.powerType),
					specification:Boolean(res.data.specification)
				}
				from.value=obj
			}
		})
		// 组织
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		// 规格
		getSpecifications().then(res=>{
			guige.value=res.data
		})
		// 品牌
		getTireBands().then(res=>{
			pinpai.value=res.data
		})
		// 花纹型号
		getpatternmodel().then(res=>{
			xinhao.value=res.data
		})
	})
</script>
<style scoped>
  .indexforn {
    width: 100%;
    display: flex;
    justify-content: left;
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
	  color: red;
	  display: flex;
	  align-items: center;
  }
 :deep(.el-form-item__content) {
	  display: flex;
	  align-items: center;
  }
  :deep(.el-input){
	  width:98%;
  }
  .marri{
	  width: 100%;
  }
  .closr{
	  font-size:16px ;
	  line-height: 34px;
  }
  .closr span{
	  margin-right: 15px;
  }
  :deep(.el-select){
	  width: 100%;
  }
  :deep(.pagination-container .el-pagination){
	  right: 20px;
  }
</style>
