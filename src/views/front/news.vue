<template>
	<div>
		<div class="serbox">
			<div class="carboxt">
				<!-- <el-select placeholder="请输入组织名称" v-model="queryfrom.fleetId" filterable :clearable="true"
					@change="serchmappositiontatol">
					<el-option :label="item.teamName" :value="Number(item.fleetId) "
						v-for="(item,index) in carcompanydata" :key="index" />
				</el-select> -->
				<el-tree-select
				:default-expand-all="true"
				   v-model="queryfrom.fleetId"
				   :data="deptOptions"
				   :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
				   value-key="deptId"
				   placeholder="选择组织"
				   check-strictly
				   @node-click="serchmappositiontatol"
				/>
				<el-select placeholder="请输入车牌号" v-model="queryfrom.vehicleNo" :clearable="true" filterable
					@change="serch">
					<el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
				</el-select>
				<!-- <el-button @click="serchmap" type="primary">查询</el-button> -->
			</div>
			<div class="carbox" style="border-color: green;color: green;" @click="greencarchange">
				<img src="@/assets/images/greencar.png" alt="">
				正常车辆({{greencarlength}})
			</div>
			<div class="carbox" @click="redcarchange">
				<img src="@/assets/images/redcar.png" alt="">
				低压高温车辆({{redcarength}})
			</div>
			<div class="carbox" style="border-color: #ed920d;color: #ed920d;" @click="yellecarchange">
				<img src="@/assets/images/yelleowcar.png" alt="">
				高压车辆({{yellowcarlength}})
			</div>
			<div class="carbox" style="border-color: #515151;color: #515151;" @click="huisechange">
				<img src="@/assets/images/huisecar.png" alt="">
				无信号车辆({{huisecarlength}})
			</div>
		</div>
		<div id="mapContainer"></div>
	</div>

</template>

<script setup lang="ts" name="News">
	import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
	import { shallowRef } from '@vue/reactivity'
	import { parseTime } from '@/utils/ruoyi'
	import { ref, onMounted, nextTick } from 'vue';
	import greencars from '@/assets/images/map_zc_t.png'
	import redcars from '@/assets/images/map_bj_t.png'
	import yellowcars from '@/assets/images/map_gy_t.png'
	import huisecars from '@/assets/images/map_wxh_t.png'
	import { actionsearch, positionactiontotal } from '@/api/front'
	import { carcompanylist, vehicleNo } from '@/api/systensettings'
	import { listDept } from "@/api/system/dept";
	import { useRouter } from "vue-router";
	const router = useRouter();
	const { proxy } = getCurrentInstance();
	const queryfrom = ref({
		fleetId: '',
		vehicleNo: '',
		state: null,
	})
	const thiscardata=ref({})
	const deptOptions = ref([]);
	const vehicleNoo = ref([])//车牌号下拉框
	const greencarlength = ref(0)
	const yellowcarlength = ref(0)
	const huisecarlength = ref(0)
	const redcarength = ref(0)

	const map = ref(null);
	// 轨迹临时数据
	const greencar = ref([])
	const redcar = ref([])
	const yellowcar = ref([])
	const huisecar = ref([])
	// 
	function serchmap() {
		let obj1={
			fleetId:queryfrom.value.fleetId,
			vehicleNo: queryfrom.value.vehicleNo,
			state: 1000
		}
		let obj2={
			fleetId:queryfrom.value.fleetId,
			vehicleNo: queryfrom.value.vehicleNo,
			state: 4001
		}
		let obj3={
			fleetId:queryfrom.value.fleetId,
			vehicleNo: queryfrom.value.vehicleNo,
			state: 1002
		}
		let obj4={
			fleetId:queryfrom.value.fleetId,
			vehicleNo: queryfrom.value.vehicleNo,
			state: 3001
		}
		let arr1 = []
		let arr2 = []
		let arr3 = []
		let arr4 = []
		actionsearch(obj1).then(res => {
			arr1=res.data.items
			greencar.value = arr1
			actionsearch(obj2).then(rest => {
				arr2=rest.data.items
				redcar.value = arr2
				actionsearch(obj3).then(resth => {
					arr3=resth.data.items
					yellowcar.value = arr3
					actionsearch(obj4).then(resf => {
						arr4=resf.data.items
						huisecar.value = arr4
						if(arr1.length == 0 && arr3.length == 0 && arr4.length == 0){
							geodemap(redcar, redcars)
						}else if(arr1.length == 0 &&arr2.length == 0&& arr4.length == 0){
							geodemap(yellowcar, yellowcars)
						}else if(arr1.length == 0 &&arr2.length == 0&& arr3.length == 0){
							geodemap(huisecar, huisecars)
						}else{
							geodemap(greencar, greencars)
						}
					})
				})
			})
		})
		
		
		
		
		
		
		
	}

	// 统计栏
	function positiontatol() {
		delete queryfrom.value.state
		positionactiontotal(queryfrom.value).then(res => {
			greencarlength.value = res.data.normalCount
			yellowcarlength.value = res.data.highPressureCount
			huisecarlength.value = res.data.noSignCount
			redcarength.value = res.data.lowPressureCount
			
		})
	}
	function serchmappositiontatol(data) {
		queryfrom.value.fleetId=data.deptId
		serch()
	}
	function serch(){
		positiontatol()
		serchmap()
	}
	const closeInfoWindow = function () {
		map.value.clearInfoWindow();
	}

	let geodemap = function (data, car) {
		if (data.value.length != 0) {
			AMapLoader.load({
				key: 'b0eec50e68fd0b9b5eaab31a161ddb05',
				version: '2.0',
			}).then((AMap) => {
				// 1.使用 Amap 初始化地图
				map.value = new AMap.Map('mapContainer', {
					mapStyle: 'amap://styles/macaron',
					center: [data.value[0].longitude.toString(),data.value[0].latitude.toString()],
					zoom:7, //这个越大 地图越大 看的地图详细
				})
				let points = []
				AMap.plugin('AMap.MoveAnimation', function () {
					let ineArr = [data.value.map((item) => [item.longitude.toString(),item.latitude.toString()])]
					// 详情
					let infodata = {}
					for (var i = 0; i < ineArr[0].length; i++) {
						var marker = new AMap.Marker({
							icon: car,
							position: ineArr[0][i],
							 offset: new AMap.Pixel(-18, -18),
							map: map.value,
							autoRotation: true,
							extData: i
						});
						marker.on('click', (e) => {
							let infodata = data.value[e.target._originOpts.extData]
							thiscardata.value=infodata
							const infoWindow = new AMap.InfoWindow({
								content: createInfoWindow(
									'<span style="font-size:14px;color:#F00;">定制公交分公司</span>',
									"组织：" + infodata.fleetName + "<br/>" +
									"车牌号：" + infodata.vehicleNo + "<br/>" +
									"运行里程：" + infodata.distance + "km<br/>" +
									"设备ID：" + infodata.deviceId + "<br/>电源：" + infodata.gpsPowerTypeDesc + "<br/>掉电状态：" + infodata.gpsPowerStateDesc + "<br/>GPS日期：" + parseTime(infodata.gpsReportDate)+ "<br/>" +
									'<span style="font-size:14px;color:#2a6496;margin-top:15px;display:block;cursor: pointer;" onclick="gotimiro()">胎压监控详情>></span>'
									),
								 offset: {x:5,y: -5}
							});
							infoWindow.open(map.value, e.target.getPosition())
						})
						let obj = {}
						obj.lnglat = ineArr[0][i]
						obj.extData = data.value[i]
						points.push(obj);
					}
				})



				// 聚合点
				// 自定义聚合点样式
				function _renderClusterMarker(context) {
					context.marker.setIcon(new AMap.Icon({ image: '#' }));
					context.marker.setLabel({
						content: `<span style="transform: rotate(-34deg);cursor: pointer;background: transparent;display: block;width: 44px;height: 25px;text-align: center;line-height: 25px;">${context.count}</span>`,
						direction: 'center',
						offset: new AMap.Pixel(-3, -13),
						textColor: "#fff",
					})
					context.marker.on('click', function (e) {
						map.value.setZoomAndCenter(14, e.target._position);
					});
				}
				AMap.plugin('AMap.MarkerClusterer', function () {
					new AMap.MarkerClusterer(map.value, points, {
						renderClusterMarker: _renderClusterMarker,
						clusterByZoomChange: true,
						gridSize: 60,
						renderMarker: (context : any) => {
							context.marker.setAnchor('bottom-center');
							context.marker.setOffset(new AMap.Pixel(0, 0));
							context.marker.setIcon(new AMap.Icon({ image: '#' }));
							context.marker.setLabel({
								content: `<span style="background-color: blue;padding: 3px;">${context.data[0].extData.vehicleNo} <span/>`,
								direction: 'center',
								offset: new AMap.Pixel(8,48),
							})
						}
					})
				})
			})
		} else {
			AMapLoader.load({
				key: 'b0eec50e68fd0b9b5eaab31a161ddb05',
				version: '2.0',
			}).then((AMap) => {
				// 1.使用 Amap 初始化地图
				map.value = new AMap.Map('mapContainer', {
					mapStyle: 'amap://styles/macaron',
					center: [119.28, 26.08],
					zoom: 7, //这个越大 地图越大 看的地图详细
				})
			})

		}

	}
	// 低温高压车辆
	const redcarchange = function () {
		geodemap(redcar, redcars)
	}
	// 正常压车辆
	const greencarchange = function () {
		geodemap(greencar, greencars)
	}
	// 高压车辆
	const yellecarchange = function () {
		geodemap(yellowcar, yellowcars)
	}
	// 无信号车辆
	const huisechange = function () {
		geodemap(huisecar, huisecars)
	}
	
	onMounted(() => {
		serchmap()
		positiontatol()
		// 组织数据
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		vehicleNo().then(res => {
			if (res.code == 200) {
				vehicleNoo.value = res.data.items
			}
		})
		 window.gotimiro =function gotimiro(e){
			 router.push({
			 	path: '/front/tiremonitor',
			 	query: {
			 		carNumber:thiscardata.value.vehicleNo
			 	}
			 })
		}
	})



	// 构建自定义信息窗体
	const createInfoWindow = function (title, content) {
		var info = document.createElement("div");
		info.className = "info";
		//可以通过下面的方式修改自定义窗体的宽高
		info.style.width = "250px";
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
		middle.style.fontSize = "14px"
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
</script>

<style>
	#mapContainer {
		width: 100%;
		height: 80vh;
	}

	:deep(.el-dialog:not(.is-fullscreen)) {
		margin-top: 0vh !important;
	}

	.serbox {
		width: 100%;
		background-color: white;
		height: 9vh;
		display: flex;
		justify-content: space-around;
	}

	.serbox .carbox {
		width: 18%;
		border: 1px solid red;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: red;
	}

	.serbox .carbox img {
		width: 30px;
	}

	.serbox .carboxt {
		padding: 0 8px;
		width: 18%;
		display: flex;
		flex-wrap: wrap;
	}

	.amap-marker-label {
		border: none;
		background-color: transparent;
		color: white;
	}
</style>