const BASE = 'https://qizitang-backend.onrender.com/api'

async function request(url, options = {}) {
  try {
    const res = await fetch(`${BASE}${url}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options
    })
    return await res.json()
  } catch (err) {
    console.error(`API请求失败: ${url}`, err)
    return { success: false, data: null, message: err.message }
  }
}

export const charAPI = {
  list(params) {
    const q = new URLSearchParams(params).toString()
    return request(`/characters?${q}`)
  },
  get(id) { return request(`/characters/${id}`) },
  random(params) {
    const q = new URLSearchParams(params).toString()
    return request(`/characters/random?${q}`)
  }
}

export const learningAPI = {
  record(data) { return request('/learning/record', { method: 'POST', body: JSON.stringify(data) }) },
  addFavorite(device_id, char_id) { return request('/learning/favorite', { method: 'POST', body: JSON.stringify({ device_id, char_id }) }) },
  removeFavorite(device_id, char_id) { return request('/learning/favorite', { method: 'DELETE', body: JSON.stringify({ device_id, char_id }) }) },
  getFavorites(device_id) { return request(`/learning/favorites/${device_id}`) },
  checkFavorite(device_id, char_id) { return request(`/learning/favorites/check/${device_id}/${char_id}`) },
  addWrong(device_id, char_id) { return request('/learning/wrong', { method: 'POST', body: JSON.stringify({ device_id, char_id }) }) },
  removeWrong(device_id, char_id) { return request('/learning/wrong', { method: 'DELETE', body: JSON.stringify({ device_id, char_id }) }) },
  clearWrong(device_id) { return request('/learning/wrong', { method: 'DELETE', body: JSON.stringify({ device_id }) }) },
  getWrong(device_id) { return request(`/learning/wrong/${device_id}`) },
  saveGameScore(data) { return request('/learning/game-score', { method: 'POST', body: JSON.stringify(data) }) },
  reportDuration(device_id, seconds) { return request('/learning/study-duration', { method: 'POST', body: JSON.stringify({ seconds }) }) },
  getCheckin(device_id, params) {
    const q = new URLSearchParams(params).toString()
    return request(`/learning/checkin/${device_id}?${q}`)
  }
}

export const deviceAPI = {
  register(device_id) { return request('/device/register', { method: 'POST', body: JSON.stringify({ device_id }) }) }
}

export const statsAPI = {
  summary(device_id) { return request(`/stats/summary/${device_id}`) },
  daily(device_id, days = 7) { return request(`/stats/daily/${device_id}?days=${days}`) },
  wrongTop(device_id) { return request(`/stats/wrong-top/${device_id}`) }
}

// 兼容性导出 - TTS 使用浏览器内置 API
export function getTTSUrl(text, speed = 1) {
  return ''
}
