<template>
	<div class="con">
		<div class="con-left">
			<div class="carinfo">
				<p>车牌号：{{echartsneeddata.vehicleNo}}</p>
				<div class="chedaya">
					<div class="databox">
						开始日期:
						<el-date-picker v-model="timepcker[0]" type="datetime" placeholder="开始时间" />
					</div>
					<div class="databox">
						截止日期:
						<el-date-picker v-model="timepcker[1]" type="datetime" placeholder="结束时间" />
					</div>

				</div>

				<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
					@change="handleCheckAllChange">全选</el-checkbox>
				<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
					<el-checkbox v-for="city in echartsneeddata.tirePosition" :label="city.tireCode"
						:key="city.tireCode">{{city.tireDesc}}</el-checkbox>
				</el-checkbox-group>
				<el-button type="primary" style="margin-top: 20px;" @click="getLits">查询</el-button>
			</div>
		</div>
		<div class="con-right">
			<div id="chartthree" ref="chartthree" style="height:49%;width: 100%;"></div>
			<div id="chartfour" ref="chartthree" style="height:48%;width: 100%;margin-top: 50px;"></div>
		</div>
	</div>
</template>

<script setup>
	import {
		ref,
		onMounted,
		watch,
		nextTick
	} from "vue";
	import * as echarts from 'echarts';
	import {
		getechartsapp,
		echartshowinfoapp
	} from '@/api/front'
	import {
		parseTime
	} from '@/utils/ruoyi'
	import {
		useRoute
	} from 'vue-router';
	// const props = defineProps({
	//     echartsneeddata: {
	//         type: Object,
	//         default: {}
	//     },
	// 	echartclickinfo:{
	// 		type: Number,
	// 		default: null
	// 	},
	// 	carid:{
	// 		type: String,
	// 		default: ''
	// 	}
	// })
	const ishaiba = ref(false)
	const issudu = ref(false)
	const endTime = ref('')
	const startTime = ref('')
	const position = ref()
	const timepcker = ref([])
	const carid = ref('')
	const token = ref('')
	const echartsneeddata = ref({})

	// 多选框
	const checkAll = ref(false)
	const isIndeterminate = ref(true)
	const checkedCities = ref([])
	const handleCheckAllChange = function(val) {
		let array = echartsneeddata.value.tirePosition.map(item => {
			return item.tireCode
		})
		checkedCities.value = val ? array : [],
			isIndeterminate.value = false
	}
	const handleCheckedCitiesChange = function(value) {
		const checkedCount = value.length
		checkAll.value = checkedCount === echartsneeddata.value.tirePosition.length
		isIndeterminate.value = checkedCount > 0 && checkedCount < echartsneeddata.value.tirePosition.length
	}

	const derangement = arr => {
		arr.sort(() => {
			Math.random() - 0.5
		});
	}

	function getLits1() {
		endTime.value = parseTime(timepcker.value[1], '{y}-{m}-{d} {h}:{i}:{s}')
		startTime.value = parseTime(timepcker.value[0], '{y}-{m}-{d} {h}:{i}:{s}')
		position.value = checkedCities.value.toString();
		let obj = { //压力曲线
			curveType: 1,
			endTime: endTime.value,
			position: position.value, //选择的轮位
			startTime: startTime.value,
			vehicleId: carid.value
		}
		getechartsapp(obj, token.value).then(res => {
			let ydata = []
			let namearr = []
			let names = []
			let obj = {
				name: '',
				type: 'line',
				connectNulls: true,
				data: []
			}
			for (let i = 0; i < res.data.data.yaxisSeries.length; i++) {
				obj = {
					name: res.data.data.yaxisSeries[i].legendName,
					connectNulls: true,
					symbolSize: 8, //设定实心点的大小
					showAllSymbol: true,
					data: [],
					type: 'line'
				}
				names = []
				namearr.push(res.data.data.yaxisSeries[i].legendName)
				for (let key = 0; key < res.data.data.yaxisSeries[i].progressList.length; key++) {
					names.push([res.data.data.xaxis[key], res.data.data.yaxisSeries[i].progressList[key]])
					obj.data = names
				}
				ydata.push(obj)
			}
			drawLine('chartthree', ydata, "压力值（bar）", namearr)
		})
	}

	function getLits2() {
		endTime.value = parseTime(timepcker.value[1], '{y}-{m}-{d} {h}:{i}:{s}')
		startTime.value = parseTime(timepcker.value[0], '{y}-{m}-{d} {h}:{i}:{s}')
		position.value = checkedCities.value.toString();
		let objtwo = { //压力曲线
			curveType: 2,
			endTime: endTime.value,
			position: position.value, //选择的轮位
			startTime: startTime.value,
			vehicleId: carid.value
		}
		getechartsapp(objtwo, token.value).then(res => {
			let ydata = []
			let namearr = []
			let names = []
			let obj = {
				name: '',
				type: 'line',
				connectNulls: true,
				data: []
			}
			for (let i = 0; i < res.data.data.yaxisSeries.length; i++) {
				obj = {
					name: res.data.data.yaxisSeries[i].legendName,
					connectNulls: true,
					symbolSize: 8, //设定实心点的大小
					showAllSymbol: true,
					data: [],
					type: 'line'
				}
				names = []
				namearr.push(res.data.data.yaxisSeries[i].legendName)
				for (let key = 0; key < res.data.data.yaxisSeries[i].progressList.length; key++) {
					names.push([res.data.data.xaxis[key], res.data.data.yaxisSeries[i].progressList[key]])
					obj.data = names
				}
				ydata.push(obj)
			}
			drawLine('chartfour', ydata, "温度值（℃）", namearr)
		})
	}

	function getLits() {
		getLits1();
		getLits2()
	}

	const drawLine = function(id, ydata, text, namearr) {
		var myChart = echarts.init(document.getElementById(id), null, {
			devicePixelRatio: 2.5
		});
		myChart.setOption({
			tooltip: {
				trigger: 'axis',
				show: true,
				appendToBody: true
			},
			legend: {
				data: namearr,
			},
			grid: {
				left: '7%',
				right: '5%',
				bottom: '6%',
				containLabel: true
			},
			toolbox: {
				feature: {
					saveAsImage: {
						show: false
					},
					dataZoom: { // 选时间缩放功能
						show: false, // show为true时，才能触发takeGlobalCursor事件
						yAxisIndex: 'none',
					}
				}
			},
			xAxis: {
				type: 'time',
				axisLabel: {
					textStyle: {
						fontSize: '12',
						color: 'black', // 坐标值的具体的颜色
						textaline: "center"
					},
				},
				splitLine: {
					show: false,
				},
			},
			yAxis: {
				type: "value",
				axisLabel: {
					textStyle: {
						fontSize: '12',
						color: 'black' // 坐标值的具体的颜色
					},
				},
			},
			series: ydata
		}, true)
	};






	const positioncheck = ref('')
	onMounted(() => {
		let b = 24 * 60 * 60 * 1000 //一天的时间
		let day = new Date(); //当天的时间
		timepcker.value = [parseTime(day.getTime() - b, '{y}-{m}-{d} {h}:{i}:{s}'), parseTime(day,
			'{y}-{m}-{d} {h}:{i}:{s}')]

		const route = useRoute();
		token.value = route.query.id
		carid.value = route.query.carid
		positioncheck.value = route.query.position
		echartshowinfoapp(carid.value, token.value).then(data => {
			echartsneeddata.value = data.data.data
			setTimeout(function() {
				checkedCities.value.push(Number(positioncheck.value))
				getLits()
			}, 500)
		})

	})
</script>

<style scoped>
	.con {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: white;
		height: 750px;
		overflow-y: scroll;
	}

	.con .con-left {
		width: 100%;
		background-color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.con .con-right {
		width: 100%;
		background-color: white;
		height: 750px;
		padding-bottom: 60px;
	}

	:deep(.el-date-editor--daterange.el-input__inner) {
		width: 95% !important;
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.con-right h3 {
		font-size: 20px;
		font-weight: 800;
		text-align: center;
	}

	:deep(.el-date-editor.el-input__wrapper) {
		width: 98%;
		margin: 15px 0;
	}

	.carinfo p {
		line-height: 34px;
	}

	.carinfo {
		padding-left: 50px;
	}

	.el-checkbox-group {
		display: flex;
		flex-wrap: wrap;

	}

	.el-checkbox-group .el-checkbox--default {
		width: 100%;
	}

	.el-dialog__body {
		height: 500px;
		overflow-y: scroll;
	}

	.chedaya {
		width: 100%;
		flex-direction: column;
	}

	.chedaya .databox {
		margin-top: 10px;
	}
	#app{
		background-color: white;
	}
</style>