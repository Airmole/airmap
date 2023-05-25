<template>
  <div>
    <h4>地图配置</h4>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图视图模式, 默认为‘2D’，可选’3D’，选择‘3D’会显示 3D 地图效果。</template>
          <div class="label">视图模式</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-switch
            v-model:checked="model.map.viewMode"
            checked-children="3D"
            un-checked-children="2D"
            checked-value="3D"
            un-checked-value="2D"
            @change="viewChange"
        />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>使用行政区县市名称、adcode、citycode等设置地图的中心点</template>
          <div class="label">城市定位</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-input v-model:value="cityName" @change="cityNameChange" placeholder="可输入省、市、县名称"></a-input>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="cityName">
      <a-col :span="6">
        <a-tooltip>
          <template #title>通过 mask 属性为地图对象设定区域掩模，只显示行政区域内的图层和覆盖物</template>
          <div class="label">区域掩模</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-switch
            v-model:checked="model.map.hasMask"
            checked-children="开启"
            un-checked-children="关闭"
            @change="hasMaskChange"
        />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图中心经纬度定位</template>
          <div class="label">经纬定位</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-input-group compact v-if="model.map.center">
          <a-input v-model:value="model.map.center[0]" style="width: 50%" />
          <a-input v-model:value="model.map.center[1]" style="width: 50%" />
        </a-input-group>
        <a-input-group compact v-else>
          <a-input disabled style="width: 50%" /><a-input disabled style="width: 50%" />
        </a-input-group>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>设置地图的显示样式</template>
          <div class="label">地图样式</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-select v-model:value="model.map.mapStyle" style="width: 100%" :options="mapStyles"
        ></a-select>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图显示的缩放级别</template>
          <div class="label">缩放级别</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-slider v-model:value="model.map.zoom" :min="2" :max="20" :step="0.01"/>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.map.viewMode === '3D'">
      <a-col :span="6">
        <a-tooltip>
          <template #title>俯仰角度，默认 0，最大值根据地图当前 zoom 级别不断增大，2D地图下无效 。</template>
          <div class="label">俯仰角度</div>
        </a-tooltip>
      </a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.map.pitch" :min="0" :max="90"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.map.pitch" :bordered="false" :min="0" :max="90" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.map.viewMode === '3D'">
      <a-col :span="6">
        <a-tooltip>
          <template #title>天空颜色，3D 模式下带有俯仰角时会显示</template>
          <div class="label">天空颜色</div>
        </a-tooltip>
      </a-col>
      <a-col :span="14" class="label">{{ model.map.skyColor }}</a-col>
      <a-col :span="3">
        <color-selector v-model:value="model.map.skyColor" size="small" @change="forceRenderMap"></color-selector>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图顺时针旋转角度，取值范围 [0-360] ，默认值：0</template>
          <div class="label">旋转角度</div>
        </a-tooltip>
      </a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.map.rotation" :min="0" :max="360"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.map.rotation" :bordered="false" :min="0" :max="360" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>是否展示地图文字和 POI 信息。默认 true</template>
          <div class="label">地图文字</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.map.showLabel" checked-children="显示" un-checked-children="隐藏" @change="forceRenderMap"/>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>设置地图上显示的元素种类, 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物），默认值：['bg','point','road','building']</template>
          <div class="label">展示元素</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-checkbox-group v-model:value="model.map.features" name="features" :options="featureOptions" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>位于地图左下角，可控制其显示与隐藏。</template>
          <div class="label">比例尺</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.map.showScale" checked-children="显示" un-checked-children="隐藏" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>鹰眼控件，用于显示缩略地图，显示于地图右下角，可以随主图的视口变化而变化</template>
          <div class="label">缩略小图</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.map.showHawkeye" checked-children="显示" un-checked-children="隐藏"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ColorSelector from "../../components/V3ColorPicker/V3ColorPicker.vue"
export default {
  name: "MapConfig",
  components: {
    ColorSelector
  },
  props: {
    model: {
      type: [Object],
      required: true
    },
    map: {
      type: [Object, null],
      required: true
    }
  },
  data () {
    return {
      cityName: '',
      featureOptions: [
        { label: '地图背景', value: 'bg' },
        { label: 'POI点', value: 'point' },
        { label: '道路', value: 'road' },
        { label: '建筑物', value: 'building' }
      ],
      mapStyles: [
        { label: '标准', value: 'amap://styles/normal' },
        { label: '幻影黑', value: 'amap://styles/dark' },
        { label: '月光银', value: 'amap://styles/light' },
        { label: '远山黛', value: 'amap://styles/whitesmoke' },
        { label: '草色青', value: 'amap://styles/fresh' },
        { label: '雅士灰', value: 'amap://styles/grey' },
        { label: '涂鸦', value: 'amap://styles/graffiti' },
        { label: '马卡龙', value: 'amap://styles/macaron' },
        { label: '靛青蓝', value: 'amap://styles/blue' },
        { label: '极夜蓝', value: 'amap://styles/darkblue' },
        { label: '酱籽', value: 'amap://styles/wine' }
      ]
    }
  },
  methods: {
    viewChange (e) {
      this.model.map.viewMode = e
      this.forceRenderMap()
    },
    cityNameChange (e) {
      this.map.setCity(e.target.value)
    },
    hasMaskChange (value) {
      if (!value) {
        this.model.map.mask = null
        this.forceRenderMap()
        return
      }
      if (!this.cityName) {
        this.model.map.hasMask = false
        this.$message.info('请先输入城市定位城市名称')
        return
      }

      var _this = this
      this.map.plugin('AMap.DistrictSearch', function () {
        var district = new AMap.DistrictSearch({
          subdistrict: 0,
          extensions: 'all',
          level: 'city'
        })
        district.search(_this.cityName, function(status, result) {
          const bounds = result.districtList[0].boundaries;
          const mask = [];
          for (let i =0; i < bounds.length; i += 1) {
            mask.push([bounds[i]])
          }
          _this.model.map.mask = mask
          _this.forceRenderMap()
        })
      })
    },
    forceRenderMap () {
      this.model.map.render = false
      setTimeout(() => { this.model.map.render = true }, 1000) // 1秒后重新渲染地图实例
    }
  }
}
</script>

<style scoped>
.label {
  margin-top: 5px;
}
.margin-top {
  margin-top: 10px;
}
</style>
