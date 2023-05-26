<template>
  <div>
    <a-row class="margin-top">
      <a-col :span="12"><h4>测算工具</h4></a-col>
      <a-col :span="12">
        <div style="float: right;">
          <a-badge :color="mouseTool ? 'red' : 'green'" :text="mouseTool ? '已启用' : '未启用'" />
          <template v-if="type"> - {{ type === 'rule' ? '距离' : '面积' }}测算中...</template>
        </div>
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="8">
        <a-button type="link" @click="measure('rule')">
          <template #icon><expand-alt-outlined /></template> 距离测量
        </a-button>
      </a-col>
      <a-col :span="8">
        <a-button type="link" @click="measure('measureArea')">
          <template #icon><gateway-outlined /></template> 面积测算
        </a-button>
      </a-col>
      <a-col :span="8">
        <a-button :disabled="!mouseTool" type="link" @click="measureEnd">
          <template #icon><stop-outlined /></template>结束测算
        </a-button>
      </a-col>
      <a-col :span="8">
        <a-button type="link" @click="ruleStyleModal = true">
          <template #icon><highlight-outlined /></template> 距离样式
        </a-button>
      </a-col>
      <a-col :span="8">
        <a-button type="link" @click="areaStyleModal = true">
          <template #icon><bg-colors-outlined /></template> 面积样式
        </a-button>
      </a-col>
      <a-col :span="8">
        <a-popconfirm
            title="确认清除所有测算标注嘛?"
            ok-text="确认清除"
            cancel-text="取消"
            @confirm="measureClear"
        >
          <a-button type="link"><template #icon><clear-outlined /></template>清除所有</a-button>
        </a-popconfirm>
      </a-col>
    </a-row>
    <!--测距样式modal-->
    <a-modal v-model:visible="ruleStyleModal" title="测距样式设定" @cancel="styleChangeCancel('rule')">
      <a-row class="margin-top">
        <a-col :span="labelSpan">样式</a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="ruleStyle" :options="ruleStyleOptions" />
        </a-col>
      </a-row>
    </a-modal>
    <!--面积测算样式modal-->
    <a-modal v-model:visible="areaStyleModal" title="面积测算样式设定" @cancel="styleChangeCancel('measureArea')">
      <a-row class="margin-top">
        <a-col :span="labelSpan">样式</a-col>
        <a-col :span="wrapperSpan">
          <a-radio-group v-model:value="areaStyle" :options="areaStyleOptions" />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import {
  ExpandAltOutlined,
  GatewayOutlined,
  StopOutlined,
  ClearOutlined,
  HighlightOutlined,
  BgColorsOutlined
} from "@ant-design/icons-vue"

export default {
  name: "MeasureTool",
  components: {
    ExpandAltOutlined,
    GatewayOutlined,
    StopOutlined,
    ClearOutlined,
    HighlightOutlined,
    BgColorsOutlined
  },
  props: {
    map: {
      type: [Object, null],
      required: true
    },
    model: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {
      labelSpan: 6,
      wrapperSpan: 18,
      mouseTool: null,
      type: '',
      ruleStyleModal: false,
      ruleStyle: 1,
      ruleStyleOptions: [
        { label: '默认样式', value: 0 },
        { label: '标注点样式', value: 1 },
        { label: '自定义样式', value: 2 }
      ],
      // 自定义测距样式
      ruleMarkerStyle: {
        start: {
          icon: {
            size: [19, 31],
            imageSize: [19, 31],
            image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
          },
          offset: [-9, -31]
        },
        end: {
          icon: {
            size: [19, 31],
            imageSize: [19, 31],
            image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
          },
          offset: [-9, -31]
        },
        mid: {
          icon: {
            size: [19, 31],
            imageSize: [19, 31],
            image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
          },
          offset: [-9, -31]
        },
        line: {
          strokeStyle: "solid",
          strokeColor: "#FF33FF",
          strokeOpacity: 1,
          strokeWeight: 2
        }
      },
      ruleCustomStyle: null,
      areaStyleModal: false,
      areaStyle: 1,
      areaStyleOptions: [
        { label: '默认样式', value: 0 },
        { label: 'demo样式', value: 1 },
        { label: '自定义样式', value: 2 }
      ],
      areaDemoStyle: {
        strokeColor: '#80d8ff',
        fillColor: '#80d8ff',
        fillOpacity: 0.3
      },
      areaCustomStyle: null
    }
  },
  methods: {
    measure (type = 'rule') {
      var map = this.map
      var _this = this
      _this.type = type
      if (_this.mouseTool !== null) {
        _this.measureHandle(type)
      } else {
        map.plugin('AMap.MouseTool', function () {
          _this.mouseTool = new AMap.MouseTool(map)
          _this.measureHandle(type)
        })
      }
    },
    measureHandle (type) {
      let ruleStyle = null
      let areaStyle = null
      // 测距
      if (type === 'rule') {
        if (this.ruleStyle === 0) ruleStyle = null
        if (this.ruleStyle === 1) ruleStyle = this.ruleMarkerStyle
        if (this.ruleStyle === 2) ruleStyle = this.ruleCustomStyle
        if (ruleStyle !== null) ruleStyle = this.formatRuleOptions(ruleStyle)
        this.mouseTool.rule(ruleStyle)
      }
      // 面积测算
      if (type === 'measureArea') {
        if (this.areaStyle === 0) areaStyle = null
        if (this.areaStyle === 1) areaStyle = this.areaDemoStyle
        if (this.areaStyle === 2) areaStyle = this.areaCustomStyle
        if (areaStyle !== null) areaStyle = this.formatAreaOptions(areaStyle)
        this.mouseTool.measureArea(areaStyle)
      }
    },
    formatAreaOptions (areaStyle) {
      // 同 Polygon 的 Option 设置（https://lbs.amap.com/api/javascript-api-v2/documentation#polygon）
      return {
        strokeColor: areaStyle.strokeColor,
        fillColor: areaStyle.fillColor,
        fillOpacity: areaStyle.fillOpacity
      }
    },
    formatRuleOptions (ruleStyle) {
      if (ruleStyle === null) return
      // 同 RangingTool 的 自定义 设置（https://lbs.amap.com/api/javascript-api-v2/documentation#rangingtool）
      return {
        startMarkerOptions: {
          icon: new AMap.Icon({
            size: ruleStyle.start.icon.size,
            imageSize: ruleStyle.start.icon.imageSize,
            image: ruleStyle.start.icon.image,
          }),
          offset: ruleStyle.start.offset,
        },
        endMarkerOptions: {
          icon: new AMap.Icon({
            size: ruleStyle.end.icon.size,
            imageSize: ruleStyle.end.icon.imageSize,
            image: ruleStyle.end.icon.image,
          }),
          offset: ruleStyle.end.offset,
        },
        midMarkerOptions: {
          icon: new AMap.Icon({
            size: ruleStyle.mid.icon.size,
            imageSize: ruleStyle.mid.icon.imageSize,
            image: ruleStyle.mid.icon.image,
          }),
          offset: ruleStyle.mid.offset,
        },
        lineOptions : ruleStyle.line
      }
    },
    measureEnd () {
      if (this.mouseTool === null) return
      this.mouseTool.close(false)
      this.type = ''
      this.mouseTool = null
    },
    measureClear () {
      if (this.mouseTool === null) {
        this.measure()
        this.measureEnd()
      } else {
        this.type = ''
        this.mouseTool.close(true)
      }
      this.mouseTool = null
      this.model.map.render = false
      setTimeout(() => { this.model.map.render = true }, 200) // 200毫秒后重新渲染地图实例
    },
    styleChangeCancel (type) {
      this.measureEnd()
      this.measure(type)
    }
  }
}
</script>

<style scoped>

</style>
