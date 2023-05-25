<template>
  <a-layout :style="{height: `${screenHeight}px`, overflow: 'hidden' }">
    <a-card
        ref="toolbox"
        class="toolcard"
        :tab-list="tabList"
        :active-tab-key="activeKey"
        @tabChange="key => { activeKey = key }"
        v-drag
    >
      <!--工具栏标题-->
      <template #title>
        <a-tooltip color="grey">
          <template #title>
            <a-typography-text class="ant-typography" keyboard>Ctrl</a-typography-text> + <a-typography-text class="ant-typography" keyboard>A</a-typography-text> 隐藏工具栏
            <br/><a-typography-text class="ant-typography" keyboard>Ctrl</a-typography-text> + <a-typography-text class="ant-typography" keyboard>D</a-typography-text> 复位工具栏
            <br/><a-typography-text class="ant-typography" keyboard>Ctrl</a-typography-text> + <a-typography-text class="ant-typography" keyboard>R</a-typography-text> 重载渲染地图
          </template>
          Airmap
        </a-tooltip>
      </template>
      <!--工具栏右侧-->
      <template #extra>
        <a-tooltip v-if="foldToolbox">
          <template #title>
            <a-typography-text class="ant-typography" keyboard>Ctrl</a-typography-text> + <a-typography-text class="ant-typography" keyboard>F</a-typography-text> 折叠工具栏
          </template>
          <a-button type="link" @click="foldToolbox = false">
            <template #icon><down-outlined/></template>
          </a-button>
        </a-tooltip>
        <a-tooltip v-else>
          <template #title>
            <a-typography-text class="ant-typography" keyboard>Ctrl</a-typography-text> + <a-typography-text class="ant-typography" keyboard>F</a-typography-text> 折叠工具栏
          </template>
          <a-button type="link" @click="foldToolbox = true">
            <template #icon><up-outlined/></template>
          </a-button>
        </a-tooltip>
      </template>
      <!--工具栏选项卡-->
      <template #customTab="item" v-if="!foldToolbox">
        <span>
          <compass-outlined v-if="item.tab === '地图'" />
          <environment-outlined v-if="item.tab === '标注'" />
          <border-outlined v-if="item.tab === '图形'" />
          <node-index-outlined v-if="item.tab === '路线'" />
          {{ item.tab }}
        </span>
      </template>
      <!--工具栏内容-->
      <div class="toolbox-content" @mousedown.stop :style="{ height: `${screenHeight-190}px`}" v-if="!foldToolbox">
        <template v-if="activeKey === '1'">
          <map-config :model="models" :map="map" />
          <a-divider />
          <layer-config :model="models" />
          <a-divider />
          <measure-tool :map="map" :model="models" />
          <a-divider />
          <h4>保存导出</h4>
          <a-button @click="saveImage">保存图片</a-button>
        </template>
        <template v-if="activeKey === '2'">
          <markers-config :model="models"/>
          <a-divider />
          <label-markers-config :model="models" />
          <a-divider />
          <text-markers-config :model="models" />
          <a-divider />
          <info-windows-config :model="models" :map="map" />
        </template>
        <template v-if="activeKey === '3'">
          <polylines-config ref="polylinesConfig" :model="models" :mouseDraw="mouseDraw" @draw="draw" />
          <a-divider />
          <polygons-config ref="polygonsConfig" :model="models" :mouseDraw="mouseDraw" @draw="draw" />
          <a-divider />
          <rectangles-config ref="rectanglesConfig" :model="models" :mouseDraw="mouseDraw" @draw="draw" />
          <a-divider />
          <circles-config ref="circlesConfig" :model="models" :mouseDraw="mouseDraw" @draw="draw" />
          <a-divider />
          <ellipses-config :model="models" />
          <a-divider />
          <beziers-config :model="models" />
        </template>
        <template v-if="activeKey === '4'">
        </template>
      </div>
    </a-card>
    <a-layout-content>
      <!--地图实例-->
      <el-amap
          v-if="models.map.render"
          style="z-index: -10"
          :center="models.map.center"
          :zoom="models.map.zoom"
          :rotation="models.map.rotation"
          :features="models.map.features"
          :mapStyle="models.map.mapStyle"
          :pitch="models.map.pitch"
          :viewMode="models.map.viewMode"
          :skyColor="models.map.skyColor"
          :showLabel="models.map.showLabel"
          :webGLParams="{ preserveDrawingBuffer: true }"
          :mask="models.map.hasMask ? models.map.mask : null"
          @init="init"
          @click="click"
          @dragend="dragend"
          @zoomend="zoomend"
      >
        <el-amap-control-scale :visible="models.map.showScale" ></el-amap-control-scale>
        <el-amap-control-hawk-eye :visible="models.map.showHawkeye" ></el-amap-control-hawk-eye>
        <el-amap-layer-traffic
            :visible="models.layer.traffic.visible"
            :opacity="models.layer.traffic.opacity"
            :zIndex="models.layer.traffic.zIndex"
        ></el-amap-layer-traffic>
        <el-amap-layer-satellite
            :visible="models.layer.satellite.visible"
            :opacity="models.layer.satellite.opacity"
            :zIndex="models.layer.satellite.zIndex"
        ></el-amap-layer-satellite>
        <el-amap-layer-road-net
            :visible="models.layer.roadnet.visible"
            :opacity="models.layer.roadnet.opacity"
            :zIndex="models.layer.roadnet.zIndex"
        ></el-amap-layer-road-net>
        <el-amap-layer-district
            type="Province"
            :depth="2"
            :visible="models.layer.district.visible"
            :adcode="models.layer.district.adcode"
            :opacity="models.layer.district.opacity"
            :styles="models.layer.district.styles"
            :zIndex="models.layer.district.zIndex"
        ></el-amap-layer-district>
        <el-amap-marker
            v-for="(marker, index) in models.markers"
            :key="index"
            :visible="marker.visible"
            :position="marker.position"
            :zIndex="marker.zIndex"
            :zooms="marker.zooms"
            :offset="marker.offset"
            :icon="marker.icon"
            :content="marker.content"
            :draggable="marker.draggable"
            :angle="marker.angle"
            :title="marker.title"
            :clickable="marker.clickable"
            :label="marker.label"
            @dragend="(e) => { markerDragend(marker, e, index) }"
            @click="(e) => { clickMarker(marker, e, index) }"
        />
        <el-amap-label-marker
            v-for="(marker, index) in models.labelMarkers"
            :key="index"
            :visible="marker.visible"
            :zIndex="marker.zIndex"
            :position="marker.position"
            :zooms="marker.zooms"
            :icon="marker.icon"
            :text="marker.text"
        />
        <el-amap-text
            v-for="(marker, index) in models.textMarkers"
            :key="index"
            :zooms="[2, 20]"
            :visible="marker.visible"
            :zIndex="marker.zIndex"
            :position="marker.position"
            :offset="marker.offset"
            :text="marker.text"
            :draggable="marker.draggable"
            :cursor="marker.cursor"
            :angle="marker.angle"
            :title="marker.title"
            :textStyle="marker.textStyle"
            @dragend="(e) => { textMarkerDragend(marker, e, index) }"
        />
        <el-amap-info-window
            v-for="(window, index) in models.infoWindows"
            :key="index"
            :visible="window.visible"
            :isCustom="window.isCustom"
            :position="window.position"
            :autoMove="window.autoMove"
            :content="window.content"
            :size="window.size"
            :anchor="window.anchor"
            @close="infoWindowClosed"
        />
        <el-amap-polygon
            v-for="(polygon, index) in models.polygons"
            :key="index"
            :path="polygon.path"
            :visible="polygon.visible"
            :editable="polygon.editable"
            :zIndex="polygon.zIndex"
            :strokeColor="polygon.strokeColor"
            :strokeOpacity="polygon.strokeOpacity"
            :strokeWeight="polygon.strokeWeight"
            :fillColor="polygon.fillColor"
            :fillOpacity="polygon.fillOpacity"
            :strokeStyle="polygon.strokeStyle"
            :strokeDasharray="polygon.strokeDasharray"
            :draggable="polygon.draggable"
            @end="(e) => { polygonEditted(e, index) }"
            @dragend="(e) => { polygonDragend(e, index) }"
        />
        <el-amap-polyline
            v-for="(polyline, index) in models.polylines"
            :key="index"
            :visible="polyline.visible"
            :editable="polyline.editable"
            :draggable="polyline.draggable"
            :path="polyline.path"
            :zIndex="polyline.zIndex"
            :strokeColor="polyline.strokeColor"
            :strokeOpacity="polyline.strokeOpacity"
            :strokeWeight="polyline.strokeWeight"
            :borderWeight="polyline.borderWeight"
            :isOutline="polyline.isOutline"
            :outlineColor="polyline.outlineColor"
            :strokeStyle="polyline.strokeStyle"
            :strokeDasharray="polyline.strokeDasharray"
            :lineJoin="polyline.lineJoin"
            :lineCap="polyline.lineCap"
            :geodesic="polyline.geodesic"
            :showDir="polyline.showDir"
            @end="(e) => { polylineEditted(e, index) }"
            @dragend="(e) => { polylineDragend(e, index) }"
        />
        <el-amap-bezier-curve
            v-for="(bezier, index) in models.beziers"
            :key="index"
            :visible="bezier.visible"
            :editable="bezier.editable"
            :draggable="bezier.draggable"
            :path="bezier.path"
            :zIndex="bezier.zIndex"
            :strokeColor="bezier.strokeColor"
            :strokeOpacity="bezier.strokeOpacity"
            :strokeWeight="bezier.strokeWeight"
            :borderWeight="bezier.borderWeight"
            :isOutline="bezier.isOutline"
            :outlineColor="bezier.outlineColor"
            :strokeStyle="bezier.strokeStyle"
            :strokeDasharray="bezier.strokeDasharray"
            :lineJoin="bezier.lineJoin"
            :lineCap="bezier.lineCap"
            :geodesic="bezier.geodesic"
            :showDir="bezier.showDir"
            @end="(e) => { bezierEditted(e, index) }"
            @dragend="(e) => { bezierDragend(e, index) }"
        />
        <el-amap-circle
            v-for="(circle, index) in models.circles"
            :key="index"
            :visible="circle.visible"
            :center="circle.center"
            :radius="circle.radius"
            :editable="circle.editable"
            :draggable="circle.draggable"
            :zIndex="circle.zIndex"
            :strokeColor="circle.strokeColor"
            :strokeOpacity="circle.strokeOpacity"
            :strokeWeight="circle.strokeWeight"
            :fillColor="circle.fillColor"
            :fillOpacity="circle.fillOpacity"
            :strokeStyle="circle.strokeStyle"
            :strokeDasharray="circle.strokeDasharray"
            @end="(e) => { circleEditted(e, index) }"
            @dragend="(e) => { circleDragend(e, index) }"
        />
        <el-amap-ellipse
            v-for="(ellipse, index) in models.ellipses"
            :key="index"
            :visible="ellipse.visible"
            :center="ellipse.center"
            :radius="ellipse.radius"
            :editable="ellipse.editable"
            :draggable="ellipse.draggable"
            :zIndex="ellipse.zIndex"
            :strokeColor="ellipse.strokeColor"
            :strokeOpacity="ellipse.strokeOpacity"
            :strokeWeight="ellipse.strokeWeight"
            :fillColor="ellipse.fillColor"
            :fillOpacity="ellipse.fillOpacity"
            :strokeStyle="ellipse.strokeStyle"
            :strokeDasharray="ellipse.strokeDasharray"
            @end="(e) => { ellipseEditted(e, index) }"
            @dragend="(e) => { ellipseDragend(e, index) }"
        />
        <el-amap-rectangle
            v-for="(rectangle, index) in models.rectangles"
            :key="index"
            :bounds="rectangle.bounds"
            :visible="rectangle.visible"
            :editable="rectangle.editable"
            :draggable="rectangle.draggable"
            :zIndex="rectangle.zIndex"
            :strokeColor="rectangle.strokeColor"
            :strokeOpacity="rectangle.strokeOpacity"
            :strokeWeight="rectangle.strokeWeight"
            :fillColor="rectangle.fillColor"
            :fillOpacity="rectangle.fillOpacity"
            :strokeStyle="rectangle.strokeStyle"
            :strokeDasharray="rectangle.strokeDasharray"
            @end="(e) => { rectangleEditted(e, index) }"
            @dragend="(e) => { rectangleDragend(e, index) }"
        />
        <!--图形绘制-->
        <el-amap-mouse-tool
            v-if="mouseDraw"
            :type="mouseDrawType"
            :autoClear="false"
            @draw="drawed"
        />
      </el-amap>
    </a-layout-content>
  </a-layout>
</template>

<script>
import MapConfig from "@/AirMap/Config/MapConfig"
import LayerConfig from "@/AirMap/Config/LayerConfig"
import MarkersConfig from "@/AirMap/Config/Makers/MarkersConfig"
import LabelMarkersConfig from "@/AirMap/Config/Makers/LabelMarkersConfig"
import TextMarkersConfig from "@/AirMap/Config/Makers/TextMarkersConfig"
import PolygonsConfig from "@/AirMap/Config/Graphical/PolygonsConfig"
import PolylinesConfig from "@/AirMap/Config/Graphical/PolylinesConfig"
import BeziersConfig from "@/AirMap/Config/Graphical/BeziersConfig"
import CirclesConfig from "@/AirMap/Config/Graphical/CirclesConfig"
import EllipsesConfig from "@/AirMap/Config/Graphical/EllipsesConfig"
import RectanglesConfig from "@/AirMap/Config/Graphical/RectanglesConfig"
import InfoWindowsConfig from "@/AirMap/Config/Makers/InfoWindowsConfig"
import MeasureTool from "@/AirMap/Config/MeasureTool"
import { Screenshot } from '@amap/screenshot'
import {
  UpOutlined,
  DownOutlined,
  CompassOutlined,
  EnvironmentOutlined,
  NodeIndexOutlined,
  BorderOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'AirMap',
  components: {
    RectanglesConfig,
    EllipsesConfig,
    PolylinesConfig,
    PolygonsConfig,
    MapConfig,
    LayerConfig,
    MarkersConfig,
    LabelMarkersConfig,
    TextMarkersConfig,
    BeziersConfig,
    CirclesConfig,
    InfoWindowsConfig,
    UpOutlined,
    DownOutlined,
    CompassOutlined,
    EnvironmentOutlined,
    NodeIndexOutlined,
    BorderOutlined,
    MeasureTool
  },
  props: {
    models: {
      type: [Object],
      required: true
    }
  },
  directives:{
    drag(el) {
      let oDiv = el // 当前元素
      // 禁止选择网页上的文字
      document.onselectstart = function () { return false }
      oDiv.onmousedown = function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - oDiv.offsetLeft
        let disY = e.clientY - oDiv.offsetTop
        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          let l = e.clientX - disX
          let t = e.clientY - disY
          oDiv.style.left = l + 'px'
          oDiv.style.top = t + 'px'
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
        return false
      }
    }
  },
  computed: {
    screenHeight () {
      return document.body.clientHeight
    }
  },
  data () {
    return {
      map: null,
      activeKey: '1',
      showToolbox: false,
      foldToolbox: false,
      mouseDraw: false,
      mouseDrawType: 'polyline',
      measureDraw: false,
      measureDrawType: 'rule',
      tabList: [
        { key: '1', tab: '地图' },
        { key: '2', tab: '标注' },
        { key: '3', tab: '图形' },
        { key: '4', tab: '路线' },
      ]
    }
  },
  mounted () {
    // 按键事件
    document.addEventListener('keydown', (e) => {
      this.keyboardControl(e)
    })
  },
  methods: {
    init (map) {
      this.map = map
      var _this = this
      // IP定位到用户所在城市
      map.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            _this.map.setBounds(result.bounds)
            _this.models.map.center = [
              _this.map.getCenter().lng,
              _this.map.getCenter().lat
            ]
          }
        })
      })
    },
    click (e) {
      // this.models.map.center = [e.lnglat.lng, e.lnglat.lat]
      console.log(e)
    },
    dragend (e) {
      this.models.map.center = [ e.target.getCenter().lng, e.target.getCenter().lat ]
    },
    zoomend (e) {
      const zoom = e.target.getZoom()
      this.models.map.zoom = zoom
    },
    clickMarker (marker) {
      console.log(`点击了标号,标号ID： ${marker.id}`)
    },
    markerDragend (marker, e, index) {
      this.models.markers[index].position = [e.lnglat.lng, e.lnglat.lat]
    },
    textMarkerDragend (marker, e, index) {
      this.models.textMarkers[index].position = [e.lnglat.lng, e.lnglat.lat]
    },
    polygonEditted(e, index) {
      const points = e.target.getPath()
      const path = []
      if (!points) return
      points.forEach((point) => {
        path.push([point.lng, point.lat])
      })
      if (this.models.polygons && this.models.polygons[index]) this.models.polygons[index].path = path
    },
    polygonDragend (e, index) {
      this.polygonEditted(e, index)
    },
    polylineEditted(e, index, isDrag = false) {
      let points = e.target.getPath()
      const path = []
      if (!points) return
      if (isDrag) points = points[0]
      points.forEach((point) => {
        path.push([point.lng, point.lat])
      })
      if (this.models.polylines && this.models.polylines[index]) this.models.polylines[index].path = path
    },
    polylineDragend (e, index) {
      this.polylineEditted(e, index, true)
    },
    bezierEditted(e, index) {
      let points = e.target.getPath()
      if (!points) return
      if (this.models.beziers && this.models.beziers[index]) this.models.beziers[index].path = points
    },
    bezierDragend (e, index) {
      this.bezierEditted(e, index)
    },
    circleEditted(e, index) {
      const radius = e.target.getRadius()
      if (radius && this.models.circles[index]) this.models.circles[index].radius = radius
    },
    circleDragend (e, index) {
      if (this.models.circles && this.models.circles[index]) this.models.circles[index].center = [e.lnglat.lng, e.lnglat.lat]
    },
    ellipseEditted(e, index) {
      const radius = e.target.getRadius()
      if (radius && this.models.ellipses[index]) this.models.ellipses[index].radius = radius
    },
    ellipseDragend (e, index) {
      if (this.models.ellipses && this.models.ellipses[index]) this.models.ellipses[index].center = [e.lnglat.lng, e.lnglat.lat]
    },
    rectangleEditted(e, index) {
      const options = e.target.getOptions()
      const bounds = [
        [options.bounds.northEast.lng, options.bounds.northEast.lat],
        [options.bounds.southWest.lng, options.bounds.southWest.lat]
      ]
      if (bounds && this.models.rectangles[index]) this.models.rectangles[index].bounds = bounds
    },
    rectangleDragend (e, index) {
      this.rectangleEditted(e, index)
    },
    infoWindowClosed () {
      this.models.infoWindows[0].visible = false
    },
    draw (type, value) {
      this.mouseDraw = value
      this.mouseDrawType = type
    },
    drawed (data) {
      const type = this.mouseDrawType
      this.mouseDraw = false
      if (type === 'polyline') this.$refs.polylinesConfig.add(data)
      if (type === 'polygon') this.$refs.polygonsConfig.add(data)
      if (type === 'rectangle') this.$refs.rectanglesConfig.add(data)
      if (type === 'circle') this.$refs.circlesConfig.add(data)
      console.log('draw', data)
    },
    measure (type) {
      const measureTypes = ['rule', 'measureArea']
      if (measureTypes.includes(type)) {
        this.measureDraw = true
        this.measureDrawType = type
      }
      if (type === 'end') {
        this.$refs.measureTool.$$getInstance().close(false)
      }
      if (type === 'clear') {
        this.measureDraw = false
        this.$refs.measureTool.$$getInstance().close(true)
      }
    },
    measured (data) {
      console.log('draw', data)
    },
    keyboardControl(e) {
      // [Ctrl] + [A] 隐藏控制板
      if (e.ctrlKey && e.keyCode === 65) {
        this.displayToolbox()
      }
      // [Ctrl] + [D] 初始化控制板(不修改参数值)
      if (e.ctrlKey && e.keyCode === 68) {
        this.displayToolbox(true)
      }
      // [Ctrl] + [F] 折叠展开控制板
      if (e.ctrlKey && e.keyCode === 70) {
        this.foldToolbox = !this.foldToolbox
      }
      // [Ctrl] + [R] 重新渲染加载地图实例
      if (e.ctrlKey && e.keyCode === 82) {
        this.models.map.render = false
        setTimeout(() => { this.models.map.render = true }, 1000) // 1秒后重新渲染地图实例
      }
    },
    displayToolbox (force = false) {
      this.showToolbox = !this.showToolbox
      this.$refs.toolbox.$el.style.display = this.showToolbox ? 'unset' : 'none'
      if (force === true) {
        this.$refs.toolbox.$el.style.top = '20px'
        this.$refs.toolbox.$el.style.left = `${document.body.clientWidth - 440}px`
        this.$refs.toolbox.$el.style.display = 'unset'
      }
    },
    saveImage () {
      const screenshot = new Screenshot(this.map)
      const filename = 'Airmap_' + this.timestampToTime() + '.jpg'
      screenshot.download({
        type: 'image/jpeg',
        filename: filename
      }).then(() => {
        console.log('下载成功')
      }).catch((error) => {
        console.log(error)
      })
    },
    timestampToTime (timestamp = 0) {
      if (timestamp !== 0 && timestamp.toString().length === 10) timestamp = timestamp * 1000
      const date = timestamp === 0 ? new Date() : new Date(timestamp)
      const Y = date.getFullYear() + '-'
      const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-'
      const D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ '_'
      const h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':'
      const m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':'
      const s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds()
      return Y+M+D+h+m+s;
    }
  }
}
</script>

<style lang="css" scoped>
.margin {
  margin: 15px;
}
.right {
  overflow-y: scroll;
}
.toolcard {
  width: 420px;
  top: 20px;
  right: 20px;
  z-index: 99;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.80);
  border-radius: 20px;
}
.toolbox-content {
  overflow-x: hidden;
  overflow-y: scroll;
}
.ant-typography {
  background-color: #ffffff;
}

</style>
