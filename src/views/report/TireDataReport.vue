<template>
	<div class="app-container">
		<div class="topbox">
			<ul>
				<li class="bg1">
					<span>{{lidata.allVehicle}}辆</span>
					总车辆数
				</li>
				<li class="bg2">
					<span>{{lidata.onLineVehicle}}辆</span>
					在线车辆
				</li>
				<li class="bg3">
					<span>{{lidata.offLineVehicle}}辆</span>
					离线车辆
				</li>
				<li class="bg4">
					<span>{{lidata.installTire}}条</span>
					已安装轮胎
				</li>
				<li class="bg5">
					<span>{{lidata.notInstalledTire}}条</span>
					未安装轮胎
				</li>
			</ul>
		</div>
		<div class="centerbox">
			<p class="titles">
				<span>
					<img src="@/assets/r_icon1.png">
					当前管理车辆总数（{{lidata.allVehicle}}）
				</span>
			</p>
			<div id="echaxone" ref="echaxone"></div>
		</div>
		<div class="downbox">
			<p class="titles">
				<span>
					<img src="@/assets/r_icon1.png">
					当前管理轮胎总数（{{lidata.installTire + lidata.notInstalledTire}}）
				</span>
			</p>
			<div id="echaxtwo" ref="echaxtwo"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as echarts from 'echarts';
	import { tirecount, tireprice, tirezhu } from '@/api/reop'
	const lidata=ref({})
	const picdata=ref([])
	const pictitle=ref([])
	function allcount (){
		tirecount().then(res=>{
			lidata.value=res.data
		})
	}
	const drawLine = function () {
		tireprice().then(data=>{
			picdata.value=data.data.data
			let arr=[]
			data.data.data.map(item=>{
				arr.push(item.name)
			})
			pictitle.value=arr
			var myChart = echarts.init(document.getElementById("echaxone"), null, { devicePixelRatio: 2.5 });
			myChart.setOption({
				tooltip: {
					trigger: 'item',
					formatter: '{a} <br/>{b}: {c} ({d}%)'
				},
				legend: {
					orient: 'vertical',
					left: 40,
					data: pictitle.value
				},
				series: [
					{
						name: '车辆统计',
						type: 'pie',
						radius: ['50%', '70%'],
						avoidLabelOverlap: true,
						itemStyle: {
							normal: {
								label: {
									show: true,
									formatter: '{b} : {c} ({d}%)',
									fontSize: 15
								},
								labelLine: { show: true }
							}
						},
						label: {
							show: true,
							position: 'center'
						},
						emphasis: {
							label: {
								show: true,
								fontSize: '30',
								fontWeight: 'bold'
							}
						},
						labelLine: {
							show: true
						},
						data:picdata.value 
					}
				]
			});
			window.addEventListener("resize", function () {
				myChart.resize();
			});
		})
	};
	const drawLinetwo = function () {
		tirezhu().then(res=>{
			var myPie2 = echarts.init(document.getElementById("echaxtwo"));
			myPie2.setOption({
				tooltip: {
					trigger: 'axis'
				},
				toolbox: {
					feature: {
						saveAsImage: {
							show: true
						},
						dataZoom: { // 选时间缩放功能
							show: true, // show为true时，才能触发takeGlobalCursor事件
							yAxisIndex: 'none',
						}
					}
				},
				calculable: true,
				xAxis: [
					{
						type: 'category',
						data: res.data.xaxis,
						axisLabel: {
							interval: 0,
							rotate: 40
						}
					}
				],
				grid: {
					top: '8%',
					left: '3%',
					right: '4%',
					bottom: '15%',
					containLabel: true
				},
				yAxis: [
					{
						type: 'value',
						axisLabel: {
							formatter: '{value}条'
						}
					}
				],
				series: [
					{
						name: '品牌数量占比',
						type: 'bar',
						data: res.data.yaxis,
						itemStyle: {
							normal: {
								label: {
									show: true,
									position: 'top',
									textStyle: {
										color: 'black'
									}
								}
							}
						},
						color: '#5fa1ff',
						barWidth: 30//柱图宽度
					}
				]
			});
			window.addEventListener("resize", function () {
				myPie2.resize();
			});
		})
		
	};
	onMounted(() => {
		allcount()
		drawLine()
		drawLinetwo()
	})
</script>
<style scoped>
	.topbox ul {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.topbox ul li {
		width: 19.5%;
		padding: 15px 0;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.topbox ul li span {
		font-size: 25px;
		font-weight: bold;
		margin-bottom: 5px;
	}

	.topbox ul .bg1 {
		background-color: #fda20d;
	}

	.topbox ul .bg2 {
		background-color: #ffebe7;
	}

	.topbox ul .bg3 {
		background-color: #fff2e7;
	}

	.topbox ul .bg4 {
		background-color: #e1eefa;
	}

	.topbox ul .bg5 {
		background-color: #e1eefa;
	}

	.titles {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.centerbox {
		margin: 20px 0;
	}

	#echaxone {
		height: 300px;
		width: 100%;
	}
	#echaxtwo{
		height: 300px;
		width: 100%;
	}
</style>