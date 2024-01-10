<template>
	<div>
      <el-form label-width="80px" style="display: flex;">
       <!-- <el-form-item label="胎号">
           <el-input v-model="querform.tireNo" style="100px"></el-input>
        </el-form-item> -->
        <el-form-item label="警报类型">
         <el-select
         placeholder="请选择警报类型" 
         v-model="querform.alarmType"
         >
		 <el-option
		    label="全部"
		    value=""
		 />
           <el-option
			v-show="dict.label != '正常'"
              v-for="dict in alarm_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
           />
         </el-select>
        </el-form-item>
        <el-form-item label="时间" width="100px">
          <el-date-picker
              v-model="time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
			   value-format="x"
			   @change="tiemchange"
               />
        </el-form-item>
		<div class="btnxob">
        <el-button size="small" style="height: 36px;margin-left: 10px;" type="primary" @click="alarmdilogshow">查询 </el-button>
        <el-button size="small" style="height: 36px;" type="warning" @click="exportlist">导出 </el-button>
        </div>
      </el-form>

       <el-table
          :data="tabledata"
          border
          style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="vehicleNo"
            label="车牌号"
           >
          </el-table-column>
          <el-table-column
            prop="tireNumber"
            label="胎号"
            >
          </el-table-column>
          <el-table-column
            prop="tirePositionDesc"
            label="轮位">
          </el-table-column>
          <el-table-column
            prop="pressure"
            label="压力(bar)"
            >
          </el-table-column>
          <el-table-column
            prop="temperature"
            label="温度(℃)"
            >
          </el-table-column>
          <el-table-column
            prop="batteryVoltage"
            label="电池电压">
          </el-table-column>
          <el-table-column
            prop="alarmLevelDesc"
            label="报警类型"
            >
          </el-table-column>
         <!-- <el-table-column
            prop="highTemperatureThreshold"
            label="当时报警压力阈值(bar)"
            >
          </el-table-column> -->
          <el-table-column
            prop="highTemperatureThreshold"
            label="当时报警高温阈值(℃)">
          </el-table-column>
          <el-table-column
            prop="reportTime"
            label="报警时间">
			<template #default="scope">
			   {{parseTime(scope.row.reportTime)}}
			</template>
          </el-table-column>
        </el-table>
       <pagination 
      v-show="total>0"
      :total="total" 
      background 
      :pager-count='5' 
      v-model:page="querform.pageNum"
      v-model:limit="querform.pageSize"
      @pagination="alarmdilogshow"
      layout="prev, pager, next"/>
	   </div>
</template>

<script setup>
	import { onMounted, ref, defineProps, watch} from 'vue';
	import {getalarmlist, alarmRecordsinfo, exmingxi} from '@/api/front'
	import {exportxlxs} from '@/api/carlive'
	import { dilog } from '../../store/dilog'
	const { proxy } = getCurrentInstance();
	const { alarm_type } = proxy.useDict("alarm_type");
	const props = defineProps({
	    alarmdata: {
	        type: Array,
	        default: []
	    },
		tos:{
			type:Number,
			default:0
		},
		carid:{
			type:String,
			default:''
		}
	})
	const time=ref([])
	const tabledata=ref([])
	const querform =ref({//所搜条件表单
		alarmType:null,
		pageNum:1,
		pageSize:10,
		startTime:null,
		endTime:null
		})
	const dilogs = dilog()//pinia获取
	const total=ref(0)
	
	function alarmdilogshow() {
		querform.value.vehicleId=props.carid
		alarmRecordsinfo(querform.value).then(res=>{
			tabledata.value=res.data.items
			total.value=res.data.total
		})
	}
	function tiemchange(){
		if(time.value != []){
			querform.value.startTime=time.value[0]
			querform.value.endTime=time.value[1]
		}
	}
	
	// 导出
	function exportlist(){
		exmingxi(querform.value).then(res=>{
				 downloadFiles(res)
		})
	}
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎报警记录.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎报警记录.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎报警记录.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	

	watch(()=>props.alarmdata,
	(val)=>{
		tabledata.value=val
		total.value=props.tos
	})
	
	// 监听dilog
	dilogs.$subscribe((mutation, state) => {
		 if(state.alarmdilog){
			alarmdilogshow()
		 }else{
			time.value=[]
			querform.value.startTime=null
			querform.value.endTime=null
		 }
	})
	onMounted(()=>{
		alarmdilogshow()
	})
	
	
</script>
<style scoped>
  .pagedove{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 230px !important;
  }
  :deep(.el-form-item){
	  align-items: center;
  }
  .btnxob{
	  display: flex;
	  
  }
</style>
