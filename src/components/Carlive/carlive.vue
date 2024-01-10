<template>
	<div>
		<el-button type="warning" @click="showpicture">展示图</el-button>
		<el-table :data="tabledatacar">
			<el-table-column label="日期" align="center" prop="createTime" />
			<el-table-column label="类型" align="center" prop="type" width="120" />
			<el-table-column label="车牌号" align="center" prop="vehicleNo" />
			<el-table-column label="轮位" align="center" prop="tirePositionDesc" />
			<el-table-column label="传感器ID/RFID" align="center" prop="rfidCode" />
			<el-table-column label="实测花纹深度" align="center" prop="measuredDepth" />
			<el-table-column label="当前累计里程(km)" align="center" prop="totalMileage" />
			<el-table-column label="当前阶段里程(km)" align="center" prop="mileage" />
			<el-table-column label="里程表读数(km)	" align="center" prop="readMileage" />
			<el-table-column label="操作人" align="center" prop="createBy" />
		</el-table>
		<pagination
		   :total="total"
		   v-model:page="pageNum"
		   v-model:limit="pageSize"
		   @pagination="getList"
		   style="height: 100px !important;"
		/>
		<el-dialog title="轮胎生命周期"  v-model="tu" width="80%" append-to-body>
			<div class="smzq" style="width:100%;height:500px">
				<div class="smzq_con" id="divHis">
				</div>
			</div>
		</el-dialog>
	</div>

</template>

<script setup lang="ts">
	import { gethistorylist } from '@/api/carlive'
	import { ref, onMounted, watch, nextTick } from 'vue';
	const props = defineProps({
		tid: {
			type: String,
			default: {}
		}
	})
	const total=ref(0)
	const pageNum=ref(1)
	const pageSize=ref(10)
	const tabledatacar = ref([])
	const tu = ref(false)
	const htmllll=ref('')
	function getList(){
		gethistorylist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			tabledatacar.value = res.data.items
			total.value= res.data.total
		})
	}
	 
	watch(() => props.tid, value => {
		gethistorylist({
			tid: value,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			tabledatacar.value = res.data.items
			total.value= res.data.total
			let json = tabledatacar.value || []
			if (json.length>0) {
			    var html = "";
			    html += "<div class=\"smzq_border\"></div>";
			    html += "<div class=\"smzq_col2\">";
			    html += "<span>开始周期</span>";
			    html += "</div>";
			    for (var i = 0; i < json.length; i++) {
			        var totalmileage = json[i]["pattern"] != "" ? (parseFloat(json[i]["pattern"]) / 1000).toFixed(2) : "0.00";
			        var totalstagemileage = json[i]["mileage"] != "" ? (parseFloat(json[i]["mileage"]) / 1000).toFixed(2) : "0.00";
			        // var addmileage = json[i]["addmileage"] != "" ? (parseFloat(json[i]["addmileage"])).toFixed(2) : "0.00";
			        var readmileage = json[i]["readMileage"] != "" ? parseFloat(json[i]["readMileage"]).toFixed(2) : "";
			        // var css = "";
			        if (i % 2 == 0) {
			            html += "<div class=\"smzq_col\">";
			            html += "<div class=\"dot\" style=\"top:72px;\"></div>";
			            html += "<div class=\"smzq_col_left smzqnr\">";
			            html += "<div class=\"smzq_img\"><img src=/tire/assets/timg.jpg\ /></div>";
			            html += "     <i id=\"triangle-left\"></i>";
			            html += "     <span>" + json[i]["type"] + "</span>";
			            // html += "     <p>" + json[i]["remark"] + "</p>";
			            if (json[i]["installPosition"] != "" && json[i]["installPosition"] != null) {
			                if (json[i]["flag"] == "23") {
			                    html += "     <p>调换后轮位：" + json[i]["installPosition"] + "</p>";
			                } else {
			                    html += "     <p>轮位：" + json[i]["installPosition"] + "</p>";
			                }
			            }
			            if (json[i]["flag"] == "20" || json[i]["flag"] == "25" || json[i]["flag"] == "22" || json[i]["flag"] == "23"
			                || json[i]["flag"] == "30" || json[i]["flag"] == "40" || json[i]["flag"] == "50" || json[i]["flag"] == "65") {
			                html += "     <p>累计里程：" + totalmileage + "km</p>";
			                html += "     <p>阶段里程：" + totalstagemileage + "km</p>";
			                html += "     <p>里程表读数：" + readmileage + "km</p>";
			            }
			
			            html += "     <p>操作人：" + json[i]["createBy"] + "</p>";
			            html += "</div>";
			            html += "<div class=\"smzq_col_right smzqtime right\" style=\"right:80px;\">" + json[i]["createTime"] + "</div>";
			            html += "</div>";
			        } else {
			            html += "<div class=\"smzq_col\">";
			            html += "		<div class=\"dot\" style=\"top: 72px;\"></div>";
			            html += "		<div class=\"smzq_col_left smzqtime\" style=\"padding-left: 155px;\">" + json[i]["createTime"] + "</div>";
			            html += "		<div class=\"smzq_col_right smzqnr\">";
			            html += "			<i id=\"triangle-right\"></i>";
			            html += "			<span>" + json[i]["type"] + "</span>";
			            // html += "           <p>" + json[i]["remark"] + "</p>";
			            if (json[i]["installPosition"] != "" && json[i]["installPosition"] != null) {
			                if (json[i]["flag"] == "23") {
			                    html += "     <p>调换后轮位：" + json[i]["installPosition"] + "</p>";
			                } else {
			                    html += "     <p>轮位：" + json[i]["installPosition"] + "</p>";
			                }
			            }
			            if (json[i]["flag"] == "20" || json[i]["flag"] == "25" || json[i]["flag"] == "22" || json[i]["flag"] == "23"
			                || json[i]["flag"] == "30" || json[i]["flag"] == "40" || json[i]["flag"] == "50" || json[i]["flag"] == "65") {
			                html += "           <p>累计里程：" + totalmileage + "km</p>";
			                html += "           <p>阶段里程：" + totalstagemileage + "km</p>";
			                html += "           <p>里程表读数：" + readmileage + "km</p>";
			            }
			            html += "           <p>操作人：" + json[i]["createBy"] + "</p>";
			           html += "<div class=\"smzq_img\"><img src=/tire/assets/timg.jpg\ /></div>";
			            html += "		</div>";
			            html += "	</div>";
			        }
			    }
				htmllll.value=html
			} else {
			    htmllll.value="暂无数据！"
			}
		})
	})
	
	
	function showpicture(){
		tu.value=true
		nextTick(()=>{
			document.getElementById('divHis').innerHTML=htmllll.value
		})
	}
	
	onMounted(() => {
		gethistorylist({
			tid: props.tid,
			pageNum:pageNum.value,
			pageSize:pageSize.value
		}).then(res => {
			tabledatacar.value = res.data.items
			let json = tabledatacar.value ||[]
			if (json.length>0) {
			    var html = "";
			    html += "<div class=\"smzq_border\"></div>";
			    html += "<div class=\"smzq_col2\">";
			    html += "<span>开始周期</span>";
			    html += "</div>";
			    for (var i = 0; i < json.length; i++) {
			        var totalmileage = json[i]["pattern"] != "" ? (parseFloat(json[i]["pattern"]) / 1000).toFixed(2) : "0.00";
			        var totalstagemileage = json[i]["mileage"] != "" ? (parseFloat(json[i]["mileage"]) / 1000).toFixed(2) : "0.00";
			        var readmileage = json[i]["readMileage"] != "" ? parseFloat(json[i]["readMileage"]).toFixed(2) : "";
			        // var css = "";
			        if (i % 2 == 0) {
			            html += "<div class=\"smzq_col\">";
			            html += "<div class=\"dot\" style=\"top:72px;\"></div>";
			            html += "<div class=\"smzq_col_left smzqnr\">";
			           html += "<div class=\"smzq_img\"><img src=/tire/assets/timg.jpg\ /></div>";
			            html += "     <i id=\"triangle-left\"></i>";
			            html += "     <span>" + json[i]["type"] + "</span>";
			            // html += "     <p>" + json[i]["remark"] + "</p>";
			           if (json[i]["installPosition"] != "" && json[i]["installPosition"] != null) {
			               if (json[i]["flag"] == "23") {
			                   html += "     <p>调换后轮位：" + json[i]["installPosition"] + "</p>";
			               }else {
			                   html += "     <p>轮位：" + json[i]["installPosition"] + "</p>";
			               }
			           }
			            if (json[i]["flag"] == "20" || json[i]["flag"] == "25" || json[i]["flag"] == "22" || json[i]["flag"] == "23"
			                || json[i]["flag"] == "30" || json[i]["flag"] == "40" || json[i]["flag"] == "50" || json[i]["flag"] == "65") {
			                html += "     <p>累计里程：" + totalmileage + "km</p>";
			                html += "     <p>阶段里程：" + totalstagemileage + "km</p>";
			                html += "     <p>里程表读数：" + readmileage + "km</p>";
			            }
			
			            html += "     <p>操作人：" + json[i]["createBy"] + "</p>";
			            html += "</div>";
			            html += "<div class=\"smzq_col_right smzqtime right\" style=\"right:80px;\">" + json[i]["createTime"] + "</div>";
			            html += "</div>";
			        } else {
			            html += "<div class=\"smzq_col\">";
			            html += "		<div class=\"dot\" style=\"top: 72px;\"></div>";
			            html += "		<div class=\"smzq_col_left smzqtime\" style=\"padding-left: 155px;\">" + json[i]["createTime"] + "</div>";
			            html += "		<div class=\"smzq_col_right smzqnr\">";
			            html += "			<i id=\"triangle-right\"></i>";
			            html += "			<span>" + json[i]["type"] + "</span>";
			            // html += "           <p>" + json[i]["remark"] + "</p>";
			            if (json[i]["installPosition"] != "" && json[i]["installPosition"] != null) {
			                if (json[i]["flag"] == "23") {
			                    html += "     <p>调换后轮位：" + json[i]["installPosition"] + "</p>";
			                }else {
			                    html += "     <p>轮位：" + json[i]["installPosition"] + "</p>";
			                }
			            }
			            if (json[i]["flag"] == "20" || json[i]["flag"] == "25" || json[i]["flag"] == "22" || json[i]["flag"] == "23"
			                || json[i]["flag"] == "30" || json[i]["flag"] == "40" || json[i]["flag"] == "50" || json[i]["flag"] == "65") {
			                html += "           <p>累计里程：" + totalmileage + "km</p>";
			                html += "           <p>阶段里程：" + totalstagemileage + "km</p>";
			                html += "           <p>里程表读数：" + readmileage + "km</p>";
			            }
			            html += "           <p>操作人：" + json[i]["createBy"] + "</p>";
			           html += "<div class=\"smzq_img\"><img src=/tire/assets/timg.jpg\ /></div>";
			            html += "		</div>";
			            html += "	</div>";
			        }
			       
			    }
				htmllll.value=html
			} else {
			    htmllll.value="暂无数据！"
			}
		})
	})
</script>

<style>
	.smzq {
		width: 600px;
		background: #FFFFFF;
		height: 400px;
		padding: 20px 15px;
		position: relative;
		overflow: auto;
	}
	
	.smzq::-webkit-scrollbar,
	.zck::-webkit-scrollbar,
	ul.ztree::-webkit-scrollbar,
	.clgl_right::-webkit-scrollbar {
		width: 4px;
		height: 1px;
	}
	
	.smzq::-webkit-scrollbar-thumb,
	.zck::-webkit-scrollbar-thumb,
	ul.ztree::-webkit-scrollbar-thumb,
	.clgl_right::-webkit-scrollbar-thumb {
		border-radius: 10px;
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #a5a9ac;
	}
	
	.smzq::-webkit-scrollbar-track,
	.zck::-webkit-scrollbar-track,
	ul.ztree::-webkit-scrollbar-track,
	.clgl_right::-webkit-scrollbar-track {
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 10px;
		background: #ededed;
	}
	
	.smzq_border {
		position: absolute;
		top: 20px;
		bottom: 20px;
		left: 50%;
		border-left: 4px solid #f53c3c;
		margin-left: -2px;
	}
	
	.smzq_col {
		width: 100%;
		float: left;
		margin: 15px 0;
		font-size: 15px;
		position: relative;
	}
	
	.smzq_col_left {
		width: 46%;
		float: left;
		text-align: right;
	}
	
	.smzq_col_right {
		width: 46%;
		float: right;
	}
	
	.smzq_col span {
		font-weight: bold;
		font-size: 16px;
	}
	
	.smzq_col p {
		font-size: 14px;
		margin-top: 10px;
		color: #a3a5a7;
		font-weight: normal;
	}
	
	.dot {
		width: 12px;
		height: 12px;
		position: absolute;
		left: 50%;
		top: 6px;
		margin-left: -6px;
		display: block;
		border-radius: 50%;
		background: #f53c3c;
	}
	
	.smzq_con {
		width: 96%;
		float: left;
		position: relative;
		margin-left: 2%;
	}
	
	.smzq_col2 {
		width: 100%;
		float: left;
		text-align: center;
		margin-bottom: 10px;
	}
	
	.smzq_col2 span {
		border-radius: 3px;
		background: #f53c3c;
		color: #FFFFFF;
		font-size: 15px;
		padding: 4px 10px;
		font-weight: bold;
	}
	
	.smzqnr {
		background: #FFFFFF;
		box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.2);
		padding: 10px;
		border-radius: 3px;
		position: relative;
	}
	
	.smzq_col_right.smzqnr {
		padding-right: 60px;
	}
	
	.smzq_col_left.smzqnr {
		padding-left: 60px;
	}
	
	.smzqtime {
		position: absolute;
		top: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.smzqtime.right {
		right: 0;
	}
	
	#triangle-right {
		width: 0;
		height: 0;
		border-top: 5px solid transparent;
		border-right: 10px solid #FFFFFF;
		border-bottom: 5px solid transparent;
		position: absolute;
		top: 50%;
		left: -10px;
		margin-top: -5px;
	}
	
	#triangle-left {
		width: 0;
		height: 0;
		border-top: 5px solid transparent;
		border-left: 10px solid #FFFFFF;
		border-bottom: 5px solid transparent;
		position: absolute;
		top: 50%;
		right: -10px;
		margin-top: -5px;
	}
	
	.smzq_col_right.smzqnr .smzq_img {
		position: absolute;
		top: 0;
		right: 5px;
		width: 50px;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.smzq_col_right.smzqnr .smzq_img img {
		max-width: 100%;
		max-height: 100%;
	}
	
	.smzq_col_left.smzqnr .smzq_img {
		position: absolute;
		top: 0;
		left: 5px;
		width: 50px;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.smzq_col_left.smzqnr .smzq_img img {
		max-width: 100%;
		max-height: 100%;
	}
	:deep(.pagination-container){
		height: 100px !important;
	}
</style>