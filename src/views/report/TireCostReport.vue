<template>
	<div class="app-container">
		<div class="downbox">
			<p class="titles">
				<span>
					<img src="@/assets/r_icon1.png">
					前十个轮胎品牌【平均磨耗】对比（单位：km/mm）
				</span>
			</p>
			<div id="echaxone" ref="echaxone"></div>
		</div>
		<div class="downbox">
			<p class="titles">
				<span>
					<img src="@/assets/r_icon1.png">
					前十个轮胎品牌【平均里程】对比（单位：km）
				</span>
			</p>
			<div id="echaxtwo" ref="echaxtwo"></div>
		</div>
		<div class="centerbox">
			<div class="box">
				<p class="titles">
					<span>
						<img src="@/assets/r_icon1.png">
						所有报废轮胎每公里成本对比（单位：元/km）
					</span>
				</p>
				<div id="echaxthree" ref="echaxthree"></div>
			</div>
			
			<div class="box">
				<p class="titles">
					<span>
						<img src="@/assets/r_icon1.png">
						正常报废轮胎每公里成本对比（单位：元/km）
					</span>
				</p>
				<div id="echaxfour" ref="echaxfour"></div>
			</div>
		</div>
		
		<div class="downbox">
			<p class="titles">
				<span>
					<img src="@/assets/r_icon1.png">
					质量问题轮胎数量占比（单位：条）
				</span>
			</p>
			<div id="echaxfive" ref="echaxfive"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import * as echarts from 'echarts';
	const drawLine = function () {
		var myChart = echarts.init(document.getElementById("echaxone"), null, { devicePixelRatio: 2.5 });
		myChart.setOption({
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
					data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
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
					data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
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
			myChart.resize();
		});
	};


	const drawLinetwo = function () {
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
					data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
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
					data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
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
	};
	const drawLinethree = function () {
		var myChart = echarts.init(document.getElementById("echaxthree"), null, { devicePixelRatio: 2.5 });
		myChart.setOption({
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
					data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
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
					data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
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
			myChart.resize();
		});
	};
	const drawLinefour = function () {
		var myChart = echarts.init(document.getElementById("echaxfour"), null, { devicePixelRatio: 2.5 });
		myChart.setOption({
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
					data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
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
					data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
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
			myChart.resize();
		});
	};
	const drawLinefive = function () {
		var myChart = echarts.init(document.getElementById("echaxfive"), null, { devicePixelRatio: 2.5 });
		myChart.setOption({
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
					data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
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
					data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
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
			myChart.resize();
		});
	};
	onMounted(() => {
		drawLine()
		drawLinetwo()
		drawLinethree()
		drawLinefour()
		drawLinefive()
	})
</script>
<style scoped>
	.titles {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}

	.centerbox {
		margin: 20px 0;
		width:100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.centerbox .box{
		width: 49%;
	}

	#echaxone {
		height: 300px;
		width: 100%;
	}
	#echaxtwo{
		height: 300px;
		width: 100%;
	}
	#echaxthree {
		height: 300px;
		width: 100%;
	}
	#echaxfour{
		height: 300px;
		width: 100%;
	}
	#echaxfive{
		height: 300px;
		width: 100%;
	}
</style>