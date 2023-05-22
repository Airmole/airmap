<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="标签标注点">
        <p>当需要在地图添加千级以上的点标记时，LabelMarker 是代替 Marker 的更好选择。不同于 Markers ，LabelMarker 不仅可以绘制图标，还可以为图标添加文字信息，且万级以上数据也具有较好性能，配置也更加灵活。
          另外，LabelMarker 之间还支持避让功能，JSAPI 2.0 版本还支持地图标注避让 LabelMarker，可以让您的 marker 更加明显。</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.labelMarkers" :key="index">
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
            <template #title>点标记显示的层级范围，超过范围不显示。默认值：zooms: [2, 20]</template>
            <div class="label">展示范围</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input
                v-model:value="item.zooms[0]"
                style="width: 33%; text-align: center"
                placeholder="Minimum"
            />
            <a-input
                style="width: 33%; border-left: 0; pointer-events: none; background-color: #fff; text-align: center"
                placeholder="~"
                disabled
            />
            <a-input
                v-model:value="item.zooms[1]"
                style="width: 33%; text-align: center; border-left: 0"
                placeholder="Maximum"
            />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>图标URL</template>
            <div class="label">icon</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input v-model:value="item.icon.image"/>
        </a-col>
      </a-row>
      <template v-if="item.icon.image">
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>图标大小</template>
              <div class="label">图标大小</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-group compact>
              <a-input-number v-model:value="item.icon.size[0]" style="width: 50%" />
              <a-input-number v-model:value="item.icon.size[1]" style="width: 50%" />
            </a-input-group>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>图标所在图片偏移位置</template>
              <div class="label">图标偏移</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-group compact>
              <a-input-number v-model:value="item.icon.clipOrigin[0]" style="width: 50%" />
              <a-input-number v-model:value="item.icon.clipOrigin[1]" style="width: 50%" />
            </a-input-group>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>图标所在图片裁剪大小，若未设置，则使用图片大小</template>
              <div class="label">图片裁剪</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-group compact>
              <a-input-number v-model:value="item.icon.clipSize[0]" style="width: 50%" />
              <a-input-number v-model:value="item.icon.clipSize[1]" style="width: 50%" />
            </a-input-group>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>图标锚点，锚点位置对应设置的 position 位置。</template>
              <div class="label">图标锚点</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-select v-model:value="item.icon.anchor" style="width: 100%" :options="anchorOptions"></a-select>
          </a-col>
        </a-row>
      </template>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>文本标注的内容，该属性为直接显示在标注旁的文本内容。</template>
            <div class="label">标注文本</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input v-model:value="item.text.content"/>
        </a-col>
      </a-row>
      <template v-if="item.text.content">
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>文本标注方位。若设置了 icon，则 direction 是以 icon 为中心的偏移，若未设置 icon，则相对 position 偏移。</template>
              <div class="label">标注方位</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-select v-model:value="item.text.direction" style="width: 100%" :options="directionOptions"></a-select>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>偏移量，在 direction 基础上的偏移。</template>
              <div class="label">偏移量</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-group compact>
              <a-input-number v-model:value="item.text.offset[0]" style="width: 50%" />
              <a-input-number v-model:value="item.text.offset[1]" style="width: 50%" />
            </a-input-group>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>文字大小，默认值： 12</template>
              <div class="label">文字大小</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-number v-model:value="item.text.style.fontSize" :min="1" :max="1024" style="width: 100%" />
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="7">
            <a-tooltip>
              <template #title>文字颜色</template>
              <div class="label">文字颜色</div>
            </a-tooltip>
          </a-col>
          <a-col :span="14" class="label">{{ item.text.style.fillColor }}</a-col>
          <a-col :span="3">
            <color-selector v-model:value="item.text.style.fillColor" size="small"></color-selector>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="7">
            <a-tooltip>
              <template #title>文字描边颜色</template>
              <div class="label">文字描边</div>
            </a-tooltip>
          </a-col>
          <a-col :span="14" class="label">{{ item.text.style.strokeColor }}</a-col>
          <a-col :span="3">
            <color-selector v-model:value="item.text.style.strokeColor" size="small"></color-selector>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>文字 padding。默认值： [3, 3, 3, 3]</template>
              <div class="label">文字边距</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-group compact>
              <a-input-number v-model:value="item.text.style.padding[0]" style="width: 25%" />
              <a-input-number v-model:value="item.text.style.padding[1]" style="width: 25%" />
              <a-input-number v-model:value="item.text.style.padding[2]" style="width: 25%" />
              <a-input-number v-model:value="item.text.style.padding[3]" style="width: 25%" />
            </a-input-group>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="7">
            <a-tooltip>
              <template #title>文字背景颜色</template>
              <div class="label">背景色</div>
            </a-tooltip>
          </a-col>
          <a-col :span="14" class="label">{{ item.text.style.backgroundColor }}</a-col>
          <a-col :span="3">
            <color-selector v-model:value="item.text.style.backgroundColor" size="small"></color-selector>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="7">
            <a-tooltip>
              <template #title>文字背景描边颜色</template>
              <div class="label">背景描边</div>
            </a-tooltip>
          </a-col>
          <a-col :span="14" class="label">{{ item.text.style.borderColor }}</a-col>
          <a-col :span="3">
            <color-selector v-model:value="item.text.style.borderColor" size="small"></color-selector>
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="labelSpan">
            <a-tooltip>
              <template #title>文字背景描边粗细</template>
              <div class="label">背景描边</div>
            </a-tooltip>
          </a-col>
          <a-col :span="wrapperSpan">
            <a-input-number v-model:value="item.text.style.borderWidth" :min="0" style="width: 100%" />
          </a-col>
        </a-row>
        <a-row class="margin-top">
          <a-col :span="7">
            <a-tooltip>
              <template #title>文字是否折行（6个字一折行）</template>
              <div class="label">文字换行</div>
            </a-tooltip>
          </a-col>
          <a-col :span="16">
            <a-switch v-model:checked="item.text.style.fold" checked-children="是" un-checked-children="否" />
          </a-col>
        </a-row>
      </template>
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
import ColorSelector from "../../../components/V3ColorPicker/V3ColorPicker.vue"
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
        zooms: [2, 20],
        icon: {
          image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
          anchor: 'bottom-center',
          size: [25, 34],
          clipOrigin: [459, 92],
          clipSize: [50, 68]
        },
        text: {
          content: '',
          direction: 'right',
          offset: [0, 0],
          style: {
            fontSize: 12,
            fillColor: '#000000',
            strokeColor: '#ffffff',
            padding: [3, 3, 3, 3],
            backgroundColor: 'rgba(255,255,255,0)',
            borderColor: 'rgba(255,255,255,0)',
            borderWidth: 0,
            fold: false
          }
        }
      }
      this.model.labelMarkers.push(item)
    },
    remove (index) {
      this.model.labelMarkers.splice(index, 1)
    },
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
