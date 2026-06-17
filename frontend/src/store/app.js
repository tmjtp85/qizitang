import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { deviceAPI } from '../api'

export const useAppStore = defineStore('app', () => {
  const deviceId = ref(localStorage.getItem('device_id') || '')
  const difficulty = ref(localStorage.getItem('difficulty') || 'preschool')
  const bgMusicOn = ref(localStorage.getItem('bg_music') !== 'off')
  const soundOn = ref(localStorage.getItem('sound') !== 'off')
  const speechSpeed = ref(parseFloat(localStorage.getItem('speech_speed') || '1.0'))
  const currentCharId = ref(null)

  function initDevice() {
    let id = localStorage.getItem('device_id')
    if (!id) {
      id = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
      localStorage.setItem('device_id', id)
    }
    deviceId.value = id
    deviceAPI.register(id)
  }

  function setDifficulty(val) {
    difficulty.value = val
    localStorage.setItem('difficulty', val)
  }

  function toggleBgMusic() {
    bgMusicOn.value = !bgMusicOn.value
    localStorage.setItem('bg_music', bgMusicOn.value ? 'on' : 'off')
  }

  function toggleSound() {
    soundOn.value = !soundOn.value
    localStorage.setItem('sound', soundOn.value ? 'on' : 'off')
  }

  function setSpeechSpeed(val) {
    speechSpeed.value = val
    localStorage.setItem('speech_speed', String(val))
  }

  const categoryMap = computed(() => ({
    preschool: 'preschool',
    easy: 'grade1_up',
    hard: 'grade1_down'
  }))

  const currentCategory = computed(() => categoryMap.value[difficulty.value] || 'preschool')

  return {
    deviceId, difficulty, bgMusicOn, soundOn, speechSpeed, currentCharId,
    initDevice, setDifficulty, toggleBgMusic, toggleSound, setSpeechSpeed,
    currentCategory
  }
})
