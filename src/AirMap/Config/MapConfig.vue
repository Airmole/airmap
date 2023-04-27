<template>
  <div>
    <h4>地图配置</h4>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图中心经纬度</template>
          <div class="label">快速定位</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-input-group compact>
          <a-input v-model:value="model.map.center[0]" style="width: 50%" />
          <a-input v-model:value="model.map.center[1]" style="width: 50%" />
        </a-input-group>
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
        <a-slider v-model:value="model.map.zoom" :min="2" :max="30" :step="0.01"/>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-tooltip>
          <template #title>地图顺时针旋转角度，取值范围 [0-360] ，默认值：0</template>
          <div class="label">旋转角度</div>
        </a-tooltip>
      </a-col>
      <a-col :span="17">
        <a-slider v-model:value="model.map.rotation" :min="0" :max="360"/>
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
        <a-switch v-model:checked="model.map.showHawkeye" checked-children="显示" un-checked-children="隐藏" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "MapConfig",
  props: {
    model: {
      type: [Object],
      required: true
    }
  },
  data () {
    return {
      featureOptions: [
        { label: '地图背景', value: 'bg' },
        { label: 'POI点', value: 'point' },
        { label: '道路', value: 'road' },
        { label: '建筑物', value: 'building' }
      ]
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
