<template>
	<div class="app-container">
	    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="90px">
	     <!-- <el-form-item label="租户号" prop="tenantId">
	        <el-input
	          v-model="queryParams.tenantId"
	          placeholder="请输入租户号"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item> -->
		  <el-form-item label="供应商名称" prop="supplierName">
		    <el-input
		      v-model="queryParams.supplierName"
		      placeholder="请输入供应商名称"
		      clearable
		      @keyup.enter.native="handleQuery"
		    />
		  </el-form-item>
	      <el-form-item label="联系人" prop="contactsName">
	        <el-input
	          v-model="queryParams.contactsName"
	          placeholder="请输入联系人"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	      <el-form-item label="电话" prop="contactsMobile">
	        <el-input
	          v-model="queryParams.contactsMobile"
	          placeholder="请输入电话"
	          clearable
	          @keyup.enter.native="handleQuery"
	        />
	      </el-form-item>
	     
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
	          v-hasPermi="['tpms:supplier:add']"
	        >新增</el-button>
	      </el-col>
	     <!-- <el-col :span="1.5">
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
	      <el-col :span="1.5">
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
	
	    <el-table v-loading="loading" :data="tenantList">
	      <!-- <el-table-column type="selection" width="55" align="center" /> -->
	      <!-- <el-table-column label="租户号" align="center" prop="tenantId" /> -->
	      <el-table-column label="联系人" align="center" prop="contactsName" />
	      <el-table-column label="电话" align="center" prop="contactsMobile" />
	      <el-table-column label="供应商名称" align="center" prop="supplierName" />
	      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
	          <template #default="scope">
	          <el-button
	            size="default"
	            link
				type="primary"
				icon="Edit"
	            @click="handleUpdate(scope.row)"
	            v-hasPermi="['tpms:supplier:edit']"
	          >修改</el-button>
	          <el-button
	            size="default"
	            link
				type="danger"
				icon="Delete"
	            @click="handleDelete(scope.row)"
	            v-hasPermi="['tpms:supplier:remove']"
	          >删除</el-button>
	        </template>
	      </el-table-column>
	    </el-table>
	
	    <pagination
	      v-show="total>0"
	      :total="total"
	      :page.sync="queryParams.pageNum"
	      :limit.sync="queryParams.pageSize"
	      @pagination="getList"
	    />
	
	    <!-- 添加或修改商户管理对话框 -->
	    <el-dialog :title="title"  v-model="open" width="50%" append-to-body :close-on-click-modal="false">
	      <el-form :model="form" :rules="rules" ref="menfrom"  label-width="120px">
	        <el-form-item label="供应商名称" prop="supplierName" >
	          <el-input v-model="form.supplierName" placeholder="请输入供应商名称" />
	        </el-form-item>
	        <el-form-item label="联系人" prop="contactsName">
	          <el-input v-model="form.contactsName" placeholder="请输入联系人" />
	        </el-form-item>
	        <el-form-item label="电话" prop="contactsMobile">
	          <el-input v-model="form.contactsMobile" placeholder="请输入电话" />
	        </el-form-item>
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
	import { supperlist, supperlistadd, supperlistinfo, supperlistdetel, supperlistupdata, exportTenant } from "@/api/system/tenant";
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
	        contactsName: [  { required: true, message: '联系人不能为空', trigger: 'blur' },],
	        contactsMobile: [{ required: true, message: "电话不能为空", trigger: "blur" }],
	        supplierName: [{ required: true, message: "商户名称不能为空", trigger: "blur" }],
	      }) 
	 function getList() {
	        loading.value = true;
	        supperlist(queryParams.value).then(response => {
	          tenantList.value = response.data.items;
	          total.value = response.data.total;
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
			title.value = "添加供应商";
		  }
	  /** 修改按钮操作 */
	    function handleUpdate(row) {
	        const id = row.supplierId || ids.value
	        supperlistinfo(id).then(response => {
	          form.value = response.data;
	          open.value = true;
	          title.value = "修改供应商";
	        });
	      }
	  /** 提交按钮 */
	    function submitForm() {
	        proxy.$refs["menfrom"].validate(valid => {
	          if (valid) {
	            if (form.value.supplierId != null) {
	              supperlistupdata(form.value).then(response => {
	               ElMessage.success("修改成功");
	                open.value = false;
	                getList();
	              });
	            } else {
	              supperlistadd(form.value).then(response => {
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
	        const infoIds = row.supplierId ;
	       ElMessageBox.confirm('是否确认删除"' + row.supplierName + '"的数据项？').then(function() {
	          return supperlistdetel(infoIds);
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