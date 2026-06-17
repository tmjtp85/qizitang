<template>
  <div class="page learn-page">
    <div class="learn-layout" v-if="charData">
      <div class="char-main card">
        <div class="pinyin">{{ charData.pinyin }}</div>
        <div class="big-char" @click="playAudio">{{ charData.char }}</div>
        <div class="strokes-info">{{ charData.strokes }}画</div>
        <div class="anim-box" ref="animRef" style="height:150px;width:150px;margin:12px auto;display:flex;align-items:center;justify-content:center;background-color:rgba(255,255,255,0.5);border-radius:8px;"></div>
        <div class="action-row">
          <button class="btn-guo" @click="togglePlay">{{ playing ? '⏸ 暂停' : '▶ 播放' }}</button>
          <button class="btn-guo" @click="resetAnim">↺ 重播</button>
          <button class="btn-guo" :class="{ primary: isFav }" @click="toggleFav">
            {{ isFav ? '★ 已收藏' : '☆ 收藏' }}
          </button>
          <button class="btn-guo danger" @click="markWrong">✗ 错题</button>
        </div>
        <div class="nav-arrows">
          <button class="btn-guo" @click="prevChar">← 上一字</button>
          <button class="btn-guo" @click="nextChar">下一字 →</button>
        </div>
      </div>

      <div class="char-side card">
        <div class="section-title">组词</div>
        <div class="words-box">
          <span class="word-tag" v-for="w in parsedWords" :key="w" @click="say(w)">{{ w }}</span>
        </div>

        <div class="filter-section">
          <div class="section-title" style="margin-top:16px">筛选</div>
          <a-select v-model="filterCategory" style="width:100%" @change="loadList">
            <a-option value="">全部</a-option>
            <a-option value="preschool">衔接字</a-option>
            <a-option value="grade1_up">一年级上</a-option>
            <a-option value="grade1_down">一年级下</a-option>
          </a-select>
        </div>
      </div>
    </div>

    <div v-else-if="loadError" class="loading-box">
      <p>加载失败，请检查后端服务是否启动</p>
      <button class="btn-guo primary" style="margin-top:12px" @click="loadList">重新加载</button>
    </div>
    <div v-else class="loading-box">加载中...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '../store/app'
import { useRoute } from 'vue-router'
import { charAPI, learningAPI } from '../api'

const app = useAppStore()
const route = useRoute()
const animRef = ref(null)
const charData = ref(null)
const charList = ref([])
const currentIdx = ref(0)
const isFav = ref(false)
const playing = ref(false)
const filterCategory = ref('')
const loadError = ref(false)
let writer = null

const parsedWords = computed(() => {
  if (!charData.value) return []
  try {
    const w = charData.value.words
    return typeof w === 'string' ? JSON.parse(w) : w
  } catch { return [] }
})

function say(text) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'zh-CN'
    u.rate = app.speechSpeed || 1
    speechSynthesis.speak(u)
  } catch (e) {
    console.log('语音播放失败:', e.message)
  }
}

function playAudio() {
  if (charData.value) say(charData.value.char)
}

async function loadList() {
  loadError.value = false
  const params = {}
  if (filterCategory.value) params.category = filterCategory.value
  else params.category = app.currentCategory
  try {
    const res = await charAPI.list(params)
    charList.value = res.data || []
    if (charList.value.length > 0) {
      currentIdx.value = 0
      loadChar(charList.value[0].id)
    }
  } catch (err) {
    console.error('加载生字列表失败:', err)
    loadError.value = true
  }
}

async function loadChar(id) {
  try {
    const res = await charAPI.get(id)
    if (!res.data) { loadError.value = true; return }
    charData.value = res.data
    app.currentCharId = id
    if (app.deviceId) {
      learningAPI.record({ device_id: app.deviceId, char_id: id, action_type: 'view' })
      const fav = await learningAPI.checkFavorite(app.deviceId, id)
      isFav.value = Boolean(fav.favorited)
    }
    await nextTick()
    initWriter()
  } catch (err) {
    console.error('加载生字失败:', err)
    loadError.value = true
  }
}

async function initWriter() {
  if (!animRef.value || !charData.value) return
  console.log('initWriter called for:', charData.value.char)
  
  // 首先显示字符作为备选（确保不会空白）
  animRef.value.innerHTML = `<div style="font-size:4rem;text-align:center;color:var(--green);opacity:0.6">${charData.value.char}</div>`
  
  try {
    const HanziWriter = await import('hanzi-writer')
    const HW = HanziWriter.default || HanziWriter
    console.log('HanziWriter loaded:', HW)
    
    animRef.value.innerHTML = ''
    writer = HW.create(animRef.value, charData.value.char, {
      width: 140,
      height: 140,
      padding: 20,
      strokeColor: '#3a3a3a',
      delayBetweenStrokes: 400,
      strokeAnimationSpeed: 1,
      showOutline: true,
      showCharacter: true,
      outlineColor: '#eee'
    })
    
    console.log('Writer created')
    playing.value = true
    // 开始动画
    setTimeout(() => {
      if (writer) writer.animateCharacter()
      console.log('Animate character called')
    }, 100)
  } catch (e) {
    console.error('Error loading hanzi-writer:', e)
    // 出错时显示备用文字
    animRef.value.innerHTML = `<div style="font-size:4rem;text-align:center;color:var(--green);opacity:0.6">${charData.value.char}</div>`
  }
}

function togglePlay() {
  playing.value = !playing.value
  if (writer) {
    if (playing.value) {
      writer.animateCharacter()
    } else {
      writer.pauseAnimation()
    }
  }
}

function resetAnim() {
  playing.value = false
  if (writer) {
    writer.cancelAnimation()
    writer.loopCharacterAnimation()
    setTimeout(() => writer.pauseAnimation(), 100)
  } else {
    initWriter()
  }
}

async function toggleFav() {
  if (!app.deviceId || !charData.value) return
  try {
    if (isFav.value) {
      await learningAPI.removeFavorite(app.deviceId, charData.value.id)
      isFav.value = false
    } else {
      await learningAPI.addFavorite(app.deviceId, charData.value.id)
      isFav.value = true
    }
  } catch (e) { console.error('收藏操作失败:', e) }
}

async function markWrong() {
  if (!app.deviceId || !charData.value) return
  try {
    await learningAPI.addWrong(app.deviceId, charData.value.id)
  } catch (e) { console.error('标记错题失败:', e) }
}

function prevChar() {
  if (currentIdx.value > 0) {
    currentIdx.value--
    loadChar(charList.value[currentIdx.value].id)
  }
}

function nextChar() {
  if (currentIdx.value < charList.value.length - 1) {
    currentIdx.value++
    loadChar(charList.value[currentIdx.value].id)
  }
}

onMounted(async () => {
  await loadList()
  if (charList.value.length === 0) {
    loadError.value = true
  }
  const focusId = parseInt(route.query.focus)
  if (focusId && charList.value.length > 0) {
    const idx = charList.value.findIndex(c => c.id === focusId)
    if (idx >= 0) { currentIdx.value = idx; loadChar(focusId) }
  }
})

onUnmounted(() => {
  if (writer) { try { writer.cancelAnimation() } catch(e) {} }
})
</script>

<style scoped>
.learn-layout { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
.char-main { text-align: center; }
.pinyin { font-size: 1.6rem; color: var(--red); margin-bottom: 8px; letter-spacing: 2px; }
.big-char { font-size: 6rem; font-family: 'Noto Serif SC', serif; cursor: pointer; color: var(--ink); line-height: 1.2; }
.big-char:hover { opacity: 0.8; }
.strokes-info { font-size: 0.85rem; color: var(--ink-light); margin: 4px 0; }
.action-row { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 16px 0; }
.nav-arrows { display: flex; justify-content: space-between; margin-top: 12px; }
.word-tag {
  display: inline-block;
  padding: 4px 14px;
  background: var(--green-light);
  color: white;
  border-radius: 20px;
  margin: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.sentence { font-size: 1rem; line-height: 1.6; cursor: pointer; padding: 8px; background: rgba(122,171,122,0.1); border-radius: 8px; }
.section-title { font-weight: 600; font-size: 0.95rem; color: var(--ink-light); margin-bottom: 8px; }
.filter-section { margin-top: 20px; }
.loading-box { text-align: center; padding: 60px; color: var(--ink-light); }

@media (max-width: 768px) {
  .learn-layout { grid-template-columns: 1fr; }
  .big-char { font-size: 4rem; }
}
</style>
