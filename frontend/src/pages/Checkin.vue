<template>
  <div class="page checkin-page">
    <h2 class="page-title">每日打卡</h2>

    <div class="streak-badge" v-if="streak > 0">
      已连续打卡 <strong>{{ streak }}</strong> 天 🔥
    </div>

    <div class="calendar card">
      <div class="cal-header">
        <button class="btn-guo" @click="changeMonth(-1)">←</button>
        <span class="cal-month">{{ year }}年{{ month }}月</span>
        <button class="btn-guo" @click="changeMonth(1)">→</button>
      </div>
      <div class="cal-grid">
        <div class="cal-weekday" v-for="d in weekDays" :key="d">{{ d }}</div>
        <div class="cal-day" v-for="(day, idx) in calendarDays" :key="idx"
          :class="{ checked: day.checked, today: day.isToday, empty: !day.num }">
          <span v-if="day.num">{{ day.num }}</span>
        </div>
      </div>
    </div>

    <div class="today-stats card" v-if="todayData">
      <h3>今日学习统计</h3>
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-val">{{ todayData.chars_learned || 0 }}</span>
          <span class="stat-label">识字数</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">{{ todayData.practice_count || 0 }}</span>
          <span class="stat-label">练习次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">{{ todayData.game_count || 0 }}</span>
          <span class="stat-label">游戏次数</span>
        </div>
        <div class="stat-item">
          <span class="stat-val">{{ formatTime(todayData.study_seconds || 0) }}</span>
          <span class="stat-label">学习时长</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../store/app'
import { learningAPI } from '../api'

const app = useAppStore()
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const streak = ref(0)
const todayData = ref(null)
const checkedDates = ref([])

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const calendarDays = computed(() => {
  const first = new Date(year.value, month.value - 1, 1).getDay()
  const daysInMonth = new Date(year.value, month.value, 0).getDate()
  const today = new Date()
  const days = []
  for (let i = 0; i < first; i++) days.push({ num: 0, checked: false, isToday: false })
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year.value}-${String(month.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    days.push({
      num: i,
      checked: checkedDates.value.includes(dateStr),
      isToday: today.getFullYear() === year.value && today.getMonth() + 1 === month.value && today.getDate() === i
    })
  }
  return days
})

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h${m}m`
  return `${m}分钟`
}

async function loadData() {
  if (!app.deviceId) return
  const res = await learningAPI.getCheckin(app.deviceId, { year: year.value, month: month.value })
  checkedDates.value = (res.data || []).map(r => {
    const d = new Date(r.checkin_date)
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  })
  streak.value = res.streak || 0

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
  todayData.value = (res.data || []).find(r => {
    const d = new Date(r.checkin_date)
    const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    return s === todayStr
  }) || { chars_learned: 0, practice_count: 0, game_count: 0, study_seconds: 0 }
}

function changeMonth(delta) {
  month.value += delta
  if (month.value > 12) { month.value = 1; year.value++ }
  if (month.value < 1) { month.value = 12; year.value-- }
  loadData()
}

onMounted(loadData)
</script>

<style scoped>
.page-title { text-align: center; margin-bottom: 8px; }
.streak-badge { text-align: center; font-size: 1.2rem; color: var(--gold); margin: 8px 0 20px; }
.calendar { max-width: 400px; margin: 0 auto 20px; }
.cal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.cal-month { font-size: 1.1rem; font-weight: 600; }
.cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.cal-weekday { text-align: center; font-size: 0.8rem; color: var(--ink-light); padding: 8px 0; }
.cal-day { text-align: center; padding: 10px 0; border-radius: 8px; font-size: 0.9rem; }
.cal-day.checked { background: var(--green-light); color: white; }
.cal-day.today { border: 2px solid var(--green); font-weight: 700; }
.cal-day.empty { opacity: 0.3; }
.today-stats { max-width: 400px; margin: 0 auto; }
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
.stat-item { text-align: center; }
.stat-val { font-size: 1.6rem; font-weight: 700; color: var(--green); display: block; }
.stat-label { font-size: 0.8rem; color: var(--ink-light); }
</style>
