<template>
  <div class="page writing-page">
    <div v-if="loadError" class="loading-box">
      <p>加载失败，请检查后端服务是否启动</p>
      <button class="btn-guo primary" style="margin-top:12px" @click="loadList">重新加载</button>
    </div>
    <div v-else-if="!charData" class="loading-box">加载中...</div>
    <div v-else class="writing-layout">
      <div class="char-info card">
        <div class="big-char" @click="playAudio">{{ charData.char }}</div>
        <div class="pinyin">{{ charData.pinyin }}</div>
      </div>

      <div class="canvas-area card">
        <div class="grid-type-row">
          <a-radio-group v-model="gridType" type="button" size="small">
            <a-radio value="tian">田字格</a-radio>
            <a-radio value="mi">米字格</a-radio>
          </a-radio-group>
        </div>

        <div class="canvas-wrapper" ref="wrapperRef">
          <canvas ref="canvasRef" class="draw-canvas" @mousedown="startDraw" @mousemove="draw" @mouseup="endDraw"
            @mouseleave="endDraw" @touchstart="touchStart" @touchmove="touchMove"
            @touchend="touchEnd"></canvas>
          <canvas ref="gridRef" class="grid-canvas"></canvas>
        </div>

        <div class="toolbar">
          <div class="tool-item">
            <span style="font-size:0.8rem">粗细</span>
            <a-slider v-model="brushSize" :min="2" :max="20" :step="1" style="width:100px" />
          </div>
          <button class="btn-guo" :class="{ danger: isEraser }" @click="toggleEraser">
            {{ isEraser ? '✏ 画笔' : '🧹 橡皮' }}
          </button>
          <button class="btn-guo danger" @click="clearCanvas">🗑 清空</button>
          <button class="btn-guo primary" @click="submitCheck">✓ 提交</button>
          <button class="btn-guo" @click="prevChar">←</button>
          <button class="btn-guo" @click="nextChar">→</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAppStore } from '../store/app'
import { charAPI, learningAPI } from '../api'

const app = useAppStore()
const canvasRef = ref(null)
const gridRef = ref(null)
const wrapperRef = ref(null)
const charData = ref(null)
const charList = ref([])
const currentIdx = ref(0)
const gridType = ref('tian')
const brushSize = ref(6)
const isEraser = ref(false)
const loadError = ref(false)
let isDrawing = false
let ctx = null
let gctx = null
let lastX = 0, lastY = 0

function initCanvas() {
  const canvas = canvasRef.value
  const grid = gridRef.value
  const wrapper = wrapperRef.value
  if (!canvas || !grid || !wrapper) return
  const rect = wrapper.getBoundingClientRect()
  const size = Math.min(Math.max(rect.width - 4, 200), 500)
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = size + 'px'
  canvas.style.height = size + 'px'
  grid.width = size * dpr
  grid.height = size * dpr
  grid.style.width = size + 'px'
  grid.style.height = size + 'px'
  ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  gctx = grid.getContext('2d')
  gctx.scale(dpr, dpr)
  drawGrid()
}

function drawGrid() {
  if (!gctx || !gridRef.value) return
  const w = parseFloat(gridRef.value.style.width) || 300
  const h = parseFloat(gridRef.value.style.height) || 300
  gctx.clearRect(0, 0, w, h)
  gctx.strokeStyle = '#ccc'
  gctx.lineWidth = 1

  gctx.strokeRect(0, 0, w, h)

  if (gridType.value === 'tian') {
    gctx.beginPath()
    gctx.moveTo(w/2, 0); gctx.lineTo(w/2, h)
    gctx.moveTo(0, h/2); gctx.lineTo(w, h/2)
    gctx.stroke()
  } else {
    gctx.beginPath()
    gctx.moveTo(w/2, 0); gctx.lineTo(w/2, h)
    gctx.moveTo(0, h/2); gctx.lineTo(w, h/2)
    gctx.moveTo(0, 0); gctx.lineTo(w, h)
    gctx.moveTo(w, 0); gctx.lineTo(0, h)
    gctx.stroke()
  }
}

function getPos(e) {
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  return { x, y }
}

function startDraw(e) {
  isDrawing = true
  const pos = getPos(e)
  lastX = pos.x; lastY = pos.y
}

function draw(e) {
  if (!isDrawing || !ctx) return
  const pos = getPos(e)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(pos.x, pos.y)
  ctx.strokeStyle = isEraser.value ? '#f5f0e8' : '#3a3a3a'
  ctx.lineWidth = isEraser.value ? brushSize.value * 3 : brushSize.value
  ctx.stroke()
  lastX = pos.x; lastY = pos.y
}

function endDraw() { isDrawing = false }

function touchStart(e) {
  e.preventDefault()
  const touch = e.touches[0]
  if (!touch) return
  isDrawing = true
  const pos = getPos(touch)
  lastX = pos.x; lastY = pos.y
}
function touchMove(e) {
  if (!isDrawing || !ctx) return
  e.preventDefault()
  const touch = e.touches[0]
  if (!touch) return
  const pos = getPos(touch)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(pos.x, pos.y)
  ctx.strokeStyle = isEraser.value ? '#f5f0e8' : '#3a3a3a'
  ctx.lineWidth = isEraser.value ? brushSize.value * 3 : brushSize.value
  ctx.stroke()
  lastX = pos.x; lastY = pos.y
}
function touchEnd() { isDrawing = false }

function toggleEraser() { isEraser.value = !isEraser.value }

function clearCanvas() {
  if (!ctx || !canvasRef.value) return
  const w = parseFloat(canvasRef.value.style.width) || 300
  const h = parseFloat(canvasRef.value.style.height) || 300
  ctx.clearRect(0, 0, w, h)
}

async function submitCheck() {
  if (!app.deviceId || !charData.value || !ctx) return
  try {
    await learningAPI.record({ device_id: app.deviceId, char_id: charData.value.id, action_type: 'writing' })

    const w = parseFloat(canvasRef.value.style.width) || 300
    const h = parseFloat(canvasRef.value.style.height) || 300
    const imageData = ctx.getImageData(0, 0, w, h)
    const pixels = imageData.data
    let filled = 0
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 128) filled++
    }
    const coverage = filled / (pixels.length / 4)

    if (coverage > 0.02) {
      alert('✧ 书写完成！继续加油！')
      await learningAPI.reportDuration(app.deviceId, 15)
    } else {
      await learningAPI.addWrong(app.deviceId, charData.value.id)
      alert('请按照标准笔顺认真书写哦～')
    }
  } catch (e) {
    console.error('提交失败:', e)
    alert('提交失败，请稍后重试')
  }
}

function playAudio() {
  if (charData.value) {
    try {
      const u = new SpeechSynthesisUtterance(charData.value.char)
      u.lang = 'zh-CN'
      u.rate = app.speechSpeed || 1
      speechSynthesis.speak(u)
    } catch (e) {
      console.log('语音播放失败:', e.message)
    }
  }
}

async function loadList() {
  loadError.value = false
  try {
    const res = await charAPI.list({ category: app.currentCategory, limit: 100 })
    charList.value = res.data || []
    if (charList.value.length > 0) {
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
    await nextTick()
    initCanvas()
    clearCanvas()
  } catch (err) {
    console.error('加载生字失败:', err)
    loadError.value = true
  }
}

function prevChar() {
  if (currentIdx.value > 0) { currentIdx.value--; loadChar(charList.value[currentIdx.value].id) }
}
function nextChar() {
  if (currentIdx.value < charList.value.length - 1) { currentIdx.value++; loadChar(charList.value[currentIdx.value].id) }
}

watch(gridType, () => { if (gridRef.value) drawGrid() })

onMounted(loadList)
</script>

<style scoped>
.writing-layout { display: grid; grid-template-columns: 200px 1fr; gap: 20px; max-width: 700px; margin: 0 auto; }
.char-info { text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.big-char { font-size: 4rem; font-family: 'Noto Serif SC', serif; cursor: pointer; }
.pinyin { font-size: 1.2rem; color: var(--red); margin-top: 8px; }
.canvas-area { text-align: center; }
.grid-type-row { margin-bottom: 12px; }
.canvas-wrapper { position: relative; width: 100%; max-width: 400px; margin: 0 auto; touch-action: none; min-height: 300px; }
.draw-canvas { width: 100%; height: auto; display: block; border-radius: 4px; }
.grid-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; border-radius: 4px; }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px; align-items: center; }
.tool-item { display: flex; align-items: center; gap: 6px; }

.loading-box { text-align: center; padding: 60px; color: var(--ink-light); }

@media (max-width: 600px) {
  .writing-layout { grid-template-columns: 1fr; }
  .char-info { flex-direction: row; gap: 16px; }
  .big-char { font-size: 3rem; }
}
</style>
