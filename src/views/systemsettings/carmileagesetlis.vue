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
		<el-form-item label="统计方式">
		  <el-select placeholder="选择" v-model="from.type" >
		   <el-option label="全部" value=""/>
		   <el-option label="以GPS为准" :value="2001"/>
		   <el-option label="以拆装公里表为准" :value="2002"/>
		    <el-option label="以手工录入为准" :value="2003"/>
		  </el-select>
		</el-form-item>
    </el-form>
	<div style="text-align: center;margin-bottom: 20px;">
	  <el-button type="primary"  @click="getList"><i class="el-icon-search"></i> 查询</el-button>
	  <el-button  @click="exportexcle"  v-hasPermi="['tpms:mileageType:export']"><i class="el-icon-upload2"></i>导出</el-button>
	</div>
<div>
    <el-table :data="tabledata" v-loading="loading">
      <el-table-column label="车牌号" align="center" prop="vehicleNo"/>
	  <el-table-column label="所属组织" align="center" prop="fleetName"/>
      <el-table-column label="接收器ID" align="center" prop="deviceId" />
      <el-table-column label="统计方式" align="center">
			<template #default="scope">
	  		  {{ filters(scope.row.mileageType) }}
	  		</template>
	   </el-table-column>
	  <el-table-column label="操作" align="center" class-name="small-padding" width="150">
	   <template #default="scope">
		   <el-button
		   link  type="primary"
		    v-hasPermi="['tpms:mileageType:edit']"
		   @click="handleAdd(scope.row)"
		  ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>设置</el-button>
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
    <!-- 里程统计方式设置 -->
    <el-dialog title="里程统计方式设置" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
        <el-form label-width="180px" :model="infodata" :rules="ytu" ref="menuRef">
			<el-form-item label="车牌号">
			 <el-input  disabled v-model="infodata.vehicleNo"></el-input>
			</el-form-item>
			<el-form-item label="接收器ID">
			 <el-input  disabled  v-model="infodata.deviceId"></el-input>
			</el-form-item>
			<el-form-item label="统计方式">
			  <el-select placeholder="选择" v-model="infodata.mileageType" >
			   <!-- <el-option label="全部" value=""/> -->
			   <el-option label="以GPS为准" :value="2001"/>
			   <el-option label="以拆装公里表为准" :value="2002"/>
			    <el-option label="以手工录入为准" :value="2003"/>
			  </el-select>
			</el-form-item>
            <el-form-item label="上次里程表读数">
             <el-input  disabled  v-model="infodata.lastReadMileage"></el-input>
            </el-form-item>
			<el-form-item label="里程表读数" prop="readMileage">
			 <el-input v-model="infodata.readMileage" placeholder="输入公里标"></el-input>
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
	import { ref, onMounted } from 'vue';
	import { ElMessage } from 'element-plus'
	import type { UploadFile } from 'element-plus'
	import { listDept } from "@/api/system/dept";
	import { mileagelist,carcompanylist, vehicleNo, mileageserch,mileageupdate, exportmileage } from '@/api/systensettings'
	const { proxy } = getCurrentInstance();
	// 搜索表单
	const from=ref({
		vehicleNo:'',//车牌号
		deviceId:'',//接收器id
		fleetId:'',//组织id
		type:'',//统计方式
		pageNum: 1,
		pageSize: 10,
	})
	// 所属组织
	const carcompanydata=ref([])
	const vehicleNoo=ref([])
	const loading = ref(false)
	const tabledata=ref([])// table数据
	const total=ref(0)// 分页总条数
	
	function filters(id: any) {
		  let txt = "";
		  switch (id) {
			case 2001:
			  txt = "以GPS为准";
			  break;
			case 2002:
			  txt = "以拆装公里表为准";
			  break;
			case 2003:
			  txt = "以手工录入为准";
			  break;
		  }
		  return txt;
	}
	
	// table数据获取
	function getList(){
		loading.value = true
		mileagelist(from.value).then(res=>{
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
	
	// 设置
	const open=ref(false)
	const infodata=ref({
		readMileage:'',
		lastReadMileage:'',
		mileageType:null,
		deviceId:null,
		vehicleNo:''
	})
	const ytu=({
		readMileage: [{ required: true, message: "里程表读数不能为空", trigger: "blur" },
		{
		   pattern:/^[0-9]+(\.\d+)?$/,
		   message: "输入正确的里程表读数",
		   trigger: "blur",
		}
		],
	  }) 
	
	function handleAdd(row){
		mileageserch(row.id).then(res=>{
			if(res.code == 200){
				infodata.value=res.data
				open.value=true
			}else{
				ElMessage.error(res.message)
			}
		})
		
	 }
	 // 提交修改
	 function subfromt (){
		 proxy.$refs["menuRef"].validate(valid => {
		   if (valid) {
			   mileageupdate(infodata.value).then(res=>{
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
	 
	 // 导出
	function exportexcle(){
		from.value.pageNum=1
		from.value.pageSize=100000
		exportmileage(from.value).then(res => {
			downloadFiles(res)
			from.value.pageNum=1
			from.value.pageSize=10
		}
	)
	}
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "里程统计方式.xls";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "里程统计方式.xls");
	    } else {
	        // Firefox version
	        var file = new File([data], "里程统计方式.xls", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	// mounted
	onMounted(()=>{
		getList()
		listDept().then(response => {
		  carcompanydata.value = proxy.handleTree(response.data, "deptId");
		});
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
	  width: 98%;
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
