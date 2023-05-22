<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="文本标注">
        <p>纯文本标记。文本标记的展示内容为纯文本。继承自 Marker 类，具有 Marker 的大部分属性、方法和事件。</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.elasticMarkers" :key="index">
      <close-circle-outlined class="show-circle" @click="remove(index)"/>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>点标记是否可见，默认为true。</template>
            <div class="label">展示</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.visible" checked-children="显示" un-checked-children="隐藏" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>点标记在地图上显示的位置</template>
            <div class="label">坐标</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input-number v-model:value="item.position[0]" style="width: 50%" />
            <a-input-number v-model:value="item.position[1]" style="width: 50%" />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>点标记的叠加顺序。地图上存在多个点标记叠加时，通过该属性使级别较高的点标记在上层显示，默认zIndex：12</template>
            <div class="label">层级</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-number v-model:value="item.zIndex" :min="-99999" :max="99999" class="width-full" />
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="6">
          <a-button type="link" @click="add">
            <template #icon><plus-outlined /></template>添加标签标注点
          </a-button>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "ElasticMarkersConfig",
  components: {
  },
  props: {
    model: {
      type: [Object],
      required: true
    }
  },
  data () {
    return {
      labelSpan: 6,
      wrapperSpan: 18
    }
  },
  methods: {
    add () {
      const item = {
        visible: true,
        position: this.model.map.center,
        zIndex: 12,
        offset: [0, 0],
        draggable: false,
        cursor: 'pointer',
        title: '',
        clickable: false,
        zoomStyleMapping: {},
        styles: []
      }
      this.model.elasticMarkers.push(item)
    },
    remove (index) {
      this.model.elasticMarkers.splice(index, 1)
    },
    addStyle (index) {
      this.model.elasticMarkers[index].push({
        icon: {
          img: 'https://a.amap.com/jsapi_demos/static/resource/img/qiniandian.png',
          size: [16, 16],
          ancher:[8, 16],
          imageOffset: [0, 0],
          fitZoom: 14,
          scaleFactor: 2,
          maxScale: 2,
          minScale: 1
        },
        label: {
          content: '',
          position: 'BM',
          offset: [0, 0],
          minZoom: 15
        }
      })
    },
    removeStyle (index, idx) {
      this.model.elasticMarkers[index].styles.splice(idx, 1)
    },
    addStyleMapping (index) {
      this.model.elasticMarkers[index].zoomStyleMapping = Object.assign(
          this.model.elasticMarkers[index].zoomStyleMapping, {
            // Todo。。。
          }
      )
    }
  },
}
</script>

<style scoped>
.card {
  margin: 5px 5px 10px 0;
  border-radius: 15px;
  border: 1px solid #ccc;
  background-color: rgba(255, 255, 255, 0.58);
}
.show-circle {
  font-size: 16px;
  position: absolute;
  right: -8px;
  top: -8px;
  z-index: 8;
  display: block;
  border: 2px solid #fff;
  border-radius: 50%;
}
.label {
  margin-top: 5px;
}
.margin-top {
  margin-top: 10px;
}
.width-full {
  width: 100%;
}
</style>
