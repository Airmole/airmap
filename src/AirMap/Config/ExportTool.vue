<template>
  <div>
    <h4>导入导出</h4>
    <a-row class="margin-top">
      <a-col :span="8">
        <a-button type="link" @click="preview"><template #icon><picture-outlined /></template>生成图片</a-button>
      </a-col>
      <a-col :span="8">
        <a-popconfirm
            title="确认下载保存当前地图标注图嘛?"
            ok-text="确认保存"
            cancel-text="取消"
            @confirm="saveImage"
        >
          <a-button type="link"><template #icon><download-outlined /></template>保存图片</a-button>
        </a-popconfirm>
      </a-col>
      <a-col :span="8">
        <a-popconfirm
            title="确认下载保存当前标注参数JSON文件?"
            ok-text="确认保存"
            cancel-text="取消"
            @confirm="saveJson"
        >
          <a-button type="link"><template #icon><export-outlined /></template>导出参数</a-button>
        </a-popconfirm>
      </a-col>
    </a-row>
    <!--图片预览模态框-->
    <a-modal v-model:visible="previewModal" title="图片预览" :footer="null" :width="'848px'">
      <template v-if="previewImage"><a-image :width="'800px'" :src="previewImage"/></template>
      <template v-else><picture-outlined /></template>
    </a-modal>
  </div>
</template>

<script>
import {Screenshot} from "@amap/screenshot/dist"
import { time } from "@/utils/time"
import {
  PictureOutlined,
  DownloadOutlined,
  ExportOutlined
} from "@ant-design/icons-vue"

export default {
  name: "ExportTool",
  components: {
    PictureOutlined,
    DownloadOutlined,
    ExportOutlined
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
  data () {
    return {
      previewModal: false,
      previewImage: null
    }
  },
  methods: {
    preview () {
      const screenshot = new Screenshot(this.map)
      screenshot.toDataURL().then(url => {
        this.previewImage = url
        this.previewModal = true
      })
    },
    saveImage () {
      const screenshot = new Screenshot(this.map)
      const filename = `Airmap_${time.timeStringFilename()}.jpg`
      screenshot.download({
        type: 'image/jpeg',
        filename: filename
      }).then(() => {
        this.$message.success('下载成功')
      }).catch((error) => {
        console.log(error)
      })
    },
    saveJson () {
      const text = JSON.stringify(this.model)
      console.log('text', text)
      const filename = `Airmap_${time.timeStringFilename()}.json`
      const blob = new Blob([text], { type: 'text/plain' })
      const href = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = href
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(href)
    }
  }
}
</script>

<style scoped>

</style>
