<template>
  <div class="page review-page">
    <div class="review-tabs">
      <button class="btn-guo" :class="{ primary: tab === 'favorites' }" @click="tab = 'favorites'; loadData()">收藏生字本</button>
      <button class="btn-guo" :class="{ primary: tab === 'wrong' }" @click="tab = 'wrong'; loadData()">错字本</button>
    </div>

    <div class="filter-bar">
      <a-select v-model="filterCat" style="width:160px" @change="loadData">
        <a-option value="">全部</a-option>
        <a-option value="preschool">衔接字</a-option>
        <a-option value="grade1_up">一年级上</a-option>
        <a-option value="grade1_down">一年级下</a-option>
      </a-select>
      <button class="btn-guo" @click="batchReview">📖 批量复习</button>
      <button v-if="tab === 'wrong'" class="btn-guo danger" @click="clearAll">清空错题</button>
    </div>

    <div class="char-list" v-if="list.length > 0">
      <div class="char-item card" v-for="item in list" :key="item.id" @click="goLearn(item)">
        <span class="ci-char">{{ item.char }}</span>
        <span class="ci-pinyin">{{ item.pinyin }}</span>
        <span v-if="tab === 'wrong'" class="ci-count">错{{ item.error_count }}次</span>
        <span class="ci-cat">{{ catLabel(item.category) }}</span>
        <button class="btn-guo danger small" @click.stop="removeItem(item)">移除</button>
      </div>
    </div>
    <div v-else class="empty-box">暂无数据</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '../store/app'
import { learningAPI } from '../api'
import { useRouter } from 'vue-router'

const app = useAppStore()
const router = useRouter()
const tab = ref('favorites')
const list = ref([])
const filterCat = ref('')

function catLabel(cat) {
  return { preschool: '衔接', grade1_up: '一上', grade1_down: '一下' }[cat] || cat
}

async function loadData() {
  if (!app.deviceId) return
  let res
  if (tab.value === 'favorites') {
    res = await learningAPI.getFavorites(app.deviceId)
  } else {
    res = await learningAPI.getWrong(app.deviceId)
  }
  let data = res.data || []
  if (filterCat.value) data = data.filter(d => d.category === filterCat.value)
  list.value = data
}

async function removeItem(item) {
  if (tab.value === 'favorites') {
    await learningAPI.removeFavorite(app.deviceId, item.id)
  } else {
    await learningAPI.removeWrong(app.deviceId, item.id)
  }
  loadData()
}

async function clearAll() {
  if (confirm('确定清空所有错题记录？')) {
    await learningAPI.clearWrong(app.deviceId)
    loadData()
  }
}

function batchReview() {
  if (list.value.length > 0) {
    router.push(`/learn?focus=${list.value[0].id}`)
  }
}

function goLearn(item) {
  router.push(`/learn?focus=${item.id}`)
}

onMounted(loadData)
</script>

<style scoped>
.review-tabs { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
.filter-bar { display: flex; gap: 12px; align-items: center; justify-content: center; margin-bottom: 20px; flex-wrap: wrap; }
.char-list { display: flex; flex-direction: column; gap: 8px; max-width: 600px; margin: 0 auto; }
.char-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; }
.char-item:hover { background: rgba(255,255,255,0.5); }
.ci-char { font-size: 1.6rem; font-family: 'Noto Serif SC', serif; min-width: 40px; text-align: center; }
.ci-pinyin { color: var(--red); font-size: 0.9rem; min-width: 60px; }
.ci-count { color: var(--red); font-size: 0.8rem; background: var(--red-light); padding: 2px 8px; border-radius: 10px; }
.ci-cat { font-size: 0.8rem; color: var(--ink-light); margin-left: auto; }
.small { padding: 4px 12px; font-size: 0.8rem; min-height: 32px; }
.empty-box { text-align: center; padding: 40px; color: var(--ink-light); }
</style>
