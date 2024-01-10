<template>
	<div>
		<el-table :data="fourghcar">
			<el-table-column label="胎号" align="center" prop="tireNo" />
			<el-table-column label="品牌" align="center" prop="tireBrandName" />
			<el-table-column label="规格" align="center" prop="specificationsName" />
			<el-table-column label="花纹" align="center" prop="pattern" />
			<el-table-column label="维护内容" align="center" prop="content" />
			<!-- <el-table-column label="维护厂家" align="center" prop="mileage" /> -->
			<el-table-column label="维护费用" align="center" prop="cost" />
			<!-- <el-table-column label="维护人" align="center" prop="cost" /> -->
			<el-table-column label="维护日期" align="center" prop="createTime">
				<template #default="scope">
					{{parseTime(scope.row.createTime)}}		
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
	import { aintenance } from '@/api/carlive'
	const props = defineProps({
		tid: {
			type:String,
			default: {}
		}
	})
	const total=ref(0)
	const pageNum=ref(1)
	const pageSize=ref(10)
	const fourghcar = ref([])
	function getList(){
		aintenance({
			tireId: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			fourghcar.value = res.data.items
			total.value= res.data.total
		})
	}
	watch(() => props.tid, value => {
		aintenance({
			tireId: value,
			pageNum:pageNum.value,
			pageSize:pageSize.value,
		}).then(res => {
			fourghcar.value = res.data.items
			total.value= res.data.total
			})
		})
	onMounted(() => {
		aintenance({
			tireId: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			fourghcar.value = res.data.items
			})
		})
			
	
</script>

<style>
</style>