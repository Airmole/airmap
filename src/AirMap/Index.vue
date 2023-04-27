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
            :visible="models.layer.traffic.show"
            :opacity="models.layer.traffic.opacity"
            :zIndex="models.layer.traffic.zIndex"
        ></el-amap-layer-traffic>
        <el-amap-layer-satellite
            :visible="models.layer.satellite.show"
            :opacity="models.layer.satellite.opacity"
            :zIndex="models.layer.satellite.zIndex"
        ></el-amap-layer-satellite>
        <el-amap-layer-road-net
            :visible="models.layer.roadnet.show"
            :opacity="models.layer.roadnet.opacity"
            :zIndex="models.layer.roadnet.zIndex"
        ></el-amap-layer-road-net>
        <el-amap-layer-district
            type="Province"
            :depth="2"
            :visible="models.layer.district.show"
            :adcode="models.layer.district.adcode"
            :opacity="models.layer.district.opacity"
            :styles="models.layer.district.styles"
            :zIndex="models.layer.district.zIndex"
        ></el-amap-layer-district>
        <el-amap-marker
            v-for="(marker, index) in models.markers"
            :key="index"
            :visible="marker.show"
            :position="marker.position"
            :zIndex="marker.zIndex"
            :offset="marker.offset"
            :icon="marker.icon"
            :content="marker.content"
            :draggable="marker.draggable"
            :angle="marker.angle"
            :title="marker.title"
            :clickable="marker.clickable"
            :label="marker.label"
            @dragend="(e) => { dragendArrayMarker(marker, e, index) }"
            @click="(e) => { clickArrayMarker(marker, e, index) }"
        />
      </el-amap>
    </a-layout-content>
    <a-layout-sider collapsible reverseArrow theme="light" width="400px">
      <div class="margin">
        <a-tabs v-model:activeKey="activeKey" :tabPosition="'left'">
          <template #renderTabBar="{ DefaultTabBar, ...props }">
            <component :is="DefaultTabBar" v-bind="props" :style="{ marginLeft: '-25px' }" />
          </template>
          <a-tab-pane :key="1" tab="地图">
            <map-config :model="models"/>
            <a-divider />
            <layer-config :model="models"/>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="标注">
            <markers-config :model="models"/>
            <a-divider />
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-layout-sider>
  </a-layout>
</template>

<script>
import mapConfig from "@/AirMap/Config/MapConfig"
import layerConfig from "@/AirMap/Config/LayerConfig"
import markersConfig from "@/AirMap/Config/MarkersConfig"
export default {
  name: 'AirMap',
  components: {
    mapConfig,
    layerConfig,
    markersConfig
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
              show: false,
              opacity: 1,
              zIndex: 4
            },
            satellite: {
              show: false,
              opacity: 1,
              zIndex: 4
            },
            roadnet: {
              show: false,
              opacity: 1,
              zIndex: 4
            },
            district: {
              show: false,
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
          markers: []
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
    clickArrayMarker (marker){
      console.log(`点击了标号,标号ID： ${marker.id}`)
    },
    dragendArrayMarker (marker, e, index){
      this.models.markers[index].position = [e.lnglat.lng, e.lnglat.lat]
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
