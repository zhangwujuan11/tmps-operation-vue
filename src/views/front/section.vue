<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
        <el-form-item label="车牌号">
          <el-select 
		  placeholder="请输入车牌号" 
		  v-model="queryfrom.vehicleNo"
		   filterable
		   remote
		   :clearable="true"
		   reserve-keyword
		  >
            <el-option :label="item" :value="item" v-for="(item,index) in vehicleNolist" :key="index" />
          </el-select>
        </el-form-item>
       <el-form-item label="胎号">
         <el-input placeholder="请输入胎号" v-model="queryfrom.tireNo"></el-input>
		  </el-form-item>
		<el-form-item label="报警类型">
		  <el-select  v-model="queryfrom.alarmType" clearable>
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
		<el-form-item>
		  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="erpot"><i class="el-icon-upload2" v-hasPermi="['tpms:alarmRecords:export']" ></i>导出</el-button>
		</el-form-item>
    </el-form>

    <el-table :data="tableDate"  v-loading="loading">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="车牌号" align="center" prop="vehicleNo">
      </el-table-column>
      <el-table-column label="所属组织" align="center" prop="fleetName" />
      <el-table-column label="胎号" align="center" prop="tireNumber" />
      <el-table-column label="轮位"  align="center" style="cursor: pointer;" width="120" prop="tirePositionDesc"></el-table-column>
      <el-table-column label="报警类型" align="center" width="120">
		  <template #default="scope">
		     <!-- <dict-tag :options="alarm_type" :value="scope.row.alarmLevel" /> -->
			 <span v-for="(item,index) in scope.row.alarmLevelDesc" style="display: block;">{{item}}</span>
		  </template>
	  </el-table-column>
      <el-table-column label="压力(bar)" align="center" prop="pressure" />
	   <el-table-column label="温度(℃)" align="center" prop="temperature" />
      <el-table-column label="报警时间" align="center" prop="reportTime">
		  <template  #default="scope">
			  {{parseTime(scope.row.reportTime)}}
		  </template>
	  </el-table-column>
        <el-table-column label="报警明细" align="center" class-name="small-padding" width="250">
		   <template #default="scope">
			   <el-button
			   link  type="warning"
			   @click="handleUpdate(scope.row)"
			  ><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情</el-button>
			  
			  <el-button
			   link  type="warning"
			   @click="gotirmirom(scope.row)"
			  >实时监控</el-button>
			  
			  <el-button
			   link  type="warning"
			   @click="goecharts(scope.row)"
			  >趋势图</el-button>
			</template>
        </el-table-column>
    </el-table>
   <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryfrom.pageNum"
      v-model:limit="queryfrom.pageSize"
      @pagination="getList"
   />
    <!-- 轮胎详情 -->
    <el-dialog title="轮胎报警明细" v-model="open" width="80%" append-to-body :close-on-click-modal="false">
       <el-form label-width="75px" class="indexforn">
           <el-form-item label="报警时间">
			   <el-date-picker
			       v-model="datae"
			       type="daterange"
			       start-placeholder="开始日期"
			       end-placeholder="结束日期"
				    format="YYYY/MM/DD"
				    value-format="YYYY-MM-DD"
				   @change="sertimechange"
			      />
       	  </el-form-item>
		  <el-form-item>
		    <el-button type="primary" @click="gethandleUpdate"><i class="el-icon-search"></i> 查询</el-button>
		    <el-button @click="expotmingxi"><i class="el-icon-upload2"></i>导出</el-button>
		  </el-form-item>
       </el-form>
       <el-table :data="alarminfo"  v-loading="loadingtwo">
         <el-table-column label="胎号" align="center" prop="tireNumber">
         </el-table-column>
         <el-table-column label="轮位"   align="center" prop="tirePositionDesc"></el-table-column>
         <el-table-column label="报警类型" align="center" prop="alarmLevelDesc">
			<!-- <template #default="scope">
				 <dict-tag :options="alarm_type" :value="scope.row.alarmLevel" />
			  </template> -->
	 </el-table-column>
         <el-table-column label="压力(bar)" align="center" prop="pressure" />
          <el-table-column label="温度(℃)" align="center" prop="temperature" />
         <el-table-column label="报警时间" align="center" prop="reportTime">
			 <template  #default="scope">
				  {{parseTime(scope.row.reportTime)}}
			  </template>
	 </el-table-column>
	  <el-table-column label="压力阈值(bar)" align="center" >
		  <template  #default="scope">
		  		{{scope.row.lowPressureThreshold + '~' + scope.row.highPressureThreshold}}
		   </template>
	   </el-table-column>
	   <el-table-column label="高温阈值(℃)" align="center" prop="highTemperatureThreshold" width="150">
	   </el-table-column>
       </el-table>
	   <div class="pagees" style="margin-top: 10px;">
	   <pagination
	      v-show="infoform.total > 0"
	      :total="infoform.total"
	      v-model:page="infoform.pageNum"
	      v-model:limit="infoform.pageSize"
	      @pagination="gethandleUpdate"
	   />
	   </div>
    </el-dialog>
	<!-- echart -->
	<Echarts :echartsneeddata="echartsneeddata" :echartclickinfo="echartclickinfo" :carid="carid" ></Echarts>
  </div>
</template>

<script setup lang="ts" name="Section">
	import { onMounted, ref, watch } from 'vue';
	import {  ElMessage, ElMessageBox } from 'element-plus'
	import type { UploadFile } from 'element-plus'
	import {alarmRecordslist, alarmRecordsinfo, exportactionposition, exmingxi,echartshowinfo} from '@/api/front'
	import {exportxlxs} from '@/api/carlive'
	import {vehicleNo} from '@/api/systensettings'
	import { useRouter } from "vue-router";
	import { dilog } from '../../store/dilog'
	import Echarts from '@/components/newnew/echarts.vue'
	const router = useRouter();
	const { proxy } = getCurrentInstance();
	const { alarm_type } = proxy.useDict("alarm_type");
	// data
	// 搜索表单
	const queryfrom=ref({
		alarmType:null,//报警类型
		endTime:null,//结束时间
		vehicleNo:null,//车牌号
		pageNum:1,
		pageSize:10,
		startTime:null,//开始时间
		tireNo:null,//胎号
	})
	const total=ref(0)
	const tableDate=ref([])//列表数据
	const vehicleNolist=ref([])//车牌号下拉列表
	const infoform=ref({//报警明细搜索表单
		pageNum:1,
		pageSize:10,
		total:0
	})
	const  title=ref('')
	const alarminfo=ref([])
	const open=ref(false)
	const datae=ref('')
	const loading = ref(true);
	const loadingtwo=ref(true)
	function getList(){
		loading.value = true;
		alarmRecordslist(queryfrom.value).then(res=>{
			tableDate.value=res.data.items
			total.value=res.data.total
			 loading.value = false;
		})
	}
	const echartsneeddata=ref({})
	const echartclickinfo=ref(null)//当前点击车辆信息
	const carid=ref('')//当前车辆id
	const dilogs = dilog();
	const goecharts = function (i) {
		carid.value=i.vehicleId
		echartclickinfo.value=Number(i.tirePosition) 
		echartshowinfo(carid.value).then(data=>{
			echartsneeddata.value=data.data
			dilogs.$patch({ echarts: true })
		})
	}
	// 报警详情
	function handleUpdate (row){
		 open.value = true;
		 title.value = "轮胎报警明细";
		 infoform.value.alarmType=row.alarmLevel.toString()
		 infoform.value.tireId=row.tireId
		 infoform.value.vehicleId=row.vehicleId
		 gethandleUpdate()
	}
	function gethandleUpdate (){
		loadingtwo.value = true;
		alarmRecordsinfo(infoform.value).then(res=>{
			if(res.code == 200 ){
				alarminfo.value= res.data.items
				infoform.value.total=res.data.total
				loadingtwo.value = false;
			}
		}).catch(()=>{
			alarminfo.value= []
			infoform.value.total=0
			loadingtwo.value = false;
		})
	}
	// 时间改变
	function sertimechange(val){
		if(val){
			infoform.value.startTime=new Date(val[0]+ " 00:00:00").valueOf()
			infoform.value.endTime=new Date(val[1] + "T16:59:59.590Z").valueOf()
			
		}else{
			infoform.value.startTime=null
			infoform.value.endTime=null
		}
		
	}
	
	
	// 导出
	function erpot(){
		   exportactionposition(queryfrom.value).then(res=>{
			   downloadFiles(res)
		   })
	}
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "胎温胎压报警记录.xls";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "胎温胎压报警记录.xls");
	    } else {
	        // Firefox version
	        var file = new File([data], "胎温胎压报警记录.xls", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	// 导出明细
	function expotmingxi(){
		exmingxi(infoform.value).then(res=>{
			downloadFilestwo(res)
		})
	}
	function downloadFilestwo(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎报警明细.xls";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎报警明细.xls");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎报警明细.xls", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	function gotirmirom(i){
		router.push({
			path: '/front/tiremonitor',
			query: {
				carNumber:i.vehicleNo
			}
		})
	}
	onMounted(()=>{
		getList()
		// 车牌号下拉列表获取
		vehicleNo().then(res=>{
			vehicleNolist.value=res.data.items
		})
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	// 上传图片
	// const dialogImageUrl = ref('')
	// const dialogVisible = ref(false)
	// const disabled = ref(false)
	// const handleRemove = (file: UploadFile) => {
	//   console.log(file)
	// }
	
	// const textarea=ref('')
	
	// const handlePictureCardPreview = (file: UploadFile) => {
	//   dialogImageUrl.value = file.url!
	//   dialogVisible.value = true
	// }
	
	// const handleDownload = (file: UploadFile) => {
	//   console.log(file)
	// }
	// const datae=ref('')
	// const radio1 =ref("")
	// const radio2 =ref("")
	// const radio3 =ref("")
	// const radio4 =ref("")
	// const value1=ref('')
	// const defaultTime = ref<[Date, Date]>([
	//   new Date(2000, 1, 1, 0, 0, 0),
	//   new Date(2000, 2, 1, 23, 59, 59),
	// ])
	// const tableData = [
	//   {
	//     date: '2016-05-03',
	//     name: 'Tom',
	//     address: 'No. 189, Grove St, Los Angeles',
	//   }
	// ]
	// const list = ref<ListItem[]>([])
	// const options = ref<ListItem[]>([])
	// const value = ref<string[]>([])
	// const loading = ref(false)
	// const remoteMethod = (query: string) => {
	//   if (query) {
	//     loading.value = true
	//     setTimeout(() => {
	//       loading.value = false
	//       options.value = dictList.value.filter((item) => {
	//         return item.value.toLowerCase().includes(query.toLowerCase())
	//       })
	//     }, 200)
	//   } else {
	//     options.value = []
	//   }
	// }
	
	// const dictList=ref([{
 //            name: "组织1",
 //            value: 1
 //          },
 //          {
 //            name: "组织1",
 //            value: 2
 //          },
 //          {
 //            name: "组织1",
 //            value: 3
 //          },
 //          {
 //            name: "组织1",
 //            value: 4
 //          },
 //          {
 //            name: "组织1",
 //            value: 6
 //          }
 //        ]) 
	// const open=ref(false)
	
	// const pageNum=ref(1)
	// const pagesize=ref(10)
	// const ifbaofei=ref('可用轮胎')
	// const fenlei=ref('')
	// const zhuangtai=ref('')
	// const kunbang=ref('')
	// const dataList=ref([{
 //            dictSort: 1,
	// 		name: "组织1",
 //          },
 //          {
 //            dictSort: 1,
	// 		name: "犹太人",
 //          },
 //          {
 //            dictSort: 1,
	// 		name: "阿斯蒂芬",
 //          },
 //          {
 //            dictSort: 1,
	// 		name: "飞洒地方1",
 //          },
 //        ]) 
	// const  ids=ref([])
	// const  title=ref('')
	
	//  // 仓库轮胎调拨
	//  const handleAdd=function(row){
	// 	diaobo.value=true
	//  }
	//  /** 删除按钮操作 */
	// const handleDelete=function (row) {
	//    const idss = row.id || ids.value;
	//    ElMessageBox.confirm(
	//       '确定删除' + idss + "车辆的同时也解除了该车辆的轮胎匹配及其他相关操作，请谨慎删除，您确定要删除该车辆吗？",
	//       '注意',
	//       {
	//         confirmButtonText: '确定',
	//         cancelButtonText: '取消',
	//         type: 'warning',
	//       }
	//     )
	//       .then(() => {
	//         ElMessage({
	//           type: 'success',
	//           message: 'Delete completed',
	//         })
	//       })
	//       .catch(() => {
	//         ElMessage({
	//           type: 'info',
	//           message: 'Delete canceled',
	//         })
	//       })
	//  }
	//  // 解绑
	// const jiabangba=function(i){
	// 	console.log(i)
	//  		 jiebang.value=true
	//  }
</script>
<style scoped>
  /*
  /deep/.el-select > .el-input{
    width: 100%;
  } */
  /* /deep/.el-input{
    width: 80%;
  } */
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
  
</style>
