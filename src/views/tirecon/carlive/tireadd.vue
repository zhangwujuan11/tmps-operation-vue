<template>
	<div>
		<el-form label-width="120px"  :rules="rules" ref="menuRef" :model="form">
		  <div class="formdiv">
		   <!-- <el-form-item label="所属组织" prop="companyId">
			   <el-tree-select
			    :default-expand-all="true"
			      v-model="form.companyId"
			      :data="deptOptions"
			      :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
			      value-key="deptId"
			      placeholder="选择组织"
			      check-strictly
			   	@node-click="changelist"
			   />
		   </el-form-item> -->
		   <el-form-item label="胎       号" prop="tireNo">
			<el-input placeholder="请输入胎号" 	v-model="form.tireNo" style="width: 80%;"></el-input>
			<span style="margin-left: 5px;color: blue;font-size: 12px;cursor: pointer;" @click="getda">虚拟生成</span>
		   </el-form-item>
		    <el-form-item label="轮胎分类" prop="category" >
		     <el-select v-model="form.category" clearable @change="gogogo($event)">
		       <el-option
			   v-for="dict in lifecycle_tire_category"
				:value="dict.value"  
				:key="dict.value"
				:label="dict.label" />
		     </el-select>
		    </el-form-item>
		    <el-form-item label="所属仓库" prop="warehouseName">
		       <el-select
		       placeholder="请输入所属仓库" 
		       v-model="warehouseName"
		        filterable
		        remote
		        :clearable="true"
				@change="warehouse"
		       >
		        <el-option :label="item.warehouseName" :value="`${item.id},${item.warehouseName}`"  v-for="(item,index) in houselist" :key="index" />
		       </el-select>
		    </el-form-item>
		    <el-form-item label="绑定传感器" prop="senderId">
		      <el-input v-model="form.senderId" placeholder="请输入绑定传感器"></el-input>
		    </el-form-item>
		    <el-form-item label="RFID标签" prop='rfidCode'>
		      <el-input v-model="form.rfidCode" placeholder="请输入RFID标签"></el-input>
		    </el-form-item>
		   <el-form-item label="品牌" prop="tireBrandId">
		      <el-select
		       placeholder="请输入品牌" 
		       v-model="brand"
		       filterable
		       :clearable="true"
		      	@change="brandr"
		      >
		       <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in pinpai" :key="index" />
		      </el-select>
		   </el-form-item>
		    <el-form-item label="花纹型号" prop="pattern">
				<el-select
				 placeholder="请输入花纹型号" 
				 v-model="xinhaovalue"
				 filterable
				 :clearable="true"
				@change="brandrxinhaovalue"
				>
				 <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in xinhao" :key="index" />
				</el-select>
		    </el-form-item>
			<el-form-item label="速度级别" prop="speedLevel">
			  <el-input v-model="form.speedLevel" placeholder="请输入速度级别"></el-input>
			</el-form-item>
			<el-form-item label="单价" prop="price">
			  <el-input type="number" v-model="form.price" placeholder="单位 元"></el-input>
			</el-form-item>
			<el-form-item label="新胎花纹深度" prop="depth">
			  <el-input type="number" v-model="form.depth" placeholder="单位 mm"></el-input>
			</el-form-item>
			<el-form-item label="累计里程" prop="totalMileage">
			  <el-input type="number" v-model="form.totalMileage" placeholder="单位km"></el-input>
			</el-form-item>
		  </div>
		  <div class="formdiv">
		    <el-form-item label="轮胎自编号" prop="insideTireNo">
		     <el-input placeholder="请输入轮胎自编号" v-model="form.insideTireNo"></el-input>
		    </el-form-item>
		    <el-form-item label="轮胎状态" prop="stockStatus">
				<el-select 
				v-model="form.stockStatus" 
				placeholder="请选择轮胎状态"
				:clearable="true">
				 <el-option :value="10" v-if="form.category==0" label="库存全新胎"/>
				 <el-option :value="15" v-if="form.category!=0 && form.category!=3" label="待用胎"/>
				 <el-option :value="30" v-if="form.category!=0 && form.category!=3" label="待修补"/>
				 <el-option :value="11" v-if="form.category==3" label="库存翻新胎"/>
				</el-select>
		    </el-form-item>
		    <el-form-item label="质保期" prop="expireDate">
		     <el-date-picker
		         v-model="form.expireDate"
				 format="YYYY/MM/DD"
				 value-format="YYYY-MM-DD"
		         type="date"/>
		    </el-form-item>
		   <el-form-item label="规格" prop="specificationsId">
		    <el-select
		    placeholder="请选择轮胎规格" 
		    v-model="specification"
		    filterable
			@change="specificati"
		    :clearable="true"
		    >
		      <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in guige" :key="index" />
		    </el-select>
		   </el-form-item>
		    <el-form-item label="DOT" prop="dot">
		     <el-input placeholder="请输入DOT" v-model="form.dot" ></el-input>
		    </el-form-item>
			
			<el-form-item label="载重指数" prop="loadIndex">
			 <el-input placeholder="请输入载重指数" v-model="form.loadIndex"></el-input>
			</el-form-item>
			<el-form-item label="供应商" prop="manufacturer">
				<el-select
				 placeholder="请选择供应商" 
				 v-model="form.manufacturer"
				 filterable
				 :clearable="true"
				>
				 <el-option :label="item.supplierName" :value="item.supplierName"  v-for="(item,index) in gongyings" :key="index" />
				</el-select>
			 <!-- <el-input placeholder="请输入供应商" v-model="form.manufacturer"></el-input> -->
			</el-form-item>
			<el-form-item label="初测花纹深度" prop="firstDepth">
			 <el-input placeholder="单位mm" v-model="form.firstDepth"></el-input>
			</el-form-item>
			<el-form-item label="累计时长" prop="totalDuration">
			 <el-input placeholder="单位h" v-model="form.totalDuration" type="number"></el-input>
			</el-form-item>
		  </div>
		</el-form>
		<div style="text-align: center;" slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="subform">确定</el-button>
		  <!-- <el-button @click="open">取消</el-button> -->
		</div>
	</div>
</template>

<script setup name="Tireadd">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { listDept } from "@/api/system/dept";
	import { carcompanylist, vehicleNo } from '@/api/systensettings'
	import {tirelist, getTireBands, getSpecifications, addtire, getKeyNA,getpatternmodel} from '@/api/carlive'
	import { warehouselist } from '@/api/warehouse'
	import { supperlist } from "@/api/system/tenant";
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_category, lifecycle_tire_status } = proxy.useDict( "lifecycle_tire_category","lifecycle_tire_status");
	// 路由
	const route = useRoute();
	const router = useRouter();
	const carcompanydata=ref([])//所属组织
	const chetai=ref([])//胎号
	const houselist=ref([])//仓库
	const pinpai=ref([])//品牌
	const guige=ref([])//规格
	const xinhao=ref([])//花纹型号
	const gongyings=ref([])
	const form=ref({})//表单
	const  rules=({
		tireNo: [{ required: true, message: "胎号不能为空", trigger: "blur" }],
		category: [{ required: true, message: "轮胎类别不能为空", trigger: "blur" }],
		warehouseName: [{ required: true, message: "仓库名称不能为空", trigger: "blur" }],
		tireId: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
		pattern: [{ required: true, message: "花纹型号不能为空", trigger: "blur" }],
		price: [
			{ required: true, message: "单价不能为空", trigger: "blur" },
			{
				pattern:/^(0|([1-9][0-9]*))(\.[\d]{1,2})?$/,
				message: "单价格式不正确",
				trigger: "blur"}
			],
		depth:[{ required: true, message: "新花纹深度不能为空", trigger: "blur" },
		{
			pattern:/^\d+(\.\d+)?$/,
			message: "花纹深不能为负数",
			trigger: "blur"}
		],
		totalMileage:[{
			pattern:/^\d+(\.\d+)?$/,
			message: "累计里程不能为负数",
			trigger: "blur"}
		],
		totalDuration:[{
			pattern:/^\d+(\.\d+)?$/,
			message: "累计时长不能为负数",
			trigger: "blur"}
		],
		// companyId:[{ required: true, message: "组织不能为空", trigger: "blur" }],
		stockStatus:[{ required: true, message: "轮胎状态不能为空", trigger: "blur" }],
		specificationsId:[{ required: true, message: "规格不能为空", trigger: "blur" }],
		firstDepth:[{ required: true, message: "初测花纹深度不能为空", trigger: "change" },
		{
			pattern:/^\d+(\.\d+)?$/,
			message: "初测花纹深度不能为负数",
			trigger: "blur"}
		],
		tireBrandId: [{ required: true, message: "品牌不能为空", trigger: "blur" }]
	  }) 
	const deptOptions = ref([]);
	const checkname=ref('')//未处理的组织数据
	const warehouseName=ref('')//未处理的所属仓库
	const brand=ref('')//未处理的品牌
	const specification=ref('')//未处理规格
	const xinhaovalue=ref('')//未处理的花纹型号
	function name(val){//处理的组织数据
		let [id,name] = val.split(',')
		form.value.companyId = id
		form.value.companyName = name
	}
	function warehouse(val){//处理仓库数据
		let [id,name] = val.split(',')
		form.value.warehouseId = id
		form.value.warehouseName = name
	}
	function brandr(val){//处理品牌数据
		let [id,name] = val.split(',')
		form.value.tireBrandId = Number(id)
		form.value.tireBrandName = name
	}
	function specificati(val){//处理规格数据
		let [id,name] = val.split(',')
		form.value.specificationsId = id
		form.value.specificationsName = name
	}
	function brandrxinhaovalue(val){//处理花纹型号数据
		let [id,name] = val.split(',')
		form.value.patternId = id
		form.value.pattern = name
	}
	
	
	function gogogo(i){
		form.value.stockStatus=''
	}
	
	// 表单提交
	function subform(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  if(form.value.totalDuration =='' || form.value.totalDuration ==null){
			  	form.value.totalDuration=0
			  }
			  if(form.value.totalMileage =='' || form.value.totalMileage ==null){
			  	form.value.totalMileage=0
			  }
			  if(form.value.lastInstallMileage =='' || form.value.lastInstallMileage ==null){
			  	form.value.lastInstallMileage=0
			  }
			  if(form.value.measuredDepth =='' || form.value.measuredDepth ==null){
			  	form.value.measuredDepth=0
			  }
			addtire(form.value).then(res=>{
				if(res.code == 200){
					ElMessage.success("添加成功")
					proxy.$refs["menuRef"].resetFields()
					warehouseName.value=''
					brand.value=''
					xinhaovalue.value=''
					specification.value=''
					router.push({ 
						path: "/tirecon/carlive/tirelist",
						query:{"form":"add"}
					})
				}else{
					ElMessage.error(res.message)
				}
			})
		  }
	  })
	}
	
	// 随机生成胎号
	function getda(){
		getKeyNA().then(res=>{
			if(res.code == 200){
				form.value.tireNo=res.data
			}else{
					ElMessage.error(res.message)
				}
		})
	}
	
	// const open=function(){
	// 	router.push({ path: "/tirecon/carlive/carlive/tirelist"})
	// }
	onMounted(()=>{
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data.items
			}
		})
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			// if(res.code == 200){
				chetai.value=res.data.items
			// }
		})
		//仓库
		warehouselist({pageNum:1,pageSize:10000}).then(res=>{
			houselist.value=res.data.items
		})
		// 品牌
		getTireBands().then(res=>{
			pinpai.value=res.data
		})
		// 规格
		getSpecifications().then(res=>{
			guige.value=res.data
		})
		// 花纹型号
		getpatternmodel().then(res=>{
			xinhao.value=res.data
		})
		// 组织
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		
		// 供应商
		supperlist({pageNum:1,pageSize:100000}).then(res=>{
			gongyings.value=res.data.items
		})
	})
	
	
</script>

<style scoped>
	.el-form{
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding-top: 50px;
	}
	.formdiv{
		width: 48%;
		padding:0 15px;
		box-sizing: border-box;
	}
</style>