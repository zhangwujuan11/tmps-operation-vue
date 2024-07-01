<template>
	<div class="app-container">
		<div class="float-left">
			<el-form>
				<div class="chooselist">
					<h4 style="margin-bottom: 12px;">
						<img src="@/assets/images/index_icon5.png" alt="">
						请选择车辆
					</h4>
					<el-form-item>
						<el-radio-group v-model="ruleForm.versionType" @change="getList">
							<el-radio :label="5002" border>硬件版</el-radio>
							<el-radio :label="5001" border>纯软件版</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<!-- <el-select
						 @change="getList"
						placeholder="请输入组织名称" 
						v-model="ruleForm.fleetId"
						filterable
						:clearable="true"
						:loading="loading"
						>
						  <el-option :label="item.teamName" :value="Number(item.fleetId) " v-for="(item,index) in carcompanydata" :key="index" />
						</el-select> -->
						   <el-tree-select
						    :default-expand-all="true"
						      v-model="ruleForm.fleetId"
						      :data="deptOptions"
						      :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
						      value-key="deptId"
						      placeholder="选择组织"
						      check-strictly
							  @node-click="changelist"
						   />
					</el-form-item>
					<el-form-item label="" prop="mfteTitle">
						<el-select
						 @change="getList"
						 no-data-text="暂无数据"
						placeholder="请输入车牌号" 
						v-model="ruleForm.carNumber"
						:clearable="true"
						filterable
						>
						  <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select  
						v-model="ruleForm.monitorStatus" 
						 @change="getList"
						clearable 
						placeholder="请输入车辆状态" >
							<el-option label="全部" value="" />
						   <el-option
						      v-for="dict in alarm_type"
						      :key="dict.value"
						      :label="dict.label"
						      :value="dict.value"
						   />
						</el-select>
					</el-form-item>
				</div>
			</el-form>
			<ul class="datalist">
				<li v-for="(itme,index) in lidatas" :key="index"  @click="getpicture(itme.vehicle,index)" :class='itme.vehicle==carid?"selected":""'>
					<span>{{itme.carNumber}}</span>
					<img v-if="itme.alarmType == 10000" src="@/assets/images/tyjk1.png" alt="">
					<img v-else-if="itme.alarmType == 10501" src="@/assets/images/tyjk_img2.png" alt="">
					<img v-else-if="itme.alarmType == 10401" src="@/assets/images/dcdy.png" alt="" style="height: 18px;">
					<img v-else src="@/assets/images/tyjk_img3.png" alt="">
				</li>
			</ul>
			<pagination 
			v-show="total>0" 
			:total="total" 
			background 
			:pager-count='5' 
			v-model:page="ruleForm.pageNum"
			v-model:limit="ruleForm.pageSize"
			@pagination="getList"
			layout="prev, pager, next" />
		</div>
		<div class="float-center">
			<h4>车牌号：{{carclickinfo.vehicleNo}} &emsp;&emsp;累计里程：{{carclickinfo.distance}}km</h4>
		<div class="luntai">
			<!-- 主车 -->
			<div v-if="maincarbox">
				<div class="luntop" v-for="(item,index) in maincardata"  :key="index">
					<!-- <div v-for="(tireleft) in item.leftTireCode" :key="tireleft.deviceNumber" class="baiban" :class="[tireleft.infodata == null ?'baiban' :'' , tireleft.infodata.alarmLevel == 3001 ?'lunbox3' :'' ,tireleft.infodata.alarmLevel == 1004 ?'lunbox' :'']"></div> -->
					<div  v-for="(tireleft) in item.leftTireCode" :key="tireleft.deviceNumber" >
						<div class="baiban" v-if="tireleft.infodata == null"></div>
						<div class="lunbox" v-else-if="tireleft.infodata.alarmLevel==10000" @click="windowshowdetail(tireleft.infodata.tireId,tireleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireleft.infodata.pressure">{{(tireleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireleft.infodata.pressure">--</span>
								<span v-if="tireleft.infodata.temperature">{{tireleft.infodata.temperature}}</span>
								<span v-if="!tireleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tireleft.infodata.coldPressure">冷{{tireleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireleft.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
						<div class="lunbox2" v-else-if="tireleft.infodata.alarmLevel==10501" @click="windowshowdetail(tireleft.infodata.tireId,tireleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireleft.infodata.pressure">{{(tireleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireleft.infodata.pressure">--</span>
								<span v-if="tireleft.infodata.temperature">{{tireleft.infodata.temperature}}</span>
								<span v-if="!tireleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tireleft.infodata.coldPressure">冷{{tireleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireleft.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
						<div class="lunbox3"  v-else  @click="windowshowdetail(tireleft.infodata.tireId,tireleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireleft.infodata.pressure">{{(tireleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireleft.infodata.pressure">--</span>
								<span v-if="tireleft.infodata.temperature">{{tireleft.infodata.temperature}}</span>
								<span v-if="!tireleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tireleft.infodata.coldPressure">冷{{tireleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireleft.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
					</div>
					<!-- <div  v-for="(tireleft) in item.leftTireCode" :key="tireleft.deviceNumber" class="lunbox2" v-if="tireleft.infodata && tireleft.infodata.alarmLevel == 3001"></div>
					<div  v-for="(tireleft) in item.leftTireCode" :key="tireleft.deviceNumber" class="lunbox3" v-if="tireleft.infodata && (tireleft.infodata.alarmLevel != 3001 ||tireleft.infodata.alarmLevel!=1000) "></div> -->
					<img v-if="item.axisNumber !=0 " style="width: 100px;height: 14px;" src="@/assets/images/tyjk_lt_zhou.png">
					<div  v-for="(tireright) in item.rightTireCode" :key="tireright.deviceNumber" >
						<div class="baiban" v-if="tireright.infodata == null"></div>
						<div class="lunbox" v-else-if="tireright.infodata.alarmLevel==10000" 
						 @click="windowshowdetail(tireright.infodata.tireId,tireright.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireright.infodata.pressure">{{(tireright.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireright.infodata.pressure">--</span>
								<span v-if="tireright.infodata.temperature">{{tireright.infodata.temperature}}</span>
								<span v-if="!tireright.infodata.temperature">--</span>
								<span class="greefont" v-if="tireright.infodata.coldPressure">冷{{tireright.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireright.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
						<div class="lunbox2" v-else-if="tireright.infodata.alarmLevel==10501"
						 @click="windowshowdetail(tireright.infodata.tireId,tireright.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireright.infodata.pressure">{{(tireright.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireright.infodata.pressure">--</span>
								<span v-if="tireright.infodata.temperature">{{tireright.infodata.temperature}}</span>
								<span v-if="!tireright.infodata.temperature">--</span>
								<span class="greefont" v-if="tireright.infodata.coldPressure">冷{{tireright.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireright.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
						<div class="lunbox3"  v-else
						 @click="windowshowdetail(tireright.infodata.tireId,tireright.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tireright.infodata.pressure">{{(tireright.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tireright.infodata.pressure">--</span>
								<span v-if="tireright.infodata.temperature">{{tireright.infodata.temperature}}</span>
								<span v-if="!tireright.infodata.temperature">--</span>
								<span class="greefont" v-if="tireright.infodata.coldPressure">冷{{tireright.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tireright.infodata.coldPressure">冷0.0</span>
							</div>
						</div>
					</div>
					<div v-if="item.axisNumber == 0 " style="display: flex;justify-content: center;width: 100%;">
						<div v-for="(its) in item.spareTireCode" :key="its.deviceNumber" style="margin: 0 20px;">
							<div v-if="its.infodata != null">
								<div class="lunbox down" v-if="its.infodata.alarmLevel==10000"
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
								<div class="lunbox2 down" v-else-if="its.infodata.alarmLevel==10501"
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
								<div class="lunbox3 down"  v-else
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
			<!-- 挂车 -->
			<div v-if="trailcarbox">
				<div class="luntop" v-for="(items,index) in trailcardata"  :key="index">
					<div v-for="(tiresleft) in items.leftTireCode" :key="tiresleft.deviceNumber">
						<div class="baiban" v-if="tiresleft.infodata == null"></div>
						<div class="lunbox" v-else-if="tiresleft.infodata.alarmLevel==10000"
						 @click="windowshowdetail(tiresleft.infodata.tireId,tiresleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tiresleft.infodata.pressure">{{(tiresleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tiresleft.infodata.pressure">--</span>
								<span v-if="tiresleft.infodata.temperature">{{tiresleft.infodata.temperature}}</span>
								<span v-if="!tiresleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tiresleft.infodata.coldPressure">冷{{tiresleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tiresleft.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
						<div class="lunbox2" v-else-if="tiresleft.infodata.alarmLevel==10501"
						 @click="windowshowdetail(tiresleft.infodata.tireId,tiresleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tiresleft.infodata.pressure">{{(tiresleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tiresleft.infodata.pressure">--</span>
								<span v-if="tiresleft.infodata.temperature">{{tiresleft.infodata.temperature}}</span>
								<span v-if="!tiresleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tiresleft.infodata.coldPressure">冷{{tiresleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tiresleft.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
						<div class="lunbox3" v-else
						 @click="windowshowdetail(tiresleft.infodata.tireId,tiresleft.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tiresleft.infodata.pressure">{{(tiresleft.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tiresleft.infodata.pressure">--</span>
								<span v-if="tiresleft.infodata.temperature">{{tiresleft.infodata.temperature}}</span>
								<span v-if="!tiresleft.infodata.temperature">--</span>
								<span class="greefont" v-if="tiresleft.infodata.coldPressure">冷{{tiresleft.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tiresleft.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
					</div>
					<img v-if="items.axisNumber !=0 " style="width: 100px;height: 14px;" src="@/assets/images/tyjk_lt_zhou.png">
					<div  v-for="(tirersight) in items.rightTireCode" :key="tirersight.deviceNumber">
						<div class="baiban" v-if="tirersight.infodata == null"></div>
						<div class="lunbox" v-else-if="tirersight.infodata.alarmLevel==10000"
						 @click="windowshowdetail(tirersight.infodata.tireId,tirersight.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tirersight.infodata.pressure">{{(tirersight.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tirersight.infodata.pressure">--</span>
								<span v-if="tirersight.infodata.temperature">{{tirersight.infodata.temperature}}</span>
								<span v-if="!tirersight.infodata.temperature">--</span>
								<span class="greefont" v-if="tirersight.infodata.coldPressure">冷{{tirersight.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tirersight.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
						<div class="lunbox2" v-else-if="tirersight.infodata.alarmLevel==10501"
						 @click="windowshowdetail(tirersight.infodata.tireId,tirersight.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tirersight.infodata.pressure">{{(tirersight.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tirersight.infodata.pressure">--</span>
								<span v-if="tirersight.infodata.temperature">{{tirersight.infodata.temperature}}</span>
								<span v-if="!tirersight.infodata.temperature">--</span>
								<span class="greefont" v-if="tirersight.infodata.coldPressure">冷{{tirersight.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tirersight.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
						<div class="lunbox3"  v-else
						 @click="windowshowdetail(tirersight.infodata.tireId,tirersight.infodata.tirePosition )">
							<div class="decs">
								<span v-if="tirersight.infodata.pressure">{{(tirersight.infodata.pressure).toFixed(2)}}</span>
								<span v-if="!tirersight.infodata.pressure">--</span>
								<span v-if="tirersight.infodata.temperature">{{tirersight.infodata.temperature}}</span>
								<span v-if="!tirersight.infodata.temperature">--</span>
								<span class="greefont" v-if="tirersight.infodata.coldPressure">冷{{tirersight.infodata.coldPressure}}</span>
								<span class="greefont" v-if="!tirersight.infodata.coldPressure">冷0.00</span>
							</div>
						</div>
					</div>
					
					
					<div v-if="items.axisNumber == 0 " style="display: flex;justify-content: center;width: 100%;">
						<div v-for="(its) in items.spareTireCode" :key="its.deviceNumber"  style="margin: 0 20px;">
							<div v-if="its.infodata != null">
								<div class="lunbox down" v-if="its.infodata.alarmLevel==10000"
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
								<div class="lunbox2 down" v-else-if="its.infodata.alarmLevel==10501"
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
								<div class="lunbox3 down"  v-else
								 @click="windowshowdetail(its.infodata.tireId,its.infodata.tirePosition )">
									<div class="decs">
										<span v-if="its.infodata.pressure">{{(its.infodata.pressure).toFixed(2)}}</span>
										<span v-if="!its.infodata.pressure">--</span>
										<span v-if="its.infodata.temperature">{{its.infodata.temperature}}</span>
										<span v-if="!its.infodata.temperature">--</span>
										<span class="greefont" v-if="its.infodata.coldPressure">冷{{its.infodata.coldPressure}}</span>
										<span class="greefont" v-if="!its.infodata.coldPressure">冷0.0</span>
									</div>
								</div>
							</div>
							
						</div>
					</div>
					
					
				</div>
			</div>
		</div>
		</div>
		<div class="float-right">
			<ul>
				<li class="title">设备号：{{carclickinfo.deviceId}}</li>
				<!-- <li>{{carclickinfo}}</li> -->
				<li> <Edit style="width:1.5em; height:1.5em;"></Edit> <span>{{carclickinfo.fleetName}}</span></li>
				<!-- <li> <Clock style="width:1.5em; height:1.5em;"></Clock><span>内部车牌号：NA</span></li> -->
				<!-- <li> <Position style="width:1.5em; height:1.5em;"></Position><span>线路：NA</span></li> -->
				<li> <Clock style="width:1.5em; height:1.5em;"></Clock><span>{{ parseTime(carclickinfo.gpsReportDate) || "--" }}</span></li>
				<li> <LocationInformation style="width:1.5em; height:1.5em;"></LocationInformation>{{addressinfo}}</li>
				<!-- <li> <PartlyCloudy style="width:1.5em; height:1.5em;"></PartlyCloudy><span>当地温度：23℃</span></li> -->
				<li> <MapLocation style="width:1.5em; height:1.5em;"></MapLocation><span>自动定位车辆</span></li>
			</ul>
			<p style="color: #ffa500;" @click="alarmdilogshow">
				<WarnTriangleFilled style="width: 2em; height:2em;"></WarnTriangleFilled>
				<span>警报记录</span>
			</p>
			<p style="color: #407fbd;margin: 13px 0;" @click="detaildilogShow">
				<Help style="width: 2em; height: 2em;"></Help>
				<span>轮胎信息</span>
			</p>
			<p style="color: #44b947;"  @click="gaodedilogShow">
			<MapLocation style="width: 2em; height: 2em;"></MapLocation>
			<span>GPS定位</span>
		  </p>
		  <p style="color:#84d9e0;margin-top: 10px;" @click="shuopming=true">
		  	 <Tickets style="width: 2em; height: 2em;"></Tickets>
		  	<span>报警状态说明</span>
		  </p>
		 
		  <el-dialog title="报警状态说明" v-model="shuopming" width="300" append-to-body :align-center="true"  style="margin-top: 22vh !important;">
			  <ul class="showread">
			  	<li>
					<img src="@/assets/images/tyjk1.png" alt=""> <span>轮胎车辆正常</span>
				</li>
				<li>
					<img src="@/assets/images/tyjk_img3.png" alt=""> <span>轮胎低压报警</span>
				</li>
				<li>
					<img src="@/assets/images/tyjk_img3.png" alt=""> <span>轮胎高压报警</span>
				</li>
				<li>
					<img src="@/assets/images/tyjk_img3.png" alt=""> <span>轮胎高温报警</span>
				</li>
				<li>
					<img src="@/assets/images/dcdy.png" alt="" > <span>轮胎电池电压低报警</span>
				</li>
				<li>
					<img src="@/assets/images/tyjk_img2.png" alt=""> <span>轮胎无信号报警</span>
				</li>
				<!-- <img v-else-if="itme.alarmType == 10501" src="@/assets/images/tyjk_img2.png" alt="">
				<img v-else-if="itme.alarmType == 10401" src="@/assets/images/dcdy.png" alt="">
				<img v-else src="@/assets/images/tyjk_img3.png" alt=""> -->
			  </ul>
		  </el-dialog>
		</div>

		<!-- 轮胎详情 -->
		<el-dialog title="单个轮胎监控信息" v-model="open" width="60%" append-to-body :close-on-click-modal="false">
			<div style="display: flex;justify-content: space-between;">
				<p>胎号：<span style="color: red;">{{tableData[0].tireNo}}</span></p>
				<p>当前轮位：<span style="color: red;">{{tableData[0].installPositionDesc}}</span></p>
			</div>
			
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="senderId" label="传感器ID" width="150">
					<template #default="scope">
							{{scope.row.senderId}}【{{scope.row.senderTypeDesc}}】
					</template>
				</el-table-column>
				<el-table-column prop="tireBrandName" label="品牌">
				</el-table-column>
				<el-table-column prop="depth" label="新胎花纹深度(mm)">
				</el-table-column>
				<el-table-column prop="measuredDepth" label="实测花纹深度(mm)">
				</el-table-column>
				<el-table-column prop="totalMileage" label="累计里程(km)">
				</el-table-column>
				<el-table-column prop="pressure" label="压力(bar)">
					<template #default="scope">
						<span style="color: red;">{{scope.row.pressure}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="temperature" label="温度(℃)">
					<template #default="scope">
						<span style="color: red;">{{scope.row.temperature}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="alarmLevelDesc" label="当前状态">
					<template #default="scope">
						<span style="color: red;">{{ scope.row.alarmLevelDesc.toString() }}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="installTime" label="安装时间">
					<template #default="scope">
						{{parseTime(scope.row.installTime)}}
					</template>
				</el-table-column>
				<el-table-column prop="installTime" label="胎压上报时间">
					<template #default="scope">
						{{parseTime(scope.row.reportTime)}}
					</template>
				</el-table-column>
				<el-table-column prop="specificationsName" label="规格">
				</el-table-column>
				<el-table-column prop="pattern" label="花纹型号">
				</el-table-column>
				<el-table-column prop="date" label="预测当前花纹深度(mm)">
				</el-table-column>
				<el-table-column prop="totalDuration" label="累计时长">
				</el-table-column>
				<el-table-column prop="highTemperatureThreshold" label="温度阈值">
				</el-table-column>
				<el-table-column prop="coldPressure" label="冷态气压">
				</el-table-column>
			</el-table>
			<div style="text-align: center;margin-top: 15px;" slot="footer" class="dialog-footer">
				<el-button type="warning" @click="goecharts">查看曲线</el-button>
			</div>
		</el-dialog>
		<!-- 胎压报警记录 -->
		<el-dialog title="轮胎报警记录" v-model="dilogs.alarmdilog" width="80%" append-to-body :close-on-click-modal="false">
			<Alarm :carid="carid"></Alarm>
		</el-dialog>
		<!-- 本车轮胎信息 -->
		<Detail :carid="carid" :carclickinfo="carclickinfo"></Detail>
		<!-- echart -->
		<Echarts :echartsneeddata="echartsneeddata" :echartclickinfo="echartclickinfo" :carid="carid" ></Echarts>
		<!-- 高德 -->
		<Gaode :carid="carid" :carclickinfo="carclickinfo" :lastpo="lastpo"></Gaode>
	</div>
</template>

<script setup name="Tiremonitor">
	import Alarm from "@/components/newnew/alarmdilog.vue";
	import Detail from '@/components/newnew/detail.vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import Echarts from '@/components/newnew/echarts.vue'
	import Gaode from '@/components/newnew/gaode.vue'
	import { ref, onMounted, nextTick, watch } from 'vue';
	import { dilog } from '../../store/dilog'
	import {carlistlist,gettirepicture} from '@/api/car.js'
	import {carcompanylist,vehicleNo} from '@/api/systensettings'
	import { listDept } from "@/api/system/dept";
	import { parseTime } from '@/utils/ruoyi'
	import {getalltire, getalarmlist, getcarinfo, tirestireId, echartshowinfo, alarmRecordsinfo, gpsguiji,lastpointer, readlocotion} from '@/api/front'
	const { proxy } = getCurrentInstance();
	const { alarm_type } = proxy.useDict("alarm_type");
	import { useRoute, useRouter } from "vue-router";
	const route = useRoute();
	const router = useRouter()
	const deptOptions = ref([]);
	// 车辆列表数据
	const loading=ref(false)
	const ruleForm=ref({
		versionType:5002,
		pageNum:1,
		pageSize:10
	})
	const total = ref(0);
	const lidatas=ref([])
	// const carcompanydata=ref([])//组织下拉框
	const vehicleNoo=ref([])//车牌号下拉框
	const taihao=ref(null)
	const tireinfo=ref({})
	const tableData=ref([])
	const maincarbox=ref(true)//主车盒子
	const trailcarbox=ref(true)//挂车盒子
	const maincardata=ref([])
	const trailcardata=ref([])
	const echartsneeddata=ref({})
	const carclickinfo=ref({})//当前点击车辆信息
	const carid=ref('')//当前车辆id
	const tos=ref(0)
	const shuopming=ref(false)
	const echartclickinfo=ref(null)//当前电点击的轮胎轮位
	const alarmdata=ref([])
	function getList(){
		const arr = route.query.vehicleId
		 loading.value = true
		 if(arr){
			carlistlist(ruleForm.value).then(res=>{
				// 初次加载车牌号列表后请求第一辆车子的轮胎信息
				if(res.code ==200){
					if(res.data != null){
						if(res.data.items == null){console.log("无车辆信息")}
						lidatas.value=res.data.items
						total.value=res.data.total
						getpicture(arr,0)
					}
					loading.value = false
				}else{
					ElMessage.error(res.message)
					  loading.value = false
				}
			}) 
		 }else{
			carlistlist(ruleForm.value).then(res=>{
				// 初次加载车牌号列表后请求第一辆车子的轮胎信息
				if(res.code ==200){
					if(res.data != null){
						if(res.data.items == null){console.log("无车辆信息")}
						lidatas.value=res.data.items
						total.value=res.data.total
						getpicture(lidatas.value[0].vehicle,0)
					}
					loading.value = false
				}else{
					ElMessage.error(res.message)
					  loading.value = false
				}
			}) 
		 }
		 vehicleNo({"versionType":ruleForm.value.versionType}).then(res=>{
		 	if(res.code == 200){
		 		vehicleNoo.value=res.data.items
		 	}
		 })
	}
	const addressinfo=ref('')
	// 轮位图加载
	const chenindev=ref('')
	function getpicture(data,index){
		chenindev.value = index
		carid.value=data
		lastpointer(carid.value).then(datas=>{
			let obj=[]
			if(datas.data){
				obj=[ datas.data.longitude,datas.data.latitude]
			}else{
				obj=[ 119.28 , 26.08]
			}
			
			readlocotion(obj).then(datast=>{
				addressinfo.value =datast.data.regeocode.addressComponent.province+" " + datast.data.regeocode.addressComponent.city+" " + datast.data.regeocode.addressComponent.district
			})
		})
		
		
		
		getcarinfo(data).then(yds=>{
			carclickinfo.value=yds.data
		})
		gettirepicture({id:data,tireStatus:0}).then(res=>{
			// 轮胎信息
				// 判断主挂车盒子
				if(res.data.mainList != null){
					getalltire(res.data.vehicleId,ruleForm.value.monitorStatus).then(response=>{
						let tirePositionlist=[]
						if(response.data != null){
							tirePositionlist=response.data.items
						}
						maincarbox.value=true
						let nwarr=res.data.mainList
						nwarr.map(item=>{
							if(item.axisNumber != 0){
								// item.leftTireCode.reverse()
								for (let i = 0; i < item.leftTireCode.length; i++) {
									item.leftTireCode[i].infodata=null
									for (let j = 0; j <  tirePositionlist.length; j++) {
										if(tirePositionlist[j].tirePosition== item.leftTireCode[i].positionCode){
											item.leftTireCode[i].infodata=tirePositionlist[j]
										}
								}
							 }
								// item.rightTireCode.reverse()
								for (let i = 0; i < item.rightTireCode.length; i++) {
										item.rightTireCode[i].infodata=null
										for (let j = 0; j <  tirePositionlist.length; j++) {
											if(tirePositionlist[j].tirePosition== item.rightTireCode[i].positionCode){
												item.rightTireCode[i].infodata=tirePositionlist[j]
											}
									}
								}
							}else{
								for (let i = 0; i < item.spareTireCode.length; i++) {
									item.spareTireCode[i].infodata = null
									for (let j = 0; j < tirePositionlist.length; j++) {
										if (tirePositionlist[j].tirePosition == item.spareTireCode[i].positionCode) {
											item.spareTireCode[i].infodata = tirePositionlist[j]
										}
									}
								}
							}
						})
						maincardata.value=nwarr
						})
				}else{
					maincarbox.value=false
				}
			
			
			if(res.data.trailList != null){
				getalltire(res.data.trailVehicleId).then(rest=>{
					let tirePosition =[]
					if(rest.data != null){
						tirePosition=rest.data.items
					}
					trailcarbox.value=true
					let olarr=res.data.trailList
					olarr.map(item=>{
						if(item.axisNumber != 0){
							// item.leftTireCode.reverse()
							for (let i = 0; i < item.leftTireCode.length; i++) {
								item.leftTireCode[i].infodata=null
								for (let j = 0; j < tirePosition.length; j++) {
									if(tirePosition[j].tirePosition== item.leftTireCode[i].positionCode){
										item.leftTireCode[i].infodata=tirePosition[j]
									}
							}
							}
							// item.rightTireCode.reverse()
							for (let i = 0; i < item.rightTireCode.length; i++) {
									item.rightTireCode[i].infodata=null
									for (let j = 0; j <  tirePosition.length; j++) {
										if(tirePosition[j].tirePosition== item.rightTireCode[i].positionCode){
											item.rightTireCode[i].infodata=tirePosition[j]
										}
								}
							}
						}else{
							for (let i = 0; i < item.spareTireCode.length; i++) {
								item.spareTireCode[i].infodata = null
								for (let j = 0; j < tirePosition.length; j++) {
									if (tirePosition[j].tirePosition == item.spareTireCode[i].positionCode) {
										item.spareTireCode[i].infodata = tirePosition[j]
									}
								}
							}
						}
					})
					trailcardata.value=olarr
					})
			}else{
				trailcarbox.value=false
			}
		})
	}
	
	// 轮胎详情
	const open = ref(false);
	 function windowshowdetail(i,e) {
		 echartclickinfo.value=e
		 tableData.value = []
		 tirestireId(i).then(res=>{
			 tableData.value.push(res.data)
			 open.value = true
		 })
		 echartshowinfo(carid.value).then(data=>{
			 echartsneeddata.value=data.data
		 })
	}
	
	function showclick (i){
		
	}
	watch(() => route.query,
	    (newValue) => {
		const flag= newValue.monitorStatus
		const flgcar=newValue.carNumber
	     if(flag){
	     	ruleForm.value.monitorStatus=flag 
	     }else if(flgcar){
	     	ruleForm.value.carNumber=flgcar
	     }
	     	getList()
	    },
	    { immediate: true }
	)
	
function changelist(val){
		ruleForm.value.fleetId=val.deptId
		getList()
	}	
	
	onMounted(()=>{
		const flag= route.query.monitorStatus
		const flgcar=route.query.carNumber
		
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
	
		vehicleNo({"versionType":ruleForm.value.versionType}).then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		if(flag){
			ruleForm.value.monitorStatus=flag 
		}else if(flgcar){
			ruleForm.value.carNumber=flgcar
		}
			getList()
		
	})
	
	const dilogs = dilog();

	const goecharts = function () {
		open.value = false
		dilogs.$patch({ echarts: true })
	}

	const alarmdilogshow = function () {
		dilogs.$patch({ alarmdilog: true })
	}
	const detaildilogShow = function () {
		dilogs.$patch({ detaildilog: true })
	}
	const lastpo = ref({})
const gaodedilogShow=function(){
	lastpointer(carid.value).then(res=>{
		lastpo.value=res.data
		dilogs.$patch({gaode:true})
	})
	
}


</script>
<style scoped>
	:dee(.el-radio){
		margin-right: 5px;
	}

:deep(.el-radio.is-bordered+.el-radio.is-bordered) {
		margin-left: 0;
	}
	.app-container {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
	}

	.float-left {
		/* padding-right: 20px; */
		width: 246px;
	}
	.baiban{
		background: url("../../assets/images/tire_bai.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: white;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.float-left li {
		padding: 0.8vw 0;
		border-bottom: 1px solid #e9e9e9;
		color: #606264;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
	}
	.datalist {
		margin: 13px 0 20px 0;
	}
	.datalist li{
		cursor: pointer;
	}
	.float-center {
		width: calc(100% - 495px);
		min-width: 400px;
		background-color: #f0f1f6;
	}
	.float-center h4 {
		background-color: #e1eefa;
		text-align: center;
		width: 100%;
		line-height: 48px;
		margin: 0;
	}
	.float-right {
		width: 200px;
	}
	.float-right .title {
		color: #fa7651;
		font-size: 16px;
	}
	.float-right li i {
		color: #407fbd;
		font-weight: bold;
		width: 20px;
	}
	.float-right li {
		padding: 0.8vw 0;
		border-bottom: 1px solid #e9e9e9;
		color: #606264;
		font-size: 14px;
		display: flex;
		align-items: center;
		padding-left: 10px;
		box-sizing: border-box;
	}
	.float-right li span{
		margin-left: 15px;
	}
	.float-right p {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		cursor: pointer;
	}
	.float-right p i {
		font-size: 32px;
	}
	.lundow,
	.luntop {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
	.greefont {
		color: green;
		position: absolute;
		margin-top:30px;
		font-size: 16px;
	}
	:deep(.pagination-container .el-pagination){
		left:0px !important;
	}
	:deep(.el-pagination.is-background .el-pager li) {
		margin: 0 2px !important;
	}
	:deep(.el-pagination){
			width: 263px;
	}
	:deep(.el-radio-group){
		display: flex;
		flex-wrap: nowrap;
	}
	.lunbox3 {
		background: url("../../assets/images/tire_bj_yz.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: white;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.lunbox {
		background: url("../../assets/images/tire_zc.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: white;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		}
	.lunbox2 {
		background: url("../../assets/images/tire_wxh.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: white;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.down{
		transform: rotate(90deg);
	}
	.decs span{
		display: block;
		min-width: 100px;
		text-align: center;
	}
	.showread li{
		line-height: 40px;
		display: flex;
		align-items: center;
		font-size: 16px;
	}
	.showread li img{
		margin-right: 15px;
		width: 22px;
	}
	.selected{
		background-color: #e1eefa;
	}
	.selected span{
		color: #407fbd;
	}
	.float-left .checkedli{
		color:#407fbd;
		border-bottom: 1px solid #407fbd;
	}
	.down{
		transform: rotate(90deg);
	}
	.down .decs{
		transform: rotate(270deg);
		margin-top: 0;
		margin-left: 0px;
	}
</style>