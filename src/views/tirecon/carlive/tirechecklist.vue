<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="品牌">
		  <el-select 
		  placeholder="请输入品牌" 
		  v-model="queryform.brand"
		   filterable
		   remote
		     :clearable="true"
		   reserve-keyword
		   :loading="loading"
		  >
		   <el-option :label="item.paramName" :value="item.paramName"  v-for="(item,index) in pinpai" :key="index" />
		  </el-select>
		</el-form-item>
        <el-form-item label="胎号">
         <el-select v-model="queryform.tireNo"
         	filterable clearable placeholder="请选择"
         	allow-create
         	:default-first-option="true"
         	@blur="Nameblur($event)"
         	default-first-option>
         	<el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
          </el-select>
        </el-form-item>
      <!--  <el-form-item label="处理人">
           <el-input ></el-input>
        </el-form-item> -->
		
    </el-form>
	<div style="text-align: center;">
	  <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	  <el-button @click="goexport"  v-hasPermi="['tpms:inspection:export']"><i class="el-icon-upload2"></i>导出</el-button>
	</div>
	<div style="margin-bottom: 10px;">
		<el-radio-group v-model="queryform.status" @change="getList">
		  <el-radio-button label="">全部</el-radio-button>
		  <el-radio-button label="0">正常记录</el-radio-button>
		  <el-radio-button label="1">异常记录</el-radio-button>
		</el-radio-group>
	</div>
	
	<div>
		<el-radio-group v-model="queryform.processingStatus"  @change="getList">
			<el-radio-button label="">全部</el-radio-button>
		  <el-radio-button label="2">未阅读</el-radio-button>
		  <el-radio-button label="0">未处理</el-radio-button>
		  <el-radio-button label="1">已处理</el-radio-button>
		</el-radio-group>
	</div>
   


    <el-table :data="dataList">
      <el-table-column label="序号" align="center" type="index" width="80px"/>
      <el-table-column label="胎号" align="center" prop="tireNo"/>
      <el-table-column label="品牌" sortable align="center" prop="brand" />
      <el-table-column label="规格" sortable align="center" prop="specification" />
      <el-table-column label="花纹型号" sortable  align="center" prop="treadModel"></el-table-column>
      <el-table-column label="新胎花纹深度(mm)" sortable align="center" prop="newTreadDepth" />
      <el-table-column label="左侧花纹深度(mm)" sortable align="center" prop="leftTreadDepth" />
      <el-table-column label="中间花纹深度(mm)" sortable align="center" prop="middleTreadDepth" />
	  <el-table-column label="右侧花纹深度(mm)" sortable align="center" prop="rightTreadDepth" />
	  <el-table-column label="问题描述" align="center" prop="issueDescription" />
	  <el-table-column label="检查时间" sortable align="center" width="180" prop="inspectionTime" />
	  <el-table-column label="状态" align="center" prop="processingStatus" >
		<template #default="scope">
		  	{{scope.row.processingStatus=='1'? "已处理":"未处理"}}
		</template>
		</el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   v-if="scope.row.processingStatus == '0'"
			    link  type="primary"
			    @click="handleUpdate(scope.row)"
			   v-hasPermi="['tpms:inspection:edit']"><EditPen style="width: 1em; height: 1em; margin-right: 2px"></EditPen>处理</el-button>
			   <el-button
			   link  type="warning"
			   @click="goinfo(scope.row)"
			 ><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>查看</el-button>
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
    <!-- 轮胎检查处理 -->
    <el-dialog title="轮胎检查处理" v-model="open" width="30%" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px">
			<el-form-item label="处理意见">
			   <el-input
			       v-model="checkIssueDescription"
			       :rows="2"
			       type="textarea"
			       placeholder="请输入处理意见"
			     />
			</el-form-item>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="geocheck">保存</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
	<!-- 轮胎详情 -->
	<el-dialog title="轮胎详情" v-model="diabinfo" width="60%" append-to-body class="diclass" :close-on-click-modal="false">
	    <el-form label-width="130px">
			<el-form-item label="品牌">
			   <span>{{infodata.brand}}</span>
			</el-form-item>
			<el-form-item label="检查问题描述">
			   <span>{{infodata.checkIssueDescription}}</span>
			</el-form-item>
			<el-form-item label="检查人">
			   <span>{{infodata.inspector}}</span>
			</el-form-item>
			<el-form-item label="问题描述">
			   <span>{{infodata.issueDescription}}</span>
			</el-form-item>
			<el-form-item label="最新安装里程表数">
			   <span>{{infodata.latestInstallationMileage}}</span>
			</el-form-item>
			<el-form-item label="新胎花纹深度">
			   <span>{{infodata.newTreadDepth}}</span>
			</el-form-item>
			<el-form-item label="压力">
			   <span>{{infodata.pressure}}</span>
			</el-form-item>
			<el-form-item label="处理人">
			   <span>{{infodata.processedBy}}</span>
			</el-form-item>
			<el-form-item label="处理状态">
			   <span>{{infodata.processingStatus == 0? '未处理':'已处理'}}</span>
			</el-form-item>
			<el-form-item label="规格">
			   <span>{{infodata.specification}}</span>
			</el-form-item>
			<el-form-item label="胎号">
			   <span>{{infodata.tireNo}}</span>
			</el-form-item>
			<el-form-item label="车牌号">
			   <span>{{infodata.vehicleNo}}</span>
			</el-form-item>
	    </el-form>
	    <div style="text-align: center;" slot="footer" class="dialog-footer">
	      <!-- <el-button type="primary" @click="geocheck">保存</el-button> -->
	      <el-button @click="diabinfo=false">取消</el-button>
	    </div>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Tirechecklist">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {inspectlist, tirelist, getTireBands, tirecherkinfo, ijtirecherk,exportchetireinfo,exportxlxs} from '@/api/carlive'
	import Cookies from "js-cookie";
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		tireNo:'',
		brand:''
	})
	const diabinfo=ref(false)
	const checkIssueDescription=ref('')
	const chetai=ref([])
	const pinpai=ref([])//品牌
	const total=ref(0)
	const open=ref(false)
	const dataList=ref([])
	const idnum=ref(null)
	const infodata=ref({})
	const loading=ref(false)
	function getList(){
		inspectlist(queryform.value).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
		})
	}
	function geocheck(i){
		let obj={
			checkIssueDescription:checkIssueDescription.value,
			processedBy:Cookies.get("username"),
			processingStatus:1,
			id:idnum.value
		}
		ijtirecherk(obj).then(res=>{
			if(res.code == 200){
				open.value=false
				ElMessage.success("处理成功")
				getList()
			}
		})
	}
	const  title=ref('')
	 // 车辆新增/修改
	 const handleUpdate=function(row){
		 open.value = true;
		 idnum.value=row.id
		 title.value = "新建车辆";
	 }
	
	// 详情
	function goinfo(i){
		tirecherkinfo(i.id).then(res=>{
			diabinfo.value=true
			infodata.value=res.data
		})
	}
	
	// 导出
	function goexport(){
		exportchetireinfo(queryform.value).then(res=>{
			exportxlxs(res.data).then(data=>{
				downloadFiles(data)
			})
		})
	}
	function Nameblur(e) {
		queryform.value.tireNo=e.target.value
	   }
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎检查列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎检查列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎检查列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		// 品牌
		getTireBands().then(res=>{
			pinpai.value=res.data
		})
		getList()
	})
	
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
  .diclass .el-form-item--default{
	  width: 50%;
  }
  .diclass .el-form{
	  display: flex;
	  flex-wrap: wrap;
  }
</style>
