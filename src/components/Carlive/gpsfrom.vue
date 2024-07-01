<template>
	<div>
		<div style="display: flex;align-items: center;justify-content: space-between;">
			<div style="display: flex;align-items: center;">
				统计时间
				<div style="width: 350px;margin-left:10px;">
					<el-date-picker
					  v-model="time"
					  @change="getList"
					 type="daterange"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					 format="YYYY/MM/DD"
					 value-format="YYYY-MM-DD"
					/>
				</div>
				<!-- <el-button type="primary" style="margin-left:10px;" @click="getList">查询</el-button> -->
			</div>
			<h3 style="color: red;margin-left:10px;" > <span v-if="time[0] != ''">从{{time[0]}}到{{time[1]}}</span>总里程：{{tiregomeal}}km</h3>
		</div>
		
		<el-table :data="datacar">
			<el-table-column type="index" label="序号" width="80px"/>
			<el-table-column label="日期" align="center" prop="date">
				<template #default="scope">
					{{parseTime(scope.row.date,'{y}-{m}-{d}')}}		
				</template>
			</el-table-column>
			<el-table-column label="胎号" align="center" prop="tireNo" />
			<el-table-column label="GPS阶段里程(km)" align="center" prop="mileage" />
			<el-table-column label="登记时间" align="center" prop="recordTime" >
			<template #default="scope">
					{{parseTime(scope.row.recordTime,'{y}-{m}-{d}')}}		
				</template>
			</el-table-column>
		</el-table>
		<pagination
		   :total="total"
		   v-model:page="pageNum"
		   v-model:limit="pageSize"
		   @pagination="getList"
		   style="height: 100px !important;"
		/>
	</div>
	
</template>

<script setup lang="ts">
	
	import { ref, onMounted, watch } from 'vue';
	import { gpslist, zlic } from '@/api/carlive'
	import { parseTime } from '@/utils/ruoyi'
	const props = defineProps({
		tid: {
			type: String,
			default: ''
		},
		tireNo:{
			type: String,
			default: ''
		},
	})
	const tiregomeal=ref(0)
	const time=ref(['',''])
	const total=ref(0)
	const pageNum=ref(1)
	const pageSize=ref(10)
	const datacar = ref([])
	function getList(){
		gpslist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value,
			startTime:time.value[0],
			endTime:time.value[1]
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
		})
		zolic()
	}
	function zolic(){
		zlic({
			tireNo:props.tireNo,
			startTime:time.value[0],
			endTime:time.value[1]
		}).then(res=>{
			tiregomeal.value=res.data
		})
	}
	watch(() => props.tid, value => {
		const currentDate = new Date();
		  const year = currentDate.getFullYear();//获取当前年
		  const month = String(currentDate.getMonth() + 1).padStart(2, "0");//获取当前月
		  const firstDay = "01";//日
		  const b=  `${year}-${month}-${firstDay}`;
		let day = new Date();  //当天的时间
		time.value=[b,parseTime(day,'{y}-{m}-{d}')]
		gpslist({
			tid: value,
			startTime:time.value[0],
			endTime:time.value[1],
			pageNum:1,
			pageSize:10,
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
			zlic({
				tireNo:props.tireNo,
				startTime:time.value[0],
				endTime:time.value[1]
			}).then(res=>{
				tiregomeal.value=res.data
			})
			})
		})
	onMounted(() => {
		const currentDate = new Date();
		  const year = currentDate.getFullYear();//获取当前年
		  const month = String(currentDate.getMonth() + 1).padStart(2, "0");//获取当前月
		  const firstDay = "01";//日
		  const b=  `${year}-${month}-${firstDay}`;
		let day = new Date();  //当天的时间
		time.value=[b,parseTime(day,'{y}-{m}-{d}')]
		gpslist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value,
			startTime:time.value[0],
			endTime:time.value[1],
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
			})
		zolic()
		})
			
	
</script>

<style>
</style>