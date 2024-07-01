<template>
    <div class="app-container">
        <div class="top">
            <el-radio-group v-model="report" @change="changeReport">
                <el-radio-button label="operate">操作类型汇总表</el-radio-button>
                <el-radio-button label="assignment">胎工作业汇总表</el-radio-button>
            </el-radio-group>
        </div>
        <div v-show="report == 'operate'">
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="操作人" prop="warehouseName">
                    <el-input placeholder="请输入操作人" v-model="queryform.maintainer"></el-input>
                </el-form-item>
                <el-form-item label="统计周期" style="margin-right: 30px;">
                    <el-date-picker v-model="queryform.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                </div>
            </el-form>
            <div class="centerbox">
                <p class="titles">
                    <span>
                        <img src="@/assets/r_icon1.png">
                        操作类型汇总表
                    </span>
                </p>
                <table class="customers">
                    <tbody>
                        <tr>
                            <th>轮胎入库</th>
                            <td><span id="sp10">254</span>次</td>
                            <th>绑定传感器</th>
                            <td><span id="sp11">154</span>次</td>
                            <th>解绑传感器</th>
                            <td><span id="sp12">207</span>次</td>
                            <th>更换传感器</th>
                            <td><span id="sp27">0</span>次</td>
                        </tr>
                        <tr>
                            <th>绑定RFID</th>
                            <td><span id="sp13">4</span>次</td>
                            <th>解绑RFID</th>
                            <td><span id="sp14">5</span>次</td>
                            <th>轮胎安装</th>
                            <td><span id="sp20">316</span>次</td>
                            <th>轮胎拆卸</th>
                            <td><span id="sp25">220</span>次</td>
                        </tr>
                        <tr>
                            <th>轮胎检查</th>
                            <td><span id="sp22">10</span>次</td>
                            <th>轮胎换位</th>
                            <td><span id="sp23">220</span>次</td>
                            <th>轮胎维修</th>
                            <td><span id="sp30">13</span>次</td>
                            <th>维修登记</th>
                            <td><span id="sp35">17</span>次</td>
                        </tr>
                        <tr>
                            <th>轮胎翻新</th>
                            <td><span id="sp40">25</span>次</td>
                            <th>翻新登记</th>
                            <td><span id="sp45">12</span>次</td>
                            <th>轮胎报废</th>
                            <td><span id="sp50">20</span>次</td>
                            <th>恢复待用</th>
                            <td><span id="sp15">2</span>次</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <p class="titles">
                    <span>
                        <img src="@/assets/r_icon1.png">
                        胎工作业柱状图
                    </span>
                </p>
                <div id="echartLine" ref="echartLine"></div>
            </div>
        </div>

        <div v-show="report == 'assignment'">
            <el-form label-width="75px" class="indexforn">
                <el-form-item label="操作人" prop="warehouseName">
                    <el-input placeholder="请输入操作人" v-model="queryform.maintainer"></el-input>
                </el-form-item>
                <el-form-item label="统计周期" style="margin-right: 30px;">
                    <el-date-picker v-model="queryform.date" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" format="YYYY/MM/DD" value-format="YYYY-MM-DD" />
                </el-form-item>
                <div style="text-align: center;">
                    <el-button type="primary" @click='getList'><i class="el-icon-search"></i> 统计</el-button>
                </div>
            </el-form>
            <el-table :data="dataList" show-summary>
                <el-table-column label="操作人" align="center" prop="tireBrandName" />
                <el-table-column label="操作类型（次数）" align="center">
                    <el-table-column label="安装" align="center" prop="specificationsName" />
                    <el-table-column label="拆卸" align="center" prop="pattern" />
                    <el-table-column label="换位" align="center" prop="depth" />
                    <el-table-column label="检查" align="center" prop="depth" />
                    <el-table-column label="维修" align="center" prop="depth" />
                    <el-table-column label="维修登记" align="center" prop="depth" />
                    <el-table-column label="入库" align="center" prop="depth" />
                    <el-table-column label="报废" align="center" prop="depth" />
                    <el-table-column label="恢复待用" align="center" prop="depth" />
                    <el-table-column label="翻新" align="center" prop="depth" />
                    <el-table-column label="翻新登记" align="center" prop="depth" />
                    <el-table-column label="绑定传感器" align="center" prop="depth" />
                    <el-table-column label="解绑传感器" align="center" prop="depth" />
                    <el-table-column label="更换传感器" align="center" prop="depth" />
                    <el-table-column label="绑定RFID" align="center" prop="depth" />
                    <el-table-column label="解绑RFID" align="center" prop="depth" />
                </el-table-column>
                <el-table-column label="合计次数" align="center" prop="depth" />
            </el-table>
        </div>
    </div>
</template>
  
<script setup name="TireMonthlyCost">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
// import { expotires, exportxlxs } from '@/api/carlive'
const { proxy } = getCurrentInstance();
const queryform = ref({
    pageNum: 1,
    pageSize: 10,
    install: 0,
    date: ''
})
const total = ref(0)
const report = ref('operate')
// 获取table数据
function getList() {
}
function changeReport(e) {
    report.value = e
}
const drawLine = () => {
    var myPie2 = echarts.init(document.getElementById("echartLine"));
    myPie2.setOption({
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true
                },
                dataZoom: { // 选时间缩放功能
                    show: true, // show为true时，才能触发takeGlobalCursor事件
                    yAxisIndex: 'none',
                }
            }
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['好运', '双钱', '多力通', '陆通', '邦驰', '安驰', '安进', '朝阳', '贝力通', '其他', '爱仕通', '翻新胎'],
                axisLabel: {
                    interval: 0,
                    rotate: 40
                }
            }
        ],
        grid: {
            top: '8%',
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}条'
                }
            }
        ],
        series: [
            {
                name: '品牌数量占比',
                type: 'bar',
                data: [5, 52, 1, 1, 1, 18, 1, 118, 1, 6, 13, 6],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: 'black'
                            }
                        }
                    }
                },
                color: '#5fa1ff',
                barWidth: 30//柱图宽度
            }
        ]
    });
    window.addEventListener("resize", function () {
        myPie2.resize();
    });
};
onMounted(() => {
    // getList()
    drawLine()
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
    margin-top: 20px;
    font-weight: bold;
    align-items: center;
}

.top {
    text-align: center;
    height: 60px;
}

.customers {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 95%;
    margin: auto;
    font-size: 14px;

    tr {
        padding: 12px 0px;
        height: 44px;
    }

    th {
        text-align: center;
        background-color: #E1EEFA;
        border: 1px solid #ddd;
        padding: 3px
    }

    td {
        border: 1px solid #ddd;
        padding: 3px
    }

    tr:nth-child(2n) {
        background-color: #f2f2f2;
    }
}

#echartLine {
    height: 450px;
    width: 100%;
}
</style>
  