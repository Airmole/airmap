<template>
  <div>
    <h4>测算工具</h4>
    <a-row class="margin-top">
      <a-col :span="6">
        <a-button type="link" @click="measure('rule')">距离测量</a-button>
      </a-col>
      <a-col :span="6">
        <a-button type="link" @click="measure('measureArea')">面积测算</a-button>
      </a-col>
      <a-col :span="6">
        <a-button :disabled="!mouseTool" type="link" @click="measureEnd">结束测算</a-button>
      </a-col>
      <a-col :span="6">
        <a-button type="link" @click="measureClear">全部清除</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "MeasureTool",
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
      mouseTool: null,
    }
  },
  methods: {
    measure(type = 'rule') {
      var map = this.map
      var _this = this
      if (_this.mouseTool === null) {
        map.plugin('AMap.MouseTool', function () {
          _this.mouseTool = new AMap.MouseTool(map)
          _this.measureSwitch(type)
        })
      } else {
        _this.measureSwitch(type)
      }
    },
    measureSwitch (type) {
      switch (type) {
        case 'rule': {
          this.mouseTool.rule()
          break;
        }
        case 'measureArea': {
          this.mouseTool.measureArea()
          break;
        }
      }
    },
    measureEnd() {
      this.mouseTool.close(false)
      this.mouseTool = null
    },
    measureClear() {
      if (this.mouseTool === null) {
        this.measure()
        this.measureEnd()
      } else {
        this.mouseTool.close(true)
      }
      this.model.map.render = false
      setTimeout(() => { this.model.map.render = true }, 1000) // 1秒后重新渲染地图实例
    }
  }
}
</script>

<style scoped>

</style>
