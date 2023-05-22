<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="椭圆">
        <p>在地图图面绘制椭圆形覆盖物的能力。可以为椭圆形覆盖物设置填充颜色、描边颜色、轮廓线样式等属性。</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.ellipses" :key="index">
      <close-circle-outlined class="show-circle" @click="remove(index)"/>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>是否可见，默认为true。</template>
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
            <template #title>圆心标记在地图上显示的位置</template>
            <div class="label">坐标</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input v-model:value="item.center[0]" style="width: 50%" />
            <a-input v-model:value="item.center[1]" style="width: 50%" />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>半径否可编辑，编辑完成后会自动同步更新半径</template>
            <div class="label">编辑半径</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.editable" checked-children="是" un-checked-children="否" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>设置圆形是否可拖拽移动，默认为false</template>
            <div class="label">可拖动</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.draggable" checked-children="是" un-checked-children="否" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>圆形半径，单位:米</template>
            <div class="label">半径</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input-number v-model:value="item.radius[0]" :min="1" :max="99999" style="width: 50%" />
            <a-input-number v-model:value="item.radius[1]" :min="1" :max="99999" style="width: 50%" />
          </a-input-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>覆盖物的叠加顺序。地图上存在多个多边形覆盖物叠加时，通过该属性使级别较高的多边形覆盖物在上层显示默认zIndex：10</template>
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
            <template #title>线条颜色，使用16进制颜色代码赋值。默认值为#00D3FC</template>
            <div class="label">线条颜色</div>
          </a-tooltip>
        </a-col>
        <a-col :span="14" class="label">{{ item.strokeColor }}</a-col>
        <a-col :span="3">
          <color-selector v-model:value="item.strokeColor" size="small"></color-selector>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>轮廓线透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9</template>
            <div class="label">边线透明</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-slider v-model:value="item.strokeOpacity" :min="0" :max="1" :step="0.01"/>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>线条宽度</template>
            <div class="label">线条宽度</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-number v-model:value="item.strokeWeight" :min="0" :max="1024" style="width: 100%" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>圆形填充颜色，使用16进制颜色代码赋值，如：#00B2D5</template>
            <div class="label">填充颜色</div>
          </a-tooltip>
        </a-col>
        <a-col :span="14" class="label">{{ item.fillColor }}</a-col>
        <a-col :span="3">
          <color-selector v-model:value="item.fillColor" size="small"></color-selector>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9</template>
            <div class="label">填充透明</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-slider v-model:value="item.fillOpacity" :min="0" :max="1" :step="0.01"/>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>轮廓线样式，实线:solid，虚线:dashed</template>
            <div class="label">轮廓线</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="item.strokeStyle">
            <a-radio-button value="solid">实线</a-radio-button>
            <a-radio-button value="dashed">虚线</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="margin-top" v-if="item.strokeStyle === 'dashed'">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效， 此属性在ie9+浏览器有效 取值： 实线： [0,0,0] 虚线： [10,10] ， [10,10] 表示10个像素的实线和10个像素的空白（如此反复）组成的虚线 点画线： [10,2,10] ， [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实线和10个像素的空白 （如此反复）组成的虚线</template>
            <div class="label">虚线间隙</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-group compact>
            <a-input-number v-model:value="item.strokeDasharray[0]" style="width: 33%" />
            <a-input-number v-model:value="item.strokeDasharray[1]" style="width: 33%" />
            <a-input-number v-model:value="item.strokeDasharray[2]" style="width: 33%" />
          </a-input-group>
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="6">
          <a-button type="link" @click="add">
            <template #icon><plus-outlined /></template>添加椭圆
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
  name: "EllipsesConfig",
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
      wrapperSpan: 18
    }
  },
  methods: {
    add () {
      const item = {
        center: this.model.map.center,
        radius: [100, 80],
        visible: true,
        draggable: false,
        editable: false,
        zIndex: 10,
        strokeColor: '#006600',
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillColor: '#00B2D5',
        fillOpacity: 0.9,
        strokeStyle: 'solid',
        strokeDasharray: [0, 0, 0]
      }
      this.model.ellipses.push(item)
    },
    remove (index) {
      this.model.ellipses.splice(index, 1)
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
.point-remove {
  margin-left: 5px;
}
</style>
