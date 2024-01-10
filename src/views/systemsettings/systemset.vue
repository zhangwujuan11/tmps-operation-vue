<template>
	<div class="con">
		<el-form label-width="100px" :model="infodata" :rules="ruls" ref="menuRef">
			 <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>单位设置</p>
		  <div class="formdiv">
		    <el-form-item label="气压单位设置">
		      <el-select placeholder="选择" v-model="infodata.pressureUnitType" @change="pressureUnitchange" >
		       <el-option label="bar" :value="10001"/>
		       <el-option label="kPa" :value="10002"/>
		      </el-select>
		    </el-form-item>
		  </div>
		  <div class="formdiv">
		    <el-form-item label="温度单位设置">
		      <el-select placeholder="选择" v-model="infodata.temperatureUnitType" @change="temperatureUnitchange">
				   <el-option label="摄氏度℃" :value="10011"/>
				   <el-option label="华氏度℉" :value="10012"/>
		      </el-select>
		    </el-form-item>
		  </div>
		  <p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>轮胎辅助管理-气压异常偏差百分比设置</p>
		   <div class="formdiv">
			   <el-form-item label="气压偏差设置">
			     <el-select placeholder="选择" v-model="infodata.pressureDeviationType" >
			      <!-- <el-option label="全部" value=""/> -->
			      <el-option label="默认偏差(10%/6%/3%)" :value="10021"/>
			      <el-option label="自定义气压偏差" :value="10022"/>
			     </el-select>
			   </el-form-item>
			   <el-form-item label="自定义偏差值" v-if="infodata.pressureDeviationType == 10022" prop="pressureDeviationSelf">
			     <el-input placeholder="单位%" v-model="infodata.pressureDeviationSelf"></el-input>%
			   </el-form-item>
		   </div>
			<p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>里程及花纹深度预警-阈值设置</p>
			<div class="formdiv">
				<el-form-item label="剩余里程阈值" prop="remainingMileageThreshold">
				  剩余<el-input placeholder="单位km" v-model="infodata.remainingMileageThreshold"></el-input>km
				</el-form-item>
			</div>
			<div class="formdiv">
				<el-form-item label="剩余花纹阈值" prop="remainingPatternThreshold">
				  小于<el-input placeholder="单位mm"  v-model="infodata.remainingPatternThreshold"></el-input>mm
				</el-form-item>
			</div>
			<p class="line"><el-icon :size="20" color="#0054a6"><Flag /></el-icon>轮胎换位提醒周期设置</p>
			<div class="formdiv">
				<el-form-item label="提醒周期" prop="alertCycle">
				  超过<el-input placeholder="单位月" v-model="infodata.alertCycle"></el-input>月
				</el-form-item>
			</div>
		</el-form>
		<div style="text-align: center;" slot="footer" class="dialog-footer">
		  <el-button type="primary" @click="subfrom">确定</el-button>
		  <el-button @click="open=false">取消</el-button>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from 'vue'
	import { ElMessage } from 'element-plus'
	import { parameter, parameterupdate } from '@/api/systensettings'
	const { proxy } = getCurrentInstance();
	const infodata=ref({
		pressureUnit:null,
		pressureUnitType:null,
		temperatureUnitType:null,
		temperatureUnit:null
	})
	const pressureUnit=ref('')
	const ruls=ref({
		pressureDeviationSelf:{
			pattern:/^[0-9]+(\.\d+)?$/,
			message: "输入正确的气压偏差设置",
			trigger: "blur"
		},
		remainingMileageThreshold:{
			pattern:/^[0-9]+(\.\d+)?$/,
			message: "输入正确的剩余里程阈值",
			trigger: "blur"
		},
		remainingPatternThreshold:{
			pattern:/^[0-9]+(\.\d+)?$/,
			message: "输入正确的剩余花纹阈值",
			trigger: "blur"
		},
		alertCycle:{
		   pattern:/^[0-9]+(\.\d+)?$/,
		   message: "输入正确的提醒周期",
		   trigger: "blur",
		}
	})
	function pressureUnitchange(){//气压单位数据处理
		if(infodata.value.pressureUnitType == 10001){
			infodata.value.pressureUnit = 'bar'
		}else if(infodata.value.pressureUnitType == 10002){
			infodata.value.pressureUnit = 'kPa'
		}
	}
	
	const temperatureUnit=ref('')
	function temperatureUnitchange(){//温度单位设置
	if(infodata.value.temperatureUnitType == 10011){
		infodata.value.temperatureUnit='摄氏度℃'
	}else if(infodata.value.temperatureUnitType == 10012){
		infodata.value.temperatureUnit='华氏度℉'
	}
	}
	
	
	// 提交修改
	function subfrom(){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			  parameterupdate(infodata.value).then(res=>{
			  	if(res.code == 200){
			  		ElMessage.success("提交成功")
			  	}else{
			  		ElMessage.error(res.message)
			  	}
			  })
		  }
		})
	}
	// mounted
	onMounted(()=>{
		parameter().then(res=>{
			if(res.code == 200){
				infodata.value=res.data
				// pressureUnit.value=res.data.pressureUnitType + ',' + res.data.pressureUnit
				// temperatureUnit.value=res.data.temperatureUnitType + ',' + res.data.temperatureUnit 
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
    display: flex;
    justify-content: space-between;
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