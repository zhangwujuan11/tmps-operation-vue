<template>
  <div class="app-container">
    <el-form label-width="75px">
       <!-- <el-form-item label="所属组织">
          <el-select 
		  placeholder="请输入组织名称" 
		  v-model="querfrom.fleetId"
		   filterable
		   remote
		   clearable 
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
         v-model="querfrom.vehicleNo"
          filterable
          remote
          reserve-keyword
          :loading="loading"
		  :clearable="true"
         >
           <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
         </el-select>
       </el-form-item>
	   <div style="text-align: center;">
	     <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	     <el-button @click="goexport" v-hasPermi="['tpms:tireMonitorCount:export']"><i class="el-icon-upload2"></i>导出</el-button>
	   </div>
    </el-form>
   
    <el-radio-group v-model="querfrom.state" @change="changetable">
      <el-radio-button :label="110">接收器故障({{geshu.driverCount}}辆)</el-radio-button>
      <el-radio-button :label="111">GPS离线({{geshu.offLineGpsCount}}辆)</el-radio-button>
	  <el-radio-button :label="112">GPS定位故障({{geshu.positionGpsCount}}辆)</el-radio-button>
	<!--  <el-radio-button :label="113">中继器离线({{geshu.repeaterOffLineCount}}个)</el-radio-button>
	  <el-radio-button :label="114">中继器未绑定({{geshu.repeaterNoBindCount}}个)</el-radio-button> -->
	  <el-radio-button :label="115">缺轮({{geshu.lackWheelCount}}辆)</el-radio-button>
	  <el-radio-button :label="116">传感器离线({{geshu.sensorOffLineCount}}个)</el-radio-button>
	  <el-radio-button :label="117">电池电压低({{geshu.cellVoltageLowCount}}个)</el-radio-button>
    </el-radio-group>

    <el-table :data="dataList">
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="车牌号" align="center" prop="vehicleNo">
      </el-table-column>
      <el-table-column v-if="shebei" label="设备ID" align="center" prop="deviceId" />
      <el-table-column label="所属组织" align="center" prop="fleetName" />
	   <el-table-column v-if="taihao" label="胎号" align="center" prop="tireNo" />
	    <el-table-column v-if="chuanganqi" label="传感器ID" align="center" prop="senderId" />
		<el-table-column v-if="lunwei" label="轮位" align="center" prop="tirePositionDesc" />
		<el-table-column v-if="querfrom.state == 110 || querfrom.state == 111 || querfrom.state == 112 " label="时间" align="center" prop="createdTime" />
       <el-table-column label="操作" align="center" class-name="small-padding">
		   <template #default="scope">
			   <el-button
			   link  type="warning"
			   @click="acty(scope.row)"
			  ><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情</el-button>
			</template>
        </el-table-column>
    </el-table>
   <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="querfrom.pageNum"
      v-model:limit="querfrom.pageSize"
      @pagination="getList"
   />
  </div>
</template>

<script setup lang="ts" name="Invest">
	import { ref, onMounted } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { malfunctionslist, countmal, fuzgz } from '@/api/front'
	import {vehicleNo} from '@/api/systensettings'
	import { useRouter } from "vue-router";
	// const route = useRoute();
	const router = useRouter()
	const querfrom=ref({
		pageNum:1,
		pageSize:10,
		state:110,
		vehicleNo:'',
		fleetId:''
	})
	const vehicleNoo=ref([])
	const geshu=ref({})
	const dataList=ref([])
	const total=ref(0)
	function getList(){
		countmal(querfrom.value).then(res=>{
			geshu.value=res.data
		})
		malfunctionslist(querfrom.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	// 导出
	function goexport(){
		querfrom.value.pageNum=1
		querfrom.value.pageSize=100000
		fuzgz(querfrom.value).then(res=>{
			downloadFiles(res)
			querfrom.value.pageNum=1
			querfrom.value.pageSize=10
		})
	}
	
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "车辆故障跟踪.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "车辆故障跟踪.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "车辆故障跟踪.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	// 详情跳转
	function acty(i) {
		router.push({
			path: '/front/tiremonitor',
			query: {
				vehicleId: i.vehicleId
			}
		})
	}
	
	onMounted(()=>{
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		getList()
	})
	const loading = ref(false)
	const zhongjiqu = ref(false)
	const banbenhao = ref(false)
	const zhonqixu = ref(false)
	const shijian=ref(true)
	const taihao=ref(false)
	const chuanganqi=ref(false)
	const shebei=ref(true)
	const lunwei=ref(false)
	const zhuanai=ref(false)
	const changetable=function(){
		if(querfrom.value.state == 110){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=true
			taihao.value=false
			chuanganqi.value=false
			shebei.value=true
			lunwei.value=false
			zhuanai.value=false
		}else if(querfrom.value.state == 111){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=true
			taihao.value=false
			chuanganqi.value=false
			lunwei.value=false
			shebei.value=true
			zhuanai.value=false
		}else if(querfrom.value.state == 112){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=true
			taihao.value=false
			chuanganqi.value=false
			shebei.value=true
			lunwei.value=false
			zhuanai.value=false
		}else if(querfrom.value.state == 113){
			zhongjiqu.value=true
			banbenhao.value=true
			zhonqixu.value=true
			shijian.value=true
			taihao.value=false
			shebei.value=true
			chuanganqi.value=false
			lunwei.value=false
			zhuanai.value=false
		}else if(querfrom.value.state == 114){
			zhongjiqu.value=true
			banbenhao.value=true
			zhonqixu.value=true
			shijian.value=true
			shebei.value=true
			taihao.value=false
			chuanganqi.value=false
			lunwei.value=false
			zhuanai.value=false
		}else if(querfrom.value.state == 115){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=false
			shebei.value=true
			taihao.value=false
			chuanganqi.value=false
			lunwei.value=false
			zhuanai.value=false
		}else if(querfrom.value.state == 116){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=false
			shebei.value=false
			taihao.value=true
			chuanganqi.value=true
			lunwei.value=true
			zhuanai.value=true
		}else if(querfrom.value.state == 117){
			zhongjiqu.value=false
			banbenhao.value=false
			zhonqixu.value=false
			shijian.value=false
			shebei.value=false
			taihao.value=true
			chuanganqi.value=true
			lunwei.value=true
			zhuanai.value=true
		}
		querfrom.value.pageNum=1
		getList()
	}
</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
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
  
</style>
