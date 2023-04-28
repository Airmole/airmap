<template>
  <div id="app">
    <air-map :models="models"/>
  </div>
</template>

<script>
import AirMap from "./AirMap/Index"

export default {
  components: {
    AirMap: AirMap,
  },
  watch: {
    models: {
      handler(val) {
        console.log("数据更新", val)
      },
      deep: true,
    },
  },
  data() {
    return {
      models: {
        map: {
          center: [118.126559, 24.498822],
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
              zIndex: 0,
              fill: '#46A4E7',
              'stroke-width': 1,
              'coastline-stroke':  'rgba(18,63,94,1)',
              'nation-stroke': 'rgba(35,35,35,1)',
              'province-stroke': 'rgba(50,50,50,1)',
              'city-stroke': 'rgba(70,70,70,1)',
              'county-stroke': 'rgba(85,85,85,1)',
            },
          }
        },
        markers: [],
        labelMarkers: []
      }
    }
  },
  methods: {},
};
</script>
<style>
/*移除高德地图logo*/
.amap-logo {
  display: none;
  opacity: 0 !important;
}

.amap-copyright {
  opacity: 0;
}

.ant-layout-sider-children {
  overflow-y: scroll;
}
</style>
