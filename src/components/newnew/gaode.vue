<template>
	<el-dialog title="轨迹回放" v-model="dilogs.gaode" width="99%" class="new-dialog" append-to-body>
		<div style="display: flex;align-items: center;">
			<span style="margin-right: 10px;">当前车牌号:{{props.carclickinfo.vehicleNo}}</span>
			<p>
				 <!-- <button id="btn">开始动画</button> -->
				<el-date-picker
				  v-model="time"
				 type="datetimerange"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				 format="YYYY/MM/DD HH:mm:ss"
				 value-format="x"
				/>
			</p>
			<el-button  type="primary" style="margin-left:10px;" @click="isShowMarker()">查询</el-button>
			<el-button  type="primary" @click="serbar">测距</el-button>
			<el-button @click="exportdata">导出Excel</el-button>
		</div>
		<div id="mapContainer">
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
	import { dilog } from '../../store/dilog'
	import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
	// import { onMounted } from '@vue/runtime-core'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { ref, onBeforeUnmount } from 'vue';
	import { parseTime } from '@/utils/ruoyi'
	import carImg from '@/assets/images/caricon.png'
	import zwjtest from '@/assets/images/zwjtest.png'
	import gos from '@/assets/images/GPSPoint2.png'
	import { gpsguiji, gpsporintexport } from '@/api/front'
	const dilogs = dilog();
	const map=ref('')
	const amap=ref('')
	const time=ref([])
	const props = defineProps({
	    carid: {
	        type: String,
	        default:''
	    },
		carclickinfo:{
			type: Object,
			default:{}
		},
		lastpo:{
			type: Object,
			default:{}
		}
	})
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
	const ruler1=ref('')
	const logistics = ref([])
	const ineArr=ref([])
	function getlist(){
		gpsguiji({
			vehicleId:props.carid,
			startTime:time.value[0],
			endTime:time.value[1]
		}).then(res=>{
			logistics.value=res.data.items
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
			amap.value = AMap
			 map.value = new AMap.Map('mapContainer', {
				center: [props.lastpo.longitude, props.lastpo.latitude] ||  [119.28, 26.08],
				zoom: 17, //这个越大 地图越大 看的地图详细
				resizeEnable: true,
			})
			//工具加载
			map.value.addControl(new AMap.MapType());
			ruler1.value = new AMap.RangingTool(map.value);
			
			
		var srtm =	new AMap.Marker({
				map: map.value,
				position: [props.lastpo.longitude, props.lastpo.latitude],
				icon: gos,
				autoRotation: true,
			});
			
			srtm.on('click', (e) => {
				let infodata = props.lastpo
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
		
	
	
	function serbar (){
		ruler1.value.turnOn();
			 
	}
	
	
	
	
	// 查询额
	function isShowMarker() {
		gpsguiji({
			vehicleId:props.carid,
			startTime:time.value[0],
			endTime:time.value[1]
		}).then(res=>{
			logistics.value=res.data.items
			ineArr.value = [logistics.value.map((item) => [item.longitude,item.latitude])]
			if(res.data.items.length == 0){
				ElMessage.error("此时间段无车辆信息")
			}else{
				map.value.clearMap();
				showmarke()
			}
		})
	}
	
	
	// 导出
	function exportdata(){
		gpsporintexport({
			vehicleId:props.carid,
			startTime:time.value[0],
			endTime:time.value[1]
		}).then(res=>{
			 downloadFiles(res)
		})
	}
	
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "GPS定位数据.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "GPS定位数据.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "GPS定位数据.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	// 监听高德地图的dilog
	dilogs.$subscribe((mutation, state) => {
		if (state.gaode) {
			let day = new Date();  //当天的时间
			let times=new Date(new Date().setHours(0,0,0,0)-0*24*60*60*1000)
			time.value=[times.getTime(),day.getTime()]
			// gpsguiji({
			// 	vehicleId:props.carid,
			// 	startTime:time.value[0],
			// 	endTime:time.value[1]
			// }).then(res=>{
			// 	logistics.value=res.data.items
			// 	ineArr.value = [logistics.value.map((item) => [item.longitude,item.latitude])]
			// 	setTimeout(geodemap(),500)
			// })
			setTimeout(geodemap(),500)
		}
	})
	
	  onBeforeUnmount(() => {
	      // 在组件销毁前清除定时器
	      if (loadingInterval.value) {
	        clearInterval(loadingInterval.value);
	      }
	    });

</script>

<style>
	#mapContainer {
		width: 100%;
		height: 80vh;
	}
	:deep(.el-dialog:not(.is-fullscreen)) {
		margin-top: 0vh !important;
	}
	.el-dialog__body{
		padding-top: 0;
	}
</style>