<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
		<el-form-item label="车牌号">
		 <el-select
		 placeholder="请输入车牌号" 
		 v-model="queryform.vehicleNo"
		  filterable
		   :clearable="true"
		  remote
		  reserve-keyword
		 >
		   <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
		 </el-select>
		</el-form-item>
		<!-- <el-form-item label="车牌号">
		  <el-select 
		  placeholder="请输入车牌号" 
		  v-model="queryform."
		   filterable
		   remote
		   reserve-keyword
		   :remote-method="remoteMethod"
		   :loading="loading"
		  >
		    <el-option :label="item.name" :value="item.value" v-for="(item,index) in dictList" :key="index" />
		  </el-select>
		</el-form-item> -->
		
		<div style="text-align: center;">
		  <el-button type="primary" @click="getList(tendata)"><i class="el-icon-search"></i> 查询</el-button>
		  <el-button @click="eportlist" v-hasPermi="['tpms:maintenance:export']"><i class="el-icon-upload2"></i>导出</el-button>
		</div>
    </el-form>
	<el-radio-group v-model="ifbaofei" v-if="moren">
	  <el-radio-button label="1">气压偏差10%车辆</el-radio-button>
	  <el-radio-button label="2">气压偏差6%车辆</el-radio-button>
	  <el-radio-button label="3">气压偏差3%车辆</el-radio-button>
	</el-radio-group>
	<el-radio-group v-if="!moren" v-model="ifbaof">
	  <el-radio-button label="1">气压偏差{{tendata}}%车辆</el-radio-button>
	</el-radio-group>
	
	
	<!-- 表格操作 -->
	<el-row :gutter="10" class="mb8">
	  <el-col :span="1.5">
	    <el-button type="success" @click="handleUpdate()">加气登记</el-button>
	  </el-col>
	</el-row>
	
    <el-table :data="lidatastable">
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
			   @click=""
			 ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button>
			</template>
    	</el-table-column>
     </el-table>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="queryform.pageNum"
       v-model:limit="queryform.pageSize"
       @pagination="getList(tendata)"
    />
	
	<!-- 轮胎详情 -->
	<!-- <el-dialog title="本车轮胎信息" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
		<el-table :data="dictList">
		  <el-table-column label="序号" align="center" type="index" width="80px"/>
		  <el-table-column label="胎号" align="center" prop="tireNo">
		  </el-table-column>
		  <el-table-column label="轮位" align="center" prop="installPosition">
		  </el-table-column>
		  <el-table-column label="传感器ID" align="center" prop="senderId" />
		   <el-table-column label="规格" align="center" prop="pattern" />
		    <el-table-column label="轮胎状态" align="center" prop="status" />
		</el-table>
		<pagination
		   v-show="totals > 0"
		   :total="totals"
		   v-model:page="querytable.pageNum"
		   v-model:limit="querytable.pageSize"
		   @pagination="handledetail"
		/>
	    <div style="text-align: center;margin-top: 28px;" slot="footer" class="dialog-footer">
	      <el-button @click="open=false">关闭</el-button>
	    </div>
	</el-dialog> -->
	<!-- 加气登记 -->
	<el-dialog title="加气登记" v-model="jiebang" width="70%" append-to-body>
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
			<el-form-item label="胎号">
				<el-select
				placeholder="请输入胎号" 
				v-model="addform.tireNo"
				filterable
				:clearable="true"
				>
				  <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
				</el-select>
			</el-form-item><strong></strong>
			<el-form-item label="气压值">
			 <el-input placeholder="单位bar" v-model="addform.aerateValue"></el-input>
			</el-form-item>
			
			<div style="text-align: center;">
			  <el-button type="primary" @click="goadd">添加</el-button>
			</div>
		</el-form>
	   <el-table :data="lidatas">
	     <el-table-column label="序号" align="center" type="index" width="80px"/>
	     <el-table-column label="胎号" align="center" prop="tireNo"/>
	      <el-table-column label="车牌号" align="center" prop="vehicleNo"/>
		  <!-- <el-table-column label="所属组织" align="center" type="index" width="80px"/> -->
		  <el-table-column label="登记时间" align="center" prop="createTime"/>
		   <el-table-column label="操作" align="center">
			   <template #default="scope">
				   <el-button
				   link  type="danger"
				   @click="handledetail(scope.row.aerateId)"
				 >删除</el-button>
				</template>
			</el-table-column>
	   </el-table>
	   <pagination
	      v-show="total > 0"
	      :total="total"
	      v-model:page="pageNum"
	      v-model:limit="pageSize"
	      @pagination="getList(tendata)"
	   />
	   
	    <div style="text-align: center;margin-top: 30px;" slot="footer" class="dialog-footer">
	      <el-button @click="jiebang=false">关闭</el-button>
	    </div>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Tirepressurelist">
	import { ref, onMounted, watch } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {abarealist, abareaadd, abareadel} from '@/api/tirecon.js'
	import {vehicleNo,parameter} from '@/api/systensettings'
	import {exportxlxs, expotires, tirelist} from '@/api/carlive'
	const vehicleNoo=ref([])//车牌号下拉框
	const lidatas=ref([])
	const chetai=ref([])//车胎列表
	const total=ref(0)
	const ifbaofei=ref('1')
	const ifbaof=ref('1')
	const open=ref(false)
	const moren=ref(true)
	const tendata=ref('')
	const jiebang=ref(false)
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		vehicleNo:'',
	})
	const dictList=ref([])
	const querytable=ref({
		pageNum:1,
		pageSize:10
	})
	const lidatastable=ref([])
	const pageNum=ref(1)
	const pageSize=ref(10)
	const totals=ref(0)
	function getList(i){
		queryform.value.type=i
		abarealist(queryform.value).then(res=>{
			lidatas.value=res.data.items
			total.value=res.data.total
		})
	}
	const addform=ref({})
	// 详情
	const handledetail=function(i){
		ElMessageBox.confirm(
		     '您确定要删除该信息吗？',
		     '注意',
		     {
		       confirmButtonText: '确定',
		       cancelButtonText: '取消',
		       type: 'warning',
		     }
		   ).then(() => {
			   abareadel(i).then(res=>{
			   	ElMessage.error("删除成功")
			   	abarealist({
			   		pageNum:pageNum.value,
			   		pageSize:pageSize.value
			   	}).then(ress=>{
			   		lidatas.value=ress.data.items
			   		total.value=ress.data.total
			   	})
			   })
				
		     }).catch(() => {
		       ElMessage({
		         type: 'info',
		         message: '已取消删除',
		       })
		     })
	}
	
	// 加气登记
	function handleUpdate(){
		abarealist({
			pageNum:1,
			pageSize:10
		}).then(res=>{
			lidatas.value=res.data.items
			total.value=res.data.total
			jiebang.value=true
		})
	}
	
	// 添加加气
	function goadd(){
		let flage=/^\d+(\.{0,1}\d+){0,1}$/ 
		if(addform.value.tireNo ==null ||addform.value.tireNo ==""){
				ElMessage.error("请选择轮胎")
				return false
		}else if(!flage.test(addform.value.aerateValue)){
			ElMessage.error("请输入正确的气压值")
			return false
		}else{
			abareaadd(addform.value).then(res=>{
				if(res.code == 200){
				abarealist({
				pageNum:1,
				pageSize:10
			}).then(res=>{
						lidatas.value=res.data.items
						total.value=res.data.total
					})
				}
			})
		}
		
	}
	
	watch(jiebang,(value)=>{
		if(!value){
			addform.value.tireNo=''
			addform.value.aerateValue=''
		}
	})
	
	// 导出
	function eportlist(){
		expotires(queryform.value).then(res=>{
			exportxlxs(res.data).then(respon=>{
				 downloadFiles(respon)
			})
		})
	}
	
	// 解码下载方法
	function downloadFiles(data) {
	    if (typeof window.chrome !== 'undefined') {
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎气压异常列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎气压异常列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎气压异常列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	onMounted(()=>{
		vehicleNo().then(res=>{
			if(res.code == 200){
				vehicleNoo.value=res.data.items
			}
		})
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		parameter().then(res=>{
			if(res.code == 200){
				if(res.data.pressureDeviationType == 10021){
					tendata.value='41'
					getList("41")
					moren.value=true
				}else{
					moren.value=false
					tendata.value=res.data.pressureDeviationSelf
					getList(tendata.value)
				}
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
