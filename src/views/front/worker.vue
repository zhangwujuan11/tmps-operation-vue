<template>
  <div class="app-container">
    <el-form label-width="75px" class="indexforn">
        <el-form-item label="胎号">
         <el-select
         placeholder="请输入胎号" 
         v-model="quertfrom.tireNo"
         filterable
         :clearable="true"
         >
           <el-option :label="item.tireNo" :value="item.tireId" v-for="(item,index) in chetai" :key="index" />
         </el-select>
        </el-form-item>
        <el-form-item label="提醒人">
           <el-input  v-model="quertfrom.trueName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input placeholder="请输入手机号" v-model="quertfrom.phone"></el-input>
        </el-form-item>
		<!-- <el-form-item label="报警类型">
		  <el-select  v-model="radio2" clearable>
		    <el-option :label="item.name" :value="item.value" v-for="(item,index) in dictList" :key="index" />
		  </el-select>
		</el-form-item> -->
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="getList"><i class="el-icon-search"></i> 查询</el-button>
      <!-- <el-button><i class="el-icon-upload2"></i>导出</el-button> -->
    </div>
    <el-radio-group v-model="quertfrom.isRead" @change="getList">
      <!-- <el-radio-button :label="0">未阅读</el-radio-button> -->
      <el-radio-button :label="1">未处理</el-radio-button>
	  <el-radio-button :label="2">已处理</el-radio-button>
    </el-radio-group>

    <el-table :data="tableDta">
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="胎号" align="center" prop="tireNo"/>
      <el-table-column label="提醒人" align="center" prop="trueName" />
      <el-table-column label="提醒内容" align="center" prop="contents" />
      <el-table-column label="手机号"  align="center"  prop="phone" />
      <el-table-column label="提醒类型" align="center" prop="alarmFlagName" />
      <el-table-column label="状态" align="center" prop="isRead">
		  <template #default="scope">
			  {{ isread(scope.row.isRead)}}
		  </template>
	  </el-table-column>
      <!-- <el-table-column label="创建时间" align="center" prop="remark" /> -->
        <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			  <!-- <el-button
			    v-if="scope.row.isRead == 0"
			    link  type="warning"
			    @click="handleUpdate(scope.row)"
			   v-hasPermi="['system:dict:edit']"><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情</el-button> -->
			   <el-button
			   v-if="scope.row.isRead != 2"
			   link  type="primary"
			   @click="handleUpdate(scope.row)"
			  v-hasPermi="['tpms:handel:edit']"> <Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>处理</el-button>
			  <el-button
			   v-if="scope.row.isRead == 2"
			   link  type="warning"
			   @click="handle(scope.row)"
			  v-hasPermi="['tpms:handel:query']"><Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情</el-button>
			</template>
        </el-table-column>
    </el-table>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="quertfrom.pageNum"
       v-model:limit="quertfrom.pageSize"
       @pagination="getList"
    />
    <!-- 轮胎详情 -->
   <el-dialog :title="trlie" v-model="open" width="50%" append-to-body :close-on-click-modal="false">
        <el-form label-width="100px"   :rules="rules" ref="menuRef" :model="form" :validate-on-rule-change="false">
            <el-form-item label="报警内容">
              <p style="color: red;">{{form.contents}}</p>
            </el-form-item>
            <el-form-item label="通知方式" prop="noticeFlag">
              <el-select v-model="form.noticeFlag" :disabled="con">
                <el-option label="电话通知" value="0"/>
                <el-option label="短信通知" value="1"/>
              </el-select>
			   </el-form-item>
			  <el-form-item label="被通知人" prop="noticeName">
			    <el-input v-model="form.noticeName" :disabled="con"></el-input>
			  </el-form-item>
			  <el-form-item label="通知手机号" prop="noticePhone">
			    <el-input v-model="form.noticePhone" :disabled="con"></el-input>
			  </el-form-item>
			  <el-form-item label="上传照片">
			     <ImageUpload :limit="1" v-model="form.photoUrl" v-if="!con"></ImageUpload>
				 <img :src="form.photoUrl" v-if="con" style="width: 100px;height: 100px;">
			  </el-form-item>
			<el-form-item label="当前处理人" v-if="con">
			    <span>{{form.handleName}}</span>
			 </el-form-item>
			<el-form-item label="处理结果" prop="handleResults">
			   <el-input
			       v-model="form.handleResults"
			       :rows="2"
			       type="textarea"
			       placeholder="请输入处理结果"
				    :disabled="con"
			     />
			</el-form-item>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer" v-if="!con">
          <el-button type="primary" @click="sub">保存</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {newslist, newinfo, newsinfodo} from '@/api/front'
	import {tirelist} from '@/api/carlive'
	import Cookies from "js-cookie"
	const { proxy } = getCurrentInstance();
	const quertfrom=ref({
		pageNum:1,
		pageSize:10,
		tireNo:'',
		trueName:'',
		phone:'',
		isRead:1
	})
	const con=ref(false)
	const form=ref({
		handleName:Cookies.get("username"),
		noticeFlag:"0"
	})
	const trlie=ref('消息通知处理')
	
	const rules=ref({
		noticeFlag: [{ required: true, message: "请选择通知方式", trigger: "blur" }],
		noticeName: [{ required: true, message: "请输入被通知人", trigger: "blur" }],
		noticePhone: [{ required: true, message: "请输入手机号", trigger: "blur" },
		{
			pattern:/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
			message: "手机格式不正确",
			trigger: "blur"}],
		handleResults: [{ required: true, message: "请输入处理结果", trigger: "blur" }],
	})
	
	const total=ref(0)
	const tableDta=ref([])
	const chetai=ref([])//车胎列表
	const open=ref(false)
	function getList(){
		newslist(quertfrom.value).then(res=>{
			tableDta.value=res.data.items
		})
	}
	
	
	// 处理
	function handleUpdate(i){
			con.value=false
			trlie.value='消息通知处理'
			newinfo(i.id).then(res=>{
				open.value=true
				form.value=res.data
				form.value.photoUrl=''
				// proxy.$refs["menuRef"].clearValidate();
			})
	}
	
	// 详情
	function handle(i){
			con.value=true
			trlie.value='消息通知详情'
			newinfo(i.id).then(res=>{
				open.value=true
				form.value=res.data
				form.value.photoUrl= import.meta.env.VITE_APP_BASE_API + form.value.photoUrl
				proxy.$refs["menuRef"].clearValidate();
			})
	}
	
	function isread(i){
		if(i == 1){
			return '未处理'
		}else if(i == 2){
			return '已处理'
		}
	}
	
	// 处理
	function sub(){
		// if(form.value.photoUrl){
		// 	form.value.photoUrl= form.value.photoUrl
		// }else{
		// 	form.value.photoUrl=''
		// }
		form.value.handleName=Cookies.get("username")
		form.value.isRead=2
		proxy.$refs["menuRef"].clearValidate();
		newsinfodo(form.value).then(res=>{
			if(res.code == 200){
				ElMessage.success('处理成功')
				open.value=false
				getList()
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	onMounted(()=>{
		// 车胎
		tirelist({pageNum:1,pageSize:10000}).then(res=>{
			if(res.code == 200){
				chetai.value=res.data.items
			}
		})
		getList()
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
  
</style>
