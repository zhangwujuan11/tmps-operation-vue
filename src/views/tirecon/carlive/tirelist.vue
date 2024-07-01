<template>
  <div class="app-container">
    <el-form label-width="75px" style="display: flex;flex-wrap: wrap;justify-content: flex-start;">
        <el-form-item label="轮胎规格">
		  <el-select
		  placeholder="请选择轮胎规格" 
		  v-model="queryform.specificationsId"
		  filterable
		  :clearable="true"
		  >
		    <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in guige" :key="index" />
		  </el-select>
        </el-form-item>
        <el-form-item label="传感器ID">
          <el-input placeholder="请输入传感器ID" v-model="queryform.senderId"></el-input>
        </el-form-item>
        <el-form-item label="花纹型号">
			<el-select
			 placeholder="请输入花纹型号" 
			 v-model="queryform.pattern"
			 filterable
			 :clearable="true"
			>
			 <el-option :label="item.paramName" :value="item.paramName"  v-for="(item,index) in xinhao" :key="index" />
			</el-select>
          <!-- <el-input placeholder="请输入花纹型号"  v-model="queryform.pattern"></el-input> -->
        </el-form-item>
        <el-form-item label="RFID标签">
          <el-input placeholder="请输入RFID标签" v-model="queryform.rfidCode"></el-input>
        </el-form-item>
        <el-form-item label="胎号">
			<!-- <el-select
			placeholder="请输入胎号" 
			v-model="queryform.tireNo"
			filterable
			:clearable="true"
			>
			  <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
			</el-select> -->
			<el-select v-model="queryform.tireNo"
				filterable clearable placeholder="请选择"
				allow-create
				:default-first-option="true"
				@blur="Nameblur($event)"
				default-first-option>
				<el-option :label="item.tireNo" :value="item.tireNo" v-for="(item,index) in chetai" :key="index" />
			 </el-select>
        </el-form-item>
		<el-form-item label="车牌号">
			<el-form-item label="" prop="mfteTitle">
				<el-select
				placeholder="请输入车牌号" 
				v-model="queryform.vehicleNo"
				:clearable="true"
				filterable
				>
				  <el-option :label="item" :value="item" v-for="(item,index) in vehicleNoo" :key="index" />
				</el-select>
			</el-form-item>
		</el-form-item>
		<el-form-item label="自编号">
		  <el-input placeholder="请输入自编号" v-model="queryform.insideTireNo"></el-input>
		</el-form-item>
        <el-form-item label="轮胎状态">
          <el-select placeholder="请选择" v-model="queryform.stockStatus" clearable>
            <el-option
               v-for="dict in lifecycle_tire_status"
               :key="dict.value"
               :label="dict.label"
               :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮胎品牌">
          <el-select
          placeholder="请输入品牌" 
          v-model="queryform.tireBrandId"
          filterable
          :clearable="true"
          >
            <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in pinpai" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库">
         <el-select
         placeholder="请选择所属仓库" 
         v-model="queryform.warehouseId"
         filterable
         :clearable="true"
         >
           <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
         </el-select>
        </el-form-item>
        <el-form-item label="入库时间" style="width: 22.5vw;">
          <el-date-picker
			  v-model="time"
			 type="daterange"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			 format="YYYY/MM/DD"
			 value-format="YYYY-MM-DD"
			  @change="wetiem"
          />
        </el-form-item>
		<el-form-item label="质保周期">
			<el-select
			 placeholder="请选择质保周期" 
			 v-model="queryform.qualityPeriod"
			 :clearable="true"
			>
			 <el-option label="正常" :value="0"/>
			 <el-option label="即将过期" :value="1"/>
			 <el-option label="已过期" :value="-1"/>
			</el-select>
		  <!-- <el-input placeholder="请输入花纹型号"  v-model="queryform.pattern"></el-input> -->
		</el-form-item>
    </el-form>
    <div style="text-align: center;">
      <el-button type="primary" @click="getListserchbtn"><i class="el-icon-search"></i> 查询</el-button>
      <el-button @click="exportable" v-hasPermi="['tpms:maintenance:export']" ><i class="el-icon-upload2"></i>导出</el-button>
    </div>
    <el-radio-group v-model="queryformtwo.isUse" @change="radiofirst">
      <el-radio-button label="0">可用轮胎（{{tirelistcount.availableTires}}）</el-radio-button>
      <el-radio-button label="-1">已报废轮胎（{{tirelistcount.scrapTires}}）</el-radio-button>
    </el-radio-group>
    <div class="chekbox">
      <span @click="queryformtwo.tblCategory=''; getListtwo()" style="cursor: pointer;">轮胎分类：</span>
      <el-radio-group v-model="queryformtwo.tblCategory" @change="radioth()">
		   <el-radio-button  
			v-for="dict in lifecycle_tire_category"
		     :key="dict.value"
		     :label="dict.value"
		    >{{dict.label}} （{{fatt(dict.value)}}） </el-radio-button>
      </el-radio-group>
    </div>
    <div class="chekbox" v-if="lunzhuan">
      <span @click="queryformtwo.tblStockStatus='' ; getListtwo()" style="cursor: pointer;">轮胎状态：</span>
      <el-radio-group v-model="queryformtwo.tblStockStatus"  @change="radiowh()">
	  <el-radio-button
	  v-for="dict in lifecycle_tire_status"
	    :key="dict.value"
	    :label="dict.value"
	   >{{dict.label}} （{{fatt(dict.value)}}）</el-radio-button>
      </el-radio-group>
    </div>
    <div class="chekbox" style="margin-bottom: 20px;">
      <span @click="queryformtwo.sensorStatus='';getListtwo()" style="cursor: pointer;">捆绑状态：</span>
      <el-radio-group v-model="queryformtwo.sensorStatus" @change="getListtwo">
        <el-radio-button label="1">已绑定传感器（{{tirelistcount.sensor}}）</el-radio-button>
        <el-radio-button label="0">未绑定传感器（{{tirelistcount.noSensor}}）</el-radio-button>
      </el-radio-group>
    </div>


    <!-- 表格操作 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain  :disabled="multiple" @click="diaobo = true"
          v-hasPermi="['tpms:tireWarehouse:edit']">仓库轮胎调拨</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain  :disabled="multiple" @click="handleUpdate"
          v-hasPermi="['tpms:tireBatch:edit']">批量修改信息</el-button>
      </el-col>
    <!--  <el-col :span="1.5">
        <el-button type="danger" plain  :disabled="multiple" @click="cheduidioabo=true"
          v-hasPermi="['tpms:tireCompany:edit']">组织轮胎调拨</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button type="warning" plain  @click="exportexcel"
          v-hasPermi="['tpms:cold:export']">导出冷态气压</el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table :data="dataList" ref="tableRef"
	@selection-change="handleSelectionChange" 
	@sort-change="headerclick($event)">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="胎号"  sortable align="center" prop="tireNo" width="180"/>
      <el-table-column label="车牌号" sortable align="center" prop="vehicleNo" />
     <el-table-column label="自编号" sortable align="center" prop="insideTireNo">
      </el-table-column>
	  <el-table-column label="所属仓库" sortable align="center" prop="warehouseName">
	  </el-table-column>
	  <el-table-column v-if="feishow" sortable label="车牌号" align="center" prop="vehicleNo">
	  </el-table-column>
	  <el-table-column v-if="feishow" sortable label="轮位" align="center" prop="installPosition">
	  </el-table-column>
      <el-table-column label="品牌" sortable align="center" prop="tireBrandName" />
      <el-table-column v-if="!feishow" label="规格" sortable align="center" prop="specificationsName" />
      <el-table-column label="花纹型号" sortable align="center" prop="pattern">
      </el-table-column>
      <el-table-column label="新胎花纹深度(mm)" sortable align="center" prop="depth" />
      <el-table-column label="初测花纹深度(mm)" sortable align="center" prop="firstDepth" />
      <el-table-column label="实测花纹深度(mm)" sortable align="center" prop="measuredDepth" />
      <el-table-column label="传感器ID" sortable align="center" prop="senderId" width="120">
		  <template #default="scope">
				<span v-if="!scope.row.senderId"  @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId,scope.row.senderType)" style="color: red;cursor: pointer;">暂无[绑定]</span>
				<span  @click="chuango(scope.row.senderId,scope.row.tireNo,scope.row.tireId,scope.row.senderType)" v-else style="color: green;cursor: pointer;">{{scope.row.senderId}} [解除]</span>  
		  </template>
	</el-table-column>
      <el-table-column label="状态" sortable align="center" >
		  <template #default="scope">
			 <dict-tag :options="lifecycle_tire_status" :value="scope.row.stockStatus" />
		  </template>
	</el-table-column>
      <el-table-column label="入库时间" sortable align="center" prop="createTime" width="180">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding" width="150">
		   <template #default="scope">
			   <el-button
			   link  type="primary"
			    @click="goxiang(scope.row)"
			  ><Edit style="width: 1em; height: 1em; margin-right: 2px"></Edit>详情</el-button>
			  <el-button type="danger" link 
			  v-hasPermi="['tpms:tireCompany:remove']" 
			  @click="detire(scope.row.tireId)"><Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除</el-button>
			</template>
      </el-table-column>
    </el-table>
    <pagination
       v-show="total > 0"
       :total="total"
       v-model:page="queryform.pageNum"
       v-model:limit="queryform.pageSize"
       @pagination="pagetablelist"
    />
    <!-- 轮胎详情 -->
    <el-dialog :title="title" v-model="open" width="45%" append-to-body :close-on-click-modal="false">
        <h4 style="color: red;text-align: center;margin-top: -5px;margin-bottom: 10px;">注：行驶中的轮胎不支持批量修改所属仓库</h4>
        <el-form label-width="100px">
          <div>
            <!-- <el-form-item label="所属组织">
              <el-select
			  placeholder="请输入组织"
			  v-model="checkname"
			  filterable
			  @change="name"
			  :clearable="true"
			  >
                <el-option :label="item.teamName" :value="`${item.fleetId},${item.teamName}`"  v-for="(item,index) in carcompanydata" :key="index" />
              </el-select>
            </el-form-item> -->
            <el-form-item label="品牌">
              <el-select
               placeholder="请输入品牌" 
               v-model="form.tireBrandId"
               filterable
               remote
               :clearable="true"
              	@change="brandr($event)"
              >
			   <el-option :label="item.paramName" :value="item.paramId"  v-for="(item,index) in pinpai" :key="index" />
              </el-select>
            </el-form-item>
            <el-form-item label="花纹型号">
				<el-select
				 placeholder="请输入花纹型号" 
				 v-model="xinhaovalue"
				 filterable
				 :clearable="true"
				@change="brandrxinhaovalue"
				>
				 <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in xinhao" :key="index" />
				</el-select>
              <!-- <el-input v-model="form.pattern" placeholder="请输入花纹型号"></el-input> -->
            </el-form-item>
            <el-form-item label="新胎花纹深度">
               <el-input type="number" v-model="form.depth" placeholder="请输入新胎花纹深度"></el-input>
            </el-form-item>
            <el-form-item label="实测花纹深度">
              <el-input  type="number" v-model="form.measuredDepth" placeholder="请输入实测花纹深度"></el-input>
            </el-form-item>
            <el-form-item label="DOT">
              <el-input  v-model="form.dot" ></el-input>
            </el-form-item>
            <el-form-item label="载重指数">
              <el-input placeholder="请输入载重指数" v-model="form.loadIndex"></el-input>
            </el-form-item>
            <el-form-item label="累计里程">
               <el-input type="number" v-model="form.totalMileage" placeholder="请输入累计里程"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="所属仓库">
             <el-select
             placeholder="请输入所属仓库" 
             v-model="warehouseName"
              filterable
              remote
              :clearable="true"
             @change="warehouse"
             >
              <el-option :label="item.warehouseName" :value="`${item.id},${item.warehouseName}`"  v-for="(item,index) in houselist" :key="index" />
             </el-select>
            </el-form-item>
            <el-form-item label="规格">
              <el-select
              placeholder="请选择轮胎规格" 
              v-model="specification"
              filterable
              @change="specificati"
              :clearable="true"
              >
                <el-option :label="item.paramName" :value="`${item.paramId},${item.paramName}`"  v-for="(item,index) in guige" :key="index" />
              </el-select>
            </el-form-item>
            <el-form-item label="单价">
              <el-input type="number" v-model="form.price" placeholder="请输入单价"></el-input>
            </el-form-item>
            <el-form-item label="初测花纹深度">
              <el-input placeholder="单位mm" v-model="form.firstDepth"></el-input>
            </el-form-item>
            <el-form-item label="供应商">
				<el-select
				 placeholder="请选择供应商" 
				 v-model="form.manufacturer"
				 filterable
				 :clearable="true"
				>
				 <el-option :label="item.supplierName" :value="item.supplierName"  v-for="(item,index) in gongyings" :key="index" />
				</el-select>
            </el-form-item>
            <el-form-item label="速度级别">
              <el-input v-model="form.speedLevel" placeholder="请输入速度级别"></el-input>
            </el-form-item>
            <el-form-item label="质保期">
             <el-date-picker
                 v-model="form.expireDate"
				 format="YYYY/MM/DD"
				 value-format="YYYY-MM-DD"
                 type="date"/>
            </el-form-item>
            <el-form-item label="累计时长">
               <el-input placeholder="单位h" v-model="form.totalDuration" type="number"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div style="text-align: center;" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subform">确定</el-button>
          <el-button @click="open=false">取消</el-button>
        </div>
    </el-dialog>
	
	
	<!-- 导出冷态气压 -->
	<el-dialog title="导出冷态气压" v-model="leng" width="500" append-to-body :close-on-click-modal="false">
	    <el-form label-width="150px" style="flex-wrap: wrap;"  :rules="ruletwo" ref="coldforms" :model="coldform">
	        <el-form-item label="请输入环境温度"  prop="temperature">
	          <el-input placeholder="单位℃" v-model="coldform.temperature"></el-input>
	        </el-form-item>
	        <el-form-item label="请选择导出日期" prop="exportDate">
	         <el-date-picker
			  type="date"
			  v-model="coldform.exportDate"
			   format="YYYY-MM-DD"
			  value-format="YYYY-MM-DD"
			  placeholder="选择日期">
			</el-date-picker>
	        </el-form-item>
			<div style="text-align: center;" slot="footer" class="dialog-footer">
			  <el-button type="primary" @click="coldcheck">确定</el-button>
			  <el-button @click="leng=false">取消</el-button>
			</div>
	    </el-form>
	</el-dialog>
	
	<!-- 仓库轮胎调拨 -->
	<el-dialog title="仓库轮胎调拨" v-model="diaobo" width="45%" append-to-body :close-on-click-modal="false">
	    <el-form label-width="150px" style="flex-wrap: wrap;">
	        <el-form-item label="选择仓库" style="width: 85%;display: flex;">
	          <el-select
	          placeholder="请输入所属仓库" 
	          v-model="value"
	           filterable
	           remote
	           reserve-keyword
			   :clearable="true"
	          >
				 <el-option :label="item.warehouseName" :value="item.id"  v-for="(item,index) in houselist" :key="index" />
	          </el-select>
	        </el-form-item>
	    </el-form>
	    <div style="text-align: center;" slot="footer" class="dialog-footer">
	      <el-button type="primary" @click="subcang">确定</el-button>
	      <el-button @click="diaobo=false">取消</el-button>
	    </div>
	</el-dialog>
	<!-- 组织轮胎调拨 -->
	<el-dialog title="组织轮胎调拨" v-model="cheduidioabo" width="45%" append-to-body :close-on-click-modal="false">
	    <el-form label-width="150px" style="flex-wrap: wrap;">
	        <el-form-item label="选择组织" style="width: 85%;display: flex;">
				<el-tree-select
				:default-expand-all="true"
				   v-model="value2"
				   :data="deptOptions"
				   :props="{ value: 'deptId', label: 'deptName', children: 'children' }"
				   value-key="deptId"
				   placeholder="选择组织"
				   check-strictly
				/>
	        </el-form-item>
	    </el-form>
	    <div style="text-align: center;" slot="footer" class="dialog-footer">
	      <el-button type="primary" @click="subchedui">确定</el-button>
	      <el-button @click="cheduidioabo=false">取消</el-button>
	    </div>
	</el-dialog>
	
	<!-- 传感器id -->
	<el-dialog title="绑定传感器" v-model="chuanid" width="480" append-to-body :close-on-click-modal="false">
	    <el-form label-width="150px" style="flex-wrap: wrap;" :rules="rules" ref="menuRef" :model="chuanfrom">
	        <el-form-item label="胎号" >
				<el-input v-model="chuanfrom.tireNo" disabled></el-input>
			</el-form-item>
			<el-form-item label="传感器ID" prop="senderId">
				<el-input v-model="chuanfrom.senderId" :disabled="!jiebangma"></el-input>
			</el-form-item>
			<el-form-item label="绑定方式" prop="senderType">
	          <el-select
			   :disabled="!jiebangma"
	          placeholder="请选择绑定方式" 
	          v-model="chuanfrom.senderType"
	           filterable
	            :clearable="true"
	          >
	            <el-option :label="item.label" :value="item.value"  v-for="(item,index) in lifecycle_tire_sendertype" :key="index" />
	          </el-select>
	        </el-form-item>
	    </el-form>
	    <div style="text-align: center;" slot="footer" class="dialog-footer">
	      <el-button type="primary" v-if="jiebangma" @click="bangdingfun">绑定</el-button>
		  <el-button type="primary" v-if="!jiebangma" @click="jiebangfun">解绑</el-button>
	      <el-button @click="chuanid=false">取消</el-button>
	    </div>
	</el-dialog>
	<!-- //详情 -->
	<el-dialog :title="dangan" v-model="xiangqing" width="85%" :close-on-click-modal="false">
	    <el-tabs v-model="activeName" class="demo-tabs">
	       <el-tab-pane label="轮胎详情" name="first">
			  <cartirefrom :xinhao="xinhao" :updateform="updateform" :pinpai="pinpai" :houselist="houselist" :gongyings="gongyings" :xiangqing="xiangqing" @onReceiveMsg="onReceiveMsg" @onReceive="onReceive"></cartirefrom>
		   </el-tab-pane>
	       <el-tab-pane label="轮胎生命周期" name="second">
			   <carlive :tid="tid"></carlive>
		   </el-tab-pane>
	       <el-tab-pane label="GPS阶段里程" name="third">
			   <gpsfrom :tid="tid" :tireNo="tireNo"></gpsfrom>
		   </el-tab-pane>
	       <el-tab-pane label="维护记录" name="fourth">
			   <fourthfrom :tid="tid"></fourthfrom>
		   </el-tab-pane>
	     </el-tabs>
	</el-dialog>
  </div>
</template>

<script setup lang="ts" name="Tirelist">
	import { useRoute  } from 'vue-router'
	import { ref, onMounted, watch } from 'vue';
	import { ElMessage, ElMessageBox } from 'element-plus'
	import {  tireinfos} from '@/api/car.js'
	import {tirelist, getTireBands, getSpecifications, deteltire,deteltireyes, companyId, warehouseId, updatatires, expotires, exportxlxs, jiebang, bangding, getpatternmodel} from '@/api/carlive'
	import { carcompanylist, vehicleNo, coldexpoprt } from '@/api/systensettings'
	import { warehouselist } from '@/api/warehouse'
	import cartirefrom from '@/components/Carlive/cartirefrom.vue'
	import carlive from '@/components/Carlive/carlive.vue'
	import gpsfrom from '@/components/Carlive/gpsfrom.vue'
	import fourthfrom from '@/components/Carlive/fourthfrom.vue'
	import { listDept } from "@/api/system/dept";
	import { supperlist, tirecount } from "@/api/system/tenant";
	import { dilog } from '@/store/dilog'
	const { proxy } = getCurrentInstance();
	const { lifecycle_tire_status, lifecycle_tire_category, lifecycle_tire_sendertype } = proxy.useDict("lifecycle_tire_status", "lifecycle_tire_category", "lifecycle_tire_sendertype");
	const carcompanydata=ref([])
	const vehicleNoo=ref([])
	const chetai=ref([])//车胎列表
	const pinpai=ref([])//品牌
	const guige=ref([])//规格
	const houselist=ref([])//仓库
	const xinhao=ref([])//花纹型号
	const value2=ref("")
	const gongyings=ref([])
	const diaobo=ref(false)
	const cheduidioabo=ref(false)
	const checkname=ref('')//未处理组织
	const brand=ref('')//未处理的品牌
	const specification=ref('')//未处理规格
	const warehouseName=ref('')//未处理的所属仓库
	const xinhaovalue=ref('')//未处理的花纹型号
	const time=ref([])
	const deptOptions=ref([])
	const queryformtwo=ref({})
	const tireNo=ref('')
	const queryform=ref({
		pageNum:1,
		pageSize:10,
		isUse:'0'
		// companyName:'',
		// specificationsId:null,
		// vehicleNo:'',
		// pattern:'',
		// rfidCode:'',
		// tireNo:'',
		// qualityPeriod:'',
		// tireBrandId:null,
		// warehouseId:null,
		// category:null,
		// stockStatus:'',
		// sensorStatus:'',
		// senderId:''
	})
	const chuanid=ref(false)
	const jiebangma=ref(false)
	const form=ref({})
	const dataList=ref([]) 
	const chuanfrom=ref({
		senderId:null,
		senderType:null
	})
	const coldform=ref({
		temperature:'',
		exportDate:''
	})
	const  ruletwo=({
		temperature: [{ required: true, message: "环境温度不能为空", trigger: "change" }],
		exportDate: [{ required: true, message: "导出日期不能为空", trigger: "change" }]
	  }) 
	const rules=({
		senderId: [{ required: true, message: "传感器ID不能为空", trigger: "blur" }],
		senderType: [{ required: true, message: "绑定方式不能为空", trigger: "blur" }],
	  }) 
	
	const xiangqing=ref(false)//详情
	const dangan=ref('')//详情标题
	const updateform=ref({})//胎压详情from
	// 调拨仓库数据
	const value=ref(null)
	const tid=ref(null)
	
	// 选择时间时
	function wetiem(){
		if(time.value){
			queryform.value.startTime=time.value[0] + " 00:00:00"
			queryform.value.endTime=time.value[1] + " 59:59:59"
		}else{
			queryform.value.startTime=''
			queryform.value.endTime=''
		}
	}
	
	const tirelistcount=ref({})
	const dilogs = dilog();
	
	// 排序点击
	function headerclick(e){
		let num=e.column.no
		let isup= ''
		if(e.order== 'ascending'){
			isup=1
		}else if(e.order== 'descending'){
			isup=0
		}else{
			isup=''
			num=''
		}
		queryform.value.fieldSort  = num
		queryform.value.fieldSortFlag = isup
		let obj = queryform.value
		obj.isUse=queryformtwo.value.isUse
		obj.type=queryformtwo.value.isUse
		obj.tblCategory=queryformtwo.value.tblCategory
		obj.tblStockStatus=queryformtwo.value.tblStockStatus
		obj.sensorStatus=queryformtwo.value.sensorStatus
		obj.pageNum=1
		obj.pageSize=10
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	// 分页列表
	function pagetablelist(){
		let obj = queryform.value
		obj.isUse=queryformtwo.value.isUse
		obj.type=queryformtwo.value.isUse
		obj.tblCategory=queryformtwo.value.tblCategory
		obj.tblStockStatus=queryformtwo.value.tblStockStatus
		obj.sensorStatus=queryformtwo.value.sensorStatus
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	
	// 获取table数据基础
	function getList(){
		queryformtwo.value.isUse=''
		queryformtwo.value.tblCategory=''
		queryformtwo.value.tblStockStatus=''
		queryformtwo.value.sensorStatus=''
		let obj = queryform.value
		obj.type=''
		obj.tblCategory=''
		// obj.stockStatus=''
		obj.tblStockStatus=''
		obj.isUse=''
		obj.sensorStatus=''
		tirecount(obj).then(data=>{
			tirelistcount.value=data.data
		})
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	// 查询table
	function getListserchbtn(){
		proxy.$refs["tableRef"].clearSort()
		proxy.$refs["tableRef"].clearFilter()
		
		queryform.value.fieldSort  = ''
		queryform.value.fieldSortFlag = ''
		queryformtwo.value.isUse=''
		queryformtwo.value.tblCategory=''
		queryformtwo.value.tblStockStatus=''
		queryformtwo.value.sensorStatus=''
		let obj = queryform.value
		obj.type=''
		obj.tblCategory=''
		obj.tblStockStatus=''
		obj.isUse=''
		obj.sensorStatus=''
		tirecount(obj).then(data=>{
			tirelistcount.value=data.data
		})
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	// 分类查询
	function getListtwo(){
		proxy.$refs["tableRef"].clearSort()
		proxy.$refs["tableRef"].clearFilter()
		queryform.value.fieldSort  = ''
		queryform.value.fieldSortFlag = ''
		let obj = queryform.value
		obj.isUse=queryformtwo.value.isUse
		obj.type=queryformtwo.value.isUse
		obj.tblCategory=queryformtwo.value.tblCategory
		obj.tblStockStatus=queryformtwo.value.tblStockStatus
		obj.sensorStatus=queryformtwo.value.sensorStatus
		
		tirecount(queryform.value).then(data=>{
			tirelistcount.value=data.data
		})
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	
	function Nameblur(e) {
		queryform.value.tireNo=e.target.value
	   }
	function getListhree(){
		queryformtwo.value.isUse='0'
		queryformtwo.value.tblCategory=''
		queryformtwo.value.tblStockStatus=''
		let obj = queryform.value
		obj.type='0'
		obj.tblCategory=''
		obj.stockStatus=''
		obj.sensorStatus=''
		obj.isUse='0'
		tirecount(obj).then(data=>{
			tirelistcount.value=data.data
		})
		tirelist(obj).then(res=>{
			dataList.value=res.data.items
			total.value=res.data.total
			dilogs.$patch({ tirelist: false })
		})
	}
	
	function fatt(e){
		return tirelistcount.value[e]
	}
	
	
	
	// 删除轮胎
	function detire(i){
		ElMessageBox.confirm(
		     '您确定要删除该信息吗？',
		     '注意',
		     {
		       confirmButtonText: '确定',
		       cancelButtonText: '取消',
		       type: 'warning',
		     }
		   ).then(() => {
			   deteltireyes(i).then(res=>{
				   if(res.data){
					deteltire(i).then(ress=>{
					  		ElMessage({
					  		  type: 'success',
					  		  message: '删除成功',
					  		})
					  		open.value=false
					  		getList()
					  }) 
				   }else{
					  ElMessage({
					    type: 'error',
					    message: res.message,
					  }) 
				   }
			   })
		     }).catch(() => {
		       ElMessage({
		         type: 'info',
		         message: '已取消删除',
		       })
		     })
	}
	
	function name(val){//处理的组织数据
		let [id,name] = val.split(',')
		form.value.companyId = id
		form.value.companyName = name
	}
	function brandr(val){//处理品牌数据
		pinpai.value.map(item=>{
			if(item.paramId == val){
				form.value.tireBrandName =item.paramName
			}
		})
	}
	function specificati(val){//处理规格数据
		let [id,name] = val.split(',')
		form.value.specificationsId = id
		form.value.specificationsName = name
	}
	function brandrxinhaovalue(val){//处理花纹型号数据
		let [id,name] = val.split(',')
		form.value.patternId = id
		form.value.pattern = name
	}
	function warehouse(val){//处理仓库数据
		let [id,name] = val.split(',')
		form.value.warehouseId = id
		form.value.warehouseName = name
	}
	/** 批量修改轮胎信息 */
	const handleUpdate=function(row){
			 from1.value = true
			 open.value = true;
			 title.value = "批量修改轮胎信息";
			 form.value={}
			checkname.value=''//未处理组织
			brand.value=''//未处理的品牌
			specification.value=''//未处理规格
			warehouseName.value=''//未处理的所属仓库
	}
	function subform(){
		const idss = ids.value
		if(JSON.stringify(form.value) == "{}"){
			ElMessage.error("请至少填写一个修改选项")
		}else{
			updatatires({
				tids:idss.toString(),
				data:form.value
			}).then(res=>{
				if(res.code == 200){
					ElMessage.success("修改成功")
					open.value=false
					getList()
				}else{
					ElMessage.error(res.message)
				}
			})
		}
	}
	
	
	// 导出
	function exportable(){
		queryform.value.pageNum=1
		queryform.value.pageSize=100000
		expotires(queryform.value).then(res=>{
			exportxlxs(res.data).then(respon=>{
				 downloadFiles(respon)
				 queryform.value.pageNum=1
				 queryform.value.pageSize=10
			})
		})
	}
	// 解码下载方法
	function downloadFiles(data) {
		console.log(data)
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "轮胎列表.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "轮胎列表.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "轮胎列表.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	// 传感器id
	function chuango(i,tire,d,sendid){
		chuanid.value=true
		if(i == null){//绑定
		chuanfrom.value={}
			jiebangma.value=true
		}else{
			jiebangma.value=false
		}
		chuanfrom.value.tireNo=tire
		chuanfrom.value.tireId=d
		chuanfrom.value.senderId=i
		chuanfrom.value.senderType=sendid
	}
	
	// 子组件触发的方法
	const onReceiveMsg = (params:string) => {
		chuango(params.senderId,params.tireNo,params.tireId,params.senderType)
	}
	const onReceive = (params) => {
		xiangqing.value=params
		getList()
	}
	
	
	// 提交解绑，绑定
	function jiebangfun (){
		jiebang(chuanfrom.value.tireId).then(res=>{
			if(res.code == 200){
				ElMessage.success("解绑成功")
				chuanid.value=false
				xiangqing.value=false
				getList()
			}else{
				ElMessage.error(res.message)
			}
		})
	}
	
	function bangdingfun (){
		proxy.$refs["menuRef"].validate(valid => {
		  if (valid) {
			 bangding(chuanfrom.value).then(res=>{
			 	if(res.code == 200){
			 	ElMessage.success("绑定成功")
			 		chuanid.value=false
			 		xiangqing.value=false
			 		getList()
			 	}
			 })
		  }
		})
	}
	function goxiang(i){
		dangan.value="轮胎档案【"+i.tireNo+"】"
		tireinfos(i.tireId).then(res=>{
			updateform.value=res.data
			tid.value = i.tireId
			xiangqing.value=true
		})
		tireNo.value=i.tireNo
	} 
	// mounted
	onMounted(()=>{
		listDept().then(response => {
		  deptOptions.value = proxy.handleTree(response.data, "deptId");
		});
		carcompanylist().then(res=>{
			if(res.code == 200){
				carcompanydata.value=res.data.items
			}
		})
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
		// 品牌
		getTireBands().then(res=>{
			pinpai.value=res.data
		})
		// 规格
		getSpecifications().then(res=>{
			guige.value=res.data
		})
		// 仓库
		warehouselist({}).then(res=>{
			houselist.value=res.data.items
		})
		// 花纹型号
		getpatternmodel().then(res=>{
			xinhao.value=res.data
		})
		// 供应商
		supperlist({pageNum:1,pageSize:100000}).then(res=>{
			gongyings.value=res.data.items
		})
		getListhree()
	})
	// 监听echarts的dilog
	dilogs.$subscribe((mutation, state) => {
		 if(dilogs.tirelist){
			 getList()
		 }
	})
	
	// 轮胎状态
	const lunzhuan=ref(false)
	const quanxin=ref(false)
	const fanxin=ref(false)
	const daichuli=ref(true)
	const feishow=ref(false)
	const radiofirst=function(){
		fenlei.value='' 
		zhuangtai.value=''  
		kunbang.value=''  
		lunzhuan.value=false
		queryformtwo.value.category=''
		queryformtwo.value.stockStatus=''
		queryformtwo.value.sensorStatus=''
		queryformtwo.value.tblCategory=''
		queryformtwo.value.tblStockStatus=''
		queryformtwo.value.sensorStatus=''
		getListtwo()
	}
	
	const radioth=function(){
		queryformtwo.value.tblStockStatus=''
		queryformtwo.value.sensorStatus=''
		lunzhuan.value=true
		if(fenlei.value == "1"){
			quanxin.value=true
			fanxin.value=false
			daichuli.value=true
			getListtwo()
		}else if(fenlei.value == "4"){
			quanxin.value=false
			fanxin.value=true
			daichuli.value=false
			getListtwo()
		} else{
			quanxin.value=false
			fanxin.value=false
			daichuli.value=true
			getListtwo()
		}
	}
	const radiowh=function(){
		queryformtwo.value.sensorStatus=''
		if(zhuangtai.value == "2"){
			feishow.value=true
			getListtwo()
		}else{
			feishow.value=false
			getListtwo()
		}
	}
	
	// 导出冷态气压
	const leng=ref(false)
	const exportexcel=function(){
		leng.value=true
	}
	// 确定导出冷态气压
	function coldcheck(){
		proxy.$refs["coldforms"].validate(valid => {
			 if (valid) {
				 queryform.value.temperature=coldform.value.temperature
				 queryform.value.exportDate=coldform.value.exportDate
				 queryform.value.pageSize=100000
				 coldexpoprt(queryform.value).then(res=>{
				 	exportxlxs(res.data).then(respon=>{
				 		 downloadFiles2(respon)
				 		 queryform.value.pageNum=1
				 		 queryform.value.pageSize=10
				 	})
				 })
			 }
		})
		// if(!coldform.value.temperature){
		// 	ElMessage.error("环境温度不能为空")
		// 	return false
		// }else if(!coldform.value.exportDate){
		// 	ElMessage.error("导出日期不能为空")
		// 	return false
		// }else{
			
			
		// }
	}
	
	function downloadFiles2(data) {
	    if (typeof window.chrome !== 'undefined') {
	        // Chrome version
	        var link = document.createElement('a');
	        link.href = window.URL.createObjectURL(data);
	        link.download = "冷态气压.xlsx";
	        link.click();
	    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
	        // IE version
	        var blob = new Blob([data], { type: 'application/force-download' });
	        window.navigator.msSaveBlob(blob, "冷态气压.xlsx");
	    } else {
	        // Firefox version
	        var file = new File([data], "冷态气压.xlsx", { type: 'application/force-download' });
	        window.open(URL.createObjectURL(file));
	    }
	}
	
	const open=ref(false)
	const total=ref(0)
	const fenlei=ref('')
	const zhuangtai=ref('')
	const kunbang=ref('')
	const  ids=ref([])
	const single=ref(true) //单个
	const multiple=ref(true)//多个
	const  title=ref('')
	const from1=ref(false) //单个
	const from2=ref(false)
	  // 多选框选中数据
	const handleSelectionChange=function(selection){
		ids.value = selection.map(item => item.tireId)
		single.value = selection.length != 1
		multiple.value = !selection.length
	}
	 // 仓库轮胎调拨
	 const handleAdd=function(row){
		 from2.value = true
		 open.value = true;
		 title.value = "仓库轮胎调拨";
	 }
	// 提交仓库调拨
	function subcang(){
		 const idss = ids.value
		 console.log(value.value)
		 if(value.value){
			companyId({
			 tids:idss.toString(),
			 companyId:value.value
			}).then(res=>{
			 if(res.code == 200){
				 diaobo.value=false
				 getList()
			 }
			}) 
		 }else{
			 ElMessage.error("选择仓库信息不能为空")
		 }
		 
	}
	// 提交组织调拨
	function subchedui(){
		 const idss = ids.value
		 warehouseId({
			 tids:idss.toString(),
			 companyId:value2.value
		 }).then(res=>{
			 if(res.code == 200){
				 cheduidioabo.value=false
				 getList()
			 }
		 })
	}
	
	// 详情
	const activeName = ref('first')
	watch(() => xiangqing.value, value => {
		if(!value){
			tid.value=''
			getList()
		}
	})
	const router = useRoute()
	watch(() => router.query,(toPath) => {
	        if(toPath.form == 'add'){
	          getList()
	        }
	},{immediate: true,deep: true})
</script>
<style scoped>
  .el-form {
    width: 100%;
    display: flex;
    justify-content: space-between;
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
  .chekbox{
	  margin-top: 15px;
	  display: flex;
	  align-items: center;
	  margin-top: 15px;
  }
  .chekbox span{
	  font-size: 14px;
	  color: #606266;
  }
</style>
