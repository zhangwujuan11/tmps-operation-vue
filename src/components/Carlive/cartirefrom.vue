<template>
	<div>
		<el-form :model="frome" label-width="150px" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
			<div style="width: 45%;">
				<el-form-item label="传感器ID" prop="">
					<span v-if="!frome.senderId"
						@click="chuango(frome.senderId,frome.tireNo,frome.tireId,frome.senderType)"
						style="color: red;cursor: pointer;">暂无[绑定]</span>
					<span @click="chuango(frome.senderId,frome.tireNo,frome.tireId,frome.senderType)" v-else
						style="color: green;cursor: pointer;">{{frome.senderId}} [解除]</span>
				</el-form-item>
				<el-form-item label="分类" prop="category">
					<!-- <el-select disabled v-model="frome.category" filterable remote :clearable="true"
						@change="brandr">
						<el-option v-for="dict in lifecycle_tire_category" :key="dict.value" :label="dict.label"
							:value="dict.value" />
					</el-select> -->
					<dict-tag style="color: red;" :options="lifecycle_tire_category" :value="frome.category" />
				</el-form-item>
				<el-form-item label="胎号" prop="tireNo">
					<!-- <el-input v-model="frome.tireNo" v-if="!enabled"></el-input> -->
					<span style="color: red;">{{frome.tireNo}}</span>
				</el-form-item>
				<el-form-item label="品牌" prop="consone">
					<el-select 
					placeholder="请输入品牌" 
					v-model="frome.consone"  
					v-if="!enabled" filterable remote 
					:clearable="true" 
					@change="brandr">
						<el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"
							v-for="(item,index) in pinpai" :key="index" />
					</el-select>
					<span v-if="enabled">{{frome.tireBrandName}}</span>
				</el-form-item>
				<el-form-item label="花纹型号" prop="pattern">
					<el-select
					v-if="!enabled"
					 placeholder="请输入花纹型号" 
					 v-model="xinhaovalue"
					 filterable
					 :clearable="true"
					@change="brandrxinhaovalue"
					>
					 <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in xinhao" :key="index" />
					</el-select>
					<!-- <el-input v-model="frome.pattern" placeholder="请输入花纹型号"  ></el-input> -->
					<span v-if="enabled">{{frome.pattern}}</span>
				</el-form-item>
				<el-form-item label="新胎花纹深度" prop="depth">
					<el-input type="number" v-model="frome.depth" placeholder="请输入新胎花纹深度"  v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.depth}}mm</span>
				</el-form-item>
				<el-form-item label="实测花纹深度" prop="measuredDepth">
					<el-input type="number" v-model="frome.measuredDepth" placeholder="请输入实测花纹深度"  v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.measuredDepth  || 0}}mm  </span>
				</el-form-item>
				<el-form-item label="累计里程" prop="totalMileage">
					<el-input type="number" v-model="frome.totalMileage" placeholder="请输入累计里程" v-if="!enabled"></el-input>
					<span style="color: red;" v-if="enabled">{{frome.totalMileage +"km" || 'NA'}}</span>
				</el-form-item>
				<el-form-item label="DOT" prop="dot">
					<el-input v-model="frome.dot" v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.dot || 'NA'}}</span>
				</el-form-item>
				<el-form-item label="速度级别" prop="speedLevel">
					<el-input v-model="frome.speedLevel" placeholder="请输入速度级别" v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.speedLevel|| 'NA'}}</span>
				</el-form-item>
				<el-form-item label="所属仓库" prop="warehouseName">
					<el-select placeholder="请输入所属仓库" @change="warehousechange" v-if="!enabled" v-model="frome.warehouseName" filterable remote :clearable="true">
						<el-option :label="item.warehouseName" :value="item.warehouseName" v-for="(item,index) in houselist" :key="index" />
					</el-select>
					<span v-if="enabled">{{frome.warehouseName}}</span>
				</el-form-item>
				<el-form-item label="所属车辆">
					<span>{{frome.vehicleNo}}</span>
				</el-form-item>
				<el-form-item label="安装轮位">
					<span style="color: red;">{{frome.installPositionDesc}}</span>
				</el-form-item>
			</div>
			<div style="width: 45%;">
				<el-form-item label="RFID标签号" >
					<span v-if="!frome.rfidCode" @click="lise(frome.rfidCode,frome.tireNo,frome.tireId)" style="color: red;cursor: pointer;">暂无[绑定]</span>
					<span @click="lise(frome.rfidCode,frome.tireNo,frome.tireId)" v-else style="color: green;cursor: pointer;">{{frome.rfidCode}} [解除]</span>
				</el-form-item>
				<el-form-item label="状态" prop="stockStatus">  
					<!-- <el-select placeholder="状态" v-model="frome.stockStatus" filterable remote :clearable="true" disabled>
						<el-option v-for="dict in lifecycle_tire_status" :key="dict.value" :label="dict.label" :value="dict.value" />
					</el-select> -->
					 <dict-tag style="color: red;" :options="lifecycle_tire_status" :value="frome.stockStatus" />
				</el-form-item>
				<!-- <el-form-item label="轮胎自编号">
					<el-input v-model="form.speedLevel" placeholder="请输入轮胎自编号"></el-input>
				</el-form-item> -->
			<!-- 	<el-form-item label="规格">
					<el-select placeholder="请选择轮胎规格" v-model="frome.specification" filterable @change="specificati"
						:clearable="true">
						<el-option :label="item.specificationsName"
							:value="`${item.specificationsId},${item.specificationsName}`" v-for="(item,index) in guige"
							:key="index" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="供应商" prop="manufacturer">
					<el-select
					 placeholder="请选择供应商" 
					 v-model="frome.manufacturer"
					 filterable
					 :clearable="true"
					 v-if="!enabled"
					>
					 <el-option :label="item.supplierName" :value="item.supplierName"  v-for="(item,index) in props.gongyings" :key="index" />
					</el-select>
					<!-- <el-input placeholder="请输入供应商" v-model="frome.manufacturer" v-if="!enabled"></el-input> -->
					<span v-if="enabled">{{frome.manufacturer|| 'NA'}}</span>
				</el-form-item>
				<el-form-item label="规格" prop="manufacturer">
					<el-select
					 v-if="!enabled"
					placeholder="请选择轮胎规格" 
					v-model="frome.specificationsId"
					filterable
					:clearable="true"
					@change="spe($event)"
					>
					  <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in guige" :key="index" />
					</el-select>
					<span v-if="enabled">{{frome.specificationsName|| 'NA'}}</span>
				</el-form-item>
				
				
				
				
				<el-form-item label="初测花纹深度" prop="firstDepth">
					<el-input placeholder="单位mm" v-model="frome.firstDepth"  v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.firstDepth}}mm</span>
				</el-form-item>
				<!-- <el-form-item label="预测当前花纹深度">
					<span>{{frome.firstDepth}}</span>
				</el-form-item> -->

				<el-form-item label="单价" prop="price">
					<el-input type="number" v-model="frome.price" placeholder="请输入单价"  v-if="!enabled"></el-input>
					<span v-if="enabled">¥{{frome.price}}</span>
				</el-form-item>
				<el-form-item label="累计时长" prop="totalDuration">
					<el-input type="number" v-model="frome.totalDuration"  v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.totalDuration || 0}} h</span>
				</el-form-item>
				<el-form-item label="载重指数" prop="loadIndex">
					<el-input placeholder="请输入载重指数" v-model="frome.loadIndex" v-if="!enabled"></el-input>
					<span v-if="enabled">{{frome.loadIndex || 'NA'}}</span>
				</el-form-item>
				<el-form-item label="质保期" prop="expireDate">
					<el-date-picker v-model="frome.expireDate" format="YYYY/MM/DD" value-format="YYYY-MM-DD"  v-if="!enabled"
						type="date" />
					<span v-if="enabled">{{frome.expireDate || 'NA'}}</span>	
				</el-form-item>
				<el-form-item label="最新安装公里表读数" prop="lastInstallMileage">
					<el-input type="number"  v-if="!enabled" v-model="frome.lastInstallMileage"></el-input>
					<span style="color: red;" v-if="enabled">{{frome.lastInstallMileage || 0}}km</span>
				</el-form-item>
				<el-form-item label="最后一次安装时间" prop="">
					<span>{{frome.installTime|| 'NA'}}</span>
				</el-form-item>
			</div>
		</el-form>
		<div style="text-align: center;">
			<el-button type="warning" v-if="enabled" @click="enabled = false">编辑</el-button>
			<el-button type="primary" v-if="!enabled" @click="subfrom">保存</el-button>
			<el-button v-if="!enabled" @click="enfale">取消</el-button>
		</div>
		
		<!-- RFID绑定，解绑 -->
		<el-dialog title="RFID" v-model="chuanid" width="40%" append-to-body>
		    <el-form label-width="150px" style="flex-wrap: wrap;">
		        <el-form-item label="胎号" >
					<span>{{frome.tireNo}}</span>
				</el-form-item>
				<el-form-item label="RFID标签">
					<el-input v-model="chuanfrom.rfidCode" :disabled="!jiebangma"></el-input>
				</el-form-item>
		    </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer">
		      <el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
			  <el-button type="primary" v-if="!jiebangma" @click="jiebangfun">解绑</el-button>
		      <el-button @click="chuanid=false">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted, watch } from 'vue';
	import { updatacartireid, ubbindingrfid, bindrfid, getSpecifications } from '@/api/carlive'
	import { ElMessage, ElMessageBox } from 'element-plus'
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, lifecycle_tire_category, lifecycle_tire_sendertype } = proxy.useDict("lifecycle_tire_status", "lifecycle_tire_category", "lifecycle_tire_sendertype");
	const props = defineProps({
		xinhao: {
			type: Object,
			default: {}
		},
		updateform: {
			type: Object,
			default: {}
		},
		pinpai:{
			type: Object,
			default: {}
		},
		houselist:{
			type: Object,
			default: {}
		},
		xiangqing:{
			type:Boolean,
			default: {}
		},
		gongyings:{
			type:Array,
			default: []
		},
	})
	const frome = ref({})
	const pinpai=ref({})
	const houselist=ref({})
	const enabled=ref(true)
	const chuanid=ref(false)//绑定RFID
	const xinhaovalue=ref('')
	const chuanfrom=ref({
		tireId:null,
		rfidCode:null,
		tireNo:null
	})
	
	
	function spe(i){
		guige.value.map(item=>{
			if(item.paramId == i){
				frome.value.specificationsName=item.paramName
			}
		})
	}
	function brandrxinhaovalue(val){//处理花纹型号数据
		let [id,name] = val.split(',')
		frome.value.patternId = id
		frome.value.pattern = name
	}
	const guige=ref([])//规格
	const jiebangma=ref(false)
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
		lastInstallMileage:[{
			pattern:/^\d+(\.\d+)?$/,
			message: "最新安装公里表读数",
			trigger: "blur"}
		],
		totalDuration:[{
			pattern:/^\d+(\.\d+)?$/,
			message: "累计时长不能为负数",
			trigger: "blur"}
		],
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
	
	function enfale(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  enabled.value = true
			  proxy.$refs["menuRef"].clearValidate();
		  }
		})
		
	}
	
	function warehousechange(){
		houselist.value.map(item=>{
			if(item.warehouseName == frome.value.warehouseName){
				frome.value.warehouseId=item.id
			}
		})
	}
	
	interface EmitType {
	  (e: "onReceiveMsg", params: string): void
	  
	}
	const emit = defineEmits<EmitType>();
	function chuango(senderId,tireNo,tireId,senderType){
		 emit("onReceiveMsg", {senderId,tireNo,tireId,senderType});
	}
	
	watch(() => props.updateform, value => {
		frome.value = value
		frome.value.consone=frome.value.tireBrandId + ',' + frome.value.tireBrandName
		proxy.$refs["menuRef"].clearValidate();
	})
	watch(() => props.pinpai, value => {
		pinpai.value = value
	})
	watch(() => props.houselist, value => {
		houselist.value = value
	})
	watch(() => props.xiangqing, value => {
		if(!value){
			enabled.value=true
		}
	})
	
	// 提交保存
	function subfrom(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  if(frome.value.totalDuration =='' || frome.value.totalDuration ==null){
				  frome.value.totalDuration=0
			  }
			  if(frome.value.totalMileage =='' || frome.value.totalMileage ==null){
			  	frome.value.totalMileage=0
			  }
			  if(frome.value.lastInstallMileage =='' || frome.value.lastInstallMileage ==null){
			  	frome.value.lastInstallMileage=0
			  }
			  if(frome.value.measuredDepth =='' || frome.value.measuredDepth ==null){
			  	frome.value.measuredDepth=0
			  }
			  if(frome.value.measuredDepth > frome.value.firstDepth){
			  	ElMessage.error("实测花纹深度不能大于初测花纹深度")
				return false
			  }else if(frome.value.firstDepth > frome.value.depth){
				  ElMessage.error("初测花纹深度不能大于新胎花纹深度")
				  return false
			  }else{
				  delete  frome.value.installTime
				   updatacartireid(frome.value).then(res=>{
				   	if(res.code == 200){
				   		ElMessage.success("修改成功")
				   		emit("onReceive", false);
				   	}else{
				   		ElMessage.error(res.message)
				   	}
				   })
			  }
			}
		  })
	}
	
	
	function lise(i,y,e){
		chuanfrom.value.tireId=e
		chuanfrom.value.rfidCode=i
		chuanfrom.value.tireNo=y
		chuanid.value=true
		if(i == null){//绑定
			jiebangma.value=true
		}else{
			jiebangma.value=false
		}
	}
	
	// 提交解绑，绑定
	function jiebangfun (){
		ubbindingrfid(chuanfrom.value.tireId).then(res=>{
			if(res.code == 200){
				ElMessage.success("解绑成功")
				chuanid.value=false
				 emit("onReceive", false);
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	
	function bangdingfun (){
		bindrfid(chuanfrom.value).then(res=>{
			if(res.code == 200){
			ElMessage.success("绑定成功")
				chuanid.value=false
				emit("onReceive", false);
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	
	
	function brandr(val){//处理品牌数据
		let [id,name] = val.split(',')
		frome.value.tireBrandId = Number(id)
		frome.value.tireBrandName = name
	}
	onMounted(() => {
		frome.value = props.updateform
		pinpai.value = props.pinpai
		houselist.value = props.houselist
		frome.value.consone=frome.value.tireBrandId + ',' + frome.value.tireBrandName
		// console.log(frome.value)
		// 规格
		getSpecifications().then(re=>{
			guige.value=re.data
		})
		
		
	})
</script>

<style scoped>
	.el-form {
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	}
</style>