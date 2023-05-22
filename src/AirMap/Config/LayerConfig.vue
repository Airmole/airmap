<template>
  <div>
    <h4>图层配置</h4>
    <a-row class="margin-top">
      <a-col :span="6"><div class="label">实时交通</div></a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.layer.traffic.visible" checked-children="显示" un-checked-children="隐藏" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.traffic.visible">
      <a-col :span="6"><div class="label">透明度</div></a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.layer.traffic.opacity" :min="0" :max="1" :step="0.01"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.layer.traffic.opacity" :bordered="false" :min="0" :max="1" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.traffic.visible">
      <a-col :span="6"><div class="label">层级</div></a-col>
      <a-col :span="17">
        <a-input-number v-model:value="model.layer.traffic.zIndex" :min="-99999" :max="99999" class="width-full" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6"><div class="label">卫星图层</div></a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.layer.satellite.visible" checked-children="显示" un-checked-children="隐藏" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.satellite.visible">
      <a-col :span="6"><div class="label">透明度</div></a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.layer.satellite.opacity" :min="0" :max="1" :step="0.01"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.layer.satellite.opacity" :bordered="false" :min="0" :max="1" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.satellite.visible">
      <a-col :span="6"><div class="label">层级</div></a-col>
      <a-col :span="17">
        <a-input-number v-model:value="model.layer.satellite.zIndex" :min="-99999" :max="99999" class="width-full" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6"><div class="label">路网图层</div></a-col>
      <a-col :span="17">
        <a-switch v-model:checked="model.layer.roadnet.visible" checked-children="显示" un-checked-children="隐藏" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.roadnet.visible">
      <a-col :span="6"><div class="label">透明度</div></a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.layer.roadnet.opacity" :min="0" :max="1" :step="0.01"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.layer.roadnet.opacity" :bordered="false" :min="0" :max="1" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.roadnet.visible">
      <a-col :span="6"><div class="label">层级</div></a-col>
      <a-col :span="17">
        <a-input-number v-model:value="model.layer.roadnet.zIndex" :min="-99999" :max="99999" class="width-full" />
      </a-col>
    </a-row>
    <a-row class="margin-top">
      <a-col :span="6"><div class="label">行政区划</div></a-col>
      <a-col :span="17">
        <a-switch
            v-model:checked="model.layer.district.visible"
            checked-children="显示"
            un-checked-children="隐藏"
            @change="showDistrictChange"
        />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">地区编码</div></a-col>
      <a-col :span="16">
        <a-input v-model:value="model.layer.district.adcode" placeholder="请输入行政区编码" />
      </a-col>
      <a-col :span="2">
        <div class="margin-left label">
          <a-tooltip>
            <template #title>行政区的编码，点击查看【adcode与省市行政区对照表】</template>
            <a :href="citycodeFile" target="_blank"> <info-circle-outlined /></a>
          </a-tooltip>
        </div>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">透明度</div></a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.layer.district.opacity" :min="0" :max="1" :step="0.01"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.layer.district.opacity" :bordered="false" :min="0" :max="1" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">填充</div></a-col>
      <a-col :span="14" class="label">{{ model.layer.district.styles.fill }}</a-col>
      <a-col :span="3">
        <color-selector v-model:value="model.layer.district.styles.fill" size="small"></color-selector>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">描边线宽</div></a-col>
      <a-col :span="14">
        <a-slider v-model:value="model.layer.district.styles[`stroke-width`]" :min="0" :max="20" :step="0.1"/>
      </a-col>
      <a-col :span="3">
        <a-input-number v-model:value="model.layer.district.styles[`stroke-width`]" :bordered="false" :min="0" :max="20" :controls="false" />
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">城市界线</div></a-col>
      <a-col :span="14" class="label">{{ model.layer.district.styles[`city-stroke`] }}</a-col>
      <a-col :span="3">
        <color-selector v-model:value="model.layer.district.styles[`city-stroke`]" size="small"></color-selector>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">区县界线</div></a-col>
      <a-col :span="14" class="label">{{ model.layer.district.styles[`county-stroke`] }}</a-col>
      <a-col :span="3">
        <color-selector v-model:value="model.layer.district.styles[`county-stroke`]" size="small"></color-selector>
      </a-col>
    </a-row>
    <a-row class="margin-top" v-if="model.layer.district.visible">
      <a-col :span="6"><div class="label">层级</div></a-col>
      <a-col :span="17">
        <a-input-number v-model:value="model.layer.district.zIndex" :min="-99999" :max="99999" class="width-full" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ColorSelector from "../../components/V3ColorPicker/V3ColorPicker.vue"
import InfoCircleOutlined from "@ant-design/icons-vue"
export default {
  name: "LayerConfig",
  components: {
    ColorSelector,
    InfoCircleOutlined
  },
  props: {
    model: {
      type: [Object],
      required: true
    }
  },
  computed: {
    citycodeFile () {
      return this.officeViewer + encodeURIComponent(this.cityAdcodeUrl)
    }
  },
  data () {
    return {
      officeViewer: 'https://view.officeapps.live.com/op/view.aspx?src=',
      cityAdcodeUrl: 'https://github.com/jkiss/china-map-data/blob/master/AMap-adcode/AMap_adcode_citycode.xlsx?raw=true'
    }
  },
  methods: {
    showDistrictChange (e) {
      if (e) this.model.map.zoom = 11
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
.margin-left {
  margin-left: 10px;
}
.width-full {
  width: 100%;
}
</style>
