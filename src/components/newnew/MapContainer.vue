<template>
  <div class="home_div">
    <div class="map-title">
      <h3>JSAPI Vue3地图组件示例</h3>
    </div>
    <div id="container"></div>
    <button id="btn">开始动画</button>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
export default {
  name: "mapcomtaint",
  setup() {
    const map = shallowRef(null);
    return {
      map
    };
  },
  create() {},
  methods: {
    ininMap() {
      AMapLoader.load({
        key: "62170a3b8752a2ac9afea1f914990063", //设置您的key
        version: "2.0",
        plugins: ["AMap.ToolBar", "AMap.Driving"],
        AMapUI: {
          version: "1.1",
          plugins: []
        },
        Loca: {
          version: "2.0.0"
        }
      })
        .then(AMap => {
          AMap.plugin("AMap.MoveAnimation", function() {
            var marker,
              lineArr = [
                [116.478935, 39.997761],
                [116.478939, 39.997825],
                [116.478912, 39.998549],
                [116.478912, 39.998549],
                [116.478998, 39.998555],
                [116.478998, 39.998555],
                [116.479282, 39.99856],
                [116.479658, 39.998528],
                [116.480151, 39.998453],
                [116.480784, 39.998302],
                [116.480784, 39.998302],
                [116.481149, 39.998184],
                [116.481573, 39.997997],
                [116.481863, 39.997846],
                [116.482072, 39.997718],
                [116.482362, 39.997718],
                [116.483633, 39.998935],
                [116.48367, 39.998968],
                [116.484648, 39.999861]
              ];

            const map = new AMap.Map("container", {
              resizeEnable: true,
              center: [116.397428, 39.90923],
              zoom: 17
            });

            marker = new AMap.Marker({
              map: map,
              position: [116.478935, 39.997761],
              icon:
                "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
              offset: new AMap.Pixel(-13, -26)
            });

            // 绘制轨迹
            var polyline = new AMap.Polyline({
              map: map,
              path: lineArr,
              showDir: true,
              strokeColor: "#28F", //线颜色
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 6 //线宽
              // strokeStyle: "solid"  //线样式
            });

            var passedPolyline = new AMap.Polyline({
              map: map,
              strokeColor: "#AF5", //线颜色
              strokeWeight: 6 //线宽
            });

            marker.on("moving", function(e) {
              passedPolyline.setPath(e.passedPath);
              map.setCenter(e.target.getPosition(), true);
            });

            map.setFitView();

          
            document.querySelector("#btn").onclick = function() {

              marker.moveAlong(lineArr, {
                // 每一段的时长
                duration: 500, //可根据实际采集时间间隔设置
                // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                autoRotation: true
              });
            };
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    addMarker() {}
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    this.ininMap();
  }
};
</script>
<style scope>
.home_div {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
  position: relative;
}
#container {
  height: 100%;
  width: 100%;
  padding: 0px;
  margin: 0px;
}
.map-title {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 50px;
  background-color: rgba(27, 25, 27, 0.884);
}
h3 {
  position: absolute;
  left: 10px;
  z-index: 2;
  color: white;
}
#btn{
    position: fixed;
    bottom: 100px;
    right: 10px;
}
</style>