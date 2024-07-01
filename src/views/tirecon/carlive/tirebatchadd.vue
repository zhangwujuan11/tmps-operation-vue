<template>
	<div>
		<el-form label-width="200px">
			<p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>未装车轮胎批量入库</p>
		    <el-form-item label="未装车轮胎">
				<el-button @click="downloadone" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载</el-button>
				<el-button type="primary"  @click="handleImport"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
		    </el-form-item>
			
			<!-- 未装车轮胎批量导入对话框 -->
			<el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body :close-on-click-modal="false">
			   <el-upload
			      ref="uploadRef"
			      :limit="1"
			      accept=".xls"
			      :headers="upload.headers"
			      :action="upload.url"
				  name="multipartFile"
			      :disabled="upload.isUploading"
			      :on-progress="handleFileUploadProgress"
			      :on-success="handleFileSuccess"
			      :auto-upload="false"
			      drag
			   >
			      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
			      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			      <template #tip>
			         <div class="el-upload__tip text-center">
			            <span>仅允许导入xls格式文件。</span>
			         </div>
			      </template>
			   </el-upload>
			   <template #footer>
			      <div class="dialog-footer">
			         <el-button type="primary" @click="submitFileForm">确 定</el-button>
			         <el-button @click="upload.open = false">取 消</el-button>
			      </div>
			   </template>
			</el-dialog>
			</el-form>
			
			
			<el-form label-width="200px">
				<p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>已装车轮胎批量入库</p>
			    <el-form-item label="已装车轮胎批量入库">
					<el-button @click="downloadtwo" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载</el-button>
					<el-button type="primary"  @click="handleImporttwo"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
			    </el-form-item>
				
				<!-- 未装车轮胎批量导入对话框 -->
				<el-dialog :title="uploadtwo.title" v-model="uploadtwo.open" width="400px" append-to-body :close-on-click-modal="false">
				   <el-upload
				      ref="uploadtwoRef"
				      :limit="1"
				      accept=".xls"
				      :headers="uploadtwo.headers"
				      :action="uploadtwo.url"
					  name="multipartFile"
				      :disabled="uploadtwo.isUploading"
				      :on-progress="handleFileUploadProgresstwo"
				      :on-success="handleFileSuccesstwo"
				      :auto-upload="false"
				      drag
				   >
				      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
				      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				      <template #tip>
				         <div class="el-upload__tip text-center">
				            <span>仅允许导入xls格式文件。</span>
				         </div>
				      </template>
				   </el-upload>
				   <template #footer>
				      <div class="dialog-footer">
				         <el-button type="primary" @click="submitFileFormtwo">确 定</el-button>
				         <el-button @click="uploadtwo.open = false">取 消</el-button>
				      </div>
				   </template>
				</el-dialog>
				</el-form>
			<!-- <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>配套轮胎批量入库</p>
		    <el-form-item label="配套轮胎">
		    	<el-button @click="load" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载(软硬件版)</el-button>
		    	<el-upload
		    		ref="upload"
		    		class="upload-demo"
		    		action="#"
		    		:limit="1"
		    		:on-exceed="handleExceed"
		    		:auto-upload="false"
		    	  >
		    		<el-button type="primary"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
		    	</el-upload>
		    </el-form-item>
		    <div style="width: 100%;text-align: center;">
		    	<el-button type="primary">(软硬件版) 导入</el-button>
		    	<el-button> 取消</el-button>
		    </div>
			
			<el-form-item label="配套轮胎" style="margin-top:40px;">
				<el-button @click="load" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载(纯软件版)</el-button>
				<el-upload
					ref="upload"
					class="upload-demo"
					action="#"
					:limit="1"
					:on-exceed="handleExceed"
					:auto-upload="false"
				  >
					<el-button type="primary"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
				</el-upload>
			</el-form-item>
			<div style="width: 100%;text-align: center;">
				<el-button type="warning">(纯软件版) 导入</el-button>
				<el-button> 取消</el-button>
			</div>
		  <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>已装车轮胎批量入库</p>
		   <el-form-item label="已装车轮胎">
		   	<el-button @click="load" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载(软硬件版)</el-button>
		   	<el-upload
		   		ref="upload"
		   		class="upload-demo"
		   		action="#"
		   		:limit="1"
		   		:on-exceed="handleExceed"
		   		:auto-upload="false"
		   	  >
		   		<el-button type="primary"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
		   	</el-upload>
		   </el-form-item>
		   <div style="width: 100%;text-align: center;">
		   	<el-button type="primary">(软硬件版) 导入</el-button>
		   	<el-button> 取消</el-button>
		   </div>
		   
		   <el-form-item label="已装车轮胎" style="margin-top:40px;">
		   	<el-button @click="load" style="line-height: 32px;margin-right: 10px;"> <Download style="width: 1em; height: 1em; margin-right: 8px" />模板下载(纯软件版)</el-button>
		   	<el-upload
		   		ref="upload"
		   		class="upload-demo"
		   		action="#"
		   		:limit="1"
		   		:on-exceed="handleExceed"
		   		:auto-upload="false"
		   	  >
		   		<el-button type="primary"> <Upload style="width: 1em; height: 1em; margin-right: 8px" />上传Excel</el-button>
		   	</el-upload>
		   </el-form-item>
		   <div style="width: 100%;text-align: center;">
		   	<el-button type="warning">(纯软件版) 导入</el-button>
		   	<el-button> 取消</el-button>
		   </div> -->
		
	</div>
</template>

<script setup lang="ts">
	import { reactive } from 'vue';
	import { getToken } from "@/utils/auth";
	const { proxy } = getCurrentInstance();
	const upload = reactive({
	  // 是否显示弹出层（用户导入）
	  open: false,
	  // 弹出层标题（用户导入）
	  title: "",
	  // 是否禁用上传
	  isUploading: false,
	  // 设置上传的请求头部
	  headers: { Authorization: "Bearer " + getToken() },
	  // 上传的地址
	  url: import.meta.env.VITE_APP_BASE_API + "/v1/tire/import/uninstall"
	});
	/**文件上传中处理 */
	const handleFileUploadProgress = (event, file, fileList) => {
	  upload.isUploading = true;
	};
	function handleImport() {
	  upload.title = "未装车轮胎批量导入";
	  upload.open = true;
	};
	/** 文件上传成功处理 */
	const handleFileSuccess = (response, file, fileList) => {
	  upload.open = false;
	  upload.isUploading = false;
	  proxy.$refs["uploadRef"].handleRemove(file);
	  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
	};
	/** 提交上传文件 */
	function submitFileForm() {
	  proxy.$refs["uploadRef"].submit();
	};
	const uploadtwo = reactive({
	  // 是否显示弹出层（用户导入）
	  open: false,
	  // 弹出层标题（用户导入）
	  title: "",
	  // 是否禁用上传
	  isUploading: false,
	  // 设置上传的请求头部
	  headers: { Authorization: "Bearer " + getToken() },
	  // 上传的地址
	  url: import.meta.env.VITE_APP_BASE_API + "/v1/tire/import/vehicleInstall"
	});
	/**文件上传中处理 */
	const handleFileUploadProgresstwo = (event, file, fileList) => {
	  uploadtwo.isUploading = true;
	};
	function handleImporttwo() {
	  uploadtwo.title = "未装车轮胎批量导入";
	  uploadtwo.open = true;
	};
	/** 文件上传成功处理 */
	const handleFileSuccesstwo = (response, file, fileList) => {
	  uploadtwo.open = false;
	  uploadtwo.isUploading = false;
	  proxy.$refs["uploadtwoRef"].handleRemove(file);
	  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.data + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
	};
	/** 提交上传文件 */
	function submitFileFormtwo() {
	  proxy.$refs["uploadtwoRef"].submit();
	};
	
	function downloadone(){
		window.open('https://tpms.5i84.cn/img/moban/未安装轮胎导入模板20240115.xls')
	}
	function downloadtwo(){
		window.open('https://tpms.5i84.cn/img/moban/已安装轮胎导入模板20240115.xls')
	}
</script>

<style scoped>
	.el-form {
	  width: 100%;
	  padding: 0 20px 20px 20px;
	  display: flex;
	  justify-content: center;
		flex-wrap: wrap;
		box-sizing: border-box;
	}
	.formdiv{
		  width:90%;
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
	:deep(.upload-demo){
		width: 250px;
	}
	:deep(.el-form-item__content){
		align-items: flex-start;
	}
</style>