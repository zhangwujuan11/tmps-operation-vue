<template>
	<div style="width: 100%;height: 100%;">
		<div style="width: 100%;position: fixed;top:15px;left: 0;z-index: 99;">
			<p style="width: 100%;display: flex;justify-content: space-around;align-items: center;">
				<el-date-picker
				v-model="time[0]"
				type="datetime"
				placeholder="开始时间"
				format="YYYY/MM/DD HH:mm:ss"
				value-format="x"
				/>
				至
				<el-date-picker
				v-model="time[1]"
				type="datetime"
				placeholder="结束时间"
				format="YYYY/MM/DD HH:mm:ss"
				value-format="x"
			  />
			  <!-- <el-date-picker
			    v-model="time"
			   type="datetimerange"
			  start-placeholder="开始日期"
			  end-placeholder="结束日期"
			   format="YYYY/MM/DD HH:mm:ss"
			   value-format="x"
			  /> -->
			  <el-button  type="primary" style="margin-left:10px;" @click="isShowMarker()">查询</el-button>
			</p>
		</div>
		<div id="mapContainer">
		</div>
	</div>
</template>

<script setup lang="ts">
	import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
	import { useRoute } from 'vue-router';
	import { ElMessage } from 'element-plus'
	import { ref, onBeforeUnmount, onMounted } from 'vue';
	import { parseTime } from '@/utils/ruoyi'
	import carImg from '@/assets/images/caricon.png'
	import zwjtest from '@/assets/images/zwjtest.png'
	import gos from '@/assets/images/GPSPoint2.png'
	import { gpsguijiapp, gpsguijiapplast } from '@/api/front'
	const map=ref('')
	const amap=ref('')
	const time=ref([])
	const idss=ref('')
	const carid=ref('')
	const lastpo=ref({})
	// 构建自定义信息窗体
		const createInfoWindow=function (title, content) {
		    var info = document.createElement("div");
		    info.className = "info";
		    //可以通过下面的方式修改自定义窗体的宽高
		    info.style.width = "230px";
		    // 定义顶部标题
		    var top = document.createElement("div");
		    var titleD = document.createElement("div");
		    var closeX = document.createElement("img");
		    top.appendChild(titleD);
		    top.appendChild(closeX);
		    info.appendChild(top);
		    // 定义中部内容
		    var middle = document.createElement("div");
		    middle.className = "info-middle";
		    middle.style.backgroundColor = 'white';
		    middle.innerHTML = content;
		    info.appendChild(middle);
		    // 定义底部内容
		    var bottom = document.createElement("div");
		    bottom.className = "info-bottom";
		    bottom.style.position = 'relative';
		    bottom.style.top = '0px';
		    bottom.style.margin = '0 auto';
		    info.appendChild(bottom);
		    return info;
		}
		const closeInfoWindow=function(){
			 map.value.clearInfoWindow();
		}
	const logistics = ref([])
	const ineArr=ref([])
	function getlist(){
		gpsguijiapp({
			vehicleId:carid.value,
			startTime:time.value[0],
			endTime:time.value[1]
		},idss.value).then(res=>{
			console.log(res)
			logistics.value=res.data.data.items
			ineArr.value = [logistics.value.map((item) => [item.longitude,item.latitude])]
		})
	}
	let geodemap =function(){
			AMapLoader.load({
				key: 'b0eec50e68fd0b9b5eaab31a161ddb05',
				version: '2.0',
				plugins: [ "AMap.ToolBar", "AMap.MapType", "AMap.Driving",'AMap.MoveAnimation', 'AMap.RangingTool'],
				AMapUI: {
				  version: "1.1",
				  plugins: []
				},
				Loca: {
				  version: "2.0.0"
				}
			}).then((AMap) => {
				gpsguijiapplast(carid.value,idss.value).then(res=>{
					lastpo.value=res.data.data
				amap.value = AMap
				 map.value = new AMap.Map('mapContainer', {
					center: [lastpo.value.longitude, lastpo.value.latitude] ||  [119.28, 26.08],
					zoom: 17, //这个越大 地图越大 看的地图详细
					resizeEnable: true,
				})
			var srtm =	new AMap.Marker({
					map: map.value,
					position: [lastpo.value.longitude,lastpo.value.latitude],
					icon: gos,
					autoRotation: true,
				});
				
				srtm.on('click', (e) => {
					let infodata = lastpo.value
				   const infoWindow = new amap.value.InfoWindow({
					content: createInfoWindow(
						'<span style="font-size:14px;color:#F00;">定制公交分公司</span>',
						"组织：" + infodata.fleetName + "<br/>" +
						"车牌号：" + infodata.vehicleNo + "<br/>" +
						"设备ID：" + infodata.deviceId + "<br/>电源：" + infodata.gpsPowerTypeDesc + "<br/>掉电状态：" + infodata.gpsPowerStateDesc + "<br/>GPS日期：" + parseTime(infodata.gpsReportDate) ),
					offset: new amap.value.Pixel(16, -30)
				   });
					infoWindow.open(map.value, e.target.getPosition())
				})
			})
		})
	} 
	
	
	const loadingInterval=ref(null) //
	function showmarke (){
		const markers=ref([]) // 存储标记点位
		const markerIndex=ref(0) //
		const batchSize=ref(50) //
		
		const loadBatchMarkers = () => {
			const batchMarkers = [];
			for (let i = markerIndex.value; i < markerIndex.value + batchSize.value && i < ineArr.value[0].length; i++) {
			        const marker = new amap.value.Marker({
			          position: ineArr.value[0][i],
			          offset: new amap.value.Pixel(-8, 0),
					  icon:zwjtest,
			          map: map.value,
			          autoRotation: true,
			          extData:logistics.value[i]
			        });
					batchMarkers.push(marker);
				marker.on('click', (e) => {
					let infodata = e.target._originOpts.extData
				   const infoWindow = new amap.value.InfoWindow({
					content: createInfoWindow(
						'<span style="font-size:14px;color:#F00;">定制公交分公司</span>',
						"组织：" + infodata.fleetName + "<br/>" +
						"车牌号：" + infodata.vehicleNo + "<br/>" +
						"设备ID：" + infodata.deviceId + "<br/>电源：" + infodata.gpsPowerTypeDesc + "<br/>掉电状态：" + infodata.gpsPowerStateDesc + "<br/>GPS日期：" + parseTime(infodata.gpsReportDate) ),
					offset: new amap.value.Pixel(16, -30)
				   });
					infoWindow.open(map.value, e.target.getPosition())
				})
			}
			for (const marker of batchMarkers) {
			        marker.setMap(map.value);
			      }
			 markers.value = [...markers.value, ...batchMarkers];
			// 更新当前加载的标记索引
			      markerIndex.value += batchSize.value;
			      // 停止定时加载，当加载完所有标记时
			      if ( markerIndex.value >= ineArr.value[0].length) {
			        clearInterval(loadingInterval);
			      }
			}
		
		
		let srartmark = new amap.value.Marker({
			icon: carImg,
			position: ineArr.value[0][0],
			map: map.value
		});
		srartmark.moveAlong(ineArr.value[0], {
			duration: 80,
			autoRotation: false,
		})
		let polyline = new amap.value.Polyline({
			map: map.value,
			path: ineArr.value[0],
			strokeColor:"#28F", 
			showDir:true,
			strokeWeight: 6, //线宽
		})
		 map.value.setFitView() 
		  loadBatchMarkers();
		  loadingInterval.value = setInterval(loadBatchMarkers, 2000); // 每2秒加载一批标记
		}
		
	
	
	
	
	// 查询额
	function isShowMarker() {
		var d1 = time.value[0]
		var d2 = time.value[1]
		if (d1 > d2) {
			ElMessage.error("温馨提示开始时间不能大于结束时间！");
			return false;
		}else{
			gpsguijiapp({
				vehicleId:carid.value,
				startTime:time.value[0],
				endTime:time.value[1]
			},idss.value).then(res=>{
				logistics.value=res.data.data.items
				ineArr.value = [logistics.value.map((item) => [item.longitude,item.latitude])] 
				if(res.data.data.items.length == 0){
					ElMessage.error("此时间段无车辆信息")
				}else{
					map.value.clearMap();
					showmarke()
				}
			})
		}
		
	}
	
	// // 监听高德地图的dilog
	// dilogs.$subscribe((mutation, state) => {
	// 	if (state.gaode) {
	// 		let day = new Date();  //当天的时间
	// 		let times=new Date(new Date().setHours(0,0,0,0)-0*24*60*60*1000)
	// 		time.value=[times.getTime(),day.getTime()]
	// 		setTimeout(geodemap(),500)
	// 	}
	// })
	
	  onBeforeUnmount(() => {
	      // 在组件销毁前清除定时器
	      if (loadingInterval.value) {
	        clearInterval(loadingInterval.value);
	      }
	    });
		onMounted(()=>{
			let day = new Date();  //当天的时间
			let times=new Date(new Date().setHours(0,0,0,0)-0*24*60*60*1000)
			time.value=[times.getTime(),day.getTime()]
			const route = useRoute();
			idss.value = route.query.id;
			carid.value=route.query.carid
			localStorage.setItem('token',route.query.id)
			// var d1 = new Date(times.value[0].replace(/\-/g, "\/"));
			// var d2 = new Date(times.value[1].replace(/\-/g, "\/"));
			// console.log(d1, d2)
			setTimeout(geodemap(),1000)
		})
</script>

<style scoped>
	#mapContainer {
		width: 100%;
		height: 90vh;
	}
	:deep(.el-dialog:not(.is-fullscreen)) {
		margin-top: 0vh !important;
	}
	.el-dialog__body{
		padding-top: 0;
	}
	:deep(.el-input__inner) {
		width: 120px !important;
	}
</style>