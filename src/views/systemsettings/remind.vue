<template>
	<div class="con">
		<el-form label-width="180px" :model="form" >
			   <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>提醒设置</p>
		    <el-form-item label="短信提醒">
		      <el-select v-model="form.smsAlertEnabled">
		        <el-option label="是" :value="1" />
				<el-option label="否" :value="0" />
		      </el-select>
		    </el-form-item>
		    <el-form-item label="微信提醒">
		     <el-select v-model="form.wechatAlertEnabled" >
		       <el-option label="是" :value="1" />
		     	<el-option label="否" :value="0" />
		     </el-select>
		    </el-form-item>
		    <el-form-item label="提醒次数">
		      <el-select v-model="form.alertFrequency">
		        <el-option label="1次" :value="1" />
		      	<el-option label="2次" :value="2" />
				<el-option label="3次" :value="3" />
				<el-option label="4次" :value="4" />
				<el-option label="5次" :value="5" />
		      </el-select>
		    </el-form-item>
		    <el-form-item label="报警提示音">
		       <el-select v-model="form.smsAlertEnabled" >
		        <el-option label="开启" :value="1" />
		       	<el-option label="关闭" :value="0" />
		       </el-select>
		    </el-form-item>
		  <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>无信号报警提醒设置</p>
			   <el-form-item label="无信号报警提醒">
			    <el-select v-model="form.noSignalAlertEnabled">
			     <el-option label="开启" :value="1" />
			    	<el-option label="关闭" :value="0" />
			    </el-select>
				  <span style="color: red;">( 注：此提醒只有短信提醒，开启后每天早上8点发送）</span>
			   </el-form-item>
		</el-form>
		<div style="text-align: center;" slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="subfrom">确定</el-button>
		  <el-button @click="open=false">取消</el-button>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { remind, remindupdate} from '@/api/systensettings'
	// 路由
	const route = useRoute();
	const router = useRouter();
	// 表单
	const form = ref({
		alertFrequency:3,//提醒次数
		alertSoundEnabled:'',//是否开启报警提示音
		noSignalAlertEnabled:'',//是否开启无信号报警提醒
		smsAlertEnabled:'',//是否开启短信提醒1开启0关闭
		tenantId:'',//租户号
		userId:'',//用户id
		wechatAlertEnabled:'',//是否开启微信提醒
	})
	// 提交表单
	function subfrom(){
		remindupdate(form.value).then(res=>{
			if(res.code == 200){
				ElMessage.success("操作成功")
			}else{
				 ElMessage.error(res.message)
			}
		})
	}
	// 组件挂载后执行的操作
	onMounted(()=>{
		remind().then(res=>{
			if(res.code == 200){
				form.value=res.data
			}else{
				 ElMessage.error(res.message)
			}
		})
	})
</script>

<style scoped>
	.con{
		padding: 30px;
		box-sizing: border-box;
	}
	.el-form {
	   width: 100%;
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
		  width: 98%;
	 }
</style>