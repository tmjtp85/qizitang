<template>
  <div class="page print-page">
    <h2 class="page-title">生字卡片打印</h2>

    <div class="print-controls card">
      <div class="control-section">
        <h4>打印范围</h4>
        <div class="checkbox-group">
          <label v-for="opt in scopeOptions" :key="opt.value" class="ck-label">
            <input type="checkbox" v-model="scope" :value="opt.value" />
            {{ opt.label }}
          </label>
        </div>
      </div>

      <div class="control-section">
        <h4>卡片版式</h4>
        <a-radio-group v-model="layout" type="button">
          <a-radio value="tian">田字格练字卡</a-radio>
          <a-radio value="pinyin">拼音四线三格卡</a-radio>
        </a-radio-group>
      </div>

      <button class="btn-guo primary" @click="generatePreview">预览卡片</button>
      <button class="btn-guo" @click="doPrint" style="margin-left:12px">🖨️ 开始打印</button>
    </div>

    <div class="preview-area" ref="previewRef" v-if="previewChars.length > 0">
      <div class="print-card" :class="layout" v-for="ch in previewChars" :key="ch.id">
        <div class="pc-tian" v-if="layout === 'tian'">
          <div class="tian-grid">
            <div class="tian-char">{{ ch.char }}</div>
          </div>
          <div class="pc-pinyin">{{ ch.pinyin }}</div>
        </div>
        <div class="pc-pinyin-card" v-else>
          <div class="four-line">
            <span class="pl-pinyin">{{ ch.pinyin }}</span>
          </div>
          <div class="pl-char">{{ ch.char }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { charAPI } from '../api'

const scope = ref(['preschool', 'grade1_up', 'grade1_down'])
const layout = ref('tian')
const previewChars = ref([])
const previewRef = ref(null)

const scopeOptions = [
  { value: 'preschool', label: '衔接生字' },
  { value: 'grade1_up', label: '一年级上册' },
  { value: 'grade1_down', label: '一年级下册' }
]

async function generatePreview() {
  let all = []
  for (const cat of scope.value) {
    const res = await charAPI.list({ category: cat, limit: 100 })
    all = all.concat(res.data || [])
  }
  previewChars.value = all.slice(0, 30)
}

function doPrint() {
  window.print()
}
</script>

<style scoped>
.page-title { text-align: center; margin-bottom: 16px; }
.print-controls { max-width: 600px; margin: 0 auto 20px; }
.control-section { margin-bottom: 16px; }
.control-section h4 { font-size: 0.95rem; color: var(--ink-light); margin-bottom: 8px; }
.checkbox-group { display: flex; gap: 16px; flex-wrap: wrap; }
.ck-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.9rem; }

.preview-area {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}
.print-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  break-inside: avoid;
  page-break-inside: avoid;
}
.tian-grid {
  width: 80px;
  height: 80px;
  margin: 0 auto 8px;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.tian-grid::before, .tian-grid::after {
  content: '';
  position: absolute;
  background: #ccc;
}
.tian-grid::before { width: 1px; height: 100%; left: 50%; top: 0; }
.tian-grid::after { width: 100%; height: 1px; left: 0; top: 50%; }
.tian-char { font-size: 2.4rem; font-family: 'Noto Serif SC', serif; z-index: 1; background: white; line-height: 1; }
.pc-pinyin { font-size: 0.85rem; color: var(--red); }
.pc-pinyin-card .four-line {
  position: relative;
  height: 40px;
  border-bottom: 1px solid #333;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.pl-pinyin { font-size: 1rem; color: var(--red); }
.pl-char { font-size: 2rem; font-family: 'Noto Serif SC', serif; }

@media print {
  .top-bar, .back-home, .print-controls, .page-title { display: none !important; }
  .preview-area { max-width: 100%; }
  .print-card { border: 1px solid #999; }
}
</style>
