<template>
	<div class="app-container">
		<el-form label-width="75px">
			<el-form-item label="月度" style="width: 22.5vw;">
				<el-date-picker
				  v-model="queryform.queryDate"
				  type="month"
				  format="YYYY-MM"
				  value-format="YYYY-MM"
				/>
			</el-form-item>
			<el-form-item label="所属仓库">
				<el-select placeholder="请选择所属仓库" v-model="queryfrom.warehouseId" filterable :clearable="true">
					<el-option :label="item.warehouseName" :value="item.id" v-for="(item,index) in houselist"
						:key="index" />
				</el-select>
			</el-form-item>
		<!-- 	<el-form-item label="结算方式" v-if="fenlei=='2'">
				<el-select v-model="typesum">
					<el-option label="先进先出" value="1" />
					<el-option label="加权平均" value="2" />
				</el-select>
			</el-form-item> -->

			<div style="text-align: center;margin-left: 15px;">
				<el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
				<!-- <el-button><i class="el-icon-upload2"></i>导出</el-button> -->
			</div>
		</el-form>

		<!-- <div class="chekbox">
			<el-radio-group v-model="fenlei">
				<el-radio-button label="1">本月入库结算表</el-radio-button>
				<el-radio-button label="2">零库存结算表</el-radio-button>
			</el-radio-group>
		</div> -->

		<el-table :data="dataList" show-summary :summary-method="totalOutYear">
			<el-table-column label="品牌" align="center" prop="tireBrandName" />
			<el-table-column label="规格" align="center" prop="specificationsName" />
			<el-table-column label="花纹型号" align="center" prop="pattern">
			</el-table-column>
			<el-table-column label="数量" align="center" prop="quantity" />
			<el-table-column label="单价" align="center" prop="price" />
			<el-table-column label="金额" align="center" prop="totalPrice" />
		</el-table>
		<!-- <div class="pagedove">
			<p>
				显示第 1 到第 {{pagesize}} 条记录，总共 30408 条记录 每页显示
				<el-select v-model="pagesize" style="width: 80px;">
					<el-option label="5" value="5" />
					<el-option label="10" value="10" />
					<el-option label="20" value="20" />
					<el-option label="30" value="30" />
					<el-option label="50" value="50" />
				</el-select>
				条记录
			</p>
			<div class="pagees">
				<el-pagination v-show="total>0" :total="total" background :pager-count='5' layout="prev, pager, next" />
			</div>
		</div> -->
	</div>
</template>

<script setup lang="ts">
	import { warehouselist,mothquer } from '@/api/warehouse'
	import { onMounted } from 'vue';
	import { ref } from 'vue';
	const queryfrom = ref({
		queryDate: ''
	})
	const houselist = ref([])
	const queryform=ref({
		pageSize:10000,
		pageNum:1,
		queryDate:''
	})
	const dataList=ref([]) 
	function getList(){
		mothquer(queryform.value).then(res=>{
			dataList.value=res.data.items
		})
	}
	
	
	// 取消花纹型号的自动结算
	function totalOutYear(param) {
	      const { columns, data } = param
	      const sums = []
	      columns.forEach((column, index) => {
	        if (index === 0) {
	          sums[index] = '合计';
	          return;
	        }
	        const values = data.map(item => Number(item[column.property]));
	        if (column.property != 'specificationsName' && column.property != 'pattern' && column.property != 'tireBrandName') {
	          sums[index] = values.reduce((prev, curr) => {
	            const value = Number(curr);
	            if (!isNaN(value)) {
	              return prev + curr;
	            } else {
	              return prev;
	            }
	          }, 0);
	          sums[index];
	        }
	      });
	      return sums
	    }
	
	onMounted(()=>{
		
		// 仓库
		warehouselist({}).then(res=>{
			houselist.value=res.data.items
		})
		// 默认当前月
		const now = new Date();
		const year = now.getFullYear();
		const month = ('0' + (now.getMonth() + 1)).slice(-2);
		queryform.value.queryDate = year+'-' + month
		getList()
	})
</script>
<style scoped>
	.el-form {
		width: 100%;
		display: flex;
		justify-content: left;
	}

	:deep(.el-date-editor--daterange.el-input__inner) {
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
		margin-top: 10px;
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

	.chekbox {
		margin-top: 15px;
		display: flex;
		align-items: center;
		margin-top: 15px;
	}

	.chekbox span {
		font-size: 14px;
		color: #606266;
	}
</style>