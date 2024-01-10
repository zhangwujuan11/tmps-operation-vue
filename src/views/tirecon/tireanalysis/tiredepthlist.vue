<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<!-- <el-form-item label="组织">
		  <el-select 
		  placeholder="请输入组织" 
		  v-model="value"
		   filterable
		   remote
		   reserve-keyword
		   :remote-method="remoteMethod"
		   :loading="loading"
		  >
		    <el-option :label="item.name" :value="item.value" v-for="(item,index) in dictList" :key="index" />
		  </el-select>
		</el-form-item> -->
		<el-form-item label="车牌号">
		  <el-select 
		  placeholder="请输入车牌号" 
		  v-model="queryform.vehicleNo"
		   filterable
		   remote
		   reserve-keyword
		    :clearable="true"
		   :loading="loading"
		  >
		    <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
		  </el-select>
		  
		</el-form-item>
		<div style="text-align: center;">
		  <el-button type="primary" @click="getList('41')"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="expor" v-hasPermi="['tpms:info:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
	<el-radio-group v-model="ifbaofei" @change="getList(ifbaofei)">
	  <el-radio-button label="41">复轮花纹深度相差超过3毫米车辆</el-radio-button>
	  <el-radio-button label="42">同轴花纹深度相差超过5毫米车辆</el-radio-button>
	</el-radio-group>
    <el-table :data="lidatas">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="车牌号" sortable align="center" prop="vehicleNo">
      </el-table-column>
      <el-table-column label="所属组织" sortable align="center" prop="companyName">
      </el-table-column>
      <el-table-column label="说明" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="primary"
			   @click="handledetail(scope.row.id)"
			  ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button>
			</template>
	    </el-table-column>
    </el-table>
   <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryform.pageNum"
      v-model:limit="queryform.pageSize"
      @pagination="getList"
   />
    <!-- 本车轮胎信息 -->
   <el-dialog title="本车轮胎信息" v-model="open" width="80%" append-to-body :close-on-click-modal="false">
   	<el-table :data="dictList">
		<el-table-column label="序号" align="center" type="index" width="80px"/>
		<el-table-column label="胎号" align="center" prop="tireNo"/>
		<el-table-column label="轮位" align="center" prop="installPositionDesc"/>
		<!-- <el-table-column label="电池电压(v)" align="center" prop="senderId" /> -->
		<el-table-column label="传感器ID" align="center" prop="senderId" />
		<el-table-column label="品牌" align="center" prop="tireBrandName" />
		<el-table-column label="花纹型号" align="center" prop="pattern" />
		<el-table-column label="新胎花纹深度(mm)" align="center" prop="depth" />
		<el-table-column label="实测花纹深度(mm)" align="center" prop="measuredDepth" />
		<el-table-column label="规格" align="center" prop="specificationsName" />
   	    <el-table-column label="累计里程(km)" align="center" prop="totalMileage" />
   	</el-table>
   	<pagination
   	   v-show="totals > 0"
   	   :total="totals"
   	   v-model:page="querytable.pageNum"
   	   v-model:limit="querytable.pageSize"
   	   @pagination="handledetail(cid)"/>
       <div style="text-align: center;margin-top: 28px;" slot="footer" class="dialog-footer">
			<el-button @click="open=false">关闭</el-button>
       </div>
   </el-dialog>
	
  </div>
</template>

<script setup lang="ts" name="Tiredepthlist">
	import { ref, onMounted } from 'vue';
	// import { ElMessage, ElMessageBox } from 'element-plus'
	import {abnormallist, abnormalinfo ,exporttire} from '@/api/tirecon.js'
	import { exportxlxs } from '@/api/carlive'
	import {vehicleNo} from '@/api/systensettings'
	const vehicleNoo=ref([])//车牌号下拉框
	const lidatas=ref([])
	const total=ref(0)
	const ifbaofei=ref('41')
	const open=ref(false)
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		vehicleNo:'',
		type:'41'
	})
	const dictList=ref([])
	const querytable=ref({
		pageNum:1,
		pageSize:10
	})
	const totals=ref(0)
	function getList(i){
		queryform.value.type=i
		abnormallist(queryform.value).then(res=>{
			lidatas.value=res.data.items
			total.value=res.data.total
		})
	}
	
	// 详情
	const cid=ref('')
	const handledetail=function(i){
		cid.value=i
		querytable.value.caiId=cid.value
		abnormalinfo(querytable.value).then(res=>{
			dictList.value=res.data.items
			totals.value=res.data.total
			open.value=true
		})
	}
	// 导出
	function expor(){
		exporttire(queryform.value).then(res=>{
			exportxlxs(res.data).then(respon=>{
				 downloadFiles(respon)
			})
		})
	}
	
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "花纹深度异常列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "花纹深度异常列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "花纹深度异常列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		getList("41")
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
  .marri{
	  margin-right: 30px;
  }
  .closr{
	  font-size:16px ;
	  line-height: 34px;
  }
  .closr span{
	  margin-right: 15px;
  }
</style>
