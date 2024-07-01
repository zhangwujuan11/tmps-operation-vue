<template>
  <div class="app-container">
    <el-form label-width="90px">
        <el-form-item label="所属组织">
         <!-- <el-select 
		  placeholder="请输入组织名称" 
		  v-model="queryform.fleetId"
		   filterable
		   remote
		   :clearable="true"
		   reserve-keyword
		  >
              <el-option :label="item.teamName" :value="item.fleetId"  v-for="(item,index) in carcompanydata" :key="index" />
          </el-select> -->
		  <el-tree-select
		  :default-expand-all="true"
		     v-model="queryform.fleetId"
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
          v-model="queryform.vehicleNo"
           filterable
           remote
           :clearable="true"
           reserve-keyword
          >
            <el-option :label="item" :value="item" v-for="(item,index) in vehicleNolist" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="接收器ID">
          <el-input placeholder="请输入接收器ID"  v-model="queryform.deviceId"></el-input>
        </el-form-item>
		<el-form-item label="版本号">
		  <el-input placeholder="请输入版本号"  v-model="queryform.version" ></el-input>
		</el-form-item>
		<!-- <el-form-item label="定位开关">
		  <el-select  v-model="queryform.autoFlags" clearable>
		    <el-option label="开" :value="0" />
		    <el-option label="关" :value="1" />
		  </el-select>
		</el-form-item> -->
		<!-- <el-form-item label="前桥中继器">
		  <el-select  v-model="radio2" clearable>
		    <el-option :label="item.name" :value="item.value" v-for="(item,index) in dictList" :key="index" />
		  </el-select>
		</el-form-item>
		<el-form-item label="后桥中继器">
		  <el-select  v-model="radio2" clearable>
		    <el-option :label="item.name" :value="item.value" v-for="(item,index) in dictList" :key="index" />
		  </el-select>
		</el-form-item> -->
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
      <el-button @click="exgetList" v-hasPermi="['tpms:autoPositions:export']"><i class="el-icon-upload2"></i>导出</el-button>
    </div>
    <el-table :data="dictList">
      <el-table-column label="车牌号" align="center" prop="vehicleNo" />
      <el-table-column label="所属组织" align="center" prop="fleetName" />
      <el-table-column label="接收器ID"  align="center" prop="deviceId" />
      <el-table-column label="面板ID" align="center" prop="panelId" />
      <el-table-column label="版本号" align="center" prop="version" />
      <!-- <el-table-column label="自动定位开关" align="center" prop="autoFlags">
		  <template #default="scope">
			  {{scope.row.autoFlags==0? '开':'关' }}
		  </template>
		</el-table-column> -->
      <el-table-column label="定位轮位数" align="center" prop="positionNumber" />
     <!-- <el-table-column label="前桥中继器" align="center" prop="remark" />
	  <el-table-column label="后桥中继器" align="center" prop="remark" /> -->
	  <el-table-column label="更新时间" align="center" prop="updateTime" />
       <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="warning"
			   @click="handleUpdate(scope.row)"
			  ><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情</el-button>
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
  </div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { autoPositionslist, exautoPositions } from '@/api/front'
	import {vehicleNo, carcompanylist} from '@/api/systensettings'
	import { listDept } from "@/api/system/dept";
	const { proxy } = getCurrentInstance();
	import { useRouter } from "vue-router";
	const router = useRouter();
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		vehicleNo:'',
		fleetId:null,
		version:'',
		deviceId:'',
		autoFlags:null,
	})
	const total=ref(0)
	const vehicleNolist=ref([])
	const deptOptions = ref([]);
	const dictList=ref([]) 
	function getList(){
		autoPositionslist(queryform.value).then(res=>{
			dictList.value=res.data.items
			total.value=res.data.total
		})
	}
	// 详情
	function handleUpdate(i){
		router.push({
			path: '/front/tiremonitor',
			query: {
				carNumber:i.vehicleNo
			}
		})
	}
	// 导出
	function exgetList(){
		exautoPositions(queryform.value).then(res=>{
			downloadFiles(res)
		})
	}
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "自动定位跟踪.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "自动定位跟踪.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "自动定位跟踪.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		getList()
		// 车牌号下拉列表获取
		vehicleNo().then(res=>{
			vehicleNolist.value=res.data.items
		})
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
	})
</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
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
  
</style>
