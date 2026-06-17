<template>
  <div class="page game-play-page">
    <div class="game-header">
      <h2>{{ gameTitle }}</h2>
      <span class="score-display">得分：{{ score }}/{{ total }}</span>
    </div>

    <div class="game-area card" v-if="!finished">
      <!-- Listen Game -->
      <template v-if="type === 'listen'">
        <div class="listen-prompt" @click="playCurrentAudio">🔊 点击播放</div>
        <div class="options-grid">
          <button v-for="opt in options" :key="opt.id"
            class="btn-guo option-btn"
            :class="{ primary: selectedId === opt.id && opt.isCorrect, danger: selectedId === opt.id && !opt.isCorrect }"
            :disabled="selectedId !== null"
            @click="selectOption(opt)">
            {{ opt.char }}
          </button>
        </div>
      </template>

      <!-- Match Game (字 + 拼音) -->
      <template v-if="type === 'match'">
        <div class="match-grid">
          <button v-for="(item, idx) in matchItems" :key="idx"
            class="btn-guo match-btn"
            :class="{ primary: item.matched, gold: selectedMatch === idx }"
            :disabled="item.matched"
            @click="selectMatch(idx)">
            {{ item.matched ? '✓' : (item.isPinyin ? item.pinyin : item.char) }}
          </button>
        </div>
      </template>
    </div>

    <div class="result-panel card" v-if="finished">
      <h3>本关完成！</h3>
      <div class="result-score">正确率：{{ total > 0 ? Math.round(score/total*100) : 0 }}%</div>
      <div class="result-detail">{{ score }}/{{ total }} 题正确</div>
      <div class="result-actions">
        <button class="btn-guo" @click="restart">重新挑战</button>
        <button class="btn-guo primary" @click="$router.push('/games')">返回游戏列表</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAppStore } from '../store/app'
import { charAPI, learningAPI } from '../api'

const props = defineProps({ type: String })
const app = useAppStore()

const gameTitle = computed(() => ({
  listen: '听音辨字', match: '汉字拼音消消乐'
}[props.type] || '识字游戏'))

const score = ref(0)
const total = ref(0)
const finished = ref(false)
const currentChar = ref(null)
const options = ref([])
const selectedId = ref(null)
const chars = ref([])
const charIdx = ref(0)

// Match game
const matchItems = ref([])
const selectedMatch = ref(null)
const matchPairs = 6

async function loadChars() {
  const res = await charAPI.list({ category: app.currentCategory, limit: 50 })
  chars.value = res.data || []
  charIdx.value = 0
  if (props.type === 'match') initMatch()
  else nextQuestion()
}

function nextQuestion() {
  if (charIdx.value >= chars.value.length) { finished.value = true; return }
  currentChar.value = chars.value[charIdx.value]
  selectedId.value = null
  generateOptions()
}

function generateOptions() {
  const correct = currentChar.value
  const others = chars.value.filter(c => c.id !== correct.id)
  const shuffled = [correct, ...others.sort(() => Math.random() - 0.5).slice(0, 3)]
  options.value = shuffled.sort(() => Math.random() - 0.5).map(o => ({
    ...o,
    isCorrect: o.id === correct.id,
    selected: false
  }))
  total.value++
}

function playCurrentAudio() {
  if (currentChar.value) {
    const u = new SpeechSynthesisUtterance(currentChar.value.char)
    u.lang = 'zh-CN'
    u.rate = app.speechSpeed || 1
    speechSynthesis.speak(u)
  }
}

async function selectOption(opt) {
  selectedId.value = opt.id
  if (opt.isCorrect) {
    score.value++
  } else {
    await learningAPI.addWrong(app.deviceId, currentChar.value.id)
  }
  await learningAPI.record({ device_id: app.deviceId, char_id: currentChar.value.id, action_type: opt.isCorrect ? 'game_correct' : 'game_wrong' })
  setTimeout(() => {
    if (props.type === 'listen') playCurrentAudio()
    charIdx.value++
    nextQuestion()
  }, 1000)
}

// Match game (字 + 拼音)
function initMatch() {
  // 先选择字，确保没有同音字（拼音相同但字不同）
  const selected = []
  const usedPinyin = new Set()
  for (let c of chars.value) {
    if (selected.length >= matchPairs) break
    if (!usedPinyin.has(c.pinyin)) {
      selected.push(c)
      usedPinyin.add(c.pinyin)
    }
  }
  
  // 如果选的不够，不管同音字了继续加
  while (selected.length < matchPairs && selected.length < chars.value.length) {
    const c = chars.value[selected.length]
    if (!selected.find(s => s.id === c.id)) {
      selected.push(c)
    }
  }
  
  // 创建配对项目：字 + 拼音
  const items = []
  selected.forEach(c => {
    items.push({ ...c, matched: false, isPinyin: false })
    items.push({ ...c, matched: false, isPinyin: true })
  })
  
  // 打乱
  matchItems.value = items.sort(() => Math.random() - 0.5)
}

function selectMatch(idx) {
  if (matchItems.value[idx].matched) return
  if (selectedMatch.value === null) {
    selectedMatch.value = idx
  } else {
    const first = matchItems.value[selectedMatch.value]
    const second = matchItems.value[idx]
    // 必须是相同 id，一个是字一个是拼音
    if (first.id === second.id && selectedMatch.value !== idx && first.isPinyin !== second.isPinyin) {
      first.matched = true
      second.matched = true
      score.value++
    }
    selectedMatch.value = null
    total.value++
    if (matchItems.value.every(m => m.matched)) {
      finished.value = true
      learningAPI.saveGameScore({ device_id: app.deviceId, game_type: 'match', score: score.value, total: total.value })
    }
  }
}



function restart() {
  score.value = 0; total.value = 0; finished.value = false; selectedId.value = null
  selectedMatch.value = null
  loadChars()
}

onMounted(loadChars)
</script>

<style scoped>
.game-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.game-header h2 { font-family: 'Noto Serif SC', serif; }
.score-display { font-size: 1.1rem; color: var(--gold); font-weight: 600; }
.game-area { max-width: 500px; margin: 0 auto; text-align: center; padding: 30px 20px; }
.listen-prompt { font-size: 2.5rem; cursor: pointer; margin-bottom: 24px; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; max-width: 400px; margin: 0 auto; }
.option-btn { font-size: 1.4rem; padding: 16px; min-height: 60px; }
.match-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.match-btn { font-size: 1.2rem; padding: 12px; min-height: 60px; }
.gold { border-color: var(--gold); background: var(--gold-light); color: white; }
.result-panel { text-align: center; max-width: 400px; margin: 20px auto; }
.result-score { font-size: 2rem; color: var(--green); margin: 12px 0; }
.result-actions { display: flex; gap: 12px; justify-content: center; margin-top: 20px; }

@media (max-width: 480px) {
  .match-grid { grid-template-columns: repeat(3, 1fr); }
  .options-grid { grid-template-columns: 1fr 1fr; }
}
</style>
