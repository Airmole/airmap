<template>
  <a-layout :style="{height: `${screenHeight}px` }">
    <a-layout-content>
      <el-amap
          :center="models.map.center"
          :zoom="models.map.zoom"
          :rotation="models.map.rotation"
          :features="models.map.features"
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
      </el-amap>
    </a-layout-content>
    <a-layout-sider collapsible reverseArrow theme="light" width="420px">
      <div class="margin">
        <a-tabs v-model:activeKey="activeKey" :tabPosition="'left'">
          <template #renderTabBar="{ DefaultTabBar, ...props }">
            <component :is="DefaultTabBar" v-bind="props" :style="{ marginLeft: '-25px' }" />
          </template>
          <a-tab-pane :key="1" tab="地图">
            <map-config :model="models"/>
            <a-divider />
            <layer-config :model="models"/>
            <a-divider />
          </a-tab-pane>
          <a-tab-pane :key="2" tab="标注" style="padding-left: 10px;">
            <markers-config :model="models"/>
            <a-divider />
            <label-markers-config :model="models" />
            <a-divider />
            <text-markers-config :model="models" />
          </a-tab-pane>
          <a-tab-pane :key="3" tab="图形" style="padding-left: 10px;">
            <polylines-config :model="models" />
            <a-divider />
            <polygons-config :model="models" />
            <a-divider />
            <beziers-config :model="models" />
            <a-divider />
            <circles-config :model="models" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-sider>
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
export default {
  name: 'AirMap',
  components: {
    PolylinesConfig,
    PolygonsConfig,
    MapConfig,
    LayerConfig,
    MarkersConfig,
    LabelMarkersConfig,
    TextMarkersConfig,
    BeziersConfig,
    CirclesConfig
  },
  props: {
    models: {
      type: [Object],
      required: true,
      default: function () {
        return {
          map: {
            center: [],
            zoom: 16,
            rotation: 0,
            features: ['bg', 'point', 'road', 'building'],
            showScale: false,
            showHawkeye: false,
          },
          layer: {
            traffic: {
              visible: false,
              opacity: 1,
              zIndex: 4
            },
            satellite: {
              visible: false,
              opacity: 1,
              zIndex: 4
            },
            roadnet: {
              visible: false,
              opacity: 1,
              zIndex: 4
            },
            district: {
              visible: false,
              adcode: '350200',
              opacity: 1,
              zIndex: 4,
              styles: {
                fill: '#46A4E7',
                zIndex: 0,
                'stroke-width': '',
                'coastline-stroke':  [0.18,0.63,0.94,1],
                'nation-stroke': [0.35,0.35,0.35,1],
                'province-stroke': [0.5,0.5,0.5,1],
                'city-stroke': [0.7,0.7,0.7,1],
                'county-stroke': [0.85,0.85,0.85,1],
              }
            }
          },
          markers: [],
          labelMarkers: [],
          textMarkers: [],
          elasticMarkers: [],
          polygons: [],
          polylines: [],
          beziers: [],
          circles: [],
          ellipses: []
        }
      }
    }
  },
  watch: {
  },
  computed: {
    screenHeight () {
      return document.body.clientHeight
    }
  },
  data () {
    return {
      map: null,
      activeKey: 1,
    }
  },
  mounted () {
  },
  methods: {
    init (map) {
      this.map = map
    },
    click (e) {
      this.models.map.center = [e.lnglat.lng, e.lnglat.lat]
    },
    dragend (e) {
      this.click(e)
    },
    zoomend (e) {
      const zoom = e.target.wm.zoom
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
      this.models.circles[index].radius = radius
    },
    circleDragend (e, index) {
      this.models.circles[index].center = [e.lnglat.lng, e.lnglat.lat]
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
</style>
