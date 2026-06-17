<template>
  <div class="top-bar">
    <router-link to="/" class="logo">
      <span>✧</span> 启字堂
    </router-link>
    <div class="controls-row">
      <a-tooltip :content="app.bgMusicOn ? '关闭背景音乐' : '打开背景音乐'">
        <button class="btn-guo" @click="app.toggleBgMusic" style="padding:6px 12px;min-width:36px">
          {{ app.bgMusicOn ? '♪' : '♩' }}
        </button>
      </a-tooltip>
      <a-tooltip :content="app.soundOn ? '关闭音效' : '打开音效'">
        <button class="btn-guo" @click="app.toggleSound" style="padding:6px 12px;min-width:36px">
          {{ app.soundOn ? '🔊' : '🔇' }}
        </button>
      </a-tooltip>
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-size:0.8rem;color:var(--ink-light)">语速</span>
        <a-slider
          :model-value="app.speechSpeed"
          :min="0.5"
          :max="2.0"
          :step="0.1"
          style="width:80px"
          @change="app.setSpeechSpeed"
        />
        <span style="font-size:0.75rem;color:var(--ink-light);min-width:28px">{{ app.speechSpeed.toFixed(1) }}x</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '../store/app'
const app = useAppStore()
</script>
