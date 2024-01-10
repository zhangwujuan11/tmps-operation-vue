<template>
	<div class="app-container">
	    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
	      <el-form-item label="商户标识" prop="tenantId">
	        <el-input
	          v-model="queryParams.tenantId"
	          placeholder="请输入商户标识"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	      <el-form-item label="联系人" prop="contact">
	        <el-input
	          v-model="queryParams.contact"
	          placeholder="请输入联系人"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	      <el-form-item label="电话" prop="phone">
	        <el-input
	          v-model="queryParams.phone"
	          placeholder="请输入电话"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	      <el-form-item label="商户名称" prop="name">
	        <el-input
	          v-model="queryParams.name"
	          placeholder="请输入商户名称"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	     <!-- <el-form-item label="商户名称" prop="userId">
	        <el-input
	          v-model="queryParams.userId"
	          placeholder="请输入商户名称"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item> -->
	      <el-form-item>
	        <el-button type="primary" size="default" @click="handleQuery">搜索</el-button>
	        <el-button size="default" @click="resetQuery">重置</el-button>
	      </el-form-item>
	    </el-form>
	
	   <el-row :gutter="10" class="mb8">
	      <el-col :span="1.5">
	        <el-button
	          type="primary"
	          plain
	          icon="Plus"
	          size="default"
	          @click="handleAdd"
	          v-hasPermi="['system:tenant:add']"
	        >新增</el-button>
	      </el-col>
	      <el-col :span="1.5">
	        <el-button
	          type="success"
	          plain
	          icon="Edit"
	          size="default"
	          :disabled="single"
	          @click="handleUpdate"
	          v-hasPermi="['system:tenant:edit']"
	        >修改</el-button>
	      </el-col>
	     <!-- <el-col :span="1.5">
	        <el-button
	          type="danger"
	          plain
	           icon="Delete"
	          size="default"
	          :disabled="multiple"
	          @click="handleDelete"
	          v-hasPermi="['system:tenant:remove']"
	        >删除</el-button>
	      </el-col> -->
	    <!-- <el-col :span="1.5">
	        <el-button
	          type="warning"
	          plain
	          icon="Upload"
	          size="default"
	          :loading="exportLoading"
	          @click="handleExport"
	          v-hasPermi="['system:tenant:export']"
	        >导出</el-button>
	      </el-col> -->
	      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
	    </el-row>
	
	    <el-table v-loading="loading" :data="tenantList" @selection-change="handleSelectionChange">
	      <el-table-column type="selection" width="55" align="center" />
	      <el-table-column label="商户标识" align="center" prop="tenantId" />
	      <el-table-column label="联系人" align="center" prop="contact" />
	      <el-table-column label="电话" align="center" prop="phone" />
	      <!-- <el-table-column label="轮胎授权数量" align="center" prop="tireNumber" /> -->
	      <el-table-column label="车辆授权数量" align="center" prop="vehicleNumber" />
	      <!-- <el-table-column label="轮毂授权数量" align="center" prop="hubNumber" /> -->
	      <el-table-column label="商户名称" align="center" prop="name" />
	      <el-table-column label="管理员账号" align="center" prop="userName" />
	      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
	          <template #default="scope">
	          <el-button
	            size="default"
	            link
				type="primary"
				icon="Edit"
	            @click="handleUpdate(scope.row)"
	            v-hasPermi="['system:tenant:edit']"
	          >修改</el-button>
	          <el-button
	            size="default"
				 v-if="scope.row.userId !== 1"
	            link
				type="danger"
				icon="Delete"
	            @click="handleDelete(scope.row)"
	            v-hasPermi="['system:tenant:remove']"
	          >删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	
	    <pagination
	      v-show="total>0"
	      :total="total"
		  v-model:page="queryParams.pageNum"
		  v-model:limit="queryParams.pageSize"
		  @pagination="getList"
	    />
	
	    <!-- 添加或修改商户管理对话框 -->
	    <el-dialog :title="title"  v-model="open" width="50%" append-to-body :close-on-click-modal="false">
	      <el-form :model="form" :rules="rules" ref="menfrom"  label-width="120px">
	        <el-form-item label="商户名称" prop="name">
	          <el-input v-model="form.name" placeholder="请输入商户名称" />
	        </el-form-item>
	        <el-form-item label="联系人" prop="contact">
	          <el-input v-model="form.contact" placeholder="请输入联系人" />
	        </el-form-item>
	        <el-form-item label="电话" prop="phone">
	          <el-input v-model="form.phone" placeholder="请输入电话" />
	        </el-form-item>
	        <el-form-item label="管理员账号" prop="userName">
	          <el-input v-if="!form.id" v-model="form.userName" placeholder="请输入要创建的管理员用户名" />
	          <span v-else>{{ form.userName }}</span>
	          <span style="color: red;">默认密码为该商户创建后的商户标识</span>
	        </el-form-item>
			<!-- <el-form-item label="轮胎授权数量" prop="tireNumber">
			  <el-input v-model="form.tireNumber" type="number" placeholder="轮胎数量" />
			</el-form-item> -->
			<el-form-item label="车辆授权数量" prop="vehicleNumber">
			  <el-input v-model="form.vehicleNumber" type="number" placeholder="车辆数量" />
			</el-form-item>
			<!-- <el-form-item label="轮毂授权数量" prop="hubNumber">
			  <el-input v-model="form.hubNumber" type="number" placeholder="轮毂数量" />
			</el-form-item> -->
	        <el-form-item label="备注" prop="remark">
	          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
	        </el-form-item>
	      </el-form>
	      <div slot="footer" class="dialog-footer">
	        <el-button type="primary" @click="submitForm">确 定</el-button>
	        <el-button @click="cancel">取 消</el-button>
	      </div>
	    </el-dialog>
	  </div>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import { listTenant, getTenant, delTenant, addTenant, updateTenant, exportTenant } from "@/api/system/tenant";
	import { ElMessage, ElMessageBox } from 'element-plus'
	const { proxy } = getCurrentInstance();
	const loading=ref(true)
	      // 导出遮罩层
	const exportLoading=ref (false)
	      // 选中数组
	const ids=ref([])
	      // 非单个禁用
	const single=ref (true)
	      // 非多个禁用
	const multiple=ref (true)
	      // 显示搜索条件
	const showSearch=ref (true)
	      // 总条数
	const total=ref (0)
	      // 商户管理表格数据
	const tenantList=ref ([])
	      // 弹出层标题
	const title=ref("")
	      // 是否显示弹出层
	const open=ref (false)
	      // 查询参数
	const queryParams=ref ({
	        pageNum: 1,
	        pageSize: 10,
	        remark: null,
	        tenantId: null,
	        contact: null,
	        phone: null,
	        name: null,
	        userId: null
	      })
	      // 表单参数
	const form=ref({})
	const rules=({
	        contact: [  { required: true, message: '联系人不能为空', trigger: 'blur' }],
	        phone: [{ required: true, message: "电话不能为空", trigger: "blur" }],
	        name: [{ required: true, message: "商户名称不能为空", trigger: "blur" }],
	        userName: [{ required: true, message: "商户名称不能为空", trigger: "blur" }],
			// tireNumber: [  { required: true, message: '轮胎授权数量不能为空', trigger: 'blur' }],
			vehicleNumber: [  { required: true, message: '车辆授权数量不能为空', trigger: 'blur' }],
			// hubNumber: [  { required: true, message: '轮毂授权数量不能为空', trigger: 'blur' }],
	      }) 
	 function getList() {
	        loading.value = true;
	        listTenant(queryParams.value).then(response => {
	          tenantList.value = response.rows;
	          total.value = response.total;
	          loading.value = false;
	        });
	      }
	   // 取消按钮
	    function cancel() {
	       open.value = false;
	       reset();
	      }
	   // 表单重置
	     function reset() {
	        form.value = {
	          id: null,
	          createBy: null,
	          createTime: null,
	          updateBy: null,
	          updateTime: null,
	          delFlag: null,
	          remark: null,
	          tenantId: null,
	          contact: null,
	          phone: null,
	          name: null,
	          userName: null,
	          userId: null
	        };
	      }
		  
	   /** 搜索按钮操作 */
	    function handleQuery() {
	        queryParams.value.pageNum = 1;
	        getList();
	      }
	   /** 重置按钮操作 */
	    function resetQuery() {
	        proxy.resetForm("queryForm");
	        handleQuery();
	      }
	   // 多选框选中数据
	    function handleSelectionChange(selection) {
	        ids.value = selection.map(item => item.id)
	        single.value = selection.length!==1
	        multiple.value = !selection.length
	      }
		/** 新增按钮操作 */
		function handleAdd() {
			reset();
			open.value = true;
			title.value = "添加商户管理";
		  }
	  /** 修改按钮操作 */
	    function handleUpdate(row) {
	        const id = row.id || ids.value
	        getTenant(id).then(response => {
	          form.value = response.data;
	          open.value = true;
	          title.value = "修改商户管理";
	        });
	      }
	  /** 提交按钮 */
	    function submitForm() {
	        proxy.$refs["menfrom"].validate(valid => {
	          if (valid) {
	            if (form.value.id != null) {
	              updateTenant(form.value).then(response => {
	               ElMessage.success("修改成功");
	                open.value = false;
	                getList();
	              });
	            } else {
	              addTenant(form.value).then(response => {
	                ElMessage.success("新增成功");
	                open.value = false;
	                getList();
	              });
	            }
	          }
	        });
	      }
	   /** 删除按钮操作 */
	    function handleDelete(row) {
	        const infoIds = row.id || ids.value;
	       ElMessageBox.confirm('是否确认删除商户管理编号为"' + infoIds + '"的数据项？').then(function() {
	          return delTenant(infoIds);
	        }).then(() => {
	          getList();
	           ElMessage.success("删除成功");
	        }).catch(() => {});
	      }
		  
	  /** 导出按钮操作 */
	   //  function handleExport() {
		  // ElMessageBox.confirm('是否确认导出所有商户管理数据项？').then(() => {
			 //  exportLoading.value = true;
			 //  proxy.download("system/tenant/export", {
			 //    ...queryParams.value,
			 //  },`user_${new Date().getTime()}.xlsx`);
				// exportLoading.value = false
				// }).catch(() => {})
	   //  }
		
		onMounted(()=>{
			getList()
		})
</script>

<style>
</style>