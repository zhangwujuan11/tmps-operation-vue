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
						<!-- <el-select @change="getList" placeholder="请输入组织名称" v-model="ruleForm.fleetId" filterable
							:clearable="true" :loading="loading">
							<el-option :label="item.teamName" :value="Number(item.fleetId) "
								v-for="(item,index) in carcompanydata" :key="index" />
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
						<el-select @change="getList" placeholder="请输入车牌号" v-model="ruleForm.carNumber" :clearable="true"
							filterable :loading="loading">
							<el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-select v-model="ruleForm.monitorStatus" @change="getList" clearable placeholder="请输入车辆状态">
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
				<li v-for="(itme,index) in lidatas" :class="chenindev == index? 'checkedli':''" :key="index" @click="getpicture(itme.vehicle,index)"
					style="cursor: pointer;">
					<span>{{itme.carNumber}}</span>
					<img v-if="itme.alarmType == 10000" src="@/assets/images/tyjk1.png" alt="">
					<img v-else-if="itme.alarmType == 10501" src="@/assets/images/tyjk_img2.png" alt="">
					<img v-else src="@/assets/images/tyjk_img3.png" alt="">
				</li>
			</ul>
			<pagination v-show="total>0" :total="total" background :pager-count='5' v-model:page="ruleForm.pageNum"
				v-model:limit="ruleForm.pageSize" @pagination="getList" layout="prev, pager, next" />
		</div>
		<div class="float-center">
			<h4>
				<span>【轮胎拆装】</span>
				<span>
					车牌号：{{carinfoshow.vehicleNo}}
				</span>
				<span>
					设备号：{{carinfoshow.deviceId}}
				</span>
				<span>
					系统版本：{{ systemVersion(carinfoshow.systemVersion) }}
				</span>
				<p style="font-size: 14px;">说明：<span style="background-color: #156dc3;color: #156dc3;margin: 0 4px;">123</span>轮胎已绑定,传感器未绑定
				<span style="background-color: #70c05b;color: #70c05b;margin: 0 4px;">123</span>轮胎已绑定,传感器已绑定
				 <span style="background-color: #ffffff;color: #ffffff;margin: 0 4px;">123</span>轮胎未绑定,传感器未绑定
				  <span class="hubstyle">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>轮毂已绑定传感器
				  <span class="hubred">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>轮毂未绑定传感器
				 </p>
				 <!-- <el-button>立即下发轮位</el-button>
				<p>设备下挂状态：待下发</p>
				 <el-button>同步设备轮位</el-button>
				 <p>同步状态：下发中...</p> -->
			</h4>
			<div class="luntai">
				<!-- 主车 -->
				<div v-if="maincarbox">
					<div class="luntop" v-for="(item,index) in maincardata" :key="index">
						<div v-for="(tireleft) in item.leftTireCode" :key="tireleft.deviceNumber"  :class="item.leftTireCode.length>1? 'widtwo':''">
							<div class="baiban" :class="[(tireleft.infohub && tireleft.infohub.senderId)? 'hubstyle':'' ,(tireleft.infohub && !tireleft.infohub.senderId)?'hubred':'' ]" v-if="tireleft.infodata == null" @click="notire(tireleft.positionCode,tireleft.positionDesc,tireleft)"></div>
							<div class="lunbox" v-else-if="tireleft.infodata.senderId" @click="havetire(tireleft.infodata)" :class="[(tireleft.infohub && tireleft.infohub.senderId)? 'hubstyle':'' ,(tireleft.infohub && !tireleft.infohub.senderId)?'hubred':'' ]" >
							</div>
							<div class="lunbox2" v-else @click="havetire(tireleft.infodata)" :class="[(tireleft.infohub && tireleft.infohub.senderId)? 'hubstyle':'' ,(tireleft.infohub && !tireleft.infohub.senderId)?'hubred':'' ]">
							</div>
							<div class="decs" >
								<p  v-if="tireleft.infodata != null">轮胎编号:{{tireleft.infodata.tireNo}}</p>
								<p v-if="tireleft.infohub != null">轮毂编号:{{tireleft.infohub.hubNo}}</p>
								<p v-if="tireleft.infodata != null || tireleft.infohub != null">轮位:{{tireleft.positionDesc}}</p>
							</div>
						</div>
						<img v-if="item.axisNumber !=0 " style="width: 100px;height: 14px;" src="@/assets/images/tyjk_lt_zhou.png">
						<div v-for="(tireright) in item.rightTireCode" :key="tireright.deviceNumber"  :class="item.rightTireCode.length>1? 'widone':''">
							<div class="baiban"  :class="[(tireright.infohub && tireright.infohub.senderId)? 'hubstyle':'' ,(tireright.infohub && !tireright.infohub.senderId)?'hubred':'' ]" v-if="tireright.infodata == null " @click="notire(tireright.positionCode,tireright.positionDesc)"></div>
							<div class="lunbox" :class="[(tireright.infohub && tireright.infohub.senderId)? 'hubstyle':'' ,(tireright.infohub && !tireright.infohub.senderId)?'hubred':'' ]" v-else-if="tireright.infodata.senderId" @click="havetire(tireright.infodata)">
							</div>
							<div class="lunbox2" :class="[(tireright.infohub && tireright.infohub.senderId)? 'hubstyle':'' ,(tireright.infohub && !tireright.infohub.senderId)?'hubred':'' ]" v-else @click="havetire(tireright.infodata)">
							</div>
							<div class="decs">
								<p  v-if="tireright.infodata != null">轮胎编号:{{tireright.infodata.tireNo}}</p>
								<p v-if="tireright.infohub != null">轮毂编号:{{tireright.infohub.hubNo}}</p>
								<p v-if="tireright.infodata != null || tireright.infohub != null">轮位:{{tireright.positionDesc}}</p>
							</div>
						</div>
						<div v-if="item.axisNumber == 0 " style="display: flex;justify-content: space-around;width: 100%;">
							<div v-for="(its) in item.spareTireCode" :key="its.deviceNumber">
								<div class="baiban down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-if="its.infodata == null" @click="notire(its.positionCode,its.positionDesc)"></div>
								<div class="lunbox down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-else-if="its.infodata.senderId" @click="havetire(its.infodata)">
								</div>
								<div class="lunbox2 down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-else @click="havetire(its.infodata)">
								</div>
								<div class="decs">
									<p  v-if="its.infodata != null">轮胎编号:{{its.infodata.tireNo}}</p>
									<p v-if="its.infohub != null">轮毂编号:{{its.infohub.hubNo}}</p>
									<p v-if="its.infodata != null || its.infohub != null">轮位:{{its.positionDesc}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- 挂车 -->
				<div v-if="trailcarbox">
					<p style="width: 100%;text-align: center;margin: 10px 0;">{{carinfoshowtwo.vehicleNo}}</p>
					<div class="luntop" v-for="(items,index) in trailcardata" :key="index">
						<div v-for="(tiresleft) in items.leftTireCode" :key="tiresleft.deviceNumber" class="widtwo">
							<div class="baiban" :class="[(tiresleft.infohub && tiresleft.infohub.senderId)? 'hubstyle':'' ,(tiresleft.infohub && !tiresleft.infohub.senderId)?'hubred':'' ]" v-if="tiresleft.infodata == null" @click="notire(tiresleft.positionCode,tiresleft.positionDesc)">
							</div>
							<div class="lunbox" :class="[(tiresleft.infohub && tiresleft.infohub.senderId)? 'hubstyle':'' ,(tiresleft.infohub && !tiresleft.infohub.senderId)?'hubred':'' ]" v-else-if="tiresleft.infodata.senderId" @click="havetire(tiresleft.infodata)">
							</div>
							<div class="lunbox2" :class="[(tiresleft.infohub && tiresleft.infohub.senderId)? 'hubstyle':'' ,(tiresleft.infohub && !tiresleft.infohub.senderId)?'hubred':'' ]" v-else @click="havetire(tiresleft.infodata)">
							</div>
							<div class="decs">
								<p  v-if="tiresleft.infodata != null">轮胎编号:{{tiresleft.infodata.tireNo}}</p>
								<p v-if="tiresleft.infohub != null">轮毂编号:{{tiresleft.infohub.hubNo}}</p>
								<p v-if="tiresleft.infodata != null || tiresleft.infohub != null">轮位:{{tiresleft.positionDesc}}</p>
							</div>
						</div>
						<img v-if="items.axisNumber !=0 " style="width: 100px;height: 14px;"
							src="@/assets/images/tyjk_lt_zhou.png">
						<div v-for="(tirersight) in items.rightTireCode" :key="tirersight.deviceNumber" class="widone">
							<div class="baiban" :class="[(tirersight.infohub && tirersight.infohub.senderId)? 'hubstyle':'' ,(tirersight.infohub && !tirersight.infohub.senderId)?'hubred':'' ]" v-if="tirersight.infodata == null" @click="notire(tirersight.positionCode,tirersight.positionDesc)"></div>
							<div class="lunbox" :class="[(tirersight.infohub && tirersight.infohub.senderId)? 'hubstyle':'' ,(tirersight.infohub && !tirersight.infohub.senderId)?'hubred':'' ]" v-else-if="tirersight.infodata.senderId" @click="havetire(tirersight.infodata)">
							</div>
							<div class="lunbox2" :class="[(tirersight.infohub && tirersight.infohub.senderId)? 'hubstyle':'' ,(tirersight.infohub && !tirersight.infohub.senderId)?'hubred':'' ]" v-else @click="havetire(tirersight.infodata)">
							</div>
							<div class="decs">
								<p  v-if="tirersight.infodata != null">轮胎编号:{{tirersight.infodata.tireNo}}</p>
								<p v-if="tirersight.infohub != null">轮毂编号:{{tirersight.infohub.hubNo}}</p>
								<p v-if="tirersight.infodata != null || tirersight.infohub != null">轮位:{{tirersight.positionDesc}}</p>
							</div>
						</div>
						<div v-if="items.axisNumber == 0 " style="display: flex;justify-content: space-around;width: 100%;">
							<div v-for="(its) in items.spareTireCode" :key="its.deviceNumber">
								<div class="baiban down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-if="its.infodata == null" @click="notire(its.positionCode,its.positionDesc)"></div>
								<div class="lunbox down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-else-if="its.infodata.senderId" @click="havetire(its.infodata)">
								</div>
								<div class="lunbox2 down" :class="[(its.infohub && its.infohub.senderId)? 'hubstyle':'' ,(its.infohub && !its.infohub.senderId)?'hubred':'' ]" v-else @click="havetire(its.infodata)">
								</div>
								<div class="decs">
									<p  v-if="its.infodata != null">轮胎编号:{{its.infodata.tireNo}}</p>
									<p v-if="its.infohub != null">轮毂编号:{{its.infohub.hubNo}}</p>
									<p v-if="its.infodata != null || its.infohub != null">轮位:{{its.positionDesc}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 轮胎拆卸 -->
		<el-dialog title="轮胎拆卸" v-model="open" width="70%" :close-on-click-modal="false">
			胎号:{{tableData[0].tireNo}}
			<span style="margin-left: 20px;">当前轮位：{{posied}}</span>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="insideTireNo" label="自编号" align="center" v-if="tableData[0].insideTireNo">
					<template #default="scope">
						<span>{{scope.row.insideTireNo}}</span>
						<!-- <el-input  v-else placeholder="补充自编号" v-model="scope.row.insideTireNo"></el-input> -->
					</template>
				</el-table-column>
				<el-table-column  label="传感器ID" align="center">
						<template #default="scope">
							<span v-if="scope.row.senderId">{{scope.row.senderId}}</span>
							<span v-if="!scope.row.senderId" style="color: red;cursor: pointer;" @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId)">[绑定]</span>
							<span v-if="scope.row.senderId"  style="color: green;cursor: pointer;" @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId)">[解绑]</span>
						</template>
				</el-table-column>
				<el-table-column prop="tireBrandName" label="品牌" align="center">
					<template #default="scope">
						{{scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].tireBrandName}}
					</template>
				</el-table-column>
				<el-table-column label="拆去方向" align="center">
					<template #default="scope">
						<el-select placeholder="拆去方向" @change="selecstockStatusCn($event)" v-model="scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus" clearable>
							<el-option
							   v-for="dict in stockStatus_tire"
							   :key="dict.value"
							   :label="dict.label"
							   :value="dict.value"
							></el-option>
						</el-select>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="address" label="安装时里程表读数" align="center">
				</el-table-column> -->
				<el-table-column prop="date" label="拆卸费用" align="center">
					<template #default="scope">
						<el-input placeholder="单位元" v-model="scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].cost"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="depth" label="新胎花纹深度(mm)" align="center">
					<template #default="scope">
						{{scope.row.depth}}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="name" label="操作单位">
					<el-input></el-input>
				</el-table-column> -->
			</el-table>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="installTime" label="安装时间" align="center">
				</el-table-column>
				<el-table-column prop="specificationsName" label="规格" align="center">
					<template #default="scope">
						{{scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].specificationsName}}
					</template>
				</el-table-column>
				<el-table-column prop="specificationsName" label="轮胎分类" align="center">
					<template #default="scope">
						<dict-tag :options="lifecycle_tire_category" :value="scope.row.category" />
					</template>
				</el-table-column>
				<el-table-column prop="pattern" label="花纹型号" align="center">
					<template #default="scope">
						{{scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].pattern}}
					</template>
				</el-table-column>
				<el-table-column prop="measuredDepth" label="上次实测花纹深度(mm)">
					
				</el-table-column>
				<!-- <el-table-column prop="depth" label="本次实测花纹深度(mm)" align="center">
					<template #default="scope">
						<el-input placeholder="单位mm" v-model="scope.row.depth"></el-input>
					</template>
				</el-table-column> -->
				<el-table-column prop="date" label="本次拆卸时里程表读数" align="center">
					<template #default="scope">
						<el-input placeholder="单位km" v-model="scope.row.readMileage"></el-input>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="name" label="累计里程">
					<el-input placeholder="单位km"></el-input>
				</el-table-column> -->
				<!-- <el-table-column prop="address" label="操作人">
					<el-input></el-input>
				</el-table-column> -->
			</el-table>
			<el-table :data="tableData" border style="width: 100%" v-if="tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus == 50">
				<el-table-column  label="报废类型" align="center">
					<template #default="scope">
						<el-radio-group v-model="scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType">
					    <el-radio label="0">正常报废</el-radio>
					    <el-radio label="1">提前报废</el-radio>
					  </el-radio-group>
					</template>
				</el-table-column>
				<el-table-column prop="specificationsName" label="是否翻新" align="center">
					<template #default="scope">
						<el-radio-group v-model="scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].isRenovate" @change="isRenovatechange($event)">
						   <el-radio :label="0">可翻新</el-radio>
						   <el-radio :label="1">不可翻新</el-radio>
						 </el-radio-group>
					</template>
				</el-table-column>
				<el-table-column prop="pattern" label="问题类型" align="center"  v-if="tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == '1'">
					<template #default="scope">
						<el-select placeholder="问题类型" @change="queschange($event)" v-model="scope.row.tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType">
							<el-option label="质量问题" value="lifecycle_tire_quality_problem" ></el-option>
							<el-option label="使用问题" value="lifecycle_tire_use_problem" ></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column prop="pattern" label="质量问题" align="center" 
				 v-if="tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType == 'lifecycle_tire_quality_problem'&& tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == '1'">
						<el-checkbox-group v-model="questionContent" @change="questionContentone($event)">
						    <el-checkbox 
							v-for="dict in lifecycle_tire_quality_problem"
							:key="dict.value"
							:label="`${dict.value},${dict.label}`"
							>{{dict.label}}</el-checkbox>
						  </el-checkbox-group>
				</el-table-column>
				<el-table-column prop="pattern" label="使用问题" align="center" 
				 v-if="tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType == 'lifecycle_tire_use_problem'&& tableData[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == '1'">
						   <el-checkbox-group v-model="questionContentt" @change="questionContents($event)">
						       <el-checkbox 
						   	v-for="dict in lifecycle_tire_use_problem"
						   	:key="dict.value"
						   	:label="`${dict.value},${dict.label}`"
						   	>{{dict.label}}</el-checkbox>
						     </el-checkbox-group>
				</el-table-column>
				
			<!-- <el-form-item label="使用问题"
				 prop="questionContentt"
				 v-if="tableData[0].tireMaintenanceBo..tireMaintenanceDetailBos[0].questionType == 'lifecycle_tire_use_problem' && form.tireMaintenanceDetailBos[0].scrappingType == '1'">
					<el-checkbox-group v-model="questionContentt" @change="questionContents($event)">
					    <el-checkbox 
						v-for="dict in lifecycle_tire_use_problem"
						:key="dict.value"
						:label="`${dict.value},${dict.label}`"
						>{{dict.label}}</el-checkbox>
					  </el-checkbox-group>
				</el-form-item> -->
			</el-table>
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column prop="lastInstallMileage" label="当前里程表读数(km)" align="center">
				</el-table-column>
				<el-table-column prop="totalMileage" label="累计里程(km)" align="center" />
				<el-table-column prop="firstDepth" label="初测花纹深度(mm)" align="center" />
				<el-table-column prop="indexDepth" label="本次实测花纹深度(mm)" align="center">
					<template #default="scope">
						<el-input placeholder="单位mm" v-model="scope.row.indexDepth"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作单位" align="center">
					{{state.user.dept.deptName}}
				</el-table-column>
				<el-table-column label="操作账号" align="center">
					{{state.user.userName}}
				</el-table-column>
			</el-table>
			备注 :<el-input type="textarea" v-model="tableData[0].tireMaintenanceBo.remark"></el-input>
			<div style="text-align: center;margin-top: 15px;" slot="footer" class="dialog-footer">
				<el-button type="warning" @click="tiredetails">拆卸</el-button>
				<el-button @click="open=false">关闭</el-button>
			</div> 
		</el-dialog>

		<!-- 轮胎安装 -->
		<el-dialog title="轮胎安装" v-model="openadd" width="800px"  :close-on-click-modal="false">
			<el-table :data="newtiretable" border style="width: 100%" align="center">
				<el-table-column label="胎号">
					<template #default="scope">
						<el-input @click="serchtireNo" v-model="scope.row.tireNo"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="已选轮位" align="center">
					<span>{{posied}}</span>
				</el-table-column>
				<el-table-column prop="specificationsName" label="规格" align="center">
				</el-table-column>
				<el-table-column  label="传感器ID" align="center">
						<template #default="scope">
							<span v-if="scope.row.senderId">{{scope.row.senderId}}</span>
							<span v-if="!scope.row.senderId" style="color: red;cursor: pointer;" @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId)">[绑定]</span>
							<span v-if="scope.row.senderId"  style="color: green;cursor: pointer;" @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId)">[解绑]</span>
						</template>
				</el-table-column>
			</el-table>
			<el-table :data="newtiretable" border style="width: 100%">
				<el-table-column prop="date" label="自编号" align="center">
					<template #default="scope">
						<el-input v-model="scope.row.insideTireNo"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="tireBrandName" label="品牌" align="center">
				</el-table-column>
				<el-table-column prop="pattern" label="花纹型号" align="center">
				</el-table-column>
				<el-table-column label="安装费用" align="center">
					<template #default="scope">
						<el-input placeholder="单位元" v-model="scope.row.installFee"></el-input>
					</template>
				</el-table-column>
				<el-table-column label="操作单位" align="center">
					{{state.user.dept.deptName}}
				</el-table-column>
				<el-table-column label="操作账号" align="center">
					{{state.user.userName}}
				</el-table-column>
			</el-table>
			<el-table :data="newtiretable" border style="width: 100%">
				<el-table-column prop="lastInstallMileage" label="当前里程表读数(km)" align="center">
					<template #default="scope">
						<el-input  v-model="scope.row.lastInstallMileage" :disabled="carinfoshow.mileageStatType == 2001 "></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="totalMileage" label="累计里程(km)" align="center" />
				<el-table-column prop="firstDepth" label="初测花纹深度(mm)" align="center" />
				<el-table-column prop="measuredDepth" label="实测花纹深度(mm)" align="center" />
			</el-table>
			<p style="color: red;text-align: center;" v-if="carinfoshow.mileageStatType == 2001">此车辆设置的里程统计方式为【 {{carinfoshow.mileageStatTypeName}} 】，在此不需要输入里程表读数</p>
			<div style="text-align: center;margin-top: 15px;" slot="footer" class="dialog-footer">
				<el-button type="warning" @click="addtire()">安装</el-button>
				<el-button @click="openadd=false">关闭</el-button>
			</div>
		</el-dialog>
	
		<!-- 未上车轮胎列表 -->
		<el-dialog title="未上车轮胎列表" v-model="tiretable" width="80%" append-to-body :close-on-click-modal="false">
			<el-form label-width="75px" style="display: flex;flex-wrap: wrap;
			justify-content: left;">
			    <el-form-item label="轮胎规格">
				  <el-select
				  placeholder="请选择轮胎规格" 
				  v-model="queryform.specificationsId"
				  filterable
				  :clearable="true"
				  >
				    <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in guige" :key="index" />
				  </el-select>
			    </el-form-item>
			    <el-form-item label="胎号">
					<!-- <el-select
					placeholder="请输入胎号" 
					v-model="queryform.tireNo"
					filterable
					:clearable="true"
					>
					  <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
					</el-select> -->
					<el-select v-model="queryform.tireNo"
						filterable clearable placeholder="请选择"
						allow-create
						:default-first-option="true"
						@blur="Nameblur($event)"
						default-first-option>
						<el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
					 </el-select>
			    </el-form-item>
				<el-form-item label="自编号">
				  <el-input placeholder="请输入自编号" v-model="queryform.insideTireNo"></el-input>
				</el-form-item>
			    <el-form-item label="质保周期">
			      <el-select placeholder="请选择" v-model="queryform.qualityPeriod" clearable>
			        <el-option label="正常" value="0" />
					<el-option label="即将过期" value="1" />
					<el-option label="已过期" value="-1" />
			      </el-select>
			    </el-form-item>
			    <el-form-item label="所属仓库">
			     <el-select
			     placeholder="请选择所属仓库" 
			     v-model="queryform.warehouseId"
			     filterable
			     :clearable="true"
			     >
			       <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
			     </el-select>
			    </el-form-item>
				 <el-button type="primary" @click="serchtireNo" style="margin-left: 20px;"><i class="el-icon-search"></i> 查询</el-button>
			</el-form>
			<el-table :data="dataList">
				<el-table-column label="选择项" width="80">
					<template #default="scope">
						<el-radio v-model="outtableRadio" :label="JSON.stringify(scope.row)">&nbsp;</el-radio>
					</template>
				</el-table-column>
			  <el-table-column label="胎号" align="center" prop="tireNo" />
			  <el-table-column label="自编号" align="center" prop="insideTireNo" />
			  <el-table-column label="所属组织" align="center" prop="companyName">
			  </el-table-column>
			  <el-table-column label="所属仓库" align="center" prop="warehouseName">
			  </el-table-column>
			  <el-table-column label="品牌" align="center" prop="tireBrandName" />
			  <el-table-column label="花纹型号" align="center" prop="pattern">
			  </el-table-column>
			  <el-table-column label="状态" align="center" >
				  <template #default="scope">
					 <dict-tag :options="lifecycle_tire_status" :value="scope.row.stockStatus" />
				  </template>
			</el-table-column>
			  <el-table-column label="入库时间" align="center" prop="createTime" width="180">
			  </el-table-column>
			</el-table>
			<p style="position: relative;">
				<pagination
				   v-show="queryform.total > 0"
				   :total="queryform.total"
				   v-model:page="queryform.pageNum"
				   v-model:limit="queryform.pageSize"
				   @pagination="serchtireNo"
				/>
			</p>
			<div style="text-align: center;margin-top: 35px;" slot="footer" class="dialog-footer">
				<el-button type="warning" @click="tableradio">确定</el-button>
				<el-button @click="tiretable=false">关闭</el-button>
			</div>
		</el-dialog>
		
		<!-- 传感器id -->
		<el-dialog title="绑定传感器" v-model="chuanid" width="40%" append-to-body :close-on-click-modal="false">
		    <el-form label-width="150px" style="flex-wrap: wrap;" :rules="rules" ref="menuRef" :model="chuanfrom">
		        <el-form-item label="胎号" >
					<el-input v-model="chuanfrom.tireNo" disabled></el-input>
				</el-form-item>
				<el-form-item label="传感器ID" prop="senderId">
					<el-input v-model="chuanfrom.senderId " :disabled="!jiebangma"></el-input>
				</el-form-item>
				<el-form-item label="绑定方式" prop="senderType">
		          <el-select
				   :disabled="!jiebangma"
		          placeholder="请选择绑定方式" 
		          v-model="chuanfrom.senderType"
		           filterable
		            :clearable="true"
		          >
		            <el-option :label="item.label" :value="item.value"  v-for="(item,index) in lifecycle_tire_sendertype" :key="index" />
		          </el-select>
		        </el-form-item>
		    </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer">
		      <el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
			  <el-button type="primary" v-if="!jiebangma" @click="jiebangfun">解绑</el-button>
		      <el-button @click="chuanid=false">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="Tireinstall">
	import { carlistlist, gettirepicture, getalltire, getallhub, tireinfos} from '@/api/car.js'
	import { ref, onMounted } from 'vue';
	import { carcompanylist, vehicleNo } from '@/api/systensettings'
	import { dilog } from '@/store/dilog';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { countdownEmits } from 'element-plus';
	import Cookies from "js-cookie";
	import { listDept } from "@/api/system/dept";
	import {tirelist, getTireBands, getSpecifications, jiebang, bangding, tireinstall, tiredetail, carinfo, getKeyWX, getKeyFX} from '@/api/carlive'
	const { proxy } = getCurrentInstance();
	import { warehouselist } from '@/api/warehouse'
	import { getUserProfile } from "@/api/system/user";
	const { lifecycle_tire_status,lifecycle_tire_category, lifecycle_tire_sendertype, stockStatus_tire, lifecycle_tire_quality_problem, lifecycle_tire_use_problem, alarm_type} = proxy.useDict("lifecycle_tire_status","lifecycle_tire_category", "lifecycle_tire_sendertype", "stockStatus_tire", "lifecycle_tire_quality_problem", "lifecycle_tire_use_problem", "alarm_type");
	const dilogs = dilog();
	// 车辆列表数据
	const loading = ref(false)
	const ruleForm = ref({
		pageNum: 1,
		pageSize: 10
	})
	const open = ref(false);
	const openadd = ref(false)
	const lidatas = ref([])
	const total = ref(0);
	const deptOptions = ref([]) //组织下拉框
	const vehicleNoo = ref([]) //车牌号下拉框
	const maincarbox = ref(true) //主车盒子
	const trailcarbox = ref(true) //挂车盒子
	const maincardata = ref([])
	const trailcardata = ref([])
	const chetai=ref([])//车胎列表
	const pinpai=ref([])//品牌
	const guige=ref([])//规格
	const houselist=ref([])//仓库
	const newtiretable=ref([{tireNo:'',positiondex:'',specificationsName:'',senderId:'',tireBrandName:'',pattern:'',installFee:''}])
	const posied=ref('')//轮位说明
	const queryform=ref({//轮胎查询表单
		pageNum:1,
		pageSize:10,
		isUseVehicle:0,
		total:0
	})
	const carallinfo=ref({})//当前车辆全部信息
	const dataList=ref([]) //轮胎table
	const tiretable=ref(false)
	const outtableRadio=ref('')
	const postfrom=ref({})
	const vechid=ref('')//当前车辆id
	const tableData = ref([{
		tireMaintenanceBo:{
			maintainer:'',//为湖人
			maintenanceDate:'',//维护日期
			manufacturer:'',//维护厂家
			mid:'',//维护单号
			tenantId:'',//租户id
			totalCost:'',//总金额
			type:'',
			tireMaintenanceDetailBos:[{
				stockStatusCn:''
			}]
		}}
	])//拆卸table
	const carinfoshow=ref({})//当前车辆信息
	const carinfoshowtwo=ref({})//当前gua车辆信息
	const questionContent=ref([])//未处理的质量问题数据
	const questionContentt=ref([])//未处理的使用问题数据
	function getList() {
		loading.value = true
		carlistlist(ruleForm.value).then(res => {
			// 初次加载车牌号列表后请求第一辆车子的轮胎信息
			if (res.code == 200) {
				lidatas.value = res.data.items
				total.value = res.data.total
				if(lidatas.value){
					getpicture(lidatas.value[0].vehicle,0)
					loading.value = false
				}
			} else {
				ElMessage.error(res.message)
				loading.value = false
			}
		})
	}
	function Nameblur(e) {
		queryform.value.tireNo=e.target.value
	   }
	const state = reactive({
	  user: {},
	  roleGroup: {},
	  postGroup: {}
	});
	function getUser() {
	  getUserProfile().then(response => {
	    state.user = response.data;
	    state.roleGroup = response.roleGroup;
	    state.postGroup = response.postGroup;
	  });
	};
	// 维护去向数据处理
	 function selecstockStatusCn(i){
		 if(i == 50){
		 	getKeyFX().then(res=>{
		 		tableData.value[0].tireMaintenanceBo.mid=res.data
		 	})
		 	tableData.value[0].tireMaintenanceBo.type=2
		 }else{
			 tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType=''
			 tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].isRenovate=''
			 tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType=''
		 	getKeyWX().then(resd=>{
		 		tableData.value[0].tireMaintenanceBo.mid=resd.data
		 	})
		 	tableData.value[0].tireMaintenanceBo.type=1
		 }
		stockStatus_tire.value.find((item)=>{
		  if(item.value === i){
			tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatusCn=item.label
		  }
		})
	}
	// 使用问题数据处理
	function questionContentone(val){
		let arr=[]
		let arrt=[]
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContent=''
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContentCN=''
		val.map(item=>{
			let [id,name] = item.split(',')
			arr.push(id)
			arrt.push(name)
		})
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContent=arr.toString()
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContentCN=arrt.toString()
	}
	// 系统版本翻译
	function systemVersion(e){
		if(e == 5001){
			return '纯软件版本'
		}else if(e == 5002){
			return '硬件版本'
		}
	}
	
	function queschange(i){
		if(i=='lifecycle_tire_quality_problem'){
			tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionTypeCN='质量问题'
		}else if(i=='lifecycle_tire_use_problem'){
			tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionTypeCN='使用问题'
		}
	}
	function isRenovatechange(i){
		if(i == 0){
			getKeyFX().then(res=>{
				tableData.value[0].tireMaintenanceBo.mid=res.data
			})
			tableData.value[0].tireMaintenanceBo.type=2  
		}else{
			getKeyWX().then(resd=>{
				tableData.value[0].tireMaintenanceBo.mid=resd.data
			})
			tableData.value[0].tireMaintenanceBo.type=1
		}
	}
	// 质量问题数据处理
	function questionContents(val){
		let arr=[]
		let arrt=[]
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContent=''
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContentCN=''
		val.map(item=>{
			let [id,name] = item.split(',')
			arr.push(id)
			arrt.push(name)
		})
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContent=arr.toString()
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionContentCN=arrt.toString()
	}
	// 轮位图加载
	const chenindev=ref('')
	function getpicture(data,index) {
		chenindev.value = index
		vechid.value=data
		gettirepicture({
			id: data,
			tireStatus: 0
		}).then(res => {
			carallinfo.value=res.data
			// 轮胎信息
			// 判断主挂车盒子
			if (res.data.mainList != null) {
				carinfo(res.data.vehicleId).then(info=>{
					carinfoshow.value=info.data
					getallhub(res.data.vehicleId).then(response => {
						let tirePositionlist = []
						if (response.data != null) {
							tirePositionlist = response.data.items || []
						}
						maincarbox.value = true
						let nwarr = res.data.mainList
						nwarr.map(item => {
							if (item.axisNumber !=0  ) {
								item.leftTireCode.reverse()
								for (let i = 0; i < item.leftTireCode.length; i++) {
									item.leftTireCode[i].infohub = null
									for (let j = 0; j < tirePositionlist.length; j++) {
										if (tirePositionlist[j].installPosition == item.leftTireCode[i]
											.positionCode) {
											item.leftTireCode[i].infohub = tirePositionlist[j]
										}
									}
								}
								item.rightTireCode.reverse()
								for (let i = 0; i < item.rightTireCode.length; i++) {
									item.rightTireCode[i].infohub = null
									for (let j = 0; j < tirePositionlist.length; j++) {
										if (tirePositionlist[j].installPosition == item.rightTireCode[i].positionCode) {
											item.rightTireCode[i].infohub = tirePositionlist[j]
										}
									}
								}
							}else{
								for (let i = 0; i < item.spareTireCode.length; i++) {
									item.spareTireCode[i].infohub = null
									for (let j = 0; j < tirePositionlist.length; j++) {
										if (tirePositionlist[j].installPosition == item.spareTireCode[i].positionCode) {
											item.spareTireCode[i].infohub = tirePositionlist[j]
										}
									}
								}
							}
						})
						getalltire(res.data.vehicleId).then(response => {
							let tirePositionlist = []
							if (response.data != null) {
								tirePositionlist = response.data.items || []
							}
							maincarbox.value = true
							let nwarr = res.data.mainList
							nwarr.map(item => {
								if (item.axisNumber !=0  ) {
									item.leftTireCode.reverse()
									for (let i = 0; i < item.leftTireCode.length; i++) {
										item.leftTireCode[i].infodata = null
										for (let j = 0; j < tirePositionlist.length; j++) {
											if (tirePositionlist[j].installPosition == item.leftTireCode[i]
												.positionCode) {
												item.leftTireCode[i].infodata = tirePositionlist[j]
											}
										}
									}
									item.rightTireCode.reverse()
									for (let i = 0; i < item.rightTireCode.length; i++) {
										item.rightTireCode[i].infodata = null
										for (let j = 0; j < tirePositionlist.length; j++) {
											if (tirePositionlist[j].installPosition == item.rightTireCode[i].positionCode) {
												item.rightTireCode[i].infodata = tirePositionlist[j]
											}
										}
									}
								}else{
									for (let i = 0; i < item.spareTireCode.length; i++) {
										item.spareTireCode[i].infodata = null
										for (let j = 0; j < tirePositionlist.length; j++) {
											if (tirePositionlist[j].installPosition == item.spareTireCode[i].positionCode) {
												item.spareTireCode[i].infodata = tirePositionlist[j]
											}
										}
									}
								}
							})
							maincardata.value = nwarr
						})
					})
				})
			} else {
				maincarbox.value = false
			}
			if (res.data.trailList != null) {
				getallhub(res.data.trailVehicleId).then(rest => {
					carinfo(res.data.trailVehicleId).then(info=>{
						carinfoshowtwo.value=info.data
						getalltire(res.data.trailVehicleId).then(rest => {
							carinfo(res.data.trailVehicleId).then(info=>{
								carinfoshowtwo.value=info.data
							})
							let tirePosition = []
							if (rest.data != null) {
								tirePosition = rest.data.items || []
							}
							trailcarbox.value = true
							let olarr = res.data.trailList
							olarr.map(item => {
								if (item.axisNumber != 0) {
									item.leftTireCode.reverse()
									for (let i = 0; i < item.leftTireCode.length; i++) {
										item.leftTireCode[i].infodata = null
										for (let j = 0; j < tirePosition.length; j++) {
											if (tirePosition[j].installPosition == item.leftTireCode[i]
												.positionCode) {
												item.leftTireCode[i].infodata = tirePosition[j]
											}
										}
									}
									item.rightTireCode.reverse()
									for (let i = 0; i < item.rightTireCode.length; i++) {
										item.rightTireCode[i].infodata = null
										for (let j = 0; j < tirePosition.length; j++) {
											if (tirePosition[j].installPosition == item.rightTireCode[i].positionCode) {
												item.rightTireCode[i].infodata = tirePosition[j]
											}
										}
									}
								}else{
									for (let i = 0; i < item.spareTireCode.length; i++) {
										item.spareTireCode[i].infodata = null
										for (let j = 0; j < tirePosition.length; j++) {
											if (tirePosition[j].installPosition == item.spareTireCode[i].positionCode) {
												item.spareTireCode[i].infodata = tirePosition[j]
											}
										}
									}
								}
							})
							trailcardata.value = olarr
						})
					})
					let tirePosition = []
					if (rest.data != null) {
						tirePosition = rest.data.items || []
					}
					trailcarbox.value = true
					let olarr = res.data.trailList
					olarr.map(item => {
						if (item.axisNumber != 0) {
							item.leftTireCode.reverse()
							for (let i = 0; i < item.leftTireCode.length; i++) {
								item.leftTireCode[i].infohub = null
								for (let j = 0; j < tirePosition.length; j++) {
									if (tirePosition[j].installPosition == item.leftTireCode[i]
										.positionCode) {
										item.leftTireCode[i].infohub = tirePosition[j]
									}
								}
							}
							item.rightTireCode.reverse()
							for (let i = 0; i < item.rightTireCode.length; i++) {
								item.rightTireCode[i].infohub = null
								for (let j = 0; j < tirePosition.length; j++) {
									if (tirePosition[j].installPosition == item.rightTireCode[i]
										.positionCode) {
										item.rightTireCode[i].infohub = tirePosition[j]
									}
								}
							}
						}else{
							for (let i = 0; i < item.spareTireCode.length; i++) {
								item.spareTireCode[i].infohub = null
								for (let j = 0; j < tirePosition.length; j++) {
									if (tirePosition[j].installPosition == item.spareTireCode[i].positionCode) {
										item.spareTireCode[i].infohub = tirePosition[j]
									}
								}
							}
						}
					})
				})
			} else {
				trailcarbox.value = false
			}
		})
	}
	// 安装轮胎
	function notire(i,e){
		if(e.includes("挂车")){
			postfrom.value.vehicleId=carallinfo.value.trailVehicleId
		}else{
			postfrom.value.vehicleId=carallinfo.value.vehicleId
		}
		newtiretable.value=[
			{tireNo:'',positiondex:e,specificationsName:'',senderId:'',tireBrandName:'',pattern:'',installFee:''}
		]
		posied.value=e//当前轮位说明
		postfrom.value.installPosition=i
		openadd.value=true
	}
	
	// 存储本次实测花纹深度
	const merlishi=ref('')
	
	// 轮胎拆卸
	function havetire(f){
		posied.value=f.installPositionDesc
		var date = new Date();
		date.getFullYear();
		let mothod=''
		let day=''
		if(date.getMonth() < 10){
			mothod= "0" +( date.getMonth()+1)
		}else{
			mothod=date.getMonth()+1
		}
		if(date.getDate() <10){
			day= "0" +date.getDate();
		}else{
			day=date.getDate();
		}
		tireinfos(f.tireId).then(res=>{
			merlishi.value=res.data
			f.stockStatus = null
			tableData.value[0]={
				category:res.data.category,
				tireNo:res.data.tireNo,
				depth:res.data.depth,
				insideTireNo:res.data.insideTireNo,
				readMileage:res.data.readMileage,
				tireId:res.data.tireId,
				senderId:res.data.senderId,
				createTime:res.data.createTime,
				vehicleId:res.data.vehicleId,
				firstDepth:res.data.firstDepth,
				lastInstallMileage:res.data.lastInstallMileage,
				totalMileage:res.data.totalMileage,
				measuredDepth:res.data.measuredDepth,
				installTime:res.data.installTime,
			tireMaintenanceBo:{
				maintainer: Cookies.get("username"),//维护人,//维护人
				maintenanceDate: date.getFullYear()+ '-' + mothod+ '-' + day,//维护日期
				manufacturer:'',//维护厂家
				tenantId:res.data.tenantId,//租户id
				totalCost:'',//总金额
				tireMaintenanceDetailBos:[{tireBrandName:res.data.tireBrandName,specificationsName:res.data.specificationsName,pattern:res.data.pattern}]
			}} 
			open.value=true
		})
	}
	// 安装提交
	function addtire(){
		// postfrom.value.vehicleId=vechid.value
		postfrom.value.insideTireNo=newtiretable.value[0].insideTireNo
		postfrom.value.tireId=newtiretable.value[0].tireId
		postfrom.value.installFee=newtiretable.value[0].installFee
		postfrom.value.installPositionDesc=posied.value
		// let flag=/^[0-9]+(\.\d+)?$/
		if(newtiretable.value[0].installFee<0){
			ElMessage.error("安装费用不能为负数")
			return false
		}else{
			tireinstall(postfrom.value).then(res=>{
				if(res.code == 200){
					ElMessage.success("轮胎安装成功")
					getpicture(vechid.value,chenindev.value)
					openadd.value=false
					dilogs.$patch({ tirelist: true })
				}else{
					ElMessage.error(res.message)
				}
			})
		}
	}
   function	serchtireNo(){
		tirelist(queryform.value).then(res=>{
			// 车胎
			tirelist({pageNum:1,pageSize:10000}).then(res=>{
				if(res.code == 200){
					chetai.value=res.data.items
				}
			})
			// 品牌
			getTireBands().then(resss=>{
				pinpai.value=resss.data.items
			})
			// 规格
			getSpecifications().then(re=>{
				guige.value=re.data
			})
			// 仓库
			warehouselist({}).then(ress=>{
				houselist.value=ress.data.items
			})
			dataList.value=res.data.items
			queryform.value.total=res.data.total
			tiretable.value=true
		})
	}
	// 确定车胎
	function tableradio(){
		newtiretable.value[0]=JSON.parse(outtableRadio.value) 
		tiretable.value=false
		outtableRadio.value=''
	}
	const chuanid=ref(false)
	const chuanfrom=ref({
		senderId:null,
		senderType:null
	})
	const rules=({
		senderId: [{ required: true, message: "传感器ID不能为空", trigger: "blur" }],
		senderType: [{ required: true, message: "绑定方式不能为空", trigger: "blur" }]
	  })
	const jiebangma=ref(false)
	// 传感器id
	function chuango(i,tire,d){
		if(tire == null || tire == ''){
			ElMessage.error("请先选择轮胎")
		}else{
			chuanid.value=true
			if(i == null){//绑定
			chuanfrom.value={}
				jiebangma.value=true
			}else{
				chuanfrom.value.senderId=i
				jiebangma.value=false
			}
			chuanfrom.value.tireNo=tire
			chuanfrom.value.tireId=d
		}
	}
	
	// 提交解绑，绑定
	function jiebangfun (){
		jiebang(chuanfrom.value.tireId).then(res=>{
			if(res.code == 200){
				chuanid.value=false
				tableData.value[0].senderId=null
				newtiretable.value[0].senderId=null
				getpicture(vechid.value,chenindev.value)
				ElMessage.success("解绑成功")
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	function bangdingfun (){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 bangding(chuanfrom.value).then(res => { 
			 	if(res.code == 200){
					chuanid.value=false
					getpicture(vechid.value,chenindev.value)
			 		tableData.value[0].senderId=chuanfrom.value.senderId
					newtiretable.value[0].senderId=chuanfrom.value.senderId
					ElMessage.success("绑定成功")
			 	}else{
			 		ElMessage.error(res.message)
			 	}
			 }) 
		  }
		  })
	}
	// 拆卸提交
	function tiredetails(){
		// let flag=/^[0-9]+(\.\d+)?$/
		let meeslins=tableData.value[0].measuredDepth
		if(tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus == undefined){
			ElMessage.error('请选择拆去方向')
			return false
		}else if(tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus == 50 && tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == undefined){
			ElMessage.error('请选择报废类型')
			return false
		}else if(tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus == 50 && tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].isRenovate == undefined){
			ElMessage.error('请选择是否翻新')
			return false
		}else if(tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == "1" && tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType == undefined){
			ElMessage.error('请选择问题类型')
			return false
		}else if(
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].questionType != undefined && 
		questionContent.value.length == 0 && 
		questionContentt.value.length == 0 && 
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].stockStatus == '50' &&
		tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].scrappingType == '1'){
			ElMessage.error('请选择问题')
			return false
		}else if(tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].cost<0){
			ElMessage.error('拆卸费用不能为负数')
			return false
		}else if(tableData.value[0].indexDepth>meeslins){
			ElMessage.error('对不起，上次实测花纹深度是【' + meeslins + 'mm】您本次输入的实测花纹深度不能大于上次的实测花纹深度')
			return false
		}else{
			tableData.value[0].depth=tableData.value[0].indexDepth
			tableData.value[0].tireMaintenanceBo.totalCost=tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].cost
			tableData.value[0].tireMaintenanceBo.tireMaintenanceDetailBos[0].tireId=tableData.value[0].tireId
			tiredetail(tableData.value[0]).then(res=>{
				if(res.code == 200){
					ElMessage.success("轮胎拆卸成功")
					getpicture(vechid.value,chenindev.value)
					open.value=false
					dilogs.$patch({ tirelist: true })
				}else{
					ElMessage.error(res.message)
				}
			})
		}
	}
	function changelist(val){
		ruleForm.value.fleetId=val.deptId
		getList()
	}
	
	onMounted(() => {
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		vehicleNo().then(res => {
			if (res.code == 200) {
				vehicleNoo.value = res.data.items
			}
		})
		getList()
		getUser()
	})
	
</script>
<style scoped>
	:dee(.el-radio) {
		margin-right: 5px;
	}
	:deep(.el-radio.is-bordered + .el-radio.is-bordered) {
		margin-left: 0;
	}
	.app-container {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		height: 100vh;
	}
	.float-left {
		padding-right: 20px;
	}
	.luntai {
		height: 100%;
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
		width: 280;
	}
	.float-center {
		width: calc(100% - 300px);
		min-width: 400px;
		background-color: #f0f1f6;
		height: 100%;
		overflow-y: scroll;
	}
	.float-center h4 {
		background-color: #e1eefa;
		text-align: center;
		width: 100%;
		line-height: 48px;
		margin: 0;
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
	.float-right li span {
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
	.lundow,.luntop {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
	.greefont {
		color: green;
		position: absolute;
		margin-top: 125px;
		font-size: 16px;
	}
	:deep(.pagination-container .el-pagination) {
		left: -22px !important;
	}
	:deep(.el-pagination.is-background .el-pager li) {
		margin: 0 2px !important;
	}
	:deep(.el-pagination) {
		width: 320px;
	}
	.anzhuang {
		text-align: center;
		margin-top: 30px;
	}
	:deep(.pagination-container .el-pagination) {
		left: 0px !important;
	}
	:deep(.el-pagination.is-background .el-pager li) {
		margin: 0 2px !important;
	}
	:deep(.el-pagination) {
		width: 263px;
	}
	/* 轮位图 */
	.luntop {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 20px;
	}
	.baiban {
		background: url("../../../assets/images/tyjk_lt_bai.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: black;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.down {
		transform: rotate(90deg);
	}
	.lunbox {
		background: url("../../../assets/images/tyjk_lt_img2.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: black;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.lunbox2 {
		background: url("../../../assets/images/tyjk_lt_img2-2.png");
		height: 130px;
		width: 100px;
		background-size: 100% 100%;
		color: black;
		font-size: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.decs{
		font-size: 14px;
		margin-top: 10px;
		width: 100px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		height: 30px;
	}
	.decs p{
		text-align: center;
		white-space: nowrap;
	}
	.down .decs{
		transform: rotate(270deg);
		margin-top: 0;
		margin-left: 130px;
	}
	.hubstyle{
		border: 3px solid rgb(112, 192, 91);
		border-radius: 10px;
	}
	.hubred{
		border: 3px solid red;
		border-radius: 10px;
	}
	.widtwo:nth-child(odd){
		width: 200px;
	}
	.widone:nth-child(even){
		width: 200px;
	}
	.checkedli{
		background-color: #e1eefa;
	}
	.checkedli span{
		color: #407fbd;
	}
	/* .float-left .checkedli{
		color:#407fbd;
		border-bottom: 1px solid #407fbd;
	} */
</style>