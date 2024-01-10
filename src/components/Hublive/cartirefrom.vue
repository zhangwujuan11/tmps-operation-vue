<template>
	<div>
		<el-form :model="form" label-width="150px" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
			<div style="width: 45%;">
				<el-form-item label="传感器ID" prop="">
					<span v-if="!form.senderId"  @click="chuango(form.senderId,form.id,form.hubNo)" style="color: red;cursor: pointer;">暂无[绑定]</span>
					<span  @click="chuango(form.senderId,form.id,form.hubNo)" v-else style="color: green;cursor: pointer;">{{form.senderId}} [解除]</span>  
				</el-form-item>
				<el-form-item label="所属仓库" prop="warehouseId">
					<el-select placeholder="请输入所属仓库" v-if="!enabled"  v-model="form.warehouseId" filterable remote :clearable="true"
						@change="warehouse($event)">
						<el-option :label="item.warehouseName" :value="item.id"
							v-for="(item,index) in props.houselist" :key="index" />
					</el-select>
					<span  v-if="enabled">{{form.warehouseName}}</span>
				</el-form-item>
				<el-form-item label="品牌" prop="brand">
					<el-select v-if="!enabled" placeholder="请选择品牌" v-model="form.brand" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in props.pinpai" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{ statusFormat(form.brand)}}</span>
				</el-form-item>
				<el-form-item label="轮毂编号" prop="hubNo">
					<span style="color: red;">{{form.hubNo}}</span>
				</el-form-item>
				<!-- <el-form-item label="绑定传感器" prop="senderId">
					<el-input v-model="form.senderId" placeholder="请输入绑定传感器"></el-input>
				</el-form-item> -->
				<el-form-item label="材质" prop="material">
					<el-select placeholder="请选择材质"  v-if="!enabled" v-model="form.material" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in  props.caizhi" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{caifun(form.material)}}</span>
				</el-form-item>
			</div>
			<div style="width: 45%;">
				<el-form-item label="孔距" prop="boltPattern">
					<el-select placeholder="请选择孔距"  v-if="!enabled" v-model="form.boltPattern" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in  props.kongju" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{konfun(form.boltPattern) }}</span>
				</el-form-item>
				<el-form-item label="型号" prop="model">
					<el-select placeholder="请选择型号"  v-if="!enabled" v-model="form.model" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in  props.xinhao" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{ xinfun(form.model) }}</span>
				</el-form-item>
				<el-form-item label="价格" prop="price">
					<el-input placeholder="请输入价格"  v-if="!enabled" v-model="form.price"></el-input>
					<span  v-if="enabled">{{form.price}}</span>
				</el-form-item>
				<el-form-item label="尺寸" prop="size">
					<el-select placeholder="请选择尺寸" v-if="!enabled" v-model="form.size" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in  props.chicun" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{chifun(form.size)}}</span>
				</el-form-item>
				<el-form-item label="螺纹规格" prop="threadSpec">
					<el-select placeholder="请选择螺纹规格"  v-if="!enabled" v-model="form.threadSpec" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in  props.guige" :key="index" >
						</el-option>	
					</el-select>
					<span  v-if="enabled">{{luofun(form.threadSpec)}}</span>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input  v-if="!enabled" placeholder="请输入备注" v-model="form.remark"></el-input>
					<span  v-if="enabled">{{form.remark}}</span>
				</el-form-item>
			</div>
		</el-form>
		<div style="text-align: center;">
			<el-button type="warning" v-if="enabled" @click="enabled = false">编辑</el-button>
			<el-button type="primary" v-if="!enabled" @click="subfrom">保存</el-button>
			<el-button v-if="!enabled" @click="enfale">取消</el-button>
		</div>
		
		<!-- RFID绑定，解绑 -->
		<el-dialog title="绑定传感器" v-model="chuanid" width="40%" append-to-body :close-on-click-modal="false">
			<el-form label-width="150px" style="flex-wrap: wrap;"  ref="subref" :model="chuanfrom">
				<el-form-item label="轮毂编号">
					<el-input v-model="chuanfrom.hubNo" disabled></el-input>
				</el-form-item>
				<el-form-item label="传感器ID" prop="senderId">
					<el-input v-model="chuanfrom.senderId" :disabled="!jiebangma"></el-input>
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
	import { hunsendid, hubupdate } from '@/api/hub'
	import { ElMessage } from 'element-plus'
	const { proxy } = getCurrentInstance();
	const props = defineProps({
		updateform: {
			type: Object,
			default: {}
		},
		pinpai:{
			type: Object,
			default: {}
		},
		kongju:{
			type: Object,
			default: {}
		},
		chexin:{
			type: Object,
			default: {}
		},
		guige:{
			type: Object,
			default: {}
		},
		chicun:{
			type: Object,
			default: {}
		},
		xinhao:{
			type: Object,
			default: {}
		},
		caizhi:{
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
		houselist:{
			type:Array,
			default: []
		},
	})
	const form = ref({})
	const pinpai=ref({})
	const enabled=ref(true)
	const chuanid=ref(false)//绑定RFID
	const chuanfrom=ref({
		tireId:null,
		rfidCode:null,
		tireNo:null
	})
	const jiebangma=ref(false)
	const rules = ref({
		boltPattern: [{ required: true, message: "孔距不能为空", trigger: "blur" }],
		brand: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
		companyId: [{ required: true, message: "所属组织不能为空", trigger: "blur" }],
		compatibleVehicle: [{ required: true, message: "兼容车型不能为空", trigger: "blur" }],
		hubNo: [{ required: true, message: "轮毂编号不能为空", trigger: "blur" }],
		material: [{ required: true, message: "材质不能为空", trigger: "blur" }],
		model: [{ required: true, message: "型号不能为空", trigger: "blur" }],
		price: [
			{ required: true, message: "价格不能为空", trigger: "blur" },
			{
				pattern:/^\d+(\.\d+)?$/,
				message: "价格格式不正确",
				trigger: "blur"}
			],
		size: [
			{ required: true, message: "尺寸不能为空", trigger: "blur" },
			],
		threadSpec: [{ required: true, message: "螺纹规格不能为空", trigger: "blur" }],
		warehouseId: [{ required: true, message: "所属仓库不能为空", trigger: "blur" }],
	})
	
	function enfale(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  enabled.value = true
			  proxy.$refs["menuRef"].clearValidate();
		  }
		})
		
	}
	
	// interface EmitType {
	//   (e: "onReceiveMsg", params: string): void
	// }
	// const emit = defineEmits<EmitType>();
	function statusFormat(row){
		for (var i = 0; i < props.pinpai.length; i++) {
			if (row ==  props.pinpai[i].paramCode) {
				return  props.pinpai[i].paramName;
			}
		}
	}
	function warehouse(val) {//处理仓库数据
		props.houselist.map(item=>{
			if(item.id == val){
				form.value.warehouseName = item.warehouseName
			}
		})
	}
	function  caifun (row){
		for (var i = 0; i < props.caizhi.length; i++) {
			if (row === props.caizhi[i].paramCode) {
				return props.caizhi[i].paramName;
			}
		}
	}
	const konfun=(row) => {
			for (var i = 0; i <  props.kongju.length; i++) {
				if (row === props.kongju[i].paramCode) {
					return props.kongju[i].paramName;
				}
			}
	}
	const xinfun=(row) => {
			for (var i = 0; i < props.xinhao.length; i++) {
				if (row === props.xinhao[i].paramCode) {
					return  props.xinhao[i].paramName;
				}
			}
	}
	
	const chifun=(row) => {
			for (var i = 0; i <  props.chicun.length; i++) {
				if (row === props.chicun[i].paramCode) {
					return  props.chicun[i].paramName;
				}
			}
	}
	const luofun=(row) => {
			for (var i = 0; i < props.guige.length; i++) {
				if (row === props.guige[i].paramCode) {
					return  props.guige[i].paramName;
				}
			}
	}
	
	
	
	interface EmitType {
	  (e: "onReceiveMsg", params: string): void
	}
	const emit = defineEmits<EmitType>();
	// 传感器id
	function chuango(senderId,hubid,tire) {
		// chuanid.value = true
		// if (senderId == null) {//绑定
		// 	chuanfrom.value = {}
		// 	chuanfrom.value.hubNo = tire
		// 	chuanfrom.value.id = hubid
		// 	chuanfrom.value.senderId = senderId
		// 	chuanfrom.value.bindStatus = 0
		// 	jiebangma.value = true
		// } else {
		// 	chuanfrom.value.hubNo = tire
		// 	chuanfrom.value.id = hubid
		// 	chuanfrom.value.senderId = senderId
		// 	chuanfrom.value.bindStatus =1
		// 	jiebangma.value = false
		// }
		emit("onReceiveMsg", {senderId,hubid,tire});
		
	}
	
	watch(() => props.updateform, value => {
		form.value = value
		form.value.consone=form.value.tireBrandId + ',' + form.value.tireBrandName
		proxy.$refs["menuRef"].clearValidate();
	})
	watch(() => props.pinpai, value => {
		pinpai.value = value
	})
	// watch(() => props.houselist, value => {
	// 	houselist.value = value
	// 	console.log("6666",houselist.value)
	// })
	watch(() => props.xiangqing, value => {
		if(!value){
			enabled.value=true
		}
	})
	
	// 提交保存
	function subfrom(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 hubupdate(form.value).then(res=>{
			 if(res.code == 200){
				ElMessage({
					type: 'success',
					message: '修改成功',
				})
				proxy.$refs["menuRef"].clearValidate();
				enabled.value=true
			 }else{
				ElMessage({
					type: 'erroe',
					message:res.message,
				}) 
			 }
			 }) 
			 }
		  })
	}
	
	
	// function lise(i,y,e){
	// 	chuanfrom.value.tireId=e
	// 	chuanfrom.value.rfidCode=i
	// 	chuanfrom.value.tireNo=y
	// 	chuanid.value=true
	// 	if(i == null){//绑定
	// 		jiebangma.value=true
	// 	}else{
	// 		jiebangma.value=false
	// 	}
	// }
	
	// 提交解绑，绑定
	// 提交解绑，绑定
	// interface EmitType {
	//   (e: "onReceiveMsg", params: string): void
	// }
	// const emit = defineEmits<EmitType>();
	function jiebangfun() {
		if(chuanfrom.value.senderId == '' || chuanfrom.value.senderId == null){
			ElMessage.error("请输入传感器ID")
		}else{
			hunsendid(chuanfrom.value).then(res => {
				if (res.code == 200) {
					ElMessage.success("解绑成功")
					form.value.senderId=null
					chuanid.value = false
					emit("onReceive");
				} else {
					ElMessage.error(res.message)
				}
			})
		}
	}
	function bangdingfun() {
		if(chuanfrom.value.senderId == '' || chuanfrom.value.senderId == null){
			ElMessage.error("请输入传感器ID")
		}else{
			hunsendid(chuanfrom.value).then(res => {
				if (res.code == 200) {
					ElMessage.success("绑定成功")
					form.value.senderId=chuanfrom.value.senderId
					chuanid.value = false
					emit("onReceive");
				} else {
					ElMessage.error(res.message)
				}
			})
		}
		
	}
	
	
	function brandr(val){//处理品牌数据
		let [id,name] = val.split(',')
		// frome.value.tireBrandId = Number(id)
		// frome.value.tireBrandName = name
	}
	onMounted(() => {
		form.value = props.updateform
		// form.value.consone=form.value.tireBrandId + ',' + form.value.tireBrandName
		
		
		
	})
</script>

<style scoped>
	.el-form {
	  width: 100%;
	  display: flex;
	  justify-content: space-between;
	}
</style>