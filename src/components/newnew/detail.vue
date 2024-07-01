<template>
	<el-dialog :title="titlediol" v-model="dilogs.detaildilog" width="80%" append-to-body>
		<el-tabs v-model="activeName">
			<el-tab-pane label="当前安装轮胎信息" name="first">
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="tireNo" label="胎号">
					</el-table-column>
					<el-table-column prop="vehicleNo" label="车牌号">
					</el-table-column>
					<el-table-column prop="installPosition" label="轮位">
					</el-table-column>
					<el-table-column prop="senderId" label="传感器ID">
					</el-table-column>
					<el-table-column prop="batteryVoltage" label="电池电压(v)">
					</el-table-column>
					<el-table-column prop="tireBrandName" label="品牌">
					</el-table-column>
					<el-table-column prop="specificationsName" label="规格">
					</el-table-column>
					<el-table-column prop="pattern" label="花纹型号">
					</el-table-column>
					<el-table-column prop="depth" label="新胎花纹深度(mm)">
					</el-table-column>
					<el-table-column prop="measuredDepth" label="实测花纹深度(mm)">
					</el-table-column>
					<el-table-column prop="totalMileage" label="累计里程(km)">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="历史安装轮胎信息" name="second" >
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column prop="tireNo" label="历史胎号">
					</el-table-column>
					<el-table-column prop="tirePositionDesc" label="历史轮位">
					</el-table-column>
					<el-table-column prop="tireBrandName" label="品牌">
					</el-table-column>
					<el-table-column prop="specificationsName" label="规格">
					</el-table-column>
					<el-table-column prop="pattern" label="花纹型号">
					</el-table-column>
					<el-table-column prop="depth" label="新胎花纹深度(mm)">
					</el-table-column>
					<el-table-column prop="updateTime" label="拆卸日期">
					</el-table-column>
				<!-- 	<el-table-column prop="name" label="拆卸花纹深度(mm)">
					</el-table-column> -->
					<el-table-column prop="totalMileage" label="累计里程(km)">
					</el-table-column>
					<!-- <el-table-column prop="address" label="趋势图">
					</el-table-column> -->
				</el-table>
			</el-tab-pane>
		</el-tabs>
		总共 {{total}} 条记录
		<pagination
		   v-show="total > 0"
		   :total="total"
		   v-model:page="querfrom.pageNum"
		   v-model:limit="querfrom.pageSize"
		   @pagination="getdata"
		/>
	</el-dialog>
</template>

<script setup>
	import { ref, onMounted, watch } from 'vue';
	import { dilog } from '../../store/dilog'
	import { tirelistOT, gethistor } from '@/api/carlive'
	
	const dilogs = dilog();
	const props = defineProps({
	    carid: {
	        type: String,
	        default:''
	    },
		carclickinfo:{
			type: Object,
			default:{}
		}
	})
	const activeName = ref('first')
	const titlediol = ref('')
	const querfrom=ref({
		pageNum:1,
		pageSize:10,
		state:null
	})
	const tableData = ref([])
	const total=ref(0)
	function getdata(i){
		if(activeName.value == 'first'){
			tirelistOT({
				pageNum:querfrom.value.pageNum,
				pageSize:querfrom.value.pageSize,
				install:0,
				vehicleId:props.carid
			}).then(res=>{
				tableData.value=res.data.items
				total.value=res.data.total
			})
		}else{
			gethistor({
				pageNum:querfrom.value.pageNum,
				pageSize:querfrom.value.pageSize,
				vehicleId:props.carid,
				type:'【轮胎拆卸】'
			}).then(res=>{
				tableData.value=res.data.items
				total.value=res.data.total
			})
		}
	}
	
	watch(activeName,(val)=>{
		if(val == 'first'){
			tirelistOT({
				pageNum:querfrom.value.pageNum,
				pageSize:querfrom.value.pageSize,
				install:0,
				vehicleId:props.carid
			}).then(res=>{
				tableData.value=res.data.items
				total.value=res.data.total
			})
		}else{
			gethistor({
				pageNum:querfrom.value.pageNum,
				pageSize:querfrom.value.pageSize,
				vehicleId:props.carid,
				type:'【轮胎拆卸】'
			}).then(res=>{
				tableData.value=res.data.items
				total.value=res.data.total
			})
		}
	})
	
	// 监听echarts的dilog
	dilogs.$subscribe((mutation, state) => {
		 if(dilogs.detaildilog){
			 activeName.value='first'
			tirelistOT({
				install:0,
				vehicleId:props.carid,
				pageNum:querfrom.value.pageNum,
				pageSize:querfrom.value.pageSize,
			}).then(res=>{
				tableData.value=res.data.items
				total.value=res.data.total
			})
			titlediol.value='本车轮胎信息 【' + props.carclickinfo.vehicleNo +'】'
		 }
	})
</script>

<style>
</style>