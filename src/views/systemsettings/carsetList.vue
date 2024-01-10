<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="所属组织">
		 <!-- <el-select 
		  placeholder="请输入所属组织" 
		  v-model="from.fleetId"
		  filterable
		  :clearable="true"
		  :loading="loading"
		  >
		    <el-option :label="item.teamName" :value="item.fleetId" v-for="(item,index) in carcompanydata" :key="index" />
		  </el-select> -->
		  <el-tree-select
		  :default-expand-all="true"
		     v-model="from.fleetId"
		     :data="carcompanydata"
		     :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
		     value-key="deptId"
		     placeholder="选择组织"
		     check-strictly
		  />
		</el-form-item>
        <el-form-item label="车牌号">
          <el-select 
		  placeholder="请输入车牌号" 
		  v-model="from.vehicleNo"
		  :clearable="true"
		  filterable
		  :loading="loading"
		  >
            <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
          </el-select>
        </el-form-item>
		<el-form-item label="接收器ID">
		  <el-input v-model="from.deviceId"></el-input>
		</el-form-item>
		<el-form-item label="指令状态">
		  <el-select placeholder="选择" v-model="from.status" >
		   <el-option label="全部" value=""/>
		   <el-option label="已完成" :value="1"/>
		   <el-option label="下发中" :value="0"/>
		  </el-select>
		</el-form-item>
    </el-form>
	<div style="text-align: center;">
	  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	  <el-button @click="exportexcle" v-hasPermi="['tpms:threshold:export']"><i class="el-icon-upload2" ></i>导出</el-button>
	</div>
   <el-row :gutter="10" class="mb8">
     <el-col :span="1.5">
       <el-button type="primary" plain  :disabled="multiple" @click="handleAdd"
         v-hasPermi="['tpms:threshold:edit']">批量设置阈值</el-button>
     </el-col>
   </el-row>
<div>
    <el-table :data="tabledata" v-loading="loading"  @selection-change="handleSelectionChange">
	  <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="车牌号" align="center" prop="vehicleNo">
      </el-table-column>
	  <el-table-column label="所属组织" align="center" prop="companyName">
	  </el-table-column>
      <el-table-column label="接收器ID" align="center" prop="deviceId" />
      <el-table-column label="低压阈值(bar)" align="center" prop="lowPressure" />
      <el-table-column label="高压阈值(bar)"  align="center" prop="highPressure"></el-table-column>
      <el-table-column label="高温阈值" align="center" prop="highTemperature" />
      <el-table-column label="标准气压值" align="center" prop="standardPressure" />
      <el-table-column label="二级报警" align="center" prop="isOpenLevel2">
		  <template #default="scope">
		  	  {{scope.row.isOpenLevel2==0 ? '关闭':'开启'}}
		  	</template>
		  </el-table-column>
	  <el-table-column label="指令状态" align="center" prop="isNormal" />
	  <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link type="primary"
			    v-hasPermi="['tpms:threshold:edit']"
			   @click="handleAdd(scope.row)"
			 ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>设置阈值</el-button>
			</template>
	    </el-table-column>
    </el-table>
</div>
     <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="from.pageNum"
        v-model:limit="from.pageSize"
        @pagination="getList"
     />
    <!-- 维护登记 -->
    <el-dialog title="胎压阈值设置" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px" :model="subfrom" :rules="rules" ref="queryRef">
			<el-form-item label="车牌号" >
			 <el-input disabled v-model="subfrom.vehicleNo"></el-input>
			</el-form-item>
			<el-form-item label="接收器ID">
			 <el-input disabled  v-model="subfrom.deviceId"></el-input>
			</el-form-item>
			<el-form-item label="标准气压值">
			 <el-input disabled v-model="subfrom.standardPressure"></el-input>
			</el-form-item>
			 <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>一级报警阈值(严重)</p>
			<p style="width: 100%;color: red;margin-bottom: 10px;">注：此设置会同步设备阈值</p>
            <el-form-item label="低压低于" prop="lowPressure">
             <el-input  v-model="subfrom.lowPressure" placeholder="单位bar"></el-input>
            </el-form-item>
			<el-form-item label="高压高于">
			 <el-input   v-model="subfrom.highPressure" placeholder="单位bar"></el-input>
			</el-form-item>
			<el-form-item label="温度高于" prop="highTemperature">
			 <el-input  v-model="subfrom.highTemperature" placeholder="单位℃ "></el-input>
			</el-form-item>
			
			 <p class="line"><el-icon :size="20" color="#0054a6"><Flag />
			 </el-icon>二级报警阈值(轻度)
			 <el-select  v-model="subfrom.isOpenLevel2">
			 	<el-option label="关闭" :value="0"  />
				<el-option label="开启" :value="1"  />
			 </el-select>
			 </p>
			 <p style="width: 100%;color: red;margin-bottom: 10px;">注：此设置不会同步设备</p>
			 
			<el-form-item label="低压低于" prop="lowPressure2">
			 <el-input  v-model="subfrom.lowPressure2"  placeholder="单位bar"></el-input>
			</el-form-item>
			<el-form-item label="高压高于" prop="highPressure2">
			 <el-input  v-model="subfrom.highPressure2" placeholder="单位bar"></el-input>
			</el-form-item>
			<el-form-item label="温度高于"  prop="highTemperature2">
			 <el-input v-model="subfrom.highTemperature2"  placeholder="单位℃ "></el-input>
			</el-form-item>
			
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subfromt">确认</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { ElMessage } from 'element-plus'
	import { carsetlist, thresholdupdate, therserch,carcompanylist, vehicleNo, exportdata } from '@/api/systensettings'
	import { listDept } from "@/api/system/dept";
	const { proxy } = getCurrentInstance();
	// 搜索表单
	const from=ref({
		vehicleNo:'',//车牌号
		deviceId:'',//接收器id
		fleetId:'',//组织id
		status:'',//指令状态
		pageNum: 1,
		pageSize: 10,
	})
	const tabledata=ref([])// table数据
	const total=ref(0)// 分页总条数
	// 表单数据获取
	function getList(){
		 loading.value = true
		carsetlist(from.value).then(res=>{
			if(res.code == 200){
				tabledata.value=res.data.items
				total.value=res.data.total
				loading.value = false
			}else{
				ElMessage.error(res.message)
				  loading.value = false
			}
		})
	}
	
	
	
	const  rules=ref({
		  lowPressure: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
		highPressure: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
		highTemperature: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
		lowPressure2: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
		highPressure2: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
		highTemperature2: [{
		   pattern:/^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
		   message: "格式不正确",
		   trigger: "blur",
		}],
	})
	
	// 批量/单个修改阈值
	const open=ref(false)//修改阈值弹框
	let ids=ref([])// 多选框选中数据
	const multiple=ref(true)//多个
	const handleSelectionChange=function(selection){
		ids.value = selection.map(item => item.id)
		multiple.value = !selection.length
	}
	//修改阈值弹框弹出
	const subfrom=ref({
		vehicleNo:'',
		deviceId:'',
		standardPressure:'',
		lowPressure:'',
		lowPressure2:'',
		highPressure2:'',
		highPressure:'',
		highTemperature2:'',
		highTemperature:'',
		isOpenLevel2:1
		
	})
	const userId=ref('')
	const fommm=ref(null)
	const handleAdd=function(row){
		userId.value = row.id
		if(row.id){
			therserch(userId.value).then(res=>{
				if(res.code == 200){
					subfrom.value=res.data
				}else{
					 ElMessage.error(res.message)
				}
			})
		}else{
			subfrom.value=ref(null)
		}
		open.value=true
	 }
	 // 提交修改
	 function subfromt (){
		 proxy.$refs["queryRef"].validate(valid => {
		   if (valid) {
			  thresholdupdate({
			  			 ids:userId.value || ids.value,
			  			 list:subfrom.value
			  }).then(res=>{
			  			 if(res.code == 200){
			  				 open.value=false
			  				 ElMessage.success("设置成功")
							 getList()
			  			 }else{
			  				 ElMessage.error(res.message)
			  			 }
			  }) 
		   }
		   })
		 
	 }
	 
	 // 所属组织
	 const carcompanydata=ref([])
	 const vehicleNoo=ref([])
	 const loading = ref(false)
	 
	 // 导出
	 function exportexcle(){
		 exportdata(from.value).then(res=>{
			  downloadFiles(res)
		 })
	 }
	 // 解码下载方法
	 function downloadFiles(data) {
	     if (typeof window.chrome !== 'undefined') {
	         // Chrome version
	         var link = document.createElement('a');
	         link.href = window.URL.createObjectURL(data);
	         link.download = "阈值设置列表.xlsx";
	         link.click();
	     } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	         // IE version
	         var blob = new Blob([data], { type: 'application/force-download' });
	         window.navigator.msSaveBlob(blob, "阈值设置列表.xlsx");
	     } else {
	         // Firefox version
	         var file = new File([data], "阈值设置列表.xlsx", { type: 'application/force-download' });
	         window.open(URL.createObjectURL(file));
	     }
	 }
	 
	// mounted
	onMounted(()=>{
		getList()
		listDept().then(response => {
		  carcompanydata.value = proxy.handleTree(response.data, "deptId");
		});
		// carcompanylist().then(res=>{
		// 	if(res.code == 200){
		// 		carcompanydata.value=res.data.items
		// 	}
		// })
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
	})
</script>
<style scoped>
  .indexforn {
    width: 100%;
    display: flex;
    justify-content: left;
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
	  color: red;
	  display: flex;
	  align-items: center;
  }
 :deep(.el-form-item__content) {
	  display: flex;
	  align-items: center;
  }
  :deep(.el-input){
	  width:98%;
  }
  .marri{
	  width: 100%;
  }
  .closr{
	  font-size:16px ;
	  line-height: 34px;
  }
  .closr span{
	  margin-right: 15px;
  }
</style>
