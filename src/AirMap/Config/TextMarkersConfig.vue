<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="文本标注">
        <p>纯文本标记。文本标记的展示内容为纯文本。继承自 Marker 类，具有 Marker 的大部分属性、方法和事件。</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.textMarkers" :key="index">
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
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>标记显示的文本内容。</template>
            <div class="label">标注文本</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input v-model:value="item.text"/>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>点标记显示位置偏移量，默认值为 [0,0] 。Marker指定position后，默认以marker左上角位置为基准点（若设置了anchor，则以anchor设置位置为基准点），对准所给定的position位置，若需使marker指定位置对准在position处，需根据marker的尺寸设置一定的偏移量。</template>
            <div class="label">偏移量</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input-number v-model:value="item.offset[0]" style="width: 50%" />
            <a-input-number v-model:value="item.offset[1]" style="width: 50%" />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>点标记的旋转角度，，广泛用于改变车辆行驶方向。默认值：0</template>
            <div class="label">角度</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-slider v-model:value="item.angle" :min="0" :max="360"/>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>鼠标滑过点标记时的文字提示。不设置则鼠标滑过点标无文字提示。</template>
            <div class="label">标题</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input v-model:value="item.title"/>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="7">
          <a-tooltip>
            <template #title>文字颜色</template>
            <div class="label">文字颜色</div>
          </a-tooltip>
        </a-col>
        <a-col :span="14" class="label">{{ item.textStyle.color }}</a-col>
        <a-col :span="3">
          <color-selector v-model:value="item.textStyle.color" size="small"></color-selector>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="7">
          <a-tooltip>
            <template #title>背景颜色</template>
            <div class="label">背景颜色</div>
          </a-tooltip>
        </a-col>
        <a-col :span="14" class="label">{{ item.textStyle.backgroundColor }}</a-col>
        <a-col :span="3">
          <color-selector v-model:value="item.textStyle.backgroundColor" size="small"></color-selector>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>设置点标记是否可拖拽移动，默认为false。</template>
            <div class="label">可拖动</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.draggable" checked-children="开" un-checked-children="关" />
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
import ColorSelector from "../../components/V3ColorPicker/V3ColorPicker.vue"
export default {
  name: "LabelMarkersConfig",
  components: {
    ColorSelector
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
      wrapperSpan: 18,
      anchorOptions: [
        { label: '左上', value: 'top-left' },
        { label: '左中', value: 'middle-left' },
        { label: '左下', value: 'bottom-left' },
        { label: '中上', value: 'top-center' },
        { label: '中央', value: 'center' },
        { label: '中下', value: 'bottom-center' },
        { label: '右上', value: 'top-right' },
        { label: '右中', value: 'middle-right' },
        { label: '右下', value: 'bottom-right' }
      ],
      directionOptions: [
        { label: '顶部', value: 'top' },
        { label: '右侧', value: 'right' },
        { label: '底部', value: 'bottom' },
        { label: '左侧', value: 'left' },
        { label: '中心', value: 'center' }
      ]
    }
  },
  methods: {
    add () {
      const item = {
        visible: true,
        position: this.model.map.center,
        zIndex: 12,
        offset: [0, 0],
        text: 'Hi！',
        draggable: false,
        cursor: 'pointer',
        angle: 0,
        title: '',
        textStyle: {
          color: '#000000',
          backgroundColor: '#ffffff'
        }
      }
      this.model.textMarkers.push(item)
    },
    remove (index) {
      this.model.textMarkers.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.card {
  margin: 5px 5px 10px 0;
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
