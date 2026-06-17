<template>
  <div class="page dashboard-page">
    <h2 class="page-title">家长数据统计</h2>

    <div class="summary-cards">
      <div class="summary-card card">
        <span class="sc-val">{{ summary.total_chars_learned || 0 }}</span>
        <span class="sc-label">累计识字</span>
      </div>
      <div class="summary-card card">
        <span class="sc-val">{{ formatTime(summary.total_study_seconds || 0) }}</span>
        <span class="sc-label">总学习时长</span>
      </div>
      <div class="summary-card card">
        <span class="sc-val">{{ summary.total_games || 0 }}</span>
        <span class="sc-label">闯关次数</span>
      </div>
      <div class="summary-card card">
        <span class="sc-val" style="color:var(--red)">{{ summary.total_wrong || 0 }}</span>
        <span class="sc-label">错题数量</span>
      </div>
    </div>

    <div class="chart-row">
      <div class="chart-box card">
        <h4>近7日识字量</h4>
        <div ref="charsChartRef" style="height:250px"></div>
      </div>
      <div class="chart-box card">
        <h4>每日学习时长</h4>
        <div ref="timeChartRef" style="height:250px"></div>
      </div>
    </div>

    <div class="wrong-rank card">
      <h4>高频错题 TOP20</h4>
      <div class="rank-list" v-if="wrongTop.length > 0">
        <div class="rank-item" v-for="(item, idx) in wrongTop" :key="idx">
          <span class="rank-num">{{ idx + 1 }}</span>
          <span class="rank-char">{{ item.char }}</span>
          <span class="rank-pinyin">{{ item.pinyin }}</span>
          <span class="rank-count">{{ item.error_count }}次</span>
        </div>
      </div>
      <div v-else class="empty-box">暂无错题记录</div>
    </div>

    <button class="btn-guo primary" @click="exportReport" style="display:block;margin:20px auto">
      📄 导出周报
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useAppStore } from '../store/app'
import { statsAPI } from '../api'
import * as echarts from 'echarts'

const app = useAppStore()
const summary = ref({})
const dailyData = ref([])
const wrongTop = ref([])
const charsChartRef = ref(null)
const timeChartRef = ref(null)

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h${m}m`
  return `${m}分`
}

async function loadData() {
  if (!app.deviceId) return
  const [sumRes, dailyRes, wrongRes] = await Promise.all([
    statsAPI.summary(app.deviceId),
    statsAPI.daily(app.deviceId, 7),
    statsAPI.wrongTop(app.deviceId)
  ])
  summary.value = sumRes.data || {}
  dailyData.value = dailyRes.data || []
  wrongTop.value = wrongRes.data || []
  await nextTick()
  initCharts()
}

function initCharts() {
  if (charsChartRef.value) {
    const chart = echarts.init(charsChartRef.value)
    const dates = dailyData.value.map(d => {
      const dt = new Date(d.checkin_date)
      return `${dt.getMonth()+1}/${dt.getDate()}`
    })
    const chars = dailyData.value.map(d => d.chars_learned || 0)
    chart.setOption({
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'line', data: chars, smooth: true,
        lineStyle: { color: '#7aab7a', width: 3 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1, [{offset:0,color:'rgba(122,171,122,0.3)'},{offset:1,color:'rgba(122,171,122,0)'}]) },
        symbol: 'circle', symbolSize: 8
      }],
      tooltip: { trigger: 'axis' }
    })
  }

  if (timeChartRef.value) {
    const chart = echarts.init(timeChartRef.value)
    const dates = dailyData.value.map(d => {
      const dt = new Date(d.checkin_date)
      return `${dt.getMonth()+1}/${dt.getDate()}`
    })
    const times = dailyData.value.map(d => Math.round((d.study_seconds || 0) / 60))
    chart.setOption({
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11 } },
      yAxis: { type: 'value', name: '分钟' },
      series: [{
        type: 'bar', data: times,
        itemStyle: { color: '#7a9ab5', borderRadius: [4,4,0,0] }
      }],
      tooltip: { trigger: 'axis', formatter: params => `${params[0].name}<br/>${params[0].value}分钟` }
    })
  }
}

function exportReport() {
  window.print()
}

onMounted(loadData)
</script>

<style scoped>
.page-title { text-align: center; margin-bottom: 20px; }
.summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.summary-card { text-align: center; padding: 16px; }
.sc-val { font-size: 1.8rem; font-weight: 700; color: var(--green); display: block; }
.sc-label { font-size: 0.8rem; color: var(--ink-light); }
.chart-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.chart-box h4 { margin-bottom: 12px; font-size: 0.95rem; color: var(--ink-light); }
.wrong-rank { margin-bottom: 20px; }
.wrong-rank h4 { margin-bottom: 12px; font-size: 0.95rem; color: var(--ink-light); }
.rank-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-bottom: 1px solid rgba(0,0,0,0.05); }
.rank-num { font-size: 0.8rem; color: var(--ink-light); min-width: 24px; }
.rank-char { font-size: 1.3rem; font-family: 'Noto Serif SC', serif; min-width: 32px; }
.rank-pinyin { color: var(--red); font-size: 0.85rem; }
.rank-count { margin-left: auto; color: var(--red); font-size: 0.85rem; }
.empty-box { text-align: center; padding: 20px; color: var(--ink-light); }

@media (max-width: 600px) {
  .summary-cards { grid-template-columns: repeat(2, 1fr); }
  .chart-row { grid-template-columns: 1fr; }
}
</style>
