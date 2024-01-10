<template>
  <div class="app-container home">
	  <div class="left">
		  <p class="titles">
			 <span>
				  <img src="@/assets/r_icon1.png" alt="">
				  车辆情况
			  </span>
			 <span>
			 	共{{boxone.vehicleSum}}辆 
			 </span> 
		  </p>
		  
		  <ul class="clqk_con">
			  <li class="color1">
				   <img src="@/assets/clqk_img1.png" alt="">
				   <p>
					   <span class="numbertext">{{boxone.onlineCount}}辆</span>
					   <span class="statustext">在线车辆</span>
				   </p>
			  </li>
			  <li class="color2">
				  <img src="@/assets/clqk_img2.png" alt="">
				  <p>
					 <span class="numbertext">{{boxone.offLineCount}}辆</span>
					 <span class="statustext">离线车辆</span> 
				  </p>
			</li>
		  </ul>
		  
		  <p class="titles">
			 <span>
				  <img src="@/assets/r_icon1.png">
				 胎温胎压报警
			  </span>
		  </p>
		  
		  <ul class="clqk_con">
			  <li class="color4" @click="gotirehtml('10101')">
				   <img src="@/assets/clqk_img5.png" alt="" style="width: 32px;height: 27px;">
				   <p>
					   <span class="numbertext">{{lefttwo.lowPressureCount}}</span>
					   <span class="statustext">低压报警车（辆）</span>
				   </p>
			  </li>
			  <li class="color4" @click="gotirehtml('10301')">
				  <img src="@/assets/clqk_img6.png" style="width: 13px;height: 27px;">
				  <p>
					 <span class="numbertext">{{lefttwo.highTemperatureCount}}</span>
					 <span class="statustext">高温报警车（辆）</span> 
				  </p>
			</li>
			<li class="color4" @click="gotirehtml('10201')">
				  <img src="@/assets/clqk_img7.png" style="width: 32px;height: 27px;">
				  <p>
					 <span class="numbertext">{{lefttwo.highPressureCount}}</span>
					 <span class="statustext">高压报警车（辆）</span> 
				  </p>
			</li>
			<li class="color2" @click="gotirehtml('10501')">
				  <img src="@/assets/clqk_img8.png" style="width: 24px;height: 23px;">
				  <p>
					 <span class="numbertext">{{lefttwo.noSignCount}}</span>
					 <span class="statustext">无信号报警车（辆）</span> 
				  </p>
			</li>
		  </ul>
		  
		  
		  <p class="titles">
			 <span>
				  <img src="@/assets/r_icon1.png">
				 轮胎辅助功能
			  </span>
		  </p>
		  <ul class="fzgn_list">
		  	<li  @click="lione">
				<span>
					<img src="@/assets/r_icon2.png" alt="">
					轮胎品牌搭配异常车辆 （{{leftthree.brandMalfunctionCount}}辆）
				</span>
				<span>
					【详情】
				</span>
			</li>
		  	<li  @click="litwo">
		  		<span>
		  			<img src="@/assets/r_icon2.png" alt="">
		  			轮胎规格搭配异常车辆 （{{leftthree.specificationsCount}}辆）
		  		</span>
		  		<span>
		  			【详情】
		  		</span>
		  	</li>
			<li @click="lithree">
				<span>
					<img src="@/assets/r_icon2.png" alt="">
					轮胎花纹搭配异常车辆 （{{leftthree.patternCount}}辆）
				</span>
				<span>
					【详情】
				</span>
			</li>
			<li @click="lifour">
				<span>
					<img src="@/assets/r_icon2.png" alt="">
					轮胎花纹深度搭配异常车辆 （{{leftthree.patternDeptCount}}辆）
				</span>
				<span>
					【详情】
				</span>
			</li>
			<li @click="lifive">
				<span>
					<img src="@/assets/r_icon2.png" alt="">
					轮胎气压异常车辆 （{{leftthree.pressureMalfunctionCount}}辆）
				</span>
				<span>
					【详情】
				</span>
			</li>
		  </ul>
		  
		  
	  </div>
      <div class="right">
		  <p class="titles">
			 <span>
				  <img src="@/assets/r_icon1.png" alt="">
				  轮胎情况
			  </span>
			 <span>
				共{{rightone.tireSum}}条
			 </span> 
		  </p>
		  <ul class="clqk_con">
			  <li class="color3">
				   <img src="@/assets/clqk_img3.png" alt="">
				   <p>
					   <span class="numbertext">{{rightone.installCount}}条</span>
					   <span class="statustext">已装车轮胎</span>
				   </p>
			  </li>
			  <li class="color2">
				  <img src="@/assets/clqk_img4.png" alt="">
				  <p>
					 <span class="numbertext">{{rightone.unInstallCount}}条</span>
					 <span class="statustext">未装车轮胎</span> 
				  </p>
			</li>
		  </ul>
		  
		  <p class="titles">
			 <span>
				<img src="@/assets/r_icon1.png" alt="">
				最近7天轮胎（低压/高温）报警趋势图
			  </span>
		  </p>
		  <div id="main" style="width: 100%;height: 200px;margin-bottom: 22px;"></div>
		  <p class="titles">
			 <span>
				<img src="@/assets/r_icon1.png" alt="">
				轮胎品牌统计
			  </span>
		  </p>
		  <div id="box" style="width: 100%;height: 200px;"></div>
	  </div>
  </div>
</template>

<script setup>
	import {ref, onMounted} from 'vue';
	import * as echarts from 'echarts';
	import { useRouter } from "vue-router";
	const router = useRouter();
	import { onlicount, yichan, install, exbarans, nohavedata, echarttemp } from '@/api/index'
	const boxone=ref({})
	const echartdatatwo=ref({})
	const echartdataone=ref({})
	const leftthree=ref({})
	const rightone=ref({})
	const lefttwo=ref({})
	function echertsone(val){
		var chartDom =document.getElementById('main');
		chartDom.removeAttribute('_echarts_instance_');
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			color:['#ffa500','#428bca'],
			grid: {
			  left: '3%',
			  right: '4%',
			  bottom: '3%',
			  top:'4%',
			  containLabel: true
			},
			tooltip: {
			   trigger: 'axis'
			},
		  xAxis: {
		    type: 'category',
		    data: echartdataone.value.xaxis
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series:val
		};
		option && myChart.setOption(option);
	}
	
	
	// 胎温胎压报警跳转记录
	function gotirehtml(e){
		router.push({
			path: '/front/tiremonitor',
			query: {
				monitorStatus:e
			}
		})
	}
	
	function echartstwo(){
		var chartDom = document.getElementById('box');
		chartDom.removeAttribute('_echarts_instance_');
		var myChart = echarts.init(chartDom);
		var option;
		option = {
			color:['#ffa500'],
			grid: {
			  left: '3%',
			  right: '4%',
			  bottom: '3%',
			  top:'4%',
			  containLabel: true
			},
		  xAxis: {
		    type: 'category',
		    data: echartdatatwo.value.xaxis,
			 axisLabel: { interval: 0, rotate: 40 }
		  },
		  yAxis: {
		    type: 'value'
		  },
		  tooltip: {
		    appendToBody : true
		  },
		  series: [
		    {
		      data:  echartdatatwo.value.yaxis,
		      type: 'bar',
			  barWidth : 30,//柱图宽度
		    }
		  ]
		};
		option && myChart.setOption(option);
	}
	function lione(){
		router.push({path:'/tirecon/tireanalysis/tirebrandabnormallist'});
	}
	function litwo(){
		router.push({path:'/tirecon/tireanalysis/tirespecabnormallist'});
	}
	function lithree(){
		router.push({path:'/tirecon/tireanalysis/tirepatternabnormallist'});
	}
	function lifour(){
		router.push({path:'/tirecon/tireanalysis/tiredepthlist'});
	}
	function lifive(){
		router.push({path:'/tirecon/tireanalysis/tirepressurelist'});
	}
	onMounted(()=>{
		
		onlicount().then(res=>{
			boxone.value=res.data
		})
		yichan().then(res=>{
			leftthree.value=res.data
		})
		install().then(res=>{
			rightone.value=res.data
		})
		nohavedata().then(res=>{
			lefttwo.value=res.data
		})
		echarttemp().then(res=>{
			echartdataone.value=res.data
			let ydata=[]
			let namearr=[]
			let names=Object.keys(res.data.yaxisSeries)
			let obj={
				name: '',
				type: 'line',
				data: []
			}
			for (let key in res.data.yaxisSeries){
			   obj={
				name: key,
				type: 'line',
				data:res.data.yaxisSeries[key]
			   }
			  ydata.push(obj)  
			}
			echertsone(ydata)
		})
		exbarans().then(res=>{
			echartdatatwo.value=res.data
			echartstwo()
		})
	})
	
</script>

<style scoped>
	.app-container{
		display: flex;
		justify-content: space-between;
	}
	.left,.right{
		width: 49%;
	}
	li.color1 {
	    background: #dcebff;
	    border: 1px solid rgba(77, 106, 238, 0.35);
		color:#4d6aee;
	}
	.clqk_con li {
	    width: 48.9%;
	    height: 90px;
	    border-radius: 5px;
	    margin-bottom: 2%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 25px;
		box-sizing: border-box;
		cursor: pointer;
	}
	.clqk_con{
		margin-bottom: 20px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		
	}
	.clqk_con li img{
		width: 49px;
		height: 49px;
	}
	li.color2 {
	    background: #ececec;
	    border: 1px solid rgba(162, 162, 162, 0.35);
		color:#7a7a7a;
	}
	.titles{
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.clqk_con li p{
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}
	.numbertext{
		font-size: 20px;
		font-weight: bold;
	}
	.statustext{
		font-size: 14px;
	}
	.color4{
		background: #ffe5db;
		border: 1px solid rgba(255, 90, 63, 0.35);
		color: #ff5b35;
	}
	.fzgn_list li{
		font-size: 14px;
		color: #84879b;
		display: flex;
		justify-content:space-between;
		align-items: center;
		line-height: 40px;
		padding: 0 20px;
		cursor: pointer;
	}
	.fzgn_list li img{
		margin-right: 5px;
	}
	.fzgn_list li:nth-child(even){
		background-color: #f5f7ff;
	}
	.color3{
		background: #d9f1ee;
		border: 1px solid rgba(64, 169, 156, 0.35);
		color: #2cbeac;
	}
</style>

