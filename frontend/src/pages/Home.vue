<template>
  <div class="page home-page">
    <div class="hero">
      <div class="hero-decor">⿅</div>
      <h1 class="hero-title">启字堂</h1>
      <p class="hero-sub">低年级识字课堂</p>
      <p class="hero-desc">学习记录自动云端保存，清除浏览器缓存不丢失进度</p>
    </div>

    <div class="difficulty-row">
      <span class="label">难度分级：</span>
      <a-radio-group :model-value="app.difficulty" @change="app.setDifficulty" type="button">
        <a-radio value="preschool">入门</a-radio>
        <a-radio value="easy">巩固</a-radio>
        <a-radio value="hard">闯关</a-radio>
      </a-radio-group>
    </div>

    <div class="nav-grid">
      <div class="nav-card" v-for="item in navItems" :key="item.path" @click="$router.push(item.path)">
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
        <span class="nav-desc">{{ item.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../store/app'
const app = useAppStore()

const navItems = [
  { path: '/learn', icon: '📖', label: '看图识字', desc: '听读音·看笔顺·组词造句' },
  { path: '/writing', icon: '✍️', label: '描红练字', desc: '触屏手写·笔顺校验' },
  { path: '/games', icon: '🎮', label: '识字游戏', desc: '闯关答题·寓教于乐' },
  { path: '/review', icon: '📚', label: '错字复习', desc: '收藏本·错字本·批量复习' },
  { path: '/checkin', icon: '📅', label: '每日打卡', desc: '学习记录·连续打卡' },
  { path: '/dashboard', icon: '📊', label: '家长统计', desc: '学习数据·错题分析' },
  { path: '/print', icon: '🖨️', label: '打印卡片', desc: '生字卡片·A4打印' },
]
</script>

<style scoped>
.home-page { padding-top: 20px; }
.hero {
  text-align: center;
  padding: 40px 20px 30px;
  position: relative;
}
.hero-decor {
  font-size: 4rem;
  opacity: 0.08;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}
.hero-title {
  font-size: 3rem;
  color: var(--ink);
  letter-spacing: 8px;
  margin-bottom: 8px;
}
.hero-sub {
  font-size: 1.2rem;
  color: var(--ink-light);
  letter-spacing: 4px;
}
.hero-desc {
  font-size: 0.8rem;
  color: var(--ink-light);
  margin-top: 12px;
  opacity: 0.7;
}
.difficulty-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0 30px;
  flex-wrap: wrap;
}
.difficulty-row .label { font-size: 0.9rem; color: var(--ink-light); }
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}
.nav-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border-radius: var(--radius);
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.nav-icon { font-size: 2.4rem; }
.nav-label { font-size: 1.1rem; font-weight: 600; font-family: 'Noto Serif SC', serif; }
.nav-desc { font-size: 0.8rem; color: var(--ink-light); }

@media (max-width: 480px) {
  .hero-title { font-size: 2.2rem; }
  .nav-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .nav-card { padding: 16px; }
  .nav-icon { font-size: 1.8rem; }
}
</style>
