<template>
  <div class="app-root">
    <TopBar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <button class="back-home" v-if="$route.path !== '/'" @click="$router.push('/')">
      ← 返回首页
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from './store/app'
import TopBar from './components/TopBar.vue'

const app = useAppStore()
onMounted(() => { app.initDevice() })
</script>

<style scoped>
.app-root { position: relative; min-height: 100vh; }
</style>
