<template>
    <div class="app-container">
        <div>
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="所属仓库" prop="warehouseName">
                    <el-select placeholder="请输入所属仓库" v-model="queryform.warehouseName" filterable remote :clearable="true">
                        <el-option :label="item.warehouseName" :value="item.warehouseName"
                            v-for="(item, index) in houselist" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="统计周期" style="margin-right: 30px;">
                    <el-date-picker v-model="queryform.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                    <el-button @click="exportable"><i class="el-icon-upload2"></i>导出</el-button>
                </div>
            </el-form>
            <el-table :data="dataList" show-summary>
                <el-table-column label="品牌" align="center" prop="tireBrandName" />
                <el-table-column label="规格" align="center" prop="specificationsName" />
                <el-table-column label="花纹型号" align="center" prop="pattern" />
                <el-table-column label="本月安装数量" align="center" prop="depth" />
                <el-table-column label="平均单价" align="center" prop="depth" />
                <el-table-column label="金额" align="center" prop="depth" />
            </el-table>
        </div>

    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import { tirelist, expotires, exportxlxs } from '@/api/carlive'
const { proxy } = getCurrentInstance();
import { warehouselist } from '@/api/warehouse'
const queryform = ref({
    pageNum: 1,
    pageSize: 10,
    install: 0,
    date: ''
})
const dataList = ref([])
const total = ref(0)
const houselist = ref([])//仓库

// 获取table数据
function getList() {
    tirelist(queryform.value).then(res => {
        dataList.value = res.data.items
        total.value = res.data.total
    })
}
// 导出
function exportable() {
    expotires(queryform.value).then(res => {
        exportxlxs(res.data).then(respon => {
            downloadFiles(respon)
        })
    })
}
// 解码下载方法
function downloadFiles(data) {
    if (typeof window.chrome !== 'undefined') {
        // Chrome version
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(data);
        link.download = "轮胎里程预测列表.xlsx";
        link.click();
    } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE version
        var blob = new Blob([data], { type: 'application/force-download' });
        window.navigator.msSaveBlob(blob, "轮胎里程预测列表.xlsx");
    } else {
        // Firefox version
        var file = new File([data], "轮胎里程预测列表.xlsx", { type: 'application/force-download' });
        window.open(URL.createObjectURL(file));
    }
}
function getDefaultDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const lastDay = new Date(currentYear, currentMonth, 0).getDate()
    queryform.value.date = [currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-' + '01',
    currentYear + '-' + currentMonth.toString().padStart(2, '0') + '-' + lastDay.toString().padStart(2, '0')];
}
onMounted(() => {
    getDefaultDate()
    // 仓库
    warehouselist({}).then(res => {
        houselist.value = res.data.items
    })
    // getList()
})

</script>
<style scoped lang="scss">
.indexforn {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}

:deep(.el-date-editor--daterange.el-input__inner) {
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
    margin-top: 10px;
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

.mb8 {
    margin-top: 20px;
}

.formdiv {
    width: 45%;
}

.line {
    width: 100%;
    border-bottom: 1px solid #ccc;
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

:deep(.el-input) {
    width: 80%;
}

.marri {
    margin-right: 30px;
}

.closr {
    font-size: 16px;
    line-height: 34px;
}

.closr span {
    margin-right: 15px;
}

.pagination-container .el-pagination {
    right: 20px;
}

.titles {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: red;
    margin-top: 20px;
    font-weight: bold;
    align-items: center;
}
</style>
  