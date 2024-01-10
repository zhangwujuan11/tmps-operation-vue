<template>
	<div class="app-container">
		<div class="pireinf">
			<el-form label-width="75px">
				<el-form-item label="所属仓库">
					<el-select placeholder="请选择所属仓库" v-model="queryform.warehouseId" filterable :clearable="true">
						<el-option :label="item.warehouseName" :value="item.id" v-for="(item,index) in houselist"
							:key="index" />
					</el-select>
				</el-form-item>
				<el-form-item label="轮毂编号">
					<el-input v-model="queryform.hubNo"	 placeholder="请输入轮毂编号"></el-input>
				</el-form-item>
				
				<el-form-item label="材质">
					<el-select placeholder="请选择材质" v-model="queryform.material" :clearable="true">
						<el-option :label="item.paramName" :value="item.paramCode"
							v-for="(item,index) in caizhi" :key="index" >
						</el-option>	
					</el-select>
				</el-form-item>
				
			</el-form>
		</div>
		<div style="text-align: center;">
			<el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		</div>
		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain @click="addhub" v-hasPermi="['tpms:hub:add']">轮毂入库</el-button>
			</el-col>
			<el-col :span="1.5">
			  <el-button type="primary" plain  :disabled="multiple" @click="diaobo = true"
			    v-hasPermi="['tpms:tireWarehouse:edit']">仓库轮毂调拨</el-button>
			</el-col>
		</el-row>
		<el-table :data="dataList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="孔距" sortable align="center" prop="boltPattern" :formatter="konfun"/>
			<el-table-column label="品牌" sortable align="center" prop="brand" :formatter="statusFormat">
			</el-table-column>
			<el-table-column  label="轮毂编号" sortable align="center" prop="hubNo"/>
			<el-table-column label="材质" sortable align="center" prop="material"  :formatter="caifun">
			</el-table-column>
			<el-table-column label="安装状态" sortable align="center" prop="install">
				<template #default="scope">
					{{scope.row.install == 0? "已上车" :"未上车"}}
				</template>
			</el-table-column>
			<el-table-column label="型号" sortable align="center" prop="model" :formatter="xinfun"/>
			<el-table-column label="价格" sortable align="center" prop="price">
			</el-table-column>
			<el-table-column label="传感器ID" sortable align="center" prop="senderId" width="120">
				  <template #default="scope">
						<span v-if="!scope.row.senderId"  @click="chuango(scope.row.senderId,scope.row.id,scope.row.hubNo)" style="color: red;cursor: pointer;">暂无[绑定]</span>
						<span  @click="chuango(scope.row.senderId,scope.row.id,scope.row.hubNo)" v-else style="color: green;cursor: pointer;">{{scope.row.senderId}} [解除]</span>  
				  </template>
			</el-table-column>
			<el-table-column label="尺寸" sortable align="center" prop="size" :formatter="chifun"/>
			<el-table-column label="仓库名称" sortable align="center" prop="warehouseName" />
			<el-table-column label="螺纹规格" sortable align="center" prop="threadSpec" width="120" :formatter="luofun">
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding" width="150">
				<template #default="scope">
					<el-button link type="primary" @click="goxiang(scope.row)" v-hasPermi="['tpms:hub:edit']">
						<Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情
					</el-button>
					<el-button type="danger" link v-hasPermi="['tpms:hub:remove']" @click="detire(scope.row.id)">
						<Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
			v-model:limit="queryform.pageSize" @pagination="getList" />
		<!-- 轮毂详情 -->
		<el-dialog :title="title" v-model="open" width="50%" append-to-body   @close="openclose" :close-on-click-modal="false">
			<el-form label-width="100px" :rules="rules" ref="menuRef" :model="form" :validate-on-rule-change="false">
				<div class="subbox">
					<!-- <el-form-item label="所属组织" prop="companyId">
					   <el-tree-select
						:default-expand-all="true"
						  v-model="form.companyId"
						  :data="deptOptions"
						  :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
						  value-key="deptId"
						  placeholder="选择组织"
						  check-strictly
						@node-click="changelist"
					   />
					</el-form-item> -->
					<el-form-item label="所属仓库" prop="warehouseId">
						<el-select placeholder="请输入所属仓库" v-model="form.warehouseId" filterable remote :clearable="true"
							@change="warehouse($event)">
							<el-option :label="item.warehouseName" :value="item.id"
								v-for="(item,index) in houselist" :key="index" />
						</el-select>
					</el-form-item>
					<el-form-item label="品牌" prop="brand">
						<el-select placeholder="请选择品牌" v-model="form.brand" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in pinpai" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
					<el-form-item label="轮毂编号" prop="hubNo">
						<el-input placeholder="轮毂编号" v-model="form.hubNo"></el-input>
						<span style="margin-left: 5px;color: blue;font-size: 12px;cursor: pointer;"
							@click="getda">虚拟生成</span>
					</el-form-item>
					<el-form-item label="绑定传感器" prop="senderId">
						<el-input v-model="form.senderId" placeholder="请输入绑定传感器"></el-input>
					</el-form-item>
					<el-form-item label="材质" prop="material">
						<el-select placeholder="请选择材质" v-model="form.material" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in caizhi" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
				</div>
				<div class="subbox">
					<el-form-item label="孔距" prop="boltPattern">
						<el-select placeholder="请选择孔距" v-model="form.boltPattern" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in kongju" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
					<el-form-item label="型号" prop="model">
						<el-select placeholder="请选择型号" v-model="form.model" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in xinhao" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
					<el-form-item label="价格" prop="price">
						<el-input placeholder="请输入价格" v-model="form.price"></el-input>
					</el-form-item>
					<el-form-item label="尺寸" prop="size">
						<el-select placeholder="请选择尺寸" v-model="form.size" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in chicun" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
					<el-form-item label="螺纹规格" prop="threadSpec">
						<el-select placeholder="请选择螺纹规格" v-model="form.threadSpec" :clearable="true">
							<el-option :label="item.paramName" :value="item.paramCode"
								v-for="(item,index) in guige" :key="index" >
							</el-option>	
						</el-select>
					</el-form-item>
					
					<el-form-item label="备注" prop="remark">
						<el-input placeholder="请输入备注" v-model="form.remark"></el-input>
					</el-form-item>
				</div>
			</el-form>
			<div style="text-align: center;" slot="footer" class="dialog-footer">
				<el-button type="primary" @click="subform" v-if="isshow">确定</el-button>
				<el-button type="primary" @click="subformipda" v-if="!isshow">确定修改</el-button>
				<el-button @click="openclose">取消</el-button>
			</div>
		</el-dialog>
		<!-- 传感器id -->
		<el-dialog title="绑定传感器" v-model="chuanid" width="40%" append-to-body :close-on-click-modal="false">
			<el-form label-width="150px" style="flex-wrap: wrap;"  ref="subref" :model="chuanfrom">
				<el-form-item label="轮毂编号">
					<el-input v-model="chuanfrom.hubNo" disabled></el-input>
				</el-form-item>
				<el-form-item label="传感器ID" prop="senderId">
					<el-input v-model="chuanfrom.senderId" :disabled="!jiebangma"></el-input>
				</el-form-item>
				<!-- <el-form-item label="绑定方式" prop="senderType">
					<el-select :disabled="!jiebangma" placeholder="请选择绑定方式" v-model="chuanfrom.senderType " filterable
						:clearable="true">
						<el-option :label="item.label" :value="item.value"
							v-for="(item,index) in lifecycle_tire_sendertype" :key="index" />
					</el-select>
				</el-form-item> -->
			</el-form>
			<div style="text-align: center;" slot="footer" class="dialog-footer">
				<el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
				<el-button type="primary" v-if="!jiebangma" @click="jiebangfun">解绑</el-button>
				<el-button @click="chuanid=false">取消</el-button>
			</div>
		</el-dialog>
		<!-- //详情 -->
		<el-dialog :title="dangan" v-model="xiangqing" width="85%" >
		    <el-tabs v-model="activeName" class="demo-tabs">
		       <el-tab-pane label="轮毂详情" name="first">
				  <cartirefrom 
				  :updateform="updateform" 
				  :kongju="kongju" 
				  :pinpai="pinpai" 
				  :chexin="chexin" 
				  :guige="guige"
				   :caizhi="caizhi"
				  :chicun="chicun" 
				  :xinhao="xinhao" 
				  :houselist="houselist"
				  :xiangqing="xiangqing" 
				   @onReceiveMsg="onReceiveMsg"
				  @onReceive="onReceive"></cartirefrom>
			   </el-tab-pane>
		       <el-tab-pane label="轮毂生命周期" name="second">
				   <carlive :tid="tid" :senderId="updateform.senderId"></carlive>
			   </el-tab-pane>
		     </el-tabs>
		</el-dialog>
		<!-- 仓库轮毂调拨 -->
		<el-dialog title="仓库轮毂调拨" v-model="diaobo" width="45%" append-to-body :close-on-click-modal="false">
		    <el-form label-width="150px" style="flex-wrap: wrap;">
		        <el-form-item label="选择仓库" style="width: 85%;display: flex;">
		          <el-select
		          placeholder="请输入所属仓库" 
		          v-model="value"
		           filterable
		           remote
		           reserve-keyword
				   :clearable="true"
		          >
					 <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
		          </el-select>
		        </el-form-item>
		    </el-form>
		    <div style="text-align: center;" slot="footer" class="dialog-footer">
		      <el-button type="primary" @click="subcang">确定</el-button>
		      <el-button @click="diaobo=false">取消</el-button>
		    </div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="Hub">
	import { ref, onMounted, watch } from 'vue';
	import { listDept } from "@/api/system/dept";
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { getKeyNA  } from '@/api/carlive'
	import { hublist, hubadd, hubinfo, hubupdate, hubdetel, hunsendid, hubdetelyes, companyhub } from '@/api/hub.js'
	import {  soucollist } from '@/api/systensettings'
	import { warehouselist } from '@/api/warehouse'
	import cartirefrom from '@/components/Hublive/cartirefrom.vue'
	import carlive from '@/components/Hublive/carlive.vue'
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, lifecycle_tire_category, lifecycle_tire_sendertype } = proxy.useDict("lifecycle_tire_status", "lifecycle_tire_category", "lifecycle_tire_sendertype");
	const carcompanydata = ref([])
	const houselist = ref([])//仓库
	const diaobo = ref(false)
	const queryform = ref({
		pageNum: 1,
		pageSize: 10,
		companyId:''
	})
	const chuanid = ref(false)
	const jiebangma = ref(false)
	const isshow=ref(true)
	const deptOptions = ref([]);
	const form = ref({
		boltPattern:'',
		brand:'',
		companyId:null,
		companyName:'',
		compatibleVehicle:'',
		hubNo:'',
		material:'',
		model:'',
		price:'',
		remark:'',
		size:'',
		threadSpec:'',
		warehouseId:null,
		warehouseName:'',
		senderId:null
	})
	const dataList = ref([])
	const chuanfrom = ref({
		senderId: null,
		senderType: null
	})
	const rules = ref({
		boltPattern: [{ required: true, message: "孔距不能为空", trigger: "blur" }],
		brand: [{ required: true, message: "品牌不能为空", trigger: "blur" }],
		// companyId: [{ required: true, message: "所属组织不能为空", trigger: "blur" }],
		compatibleVehicle: [{ required: true, message: "兼容车型不能为空", trigger: "blur" }],
		hubNo: [{ required: true, message: "轮毂编号不能为空", trigger: "blur" }],
		material: [{ required: true, message: "材质不能为空", trigger: "blur" }],
		model: [{ required: true, message: "型号不能为空", trigger: "blur" }],
		price: [
			{ required: true, message: "价格不能为空", trigger: "blur" },
			{
				pattern:/^\d+(\.\d+)?$/,
				message: "价格格式不正确",
				trigger: "blur"}
			],
		size: [{ required: true, message: "尺寸不能为空", trigger: "blur" }],
		threadSpec: [{ required: true, message: "螺纹规格不能为空", trigger: "blur" }],
		warehouseId: [{ required: true, message: "所属仓库不能为空", trigger: "blur" }],
	})
	const xiangqing = ref(false)//详情
	const dangan = ref('')//详情标题
	const updateform = ref({})//胎压详情from
	// 调拨仓库数据
	const value = ref(null)
	const tid = ref(null)
	const title = ref('')
	const kongju=ref([])//孔距下拉框
	const pinpai=ref([])//品牌下拉框
	const chexin=ref([])//车型下拉框
	const guige=ref([])//规格下拉框
	const chicun=ref([])//尺寸下拉框
	const xinhao=ref([])//型号下拉框
	const caizhi=ref([])
	function name(val) {//处理的组织数据
		carcompanydata.value.map(item=>{
			if(item.fleetId == val){
				form.value.companyName = item.teamName
			}
		})
	}
	
	// 多选框选中数据
	const single=ref(true) //单个
	const multiple=ref(true)//多个
	function handleSelectionChange(selection){
		ids.value = selection.map(item => item.id)
		single.value = selection.length != 1
		multiple.value = !selection.length
	}
	function warehouse(val) {//处理仓库数据
		houselist.value.map(item=>{
			if(item.id == val){
				form.value.warehouseName = item.warehouseName
			}
		})
	}
	// 随机生成轮毂号
	function getda() {
		getKeyNA().then(res => {
			if (res.code == 200) {
				form.value.hubNo = res.data
			} else {
				ElMessage.error(res.message)
			}
		})
	}
	// 获取table数据
	function getList() {
		hublist(queryform.value).then(res => {
			dataList.value = res.data.items
			total.value = res.data.total
		})
	}
	
	
	// 子组件触发方法
	const onReceive = () => {
		getList()
	}
	
	
	function subform() {
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 hubadd(form.value).then(res=>{
				 if(res.code == 200){
					ElMessage({
						type: 'success',
						message: '入库成功',
					})
					open.value = false
					getList() 
				 }else{
					ElMessage({
						type: 'erroe',
						message:res.message,
					}) 
				 }
			 }) 
		  }
		})
	}
	// 编辑
	const sentid=ref('')
	function goxiang(i){
		// hublive(i).then(res=>{
		// 	console.log(res)
		// })
		
		hubinfo(i.id).then(res=>{
			dangan.value="轮毂档案【"+i.	hubNo+"】"
			updateform.value=res.data
			tid.value = i.id
			sentid.value=i.id
			xiangqing.value=true
		})
		
	}
	
	// 新增
	function addhub(){
		form.value.boltPattern=''
		form.value.boltPattern=''
		form.value.brand=''
		form.value.companyId=''
		form.value.companyName=''
		form.value.compatibleVehicle=''
		form.value.hubNo=''
		form.value.material=''
		form.value.model=''
		form.value.price=''
		form.value.remark=''
		form.value.size=''
		form.value.threadSpec=''
		form.value.warehouseId=''
		form.value.warehouseName=''
		form.value.senderId=''
		isshow.value=true
		title.value="新增轮毂"
		open.value=true
		proxy.$refs["menuRef"].clearValidate();
	}
	const statusFormat=(row) => {
		 var typelable = '';
		    for (var i = 0; i < pinpai.value.length; i++) {
		        if (row.brand === pinpai.value[i].paramCode) {
		            typelable =  pinpai.value[i].paramName;
		        }
		    }
		    return typelable;
}
const caifun=(row) => {
	 var typelable = '';
		for (var i = 0; i < caizhi.value.length; i++) {
			if (row.material === caizhi.value[i].paramCode) {
				typelable =  caizhi.value[i].paramName;
			}
		}
		return typelable;
}
const konfun=(row) => {
	 var typelable = '';
		for (var i = 0; i < kongju.value.length; i++) {
			if (row.boltPattern === kongju.value[i].paramCode) {
				typelable =  kongju.value[i].paramName;
			}
		}
		return typelable;
}
const xinfun=(row) => {
	 var typelable = '';
		for (var i = 0; i < xinhao.value.length; i++) {
			if (row.model === xinhao.value[i].paramCode) {
				typelable =  xinhao.value[i].paramName;
			}
		}
		return typelable;
}

const chifun=(row) => {
	 var typelable = '';
		for (var i = 0; i < chicun.value.length; i++) {
			if (row.size === chicun.value[i].paramCode) {
				typelable =  chicun.value[i].paramName;
			}
		}
		return typelable;
}
const luofun=(row) => {
	 var typelable = '';
		for (var i = 0; i < guige.value.length; i++) {
			if (row.threadSpec === guige.value[i].paramCode) {
				typelable =  guige.value[i].paramName;
			}
		}
		return typelable;
}
	// 提交修改
	function subformipda(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 hubupdate(form.value).then(res=>{
				 if(res.code == 200){
					ElMessage({
						type: 'success',
						message: '修改成功',
					})
					open.value = false
					proxy.$refs["menuRef"].clearValidate();
					getList() 
				 }else{
					ElMessage({
						type: 'erroe',
						message:res.message,
					}) 
				 }
			 }) 
		  }
		})
	}
	// 取消
	function openclose(){
		open.value=false
		proxy.$refs["menuRef"].clearValidate();
	}
	
	// 删除轮毂
	function detire(i) {
		ElMessageBox.confirm(
			'您确定要删除该信息吗？',
			'注意',
			{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}
		).then(() => {
			hubdetelyes(i).then(res=>{
				if(res.data){
					hubdetel(i).then(res => {
						if (res.code == 200) {
							ElMessage({
								type: 'success',
								message: '删除成功',
							})
							open.value = false
							getList()
						}
					})
				}else{
					ElMessage({
						type: 'error',
						message: '轮毂已上车或已绑定传感器',
					})
				}
			})
		}).catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消删除',
			})
		})
	}
	// 解码下载方法
	function downloadFiles(data) {
		if (typeof window.chrome !== 'undefined') {
			// Chrome version
			var link = document.createElement('a');
			link.href = window.URL.createObjectURL(data);
			link.download = "轮毂列表.xlsx";
			link.click();
		} else if (typeof window.navigator.msSaveBlob !== 'undefined') {
			var blob = new Blob([data], { type: 'application/force-download' });
			window.navigator.msSaveBlob(blob, "轮毂列表.xlsx");
		} else {
			var file = new File([data], "轮毂列表.xlsx", { type: 'application/force-download' });
			window.open(URL.createObjectURL(file));
		}
	}

	// 传感器id
	function chuango(senderId,hubid,tire) {
		chuanid.value = true
		if (senderId == null) {//绑定
			chuanfrom.value = {}
			chuanfrom.value.hubNo = tire
			chuanfrom.value.id = hubid
			chuanfrom.value.senderId = senderId
			chuanfrom.value.bindStatus = 0
			jiebangma.value = true
		} else {
			chuanfrom.value.hubNo = tire
			chuanfrom.value.id = hubid
			chuanfrom.value.senderId = senderId
			chuanfrom.value.bindStatus =1
			jiebangma.value = false
		}
		
	}
	
	const onReceiveMsg = (params:string) => {
		chuango(params.senderId,params.hubid,params.tire)
	}
	

	// 子组件触发的方法
	// const onReceiveMsg = (params : string) => {
	// 	chuango(params.senderId, params.hubNo, params.id)
	// }
	// 提交解绑，绑定
	function jiebangfun() {
		if(chuanfrom.value.senderId == '' || chuanfrom.value.senderId == null){
			ElMessage.error("请输入传感器ID")
		}else{
			hunsendid(chuanfrom.value).then(res => {
				if (res.code == 200) {
					ElMessage.success("解绑成功")
					chuanid.value = false
					updateform.value.senderId=null
					getList()
				} else {
					ElMessage.error(res.message)
				}
			})
		}
	}
	function bangdingfun() {
		if(chuanfrom.value.senderId == '' || chuanfrom.value.senderId == null){
			ElMessage.error("请输入传感器ID")
		}else{
			hunsendid(chuanfrom.value).then(res => {
				if (res.code == 200) {
					ElMessage.success("绑定成功")
					updateform.value.senderId=chuanfrom.value.senderId
					chuanid.value = false
					getList()
				} else {
					ElMessage.error(res.message)
				}
			})
		}
	}
	
	
	onMounted(() => {
		// 仓库
		warehouselist({}).then(res => {
			houselist.value = res.data.items
		})
		// 孔距下拉框
		soucollist({paramType:"tire_pitch_row_param"}).then(res=>{
			kongju.value=res.data
		})
		soucollist({paramType:"tire_brand_param"}).then(res=>{
			pinpai.value=res.data
		})
		soucollist({paramType:"tire_compatible_param"}).then(res=>{
			chexin.value=res.data
		})
		soucollist({paramType:"tire_thread_specification_param"}).then(res=>{
			guige.value=res.data
		})
		soucollist({paramType:"tire_size_param"}).then(res=>{
			chicun.value=res.data
		})
		soucollist({paramType:"tire_model_param"}).then(res=>{
			xinhao.value=res.data
		})
		soucollist({paramType:"hub_material_param"}).then(res=>{
			caizhi.value=res.data
		})
		// 组织
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		getList()
	})

	const feishow = ref(false)
	// 导出冷态气压
	const open = ref(false)
	const total = ref(0)
	const ids = ref([])
	// 提交仓库调拨
	function subcang() {
		const idss = ids.value
		companyhub({
			tids: idss.toString(),
			companyId: value.value
		}).then(res => {
			if (res.code == 200) {
				diaobo.value = false
				getList()
			}
		})
	}

	// 详情
	const activeName = ref('first')
	watch(() => xiangqing.value, value => {
		if(!value){
			tid.value=''
		}
	})
</script>
<style scoped>
	.el-form {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	.pireinf .el-form {
		width: 100%;
		display: flex;
		justify-content: left;
	}

	:deep(.el-date-editor--daterange.el-input__inner) {
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
		margin-top: 10px;
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

	.chekbox {
		margin-top: 15px;
		display: flex;
		align-items: center;
		margin-top: 15px;
	}
	.chekbox span {
		font-size: 14px;
		color: #606266;
	}
	.subbox{
		width: 48%;
	}
</style>