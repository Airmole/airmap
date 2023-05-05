<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="多边形">
        <p>提供在地图图面绘制多边形的能力。可以为多边形设置填充颜色、描边颜色、轮廓线样式等属性。</p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.polygons" :key="index">
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
            <template #title>多边形当前是否可编辑，编辑完成后会自动同步更新顶点</template>
            <div class="label">编辑顶点</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.editable" checked-children="是" un-checked-children="否" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>设置多边形是否可拖拽移动，默认为false</template>
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
            <template #title>多边形轮廓线的节点坐标数组。 支持 单个普通多边形({Array })</template>
            <div class="label">顶点</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <template v-for="(itm, idx) in item.path" :key="idx">
            <a-input-group compact class="margin-top" style="width: 90%;display: inline-block;">
              <a-input-number v-model:value="itm[0]" style="width: 50%" />
              <a-input-number v-model:value="itm[1]" style="width: 50%" />
            </a-input-group>
            <span v-if="idx > 1" class="point-remove" @click="removePoint(index, idx)"><close-circle-outlined/></span>
          </template>
          <a-button type="link" @click="addPoint(index)">
            <template #icon><plus-outlined /></template>添加顶点
          </a-button>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>多边形覆盖物的叠加顺序。地图上存在多个多边形覆盖物叠加时，通过该属性使级别较高的多边形覆盖物在上层显示默认zIndex：10</template>
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
            <template #title>使用16进制颜色代码赋值。默认值为#00D3FC</template>
            <div class="label">边线颜色</div>
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
            <template #title>轮廓线宽度</template>
            <div class="label">边线宽度</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-number v-model:value="item.strokeWeight" :min="1" :max="1024" style="width: 100%" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>多边形填充颜色，使用16进制颜色代码赋值，如：#00B2D5</template>
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
            <template #title>多边形填充透明度，取值范围[0,1]，0表示完全透明，1表示不透明。默认为0.9</template>
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
            <template #icon><plus-outlined /></template>添加多边形
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
  name: "PolygonsConfig",
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
      const path = [
        this.model.map.center,
        [ this.model.map.center[0]+0.005, this.model.map.center[1] ],
        [ this.model.map.center[0], this.model.map.center[1]+0.005 ]
      ]
      const item = {
        visible: true,
        path: path,
        editable: false,
        zIndex: 10,
        strokeColor: '#00D3FC',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#00B2D5',
        fillOpacity: 0.9,
        strokeStyle: 'solid',
        strokeDasharray: [0, 0, 0],
        draggable: false
      }
      this.model.polygons.push(item)
    },
    remove (index) {
      this.model.polygons.splice(index, 1)
    },
    addPoint (index) {
      const lastIndex = this.model.polygons[index].path.length - 1
      const point = [
        this.model.polygons[index].path[lastIndex][0] - 0.005,
        this.model.polygons[index].path[lastIndex][1] - 0.005
      ]
      this.model.polygons[index].path.push(point)
    },
    removePoint (index, idx) {
      this.model.polygons[index].path.splice(idx, 1)
    }
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
.point-remove {
  margin-left: 5px;
}
</style>
