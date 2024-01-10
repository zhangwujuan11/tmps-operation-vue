<template>
	<div>
		<!-- 统计时间
		<el-date-picker
		  v-model="time"
		 type="daterange"
		start-placeholder="开始日期"
		end-placeholder="结束日期"
		 format="YYYY/MM/DD"
		 value-format="YYYY-MM-DD"
		  @change="wetiem"
		/> -->
		<el-table :data="datacar">
			<el-table-column type="index" label="序号" width="80px"/>
			<el-table-column label="日期" align="center" prop="date">
				<template #default="scope">
					{{parseTime(scope.row.date)}}		
				</template>
			</el-table-column>
			<el-table-column label="胎号" align="center" prop="tireNo" />
			<el-table-column label="GPS阶段里程(km)" align="center" prop="mileage" />
			<el-table-column label="登记时间" align="center" prop="recordTime" >
			<template #default="scope">
					{{parseTime(scope.row.recordTime)}}		
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
	import { gpslist } from '@/api/carlive'
	const props = defineProps({
		tid: {
			type: String,
			default: {}
		}
	})
	const time=ref('')
	const total=ref(0)
	const pageNum=ref(1)
	const pageSize=ref(10)
	const datacar = ref([])
	function getList(){
		gpslist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
		})
	}
	watch(() => props.tid, value => {
		gpslist({
			tid: value,
			pageNum:pageNum.value,
			pageSize:pageSize.value,
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
			})
		})
	onMounted(() => {
		gpslist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			datacar.value = res.data.items
			total.value= res.data.total
			})
		})
			
	
</script>

<style>
</style>