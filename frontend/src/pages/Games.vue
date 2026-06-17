<template>
  <div class="page games-page">
    <h2 class="page-title">识字小游戏</h2>
    <p class="page-desc">选择游戏开始闯关吧！</p>
    <div class="game-grid">
      <div class="game-card" v-for="g in games" :key="g.type" @click="$router.push(`/game/${g.type}`)">
        <span class="game-icon">{{ g.icon }}</span>
        <span class="game-name">{{ g.name }}</span>
        <span class="game-desc">{{ g.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const games = [
  { type: 'listen', icon: '🔊', name: '听音辨字', desc: '听读音，选汉字' },
  { type: 'match', icon: '🔍', name: '汉字消消乐', desc: '配对汉字和拼音' },
]
</script>

<style scoped>
.page-title { text-align: center; font-size: 1.6rem; margin-bottom: 4px; }
.page-desc { text-align: center; color: var(--ink-light); margin-bottom: 24px; }
.game-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; max-width: 700px; margin: 0 auto; }
.game-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border-radius: var(--radius);
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,0.5);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.game-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.game-icon { font-size: 3rem; }
.game-name { font-size: 1.2rem; font-weight: 600; font-family: 'Noto Serif SC', serif; }
.game-desc { font-size: 0.85rem; color: var(--ink-light); }
</style>
