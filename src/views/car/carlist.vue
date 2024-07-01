<template>
  <div class="app-container">
    <el-form label-width="75px">
      <el-form-item label="组织名称">
		<el-tree-select
		:default-expand-all="true"
		   v-model="ruleForm.fleetId"
		   :data="deptOptions"
		   :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
		   value-key="deptId"
		   placeholder="选择组织"
		   check-strictly
		/>
      </el-form-item>
        <el-form-item label="车牌号">
         <el-select
         placeholder="请输入车牌号" 
         v-model="ruleForm.mainNumber"
         :clearable="true"
         filterable
         :loading="loading"
         >
           <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
         </el-select>
        </el-form-item>
        <el-form-item label="接收器ID">
          <el-input v-model="ruleForm.receiverId" placeholder="请输入接收器ID"></el-input>
        </el-form-item>
		<!-- <el-form-item label="报警类型">
		  <el-select  v-model="ruleForm.monitorStatus" clearable>
			<el-option
			v-for="dict in alarm_type"
			  :key="dict.value"
			  :label="dict.label"
			  :value="dict.value"
			></el-option>
		  </el-select>
		</el-form-item> -->
		<el-form-item label="运营状态">
		  <el-select  v-model="ruleForm.operationStatus" clearable>
			<el-option label="全部" value="" />
		   <el-option label="正常" :value="0" />
		   <el-option label="已报废" :value="1" />
		  </el-select>
		</el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
      <el-button @click="exportlist" v-hasPermi="['tpms:vehicles:export']"><i class="el-icon-upload2"></i>导出</el-button>
    </div>
    <el-radio-group v-model="ruleForm.versionType" @change="getList">
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button :label="5002">硬件版</el-radio-button>
	  <el-radio-button :label="5001">纯软件版</el-radio-button>
    </el-radio-group>


    <!-- 表格操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain :disabled="multiple" @click="handleAdd"
          v-hasPermi="['tpms:vehicles:edit']">车辆调拨</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain v-hasPermi="['tpms:vehicles:add']"  @click="handleUpdate()">车辆增加</el-button>
      </el-col>
	  <el-col :span="1.5">
	    <el-button
	       type="info"
	       plain
	       icon="Upload"
		   v-hasPermi="['tpms:vehicles:add']"
	       @click="handleImport"
	    >导入</el-button>
	  </el-col>
    </el-row>

    <el-table  :data="tableData" v-loading="loading"  @selection-change="handleSelectionChange" @sort-change="headerclick($event)">
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" sortable="custom" align="center" prop="number"  width="55"/>
      <el-table-column label="车牌号" sortable="custom" align="center" prop="vehicleNo">
      </el-table-column>
      <el-table-column label="车辆品牌" sortable align="center" prop="brand" />
      <el-table-column label="所属组织" sortable align="center" prop="fleetName" />
      <el-table-column label="接收器ID" sortable align="center" style="cursor: pointer;" width="180">
		  <template #default="scope">
		  	<span v-if="scope.row.receiverId">{{scope.row.receiverId}}</span>
		  	<span v-if="!scope.row.receiverId" style="color: red;cursor: pointer;" @click="chuango(scope.row.receiverId, scope.row.vehicleNo,scope.row.vehicleId)">[绑定]</span>
		  	<span v-if="scope.row.receiverId"  style="color: green;cursor: pointer;" @click="chuango(scope.row.receiverId, scope.row.vehicleNo,scope.row.vehicleId)">[解绑]</span>
		  </template>
      </el-table-column>
      <el-table-column label="车型" sortable align="center" prop="carClassName" />
      <el-table-column label="GPS累计里程(km)" sortable align="center" prop="totalMileage" width="180" />
      <el-table-column label="软件版累计里程(km)" sortable align="center" prop="remark" width="180" />
      <el-table-column label="报警类型" sortable align="center" prop="alarmType">
		  <template #default="scope">
			<dict-tag :options="alarm_type" :value="scope.row.alarmType" />
		  </template>
	  </el-table-column>
      <el-table-column label="创建时间" sortable align="center" prop="createdTime" />
        <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="primary"
			   @click="handleUpdate(scope.row)"
			  v-hasPermi="['tpms:vehicles:edit']"><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>修改</el-button>
			  <el-button type="danger" link 
			  v-hasPermi="['tpms:vehicles:remove']" 
			  @click="handleDelete(scope.row)"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
			</template>
        </el-table-column>
    </el-table>
   <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="ruleForm.pageNum"
      v-model:limit="ruleForm.pageSize"
      @pagination="pagegetlist"
   />
    <!-- 轮胎详情 -->
    <el-dialog :title="title" v-model="open" width="80%" append-to-body @close="openclose" :close-on-click-modal="false">
        <el-form label-width="130px" :model="form" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
          <div class="formdiv">
			<el-form-item label="建车类型" prop="truckType">
				<el-radio-group v-model="form.truckType" :disabled ='ischecked'>
				  <el-radio-button :label="10">主车</el-radio-button>
				  <el-radio-button :label="20">挂车</el-radio-button>
				  <el-radio-button :label="30" v-if="!ischecked">主挂一体</el-radio-button>
				</el-radio-group>
			</el-form-item>
            <el-form-item label="所属组织" prop="fleetId">
             <!-- <el-select
              placeholder="请输入组织名称" 
              v-model="form.fleetId"
              filterable
              :clearable="true"
              :loading="loading"
			  @change="changfeeid($event)"
              >
                <el-option v-for="(item,index) in carcompanydata"  :label="item.teamName" :value="item.fleetId" :key="index" />
              </el-select> -->
			  <el-tree-select
			  :default-expand-all="true"
			     v-model="form.fleetId"
			     :data="deptOptions"
			     :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
			     value-key="deptId"
			     placeholder="选择组织"
			     check-strictly
			  	@node-click="changfeeid"
			  />
            </el-form-item>
            <el-form-item label="车分类" prop="category" >
              <el-select v-model="form.category" clearable :disabled="isdid">
               <el-option label="客车" :value="40" />
               <el-option label="卡车" :value="50" />
               <el-option label="工程车" :value="60" />
              </el-select>
            </el-form-item>
            <el-form-item label="主车车型" v-if="form.truckType != 20" prop="carClass">
              <el-select v-model="form.carClass" clearable  @change="carclasschange">
               <el-option
                  v-for="dict in car_class"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
               ></el-option>
              </el-select>
            </el-form-item>
			<el-form-item label="拖车车牌号"  v-if="form.truckType != 10" prop="trailCarNo">
			   <el-input v-model="form.trailCarNo"></el-input>
			</el-form-item>
			<el-form-item label="拖车轴数" v-if="form.truckType  != 10" prop="trailCarAxle">
			  <el-select v-model="form.trailCarAxle" clearable >
			   <el-option label="1根轴" value="1"/>
			   <el-option label="2根轴" value="2"/>
			   <el-option label="3根轴" value="3"/>
			   <el-option label="4根轴" value="4"/>
			  </el-select>
			</el-form-item>
			<el-form-item label="拖车显示车牌号" v-if="form.truckType  != 10" prop="trailCarNoShow">
			  <el-select v-model="form.trailCarNoShow" clearable >
			   <el-option label="隐藏" :value="0"/>
			   <el-option label="显示" :value="1"/>
			  </el-select>
			</el-form-item>
            <el-form-item label="主车车牌号" v-if="form.truckType != 20" prop="vehicleNo">
               <el-input v-model="form.vehicleNo"></el-input>
            </el-form-item>
            <el-form-item label="发动机号" v-if="form.truckType != 20" prop="engineNumber">
              <el-input v-model="form.engineNumber"></el-input>
            </el-form-item>
            <el-form-item label="车主" prop="vehicleOwner">
              <el-input v-model="form.vehicleOwner"></el-input>
            </el-form-item>
			<el-form-item label="系统版本" prop="systemVersion">
			  <el-select v-model="form.systemVersion" clearable >
			   <el-option label="硬件版" :value="5002"/>
			   <el-option label="纯软件版" :value="5001"/>
			  </el-select>
			</el-form-item>
            <el-form-item label="动力类型" prop="engineType">
              <el-select v-model="form.engineType" clearable >
              <!-- <el-option label="燃油车" :value="101"/>
               <el-option label="燃汽车" :value="102"/>
			   <el-option label="油电混合" :value="103"/>
			   <el-option label="气电混合" :value="104"/>
			   <el-option label="纯电动" :value="105"/>
			   <el-option label="氢能源" :value="106"/>
			    <el-option label="其他" :value="107"/> -->
				<el-option
				v-for="dict in car_power"
				  :key="dict.value"
				  :label="dict.label"
				  :value="dict.value"
				></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="所属司机" prop="driverId">
			  <el-select
			  placeholder="请输入组织名称" 
			  v-model="driverId"
			  filterable
			  :clearable="true"
			  :loading="loading"
			   @change="handleRoleChange"
			  >
			    <el-option v-for="(item,index) in drivelist" :label="item.driverName" :value="`${item.driverId},${item.driverName}`" :key="index" />
			  </el-select>
            </el-form-item> -->
			<el-form-item label="里程统计方式" prop="mileageStatType">
				<el-radio-group v-model="form.mileageStatType" :disabled ='ischecked'>
				  <el-radio :label="2001" >以GPS为准</el-radio>
				  <el-radio :label="2002">以拆装公里表为准</el-radio>
				  <el-radio :label="2003">以手工录入为准</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="累计里程" prop="totalMileage">
			  <el-input placeholder="单位km" v-model="form.totalMileage"></el-input>km
			</el-form-item>
          </div>
          <div class="formdiv">
            <el-form-item label="车辆品牌" prop="s">
				<el-select
				 v-model="form.brand"
				 filterable
				 remote
				 :clearable="true"
				 >
				 <el-option :label="item.paramName" :value="item.paramName"  v-for="(item,index) in chebans" :key="index" />
				 </el-select>
            </el-form-item>
			<el-form-item label="拖车车型" v-if="form.truckType  != 10" prop="trailCarType">
			  <el-select v-model="form.trailCarType" clearable @change="trailCarTypechange($event)">
			 <el-option
			     v-for="dict in gaucar_class"
			     :key="dict.value"
			     :label="dict.label"
			     :value="dict.value"
			  ></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="智能挂甩" v-if="form.truckType  != 10" prop="dumpCar">
			  <el-select v-model="form.dumpCar" clearable >
			   <el-option label="是" :value="1"/>
			   <el-option label="否" :value="0"/>
			  </el-select>
			</el-form-item>
            <el-form-item label="车辆自编号"  v-if="form.truckType != 20" prop="selfNumber">
              <el-input v-model="form.selfNumber"></el-input>
            </el-form-item>
            <el-form-item label="车架号"   v-if="form.truckType != 20" prop="vin">
              <el-input v-model="form.vin"></el-input>
            </el-form-item>
            <el-form-item label="线路" prop="route">
              <el-input v-model="form.route"></el-input>
            </el-form-item>
			<!-- <el-form-item label="绑定接收器ID"  v-if="form.truckType != 20">
			  <el-input v-model="form.receiverId"></el-input>
			</el-form-item> -->
           <el-form-item label="初始公里表"  prop="initMileage">
              <el-input  v-model="form.initMileage" placeholder="单位km"></el-input>km
            </el-form-item>
          </div>
		  <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>车辆气压阈值设置</p>
		   <div class="formdiv">
			   <el-form-item label="高温阈值" prop="highTemperature">
			     高于<el-input v-model="form.highTemperature"></el-input>℃  
			   </el-form-item>
			   <el-form-item label="低压阈值" prop="lowPressure">
			     低于<el-input  v-model="form.lowPressure"></el-input>bar
			   </el-form-item>
		   </div>
		    <div class="formdiv">
				<el-form-item label="高压阈值" prop="highPressure">
				  高于<el-input v-model="form.highPressure"></el-input>bar 
				</el-form-item>
			</div>
			<p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>车辆气压标准值设置</p>
			<div class="formdiv">
				<el-form-item label="标准气压值" prop="standardPressure">
				  <el-input  v-model="form.standardPressure"></el-input>bar
				</el-form-item>
			</div>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform">确定</el-button>
          <el-button @click="openclose">取消</el-button>
        </div>
    </el-dialog>
	
	
	<!-- 解绑dilog -->
	<el-dialog title="绑定接收器ID" v-model="jiebang" width="30%" append-to-body :close-on-click-modal="false">
	  <el-form label-width="150px" style="flex-wrap: wrap;">
	      <el-form-item label="车牌号" >
	  		<el-input v-model="chuanfrom.vehicleNo" disabled></el-input>
	  	</el-form-item>
	  	<el-form-item label="接收器ID">
	  		<el-input v-model="chuanfrom.receiverId " :disabled="!jiebangma"></el-input>
	  	</el-form-item>
	  </el-form>
	  <div style="text-align: center;" slot="footer" class="dialog-footer">
	    <el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
	    <el-button type="primary" v-if="!jiebangma"  @click="jiebangfiun">解绑</el-button>
	    <el-button @click="jiebang=false">取消</el-button>
	  </div>
	</el-dialog>
	
	<!-- 车辆调拨dilog -->
	<el-dialog title="车辆调拨" v-model="diaobo" width="30%" append-to-body :close-on-click-modal="false">
		选择组织
		<!-- <el-select
		placeholder="请输入组织名称" 
		v-model="changfid"
		filterable
		:clearable="true"
		:loading="loading"
		>
		  <el-option :label="item.teamName" :value="Number(item.fleetId) " v-for="(item,index) in carcompanydata" :key="index" />
		</el-select> -->
		<el-form-item>
		<el-tree-select
		:default-expand-all="true"
		   v-model="changfid"
		   :data="deptOptions"
		   :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
		   value-key="deptId"
		   placeholder="选择组织"
		   check-strictly
		/>
		</el-form-item>
		 <div style="text-align: center;margin-top: 15px;" slot="footer" class="dialog-footer">
		   <el-button type="primary" @click="tochangefeeid">调拨</el-button>
		   <el-button @click="diaobo=false">取消</el-button>
		 </div>
	</el-dialog>
	
	<!-- 导入对话框 -->
	<el-dialog :title="upload.title" v-model="upload.open"  width="400px" :destroy-on-close="true" append-to-body :close-on-click-modal="false">
	   <el-upload
	      ref="uploadRef"
	      :limit="1"
	      accept=".xlsx, .xls"
	      :headers="upload.headers"
	      :action="upload.url"
	      :on-progress="handleFileUploadProgress"
	      :on-success="handleFileSuccess"
	      :auto-upload="false"
		  name="multipartFile"
	      drag
	   >
	      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
	      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
	      <template #tip>
	         <div class="el-upload__tip text-center">
	            <span>仅允许导入xls、xlsx格式文件。</span>
	         </div>
	      </template>
	   </el-upload>
	   请选择版本：
	   <el-radio-group v-model="versionType" @change="ifchange">
	     <el-radio :label="5002">硬件版</el-radio>
	     <el-radio :label="5001">纯软件版</el-radio>
	   </el-radio-group>
	   <p style="width: 100%;text-align: center;margin-top: 10px;">
		  <el-button  type="primary" @click="mudow">车辆模板下载</el-button> 
	   </p>
	   <template #footer>
	      <div class="dialog-footer">
	         <el-button type="primary" @click="submitFileForm">确 定</el-button>
	         <el-button @click="upload.open=false">取 消</el-button>
	      </div>
	   </template>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Carlist">
	import { ref, onMounted, watch } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {carlist,addcar, carinfo, updatecar,detalcaryes, detalcar, gofeedi, exportcarlist, binds} from '@/api/car.js'
	import {carbands} from '@/api/carlive'
	import {carcompanylist,vehicleNo} from '@/api/systensettings'
	import {actionslist} from '@/api/company.js'
	import { listDept } from "@/api/system/dept";
	import { getToken } from "@/utils/auth";
	const { proxy } = getCurrentInstance();
	const { car_class, gaucar_class, alarm_type,car_power } = proxy.useDict("car_class", "gaucar_class","alarm_type","car_power");
	const deptOptions = ref([]);//组织下拉框
	const vehicleNoo=ref([])//车牌号下拉框
	const carClass=ref('')//未处理的车型
	const trailCarType=ref('')//未处理的gua车型
	const changfid=ref('')
	const ruleForm=ref({
		versionType:'',
		pageNum:1,
		pageSize: 10
	})//搜索框表单
	const total=ref(0)
	const chebans=ref([])
	const open=ref(false)
	const loading=ref(false)
	const tableData=ref([])
	const versionType=ref(5002)
	/*** 导入参数 */
	const upload = reactive({
	  // 是否显示弹出层（用户导入）
	  open: false,
	  // 弹出层标题（用户导入）
	  title: "",
	  // 设置上传的请求头部
	  headers: { Authorization: "Bearer " + getToken() },
	  // 上传的地址
	  url: import.meta.env.VITE_APP_BASE_API + "/v1/vehicles/actions/import?versionType=" + versionType.value
	});
	function ifchange(){
		upload.url=import.meta.env.VITE_APP_BASE_API + "/v1/vehicles/actions/import?versionType=" + versionType.value
	}
	// 排序点击
	function headerclick(e){
		loading.value = true
		// e.preventDefault();
		let num=e.column.no
		let isup= ''
		if(e.order== 'ascending'){
			isup=1
		}else if(e.order== 'descending'){
			isup=0
		}else{
			isup=''
			num=''
		}
		ruleForm.value.fieldSort  = num
		ruleForm.value.fieldSortFlag = isup
		ruleForm.value.pageNum=1
		ruleForm.value.pageSize=10
		carlist(ruleForm.value).then(res=>{
			loading.value = false
				if(res.code ==200){
					tableData.value=res.data.items
					total.value=res.data.total
					loading.value = false
				}else{
					ElMessage.error(res.message)
					loading.value = false
				}
			})
		}
	// table数据
	function getList(){
		 loading.value = true
		 ruleForm.value.fieldSort  = ''
		 ruleForm.value.fieldSortFlag = ''
		carlist(ruleForm.value).then(res=>{
			if(res.code ==200){
				tableData.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.message)
				loading.value = false
			}
		})
	}
	function pagegetlist(){
		loading.value = true
		carlist(ruleForm.value).then(res=>{
			if(res.code ==200){
				tableData.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.message)
				loading.value = false
			}
		})
	}
	// 蒙城表单
	const form=ref({
		truckType:10,
		highTemperature:90,
		lowPressure:6.9,
		highPressure:11.6,
		standardPressure:9,
		mileageType:'2001',
		category:null,
		trailCarNo:'',
		trailCarAxle:'',
		trailCarNoShow:null,
		vehicleNo:"",
		engineNumber:"",
		vehicleOwner:"",
		systemVersion:'',
		engineType:null,
		totalMileage:"",
		brand:"",
		dumpCar:null,
		selfNumber:"",
		vin:"",
		route:"",
		initMileage:"",
		fleetId:null,
		fleetName:'',
		mileageStatType:2001,
	})
	const  rules=ref({
	    fleetId: [{ required: true, message: "所属组织不能为空", trigger: "submit" }],
		category: [{ required: true, message: "车分类不能为空", trigger: "submit" }],
		carClass: [{ required: true, message: "主车车型不能为空", trigger: "submit" }],
		vehicleNo: [{ required: true, message: "主车车牌号不能为空", trigger: "submit" }],
		systemVersion: [{ required: true, message: "系统版本不能为空", trigger: "submit" }],
		engineType: [{ required: true, message: "动力类型不能为空", trigger: "submit" }],
		trailCarNo: [{ required: true, message: "拖车车牌号不能为空", trigger: "submit" }],
		trailCarAxle: [{ required: true, message: "拖车轴数不能为空", trigger: "submit" }],
		trailCarNoShow: [{ required: true, message: "拖车显示车牌号不能为空", trigger: "submit" }],
		trailCarType: [{ required: true, message: "拖车车型不能为空", trigger: "submit" }],
		highTemperature: [{ required: true, message: "高温阈值不能为空", trigger: "submit" },{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "submit",
		}],
		lowPressure: [{ required: true, message: "低压阈值不能为空", trigger: "submit" },{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "submit",
		}],
		highPressure: [{ required: true, message: "高压阈值不能为空", trigger: "submit" },{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "submit",
		}],
		standardPressure: [{ required: true, message: "标准气压值不能为空", trigger: "submit" },{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "submit",
		}],
		totalMileage:[{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "submit",
		}]
	  }) 
	const driverId=ref('')
	const fleed=ref('')
	function handleRoleChange(val){
		let [id,name] = val.split(',')
			form.value.driverId = id
			form.value.driverName = name
	}
	function carclasschange(val){
		car_class.value.map(item=>{
			if(item.value == val){
				form.value.carClassName = item.label
			}
		})
	}
	function trailCarTypechange(val){
		gaucar_class.value.map(item=>{
			if(item.value == val){
				form.value.trailCarTypeName = item.label
			}
		})
	}
	// 取消
	function openclose(){
		open.value=false
		proxy.$refs["menuRef"].clearValidate();
	}
	function changfeeid(val){
		// console.log(val)
		// carcompanydata.value.map(item=>{
		// 	if(item.fleetId == val){
		// 		form.value.fleetName = item.teamName
		// 	}
		// })
		form.value.fleetName = val.deptName
	}
	// 车辆新增/修改
	const ischecked = ref(false)
	const title=ref('')
	const handleUpdate=function(row){
			 if(row){
				 rules.value={
				 	fleetId: [{ required: true, message: "所属组织不能为空", trigger: "change" }],
				 	category: [{ required: true, message: "车分类不能为空", trigger: "change" }],
				 	carClass: [{ required: true, message: "主车车型不能为空", trigger: "change" }],
				 	vehicleNo: [{ required: true, message: "主车车牌号不能为空", trigger: "change" }],
				 	systemVersion: [{ required: true, message: "系统版本不能为空", trigger: "change" }],
				 	engineType: [{ required: true, message: "动力类型不能为空", trigger: "change" }],
				 	trailCarNo: [{ required: true, message: "拖车车牌号不能为空", trigger: "change" }],
				 	trailCarAxle: [{ required: true, message: "拖车轴数不能为空", trigger: "change" }],
				 	trailCarNoShow: [{ required: true, message: "拖车显示车牌号不能为空", trigger: "change" }],
				 	trailCarType: [{ required: true, message: "拖车车型不能为空", trigger: "change" }],
				 	highTemperature: [{ required: true, message: "高温阈值不能为空", trigger: "change" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "change",
					}],
				 	lowPressure: [{ required: true, message: "低压阈值不能为空", trigger: "change" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "change",
					}],
				 	highPressure: [{ required: true, message: "高压阈值不能为空", trigger: "change" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "change",
					}],
				 	standardPressure: [{ required: true, message: "标准气压值不能为空", trigger: "change" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "change",
					}],
					totalMileage:[{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "change",
					}]
				 }
				 carinfo(row.vehicleId).then(res=>{
					form.value=res.data 
					form.value.fleetId=res.data.fleetId
					form.value.carClass=res.data.carClass.toString()
					form.value.trailCarType=res.data.trailCarType.toString()
					driverId.value=res.data.driverId + "," + res.data.driverName
					fleed.value=res.data.fleetId + "," + res.data.fleetName
					form.value.mainvehicleNo=res.data.vehicleNo
				 })
				ischecked.value=true
				 form.value=row
				  open.value = true;
				 title.value = "修改车辆";
			 }else{
				 ischecked.value=false
				 form.value={
				 	mileageStatType:2001,
				 		truckType:10,
				 		highTemperature:90,
				 		lowPressure:6.9,
				 		highPressure:11.6,
				 		standardPressure:9,
				 		mileageType:'2001',
				 		category:null,
				 		trailCarNo:'',
				 		trailCarAxle:'',
				 		trailCarNoShow:null,
				 		vehicleNo:"",
				 		engineNumber:"",
				 		vehicleOwner:"",
				 		systemVersion:null,
				 		engineType:null,
				 		totalMileage:"",
				 		brand:"",
				 		dumpCar:null,
				 		selfNumber:"",
				 		vin:"",
				 		route:"",
				 		initMileage:"",
				 		fleetId:null
				 	}
				 rules.value={
				 	fleetId: [{ required: true, message: "所属组织不能为空", trigger: "blur" }],
				 	category: [{ required: true, message: "车分类不能为空", trigger: "blur" }],
				 	carClass: [{ required: true, message: "主车车型不能为空", trigger: "blur" }],
				 	vehicleNo: [{ required: true, message: "主车车牌号不能为空", trigger: "blur" }],
				 	systemVersion: [{ required: true, message: "系统版本不能为空", trigger: "blur" }],
				 	engineType: [{ required: true, message: "动力类型不能为空", trigger: "blur" }],
				 	trailCarNo: [{ required: true, message: "拖车车牌号不能为空", trigger: "blur" }],
				 	trailCarAxle: [{ required: true, message: "拖车轴数不能为空", trigger: "blur" }],
				 	trailCarNoShow: [{ required: true, message: "拖车显示车牌号不能为空", trigger: "blur" }],
				 	trailCarType: [{ required: true, message: "拖车车型不能为空", trigger: "blur" }],
				 	highTemperature: [{ required: true, message: "高温阈值不能为空", trigger: "blur" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "blur",
					}],
				 	lowPressure: [{ required: true, message: "低压阈值不能为空", trigger: "blur" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "blur",
					}],
				 	highPressure: [{ required: true, message: "高压阈值不能为空", trigger: "blur" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "blur",
					}],
				 	standardPressure: [{ required: true, message: "标准气压值不能为空", trigger: "blur" },{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "blur",
					}],
					totalMileage:[{
					   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
					   message: "格式不正确",
					   trigger: "blur",
					}]
				 }
					driverId.value=''
					open.value = true;
					title.value = "新建车辆"
			 }
	}
	
	  
	  // 添加，修改车辆
	  function subform(){
		  proxy.$refs["menuRef"].validate(valid => {
		    if (valid) {
				if(Number(form.value.highPressure) < Number(form.value.lowPressure) ){
					ElMessage.error("对不起，低压阈值不能高于高压阈值")
					return false
				}else if(Number( form.value.highPressure) < Number(form.value.standardPressure) ){
					ElMessage.error("对不起，标准气压阈值不能高于高压阈值")
					return false
				} else{
					if(form.value.initMileage == '' || form.value.initMileage == null ){
						form.value.initMileage=0
					}
					if(form.value.totalMileage == '' || form.value.totalMileage == null ){
						form.value.totalMileage=0
					}
					if(form.value.vehicleId){
						updatecar(form.value).then(res=>{
							if(res.code == 200){
								open.value=false
								ElMessage.success("修改成功")
								getList()
							}else{
								ElMessage.error(res.message)
							}
						})
					}else{
						if(form.value.mileageStatType == '2001'){
							form.value.mileageStatTypeName="以GPS为准"
						}else if(form.value.mileageStatType == '2002'){
							form.value.mileageStatTypeName='以拆装公里表为准 '
						}else{
							form.value.mileageStatTypeName='以手工录入为准'
						}
						if(form.value.category == 40){
							form.value.categoryName='客车'
						}else if(form.value.category == 50){
							form.value.categoryName='卡车'
						}else if(form.value.category == 60){
							form.value.categoryName='工程车'
						}
						addcar(form.value).then(res=>{
							if(res.code == 200){
							 open.value=false
							 ElMessage.success("添加成功")
							 getList()
							}else{
							 ElMessage.error(res.message)
							}
						})
					}
				}
			}
		})
	  }
	  // 解绑车辆
     const jiebang=ref(false)
	const jiabangba=function(i){
	 	jiebang.value=true
	 }
	onMounted(()=>{
		getList()
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		
		// 车辆品牌
		carbands().then(res=>{
			chebans.value=res.data
			// console.log(chebans.value)
		})
	})
	
	function mudow(){
		window.open('https://tpms.5i84.cn/img/moban/车辆导入模板20240115.xls')
	}
	// 新增表单选项变化
	const isdid=ref(false)//车分类是否可以操控
	watch(() => form.value.truckType, (val) => {
		if(val == 10){//主车
			isdid.value =false
		}else if(val == 20){//挂车
			isdid.value = true
			form.value.category =50
		}else if(val == 30){//主挂一体
			isdid.value = true
			form.value.category =50
		}
	})
	
	
	const diaobo=ref(false)
	const  ids=ref([])
	const single=ref(true) //单个
	const multiple=ref(true)//多个
	  // 多选框选中数据
	const handleSelectionChange=function(selection){
		ids.value = selection.map(item => item.vehicleId)
		single.value = selection.length != 1
		multiple.value = !selection.length
	}
	 
	 /** 删除按钮操作 */
	const handleDelete=function (row) {
	   const idss = row.vehicleId;
	   ElMessageBox.confirm(
	      '确定删除车牌号为' + row.vehicleNo + "车辆吗？",
	      '注意',
	      {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning',
	      }
	    ).then(() => {
			detalcaryes(idss).then(res=>{
				if(res.data){
					detalcar(idss).then(ress=>{
					  ElMessage({
						type: 'success',
						message: '删除成功',
					  })
					  getList()
					})
				}else{
					ElMessage({
						type: 'error',
						message: '车辆已绑定接收器，请先解绑',
					})
				}
			})
	      }).catch(() => {
	        ElMessage({
	          type: 'info',
	          message: res.message,
	        })
	      })
	 }
	//  车辆调拨
	//  // 仓库轮胎调拨
	 const handleAdd=function(row){
		diaobo.value=true
	 }
	function tochangefeeid(){
		gofeedi({
			array:ids.value.toString() ,
			vehicleIds:changfid.value
		}).then(res=>{
			if(res.code == 200){
				ElMessage({
				  type: 'success',
				  message: '调拨成功',
				})
			diaobo.value=false
			getList()
			}else{
				ElMessage({
				  type: 'info',
				  message: res.message
				})
			}
		})
	}
	
	// 导出车辆列表
	function exportlist(){
		ruleForm.value.pageNum=1,
		ruleForm.value.pageSize= 100000
		exportcarlist(ruleForm.value).then(res=>{
			downloadFiles(res)
		})
	}
// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "车辆列表.xls";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "车辆列表.xls");
	    } else {
	        // Firefox version
	        var file = new File([data], "车辆列表.xls", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	// 导入
	function handleImport(){
		upload.title = "车辆批量导入";
		upload.open = true;
	}
	/**文件上传中处理 */
	const handleFileUploadProgress = (event, file, fileList) => {
	  upload.isUploading = true;
	};
	/** 文件上传成功处理 */
	const handleFileSuccess = (response, file, fileList) => {
		if(response.code ==200){
			upload.open = false;
			upload.isUploading = false;
			proxy.$refs["uploadRef"].handleRemove(file);
			proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
			getList();
		}else{
			upload.open = false;
			upload.isUploading = false;
			ElMessage({
			  type: 'error',
			  message: response.msg
			})
		}
	 
	};
	/** 提交上传文件 */
	function submitFileForm() {
	  proxy.$refs["uploadRef"].submit();
	};
	
	// 接收器id
	const jiebangma=ref(false)
	const chuanfrom=ref({})
	function chuango(i,t,id){
		jiebang.value=true
		if(i == null){//绑定
			chuanfrom.value={}
			jiebangma.value=true
		}else{
			jiebangma.value=false
			chuanfrom.value.receiverId=i
		}
		chuanfrom.value.vehicleNo=t
		chuanfrom.value.id=id
	}
	// 提交绑定，解绑
	function bangdingfun(){
		// console.log(chuanfrom.value.receiverId)
		if(chuanfrom.value.receiverId == undefined ||chuanfrom.value.receiverId == ''){
			ElMessage({
			  type: 'error',
			  message: '传感器id不能为空'
			})
			return false
		}else{
			binds({
				vehicleId:chuanfrom.value.id,
				info:{
					bindStatus:0,
					receiverId:chuanfrom.value.receiverId
				}
			}).then(res=>{
				if(res.code == 200){
					ElMessage({
					  type: 'success',
					  message: '绑定成功'
					})
					jiebang.value=false
				getList()
				}else{
					ElMessage({
					  type: 'info',
					  message: res.message
					})
				}
			})
		}
	}
	function jiebangfiun(){
		binds({
			vehicleId:chuanfrom.value.id,
			info:{
				bindStatus:1
			}
		}).then(res=>{
			if(res.code == 200){
				ElMessage({
				  type: 'success',
				  message: '解绑成功'
				})
				jiebang.value=false
			getList()
			}else{
				ElMessage({
				  type: 'info',
				  message: res.message
				})
			}
		})
	}
	
</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
    justify-content:left;
	flex-wrap: wrap;
  }

  :deep(.el-date-editor--daterange.el-input__inner){
    width: auto;
    max-width: 209px;
  }

  .pagedove {
	font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
	color: #606266;
	padding-right: 8px;
	margin-top:10px;
  }
  :deep(.pagination-container) {
	  margin: 0;
	  padding: 0;
  }

  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 230px !important;
  }
  .mb8{
	  margin-top: 20px;
  }
  .formdiv{
	  width: 45%;
  }
  .line{
	  width:100%;
	  border-bottom:1px solid #ccc;
	  margin: 20px 0;
	  font-size: 14px;
	  color: #ccc;
	  display: flex;
	  align-items: center;
  }
 :deep(.el-form-item__content) {
	  display: flex;
	  align-items: center;
  }
  :deep(.el-input){
	  width: 80%;
  }
  :deep(.el-select){
	  width:100% !important;
  }
  
</style>
