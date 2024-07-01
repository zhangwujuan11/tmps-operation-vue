<template>
    <div class="app-container">
        <div>
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="轮胎品牌">
                    <el-select placeholder="请输入品牌" v-model="queryform.tireBrandId" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in pinpai"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="轮胎规格">
                    <el-select placeholder="请选择轮胎规格" v-model="queryform.specificationsId" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramId" v-for="(item, index) in guige"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="花纹型号">
                    <el-select placeholder="请输入花纹型号" v-model="queryform.pattern" filterable :clearable="true">
                        <el-option :label="item.paramName" :value="item.paramName" v-for="(item, index) in xinhao"
                            :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input placeholder="请输入操作人" v-model="queryform.maintainer"></el-input>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-select placeholder="请输入车牌号" v-model="queryform.vehicleNo" filterable :clearable="true">
                        <el-option :label="item" :value="item" v-for="(item, index) in vehicleNoo" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="胎号">
                    <el-select v-model="queryform.tireNo" filterable clearable placeholder="请选择" allow-create
                        :default-first-option="true" @blur="Nameblur($event)" default-first-option>
                        <el-option :label="item.tireNo" :value="item.tireNo" v-for="(item, index) in chetai" :key="index" />
                    </el-select>
                </el-form-item>
                <el-form-item label="统计时间" style="margin-right: 30px;">
                    <el-date-picker v-model="queryform.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <el-form-item label="类型" prop="businessType">
                    <el-select v-model="queryform.businessType" placeholder="操作类型" clearable style="width: 240px">
                        <el-option v-for="dict in sys_oper_type" :key="dict.value" :label="dict.label"
                            :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="传感器ID">
                    <el-input placeholder="请输入传感器ID" v-model="queryform.manufacturer"></el-input>
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                    <el-button @click="exportable"><i class="el-icon-upload2"></i>导出</el-button>
                </div>
            </el-form>
            <el-table :data="dataList">
                <el-table-column label="操作类型" align="center" prop="tireNo" width="180" />
                <el-table-column label="轮胎去向" align="center" prop="tireBrandName" />
                <el-table-column label="胎号" align="center" prop="specificationsName" />
                <el-table-column label="车牌号" align="center" prop="pattern" />
                <el-table-column label="轮位" align="center" prop="depth" />
                <el-table-column label="品牌" align="center" prop="depth" />
                <el-table-column label="规格" align="center" prop="depth" />
                <el-table-column label="实测花纹深度" align="center" prop="firstDepth" />
                <el-table-column label="累计里程" align="center" prop="measuredDepth" />
                <el-table-column label="里程表读数" align="center" prop="measuredDepth" />
                <el-table-column label="操作人" align="center" prop="measuredDepth" />
                <el-table-column label="操作时间" align="center" prop="measuredDepth" />
                <el-table-column label="操作" align="center" width="150">
                    <template #default="scope">
                        <el-button link type="primary" @click="handleDetail(scope.row)">
                            <Document style="width: 1em; height: 1em; margin-right: 2px"></Document>详情
                        </el-button>
                        <el-button type="danger" link v-hasPermi="['tpms:vehicles:remove']"
                            @click="handleDelete(scope.row)">
                            <Delete style="width: 1em; height: 1em; margin-right: 2px"></Delete>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryform.pageNum"
                v-model:limit="queryform.pageSize" @pagination="getList" />
        </div>

        <!-- 翻新明细修改 -->
        <el-dialog title="轮胎维护编辑" v-model="open" width="80%" append-to-body @close="closeEdit"
            :close-on-click-modal="false">
            <el-form label-width="140px" :model="editForm" :rules="rules" ref="menuRef" :validate-on-rule-change="false">
                <div class="formdiv">
                    <el-form-item label="胎号">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="车牌号">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="花纹型号">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="新胎花纹深度(mm)">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="累计里程">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="操作人">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="备注">
                        <span>{{}}111</span>
                    </el-form-item>
                </div>
                <div class="formdiv">
                    <el-form-item label="传感器ID">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="轮位">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="规格">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="里程表读数">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="实测花纹深度(mm)">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="阶段里程">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="操作时间">
                        <span>{{}}111</span>
                    </el-form-item>
                    <el-form-item label="照片">
                        <span>{{}}111</span>
                    </el-form-item>
                </div>
            </el-form>
            <div style="text-align: center;" slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import { vehicleNo } from '@/api/systensettings'
import { tirelist, expotires, exportxlxs, getTireBands, getSpecifications, getpatternmodel } from '@/api/carlive'
const { proxy } = getCurrentInstance();
const { sys_oper_type } = proxy.useDict("sys_oper_type");
const queryform = ref({
    pageNum: 1,
    pageSize: 10,
    install: 0,
    vehicleNo: '',
    engineType: '',
    manufacturer: '',
    maintainer: '',
    date: '',
    businessType: ''
})
const editForm = ref({
    tireNo: '',
    brand: '',
    manufacturer: ''
})
const dataList = ref([])
const total = ref(0)
const vehicleNoo = ref([])//车牌号
const chetai = ref([])//胎号
const pinpai = ref([])//品牌
const guige = ref([])//规格
const xinhao = ref([])//花纹型号
const open = ref(false)
const rules = ref({
    date: [{ required: true, message: "维护日期不能为空", trigger: "submit" }],
})
// 获取table数据
function getList() {
    tirelist(queryform.value).then(res => {
        dataList.value = res.data.items
        total.value = res.data.total
    })
}
function Nameblur(e) {
    queryform.value.tireNo = e.target.value
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
const handleDetail = (row) => {
    open.value = true
    console.log(row);
}
const handleDelete = (row) => {
    console.log(row);
}
const closeEdit = () => {
    open.value = false
}
onMounted(() => {
    vehicleNo().then(res => {
        if (res.code == 200) {
            vehicleNoo.value = res.data.items
        }
    })
    // 车胎
    tirelist({ pageNum: 1, pageSize: 10000 }).then(res => {
        if (res.code == 200) {
            chetai.value = res.data.items
        }
    })
    // 品牌
    getTireBands().then(res => {
        pinpai.value = res.data
    })
    // 规格
    getSpecifications().then(res => {
        guige.value = res.data
    })
    // 花纹型号
    getpatternmodel().then(res => {
        xinhao.value = res.data
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
    width: 50%;
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

.el-form {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}
</style>