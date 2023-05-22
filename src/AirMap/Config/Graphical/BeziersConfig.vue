<template>
  <div>
    <a-collapse ghost>
      <a-collapse-panel key="1" header="贝塞尔曲线">
        <p>贝塞尔曲线，<a href="https://lbs.amap.com/api/javascript-api-v2/documentation#beziercurve">https://lbs.amap.com/api/javascript-api-v2/documentation#beziercurve</a></p>
      </a-collapse-panel>
    </a-collapse>
    <a-card class="card" v-for="(item, index) in model.beziers" :key="index">
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
            <template #title>当前是否可编辑，编辑完成后会自动同步更新节点</template>
            <div class="label">编辑节点</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.editable" checked-children="是" un-checked-children="否" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>设置折线是否可拖拽移动，默认为false</template>
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
            <template #title>折线节点坐标polyline路径数组</template>
            <div class="label"><a href="https://lbs.amap.com/api/javascript-api-v2/documentation#beziercurve" target="_blank">节点</a></div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <template v-for="(it, id) in item.path" :key="id">
            <template v-for="(itm, idx) in it" :key="idx">
              <a-input-group compact class="margin-top" style="width: 90%;display: inline-block;">
                <a-input-number v-model:value="itm[0]" style="width: 50%" />
                <a-input-number v-model:value="itm[1]" style="width: 50%" />
              </a-input-group>
              <span v-if="(id > 1 && id < item.path.length-1) && idx === 0" class="point-remove" @click="removePoint(index, id)"><close-circle-outlined/></span>
            </template>
            <a-divider style="margin: 10px 0 0 0 ;" />
          </template>
          <a-button type="link" @click="addPoint(index)">
            <template #icon><plus-outlined /></template>添加线端
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
            <template #title>线条是否带描边，默认false</template>
            <div class="label">线条描边</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.isOutline" checked-children="显示" un-checked-children="隐藏" />
        </a-col>
      </a-row>
      <a-row class="margin-top" v-if="item.isOutline">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>描边线宽度</template>
            <div class="label">描边宽度</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-input-number v-model:value="item.borderWeight" :min="0" :max="1024" style="width: 100%" />
        </a-col>
      </a-row>
      <a-row class="margin-top" v-if="item.isOutline">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>线条描边颜色，此项仅在isOutline为true时有效，默认：#000000</template>
            <div class="label">描边颜色</div>
          </a-tooltip>
        </a-col>
        <a-col :span="14" class="label">{{ item.outlineColor }}</a-col>
        <a-col :span="3">
          <color-selector v-model:value="item.outlineColor" size="small"></color-selector>
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
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>折线拐点的绘制样式，默认值为'miter'尖角，其他可选值：'round'圆角、'bevel'斜角</template>
            <div class="label">拐点样式</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="item.lineJoin">
            <a-radio-button :value="'miter'">尖角</a-radio-button>
            <a-radio-button :value="'round'">圆角</a-radio-button>
            <a-radio-button :value="'bevel'">斜角</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>折线两端线帽的绘制样式，默认值为'butt'无头，其他可选值：'round'圆头、'square'方头</template>
            <div class="label">端点样式</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="item.lineCap">
            <a-radio-button :value="'butt'">无头</a-radio-button>
            <a-radio-button :value="'round'">圆头</a-radio-button>
            <a-radio-button :value="'square'">方头</a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>是否绘制大地线，默认false</template>
            <div class="label">大地线</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.geodesic" checked-children="显示" un-checked-children="隐藏" />
        </a-col>
      </a-row>
      <a-row class="margin-top">
        <a-col :span="labelSpan">
          <a-tooltip>
            <template #title>是否延路径显示白色方向箭头,默认false。建议折线宽度大于6时使用</template>
            <div class="label">路径箭头</div>
          </a-tooltip>
        </a-col>
        <a-col :span="wrapperSpan">
          <a-switch v-model:checked="item.showDir" checked-children="显示" un-checked-children="隐藏" />
        </a-col>
      </a-row>
    </a-card>
    <div>
      <a-row>
        <a-col :span="6"></a-col>
        <a-col :span="6">
          <a-button type="link" @click="add">
            <template #icon><plus-outlined /></template>添加贝塞尔曲线
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
  name: "BeziersConfig",
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
        [ this.model.map.center ],
        [ [this.model.map.center[0]-0.006, this.model.map.center[1]], [this.model.map.center[0]-0.002, this.model.map.center[1]+0.003] ],
        [ [this.model.map.center[0]-0.005, this.model.map.center[1]+0.004], [this.model.map.center[0], this.model.map.center[1]+0.005] ],
        [ [this.model.map.center[0]+0.002, this.model.map.center[1]+0.008], [this.model.map.center[0]+0.005, this.model.map.center[1]+0.003] ],
      ]
      const item = {
        visible: true,
        draggable: false,
        path: path,
        editable: false,
        zIndex: 10,
        strokeColor: '#006600',
        strokeOpacity: 0.9,
        strokeWeight: 3,
        borderWeight: 1,
        isOutline: false,
        outlineColor: '#000000',
        strokeStyle: 'solid',
        strokeDasharray: [0, 0, 0],
        lineJoin: 'miter',
        lineCap: 'butt',
        geodesic: false,
        showDir: false
      }
      this.model.beziers.push(item)
    },
    remove (index) {
      this.model.beziers.splice(index, 1)
    },
    addPoint (index) {
      const path = this.model.beziers[index].path
      const lastIndex = path.length - 1
      let lastNode = lastIndex - 1
      if (lastNode === 0) lastNode = 1
      const item = [
        [path[lastNode][0][0], path[lastNode][0][1] + 0.005],
        [path[lastNode][1][0], path[lastNode][1][1] + 0.005],
      ]
      this.model.beziers[index].path.splice(lastIndex, 0, item)
    },
    removePoint (index, idx) {
      this.model.beziers[index].path.splice(idx, 1)
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
