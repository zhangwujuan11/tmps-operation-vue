<template>
	<el-dialog v-model="dilogs.echartstwo" width="80%" append-to-body>
  <div class="con">
    <div class="con-left">
      <div class="carinfo">
        <p>车牌号：{{props.echartsneeddata.vehicleNo}}</p>
        <p>设备ID：{{props.echartsneeddata.deviceId}}</p>
        <p>速度曲线： <el-checkbox v-model="speedShow" style="margin-right: 5px;" :true-label="0" :false-label="1"></el-checkbox>是否显示</p>
        <p>海拔曲线： <el-checkbox v-model="altitudeShow" style="margin-right: 5px;" :true-label="0" :false-label="1"></el-checkbox>是否显示</p>
        检测日期:
      <!-- <el-date-picker
          v-model="timepcker"
           type="daterange"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
		  format="YYYY/MM/DD"
		  value-format="YYYY-MM-DD">
        </el-date-picker> -->
		 <el-date-picker
		  v-model="timepcker[0]"
		  type="datetime"
		  placeholder="开始时间"
		/>
		<p>至</p>
		<el-date-picker
		  v-model="timepcker[1]"
		  type="datetime"
		  placeholder="结束时间"
		/>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
         <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="city in props.echartsneeddata.tirePosition"  :label="city.tireCode" :key="city.tireCode">{{city.tireDesc}}</el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" style="margin-top: 20px;" @click="getLits">查询</el-button>
      </div>
    </div>
    <div class="con-right">
      <h3>胎压胎温趋势图</h3>
        <div id="charttwothree" ref="charttwothree" style="height:49%;width: 100%;"></div>
       <div id="charttwofour" ref="charttwofour" style="height:48%;width: 100%;"></div>
	   
	   <div id="charttwofive" ref="charttwofive" style="height:49%;width: 100%;background-color: white;" v-show="ishaiba"></div>
	   <div id="charttwosix" ref="charttwosix" style="height:48%;width: 100%;background-color: white;" v-show="issudu"></div>
    </div>
  </div>
  </el-dialog>
</template>

<script setup>
	import { ref, onMounted, watch, nextTick } from "vue";
	import * as echarts from 'echarts';
	import { dilog } from '../../store/dilog'
	import { getecharts,getechangtte } from '@/api/front'
	import { parseTime } from '@/utils/ruoyi'
	const dilogs = dilog();
	const props = defineProps({
	    echartsneeddata: {
	        type: Object,
	        default: {}
	    },
		echartclickinfo:{
			type: Number,
			default: null
		},
		carid:{
			type: String,
			default: ''
		}
	})
	const altitudeShow=ref(1)//海拔曲线是否显示 0显示 1 不显示
	const speedShow=ref(1)//速度曲线是否显示 0显示 1 不显示
	const ishaiba=ref(false)
	const issudu=ref(false)
	const endTime=ref('')
	const startTime=ref('')
	const position=ref()
	const timepcker=ref([])
	
   // 多选框
   const checkAll = ref(false)
   const isIndeterminate = ref(true)
   const checkedCities = ref([])
   const handleCheckAllChange = function(val){
	   let array=props.echartsneeddata.tirePosition.map(item=>{
		   return item.tireCode
	   })
     checkedCities.value = val ? array : []
     isIndeterminate.value = false
   }
   const handleCheckedCitiesChange = function(value){
     const checkedCount = value.length
     checkAll.value = checkedCount === props.echartsneeddata.tirePosition.length
     isIndeterminate.value = checkedCount > 0 && checkedCount < props.echartsneeddata.tirePosition.length
   }
  
   const derangement=arr=>{
     arr.sort(()=>{Math.random()-0.5});
   }
   
    function getLits1(){
		endTime.value= parseTime(timepcker.value[1],'{y}-{m}-{d} {h}:{i}:{s}')
		startTime.value= parseTime(timepcker.value[0],'{y}-{m}-{d} {h}:{i}:{s}')
		position.value=checkedCities.value.toString(); 
		let obj={//压力曲线
				   curveType:1,
				   endTime:endTime.value,
				   position:position.value,//选择的轮位
				   startTime:startTime.value,
				   vehicleId:props.carid
		}
		getecharts(obj).then(res=>{
				   let ydata=[]
				   let namearr=[]
				   let names=[]
				   let obj={
					    name: '',
					    type: 'line',
						connectNulls: true,
					    data: []
				   }
				   for(let i=0;i<res.data.yaxisSeries.length;i++){
					   obj={
							name:res.data.yaxisSeries[i].legendName,
							connectNulls: true,
							symbolSize: 8,   //设定实心点的大小
							showAllSymbol: true,
							data:[],
							type:'line'
					   }
					   names=[]
					   namearr.push(res.data.yaxisSeries[i].legendName)
					   for (let key=0; key<res.data.yaxisSeries[i].progressList.length; key++ ) {
							names.push([res.data.xaxis[key],res.data.yaxisSeries[i].progressList[key]])
							obj.data=names
					   }
					   ydata.push(obj)
				   }
				drawLine('charttwothree',ydata,"压力值（bar）",namearr)
		})
	}
	function getLits2(){
		endTime.value= parseTime(timepcker.value[1],'{y}-{m}-{d} {h}:{i}:{s}')
		startTime.value= parseTime(timepcker.value[0],'{y}-{m}-{d} {h}:{i}:{s}')
		position.value=checkedCities.value.toString(); 
		let objtwo={//压力曲线
				   curveType:2,
				   endTime:endTime.value,
				   position:position.value,//选择的轮位
				   startTime: startTime.value,
				   vehicleId:props.carid
		}
		getecharts(objtwo).then(res=>{
					let ydata=[]
				    let namearr=[]
				    let names=[]
				    let obj={
				  	    name: '',
				  	    type: 'line',
				  		connectNulls: true,
				  	    data: []
				     }
				    for(let i=0;i<res.data.yaxisSeries.length;i++){
				    					   obj={
				    							name:res.data.yaxisSeries[i].legendName,
				    							connectNulls: true,
				    							symbolSize: 8,   //设定实心点的大小
				    							showAllSymbol: true,
				    							data:[],
				    							type:'line'
				    					   }
				    					   names=[]
				    					   namearr.push(res.data.yaxisSeries[i].legendName)
				    					   for (let key=0; key<res.data.yaxisSeries[i].progressList.length; key++ ) {
				    							names.push([res.data.xaxis[key],res.data.yaxisSeries[i].progressList[key]])
				    							obj.data=names
				    					   }
				    					   ydata.push(obj)
				    }
				   drawLine('charttwofour',ydata,"温度值（℃）",namearr)
		})
	}
   function getLits(){
	   getLits1();
	   getLits2()
	   let objthree={
	   		   curveType:3,
	   		   endTime:endTime.value,
	   		   position:position.value,//选择的轮位
	   		   startTime: startTime.value,
	   		  vehicleId:props.carid
	   }
	   if(altitudeShow.value == 0){
		   ishaiba.value=true
		   getechangtte(objthree).then(res=>{
			   HBChart(res.data);
		   })
	   }else{
		   ishaiba.value=false
	   }
	   let objsix={
	   		   curveType:4,
	   		   endTime:endTime.value,
	   		   position:position.value,//选择的轮位
	   		   startTime: startTime.value,
	   		   vehicleId:props.carid
				}
	   if(speedShow.value == 0){
			issudu.value=true
		   getechangtte(objsix).then(res=>{
			SDChart(res.data);
		   })
		}else{
			issudu.value=false
		}
   }
   
   const  drawLine=function(id,ydata,text,namearr) {
          var myChart=echarts.init(document.getElementById(id), null, {devicePixelRatio: 2.5});
            	myChart.setOption({
            		tooltip: {
            		    trigger: 'axis',
            		    show:true,
            			appendToBody:true
            		},
                 legend: {
                   data:namearr,
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
								   show: true
							   },                        
							   dataZoom: { // 选时间缩放功能
								   show: true, // show为true时，才能触发takeGlobalCursor事件
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
          },true)
      };
	  const HBChart= function (hbdata) {
            var hb = hbdata
            var datas = hbdata.yaxis;
            var timelist = hbdata.xaxis
            var option = {
                title: {
                    text: '海拔(单位：米)'
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '10%',
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    containLabel: true
                },
                legend: {
                    data: ['海拔']
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
                xAxis: {
                    type: 'category',
                    data: timelist,
                    boundaryGap: false,
                    splitLine: {
                        show: false,
                        interval: 'auto',
                        lineStyle: {
                            color: ['red']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e9e9e9'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999999',
                            fontSize: 12
                        },
                        rotate: 40,
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        lineStyle: {
                            color: ['#e9e9e9']
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#e9e9e9'
                        }
                    },
                    axisLabel: {
                        margin: 10,
                        textStyle: {
                            color: '#4d5054',
                            fontSize: 12
                        }
                    },
                },
                series: [{
                    name: '海拔',
                    type: 'line',
                    smooth: true,
                    symbolSize: 5,
                    showAllSymbol: true,
                    data: datas,
                    itemStyle: {
                        normal: {
                            color: 'green'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: 2
                        }
                    }
                }]
            };
            var chartHB = echarts.init(document.getElementById("charttwofive"));
            chartHB.setOption(option, true);
            window.addEventListener("resize", function () {
                chartHB.resize();
            });
        }
	  
	  const SDChart= function (hbdata) {
	        var hb = hbdata
	        var datas = hbdata.yaxis;
	        var timelist = hbdata.xaxis
	        var option = {
	            title: {
	               text: '速度（km/h）'
	            },
	            tooltip: {
	                trigger: 'axis'
	            },
	            grid: {
	                top: '10%',
	                left: '3%',
	                right: '4%',
	                bottom: '20%',
	                containLabel: true
	            },
	            legend: {
	               data: ['速度']
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
	            xAxis: {
	                type: 'category',
	                data: timelist,
	                boundaryGap: false,
	                splitLine: {
	                    show: false,
	                    interval: 'auto',
	                    lineStyle: {
	                        color: ['red']
	                    }
	                },
	                axisTick: {
	                    show: false
	                },
	                axisLine: {
	                    lineStyle: {
	                        color: '#e9e9e9'
	                    }
	                },
	                axisLabel: {
	                    textStyle: {
	                        color: '#999999',
	                        fontSize: 12
	                    },
	                    rotate: 40,
	                }
	            },
	            yAxis: {
	                type: 'value',
	                splitLine: {
	                    lineStyle: {
	                        color: ['#e9e9e9']
	                    }
	                },
	                axisTick: {
	                    show: false
	                },
	                axisLine: {
	                    lineStyle: {
	                        color: '#e9e9e9'
	                    }
	                },
	                axisLabel: {
	                    margin: 10,
	                    textStyle: {
	                        color: '#4d5054',
	                        fontSize: 12
	                    }
	                },
	            },
	            series: [{
	                name: '海拔',
	                type: 'line',
	                smooth: true,
	                symbolSize: 5,
	                showAllSymbol: true,
	                data: datas,
	                itemStyle: {
	                    normal: {
	                        color: '#447a96'
	                    }
	                },
	                lineStyle: {
	                    normal: {
	                        width: 2
	                    }
	                }
	            }]
	        };
	        var chartHB = echarts.init(document.getElementById("charttwosix"));
	        chartHB.setOption(option, true);
	        window.addEventListener("resize", function () {
	            chartHB.resize();
	        });
	    }
	  
	  
	  
	  
	  
	  
	  // 监听echarts的dilog
	 dilogs.$subscribe((mutation, state) => {
		 if(state.echartstwo){
			 setTimeout(function (){
				 checkedCities.value.push(props.echartclickinfo)
				getLits()
			  },500)
		 }else{
			 checkedCities.value=[]
			 speedShow.value=1
			 altitudeShow.value=1
		 }
	 })
	 
	 onMounted(()=>{
		 let b=24*60*60*1000   //一天的时间
		 let day = new Date();  //当天的时间
		 timepcker.value=[parseTime(day.getTime()-b,'{y}-{m}-{d} {h}:{i}:{s}'),parseTime(day,'{y}-{m}-{d} {h}:{i}:{s}')]
	 })
</script>

<style scoped>
  .con{
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #f0f1f6;
	height: 750px;
	overflow-y: scroll;
  }
  .con .con-left{
    width: 240px;
    background-color: white;
  }
  .con .con-right{
    width:calc(100% - 250px);
     background-color: white;
     height: 750px;
  }
  :deep(.el-date-editor--daterange.el-input__inner){
    width: 95% !important;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .con-right h3{
    font-size: 20px;
    font-weight: 800;
    text-align: center;
  }
  :deep( .el-date-editor.el-input__wrapper){
	  width: 98%;
	  margin: 15px 0;
  }
  .carinfo p{
	  line-height: 34px;
  }
  .el-checkbox-group{
	  display: flex;
	  flex-wrap: wrap;
	  
  }
   .el-checkbox-group .el-checkbox--default{
	  width: 100%;
  }
 .el-dialog__body{
		height: 500px;
		overflow-y:scroll;
	}
</style>
