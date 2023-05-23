<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="信息窗体标注">
        <p>用于在地图上展示复杂的说明性信息的类型。 信息窗体，地图仅可同时展示一个信息窗体，推荐为信息窗体通过样式显示设置尺寸</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.infoWindows" :key="index">
      <close-circle-outlined class="show-circle" @click="remove(index)"/>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>信息窗体标记是否可见，默认为true。</template>
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
            <template #title>是否自定义窗体。设为true时，信息窗体外框及内容完全按照content所设的值添加（默认为false，即在系统默认的信息窗体外框中显示content内容）</template>
            <div class="label">自定义div</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.isCustom" checked-children="是" un-checked-children="否" @change="forceRenderMap()" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>是否自动调整窗体到视野内（当信息窗体超出视野范围时，通过该属性设置是否自动平移地图，使信息窗体完全显示）【但是测试好像没生效啊】</template>
            <div class="label">自动显示</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.autoMove" checked-children="是" un-checked-children="否" @change="forceRenderMap()" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>信息窗体标记在地图上显示的位置</template>
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
            <template #title>显示内容，可以是HTML要素字符串。</template>
            <div class="label">显示内容</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input v-model:value="item.content"/>
        </a-col>
      </a-row>
      <a-row class="margin-top" v-if="!item.isCustom">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>信息窗体尺寸（isCustom为true时，该属性无效）</template>
            <div class="label">窗体尺寸</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input-number v-model:value="item.size[0]" style="width: 50%" />
            <a-input-number v-model:value="item.size[1]" style="width: 50%" />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>信息窗体锚点。默认值：'bottom-center'。可选值：'top-left'</template>
            <div class="label">窗体锚点</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="item.anchor">
            <a-radio value="bottom-center">底部中央</a-radio>
            <a-radio value="top-left">顶部左侧</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="6">
          <a-button type="link" @click="add" :disabled="model.infoWindows.length > 0">
            <template #icon><plus-outlined /></template>添加信息窗标注
          </a-button>
        </a-col>
        <a-col :span="6"></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "LabelMarkersConfig",
  components: {},
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
        isCustom: false,
        autoMove: false,
        content: '<div style="color:red;">hello，我在这儿~</div>',
        size: [null, null],
        anchor: 'bottom-center'
      }
      this.model.infoWindows.push(item)
    },
    remove (index) {
      this.model.infoWindows.splice(index, 1)
    },
    forceRenderMap () {
      this.model.map.render = false
      setTimeout(() => { this.model.map.render = true }, 1000) // 1秒后重新渲染地图实例
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
