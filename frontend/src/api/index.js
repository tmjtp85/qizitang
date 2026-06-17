const BASE = '/api'

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
  get(id) { return request(`/characters?id=${id}`) },
  random(params) {
    const q = new URLSearchParams(params).toString()
    return request(`/characters/random?${q}`)
  }
}

export const learningAPI = {
  record(data) { return request('/learning?type=record', { method: 'POST', body: JSON.stringify(data) }) },
  addFavorite(device_id, char_id) { return request(`/learning?type=favorite&device_id=${device_id}`, { method: 'POST', body: JSON.stringify({ char_id }) }) },
  removeFavorite(device_id, char_id) { return request(`/learning?type=favorite&device_id=${device_id}`, { method: 'DELETE', body: JSON.stringify({ char_id }) }) },
  getFavorites(device_id) { return request(`/learning?type=favorites&device_id=${device_id}`) },
  checkFavorite(device_id, char_id) { return request(`/learning?type=favorites/check&device_id=${device_id}&char_id=${char_id}`) },
  addWrong(device_id, char_id) { return request(`/learning?type=wrong&device_id=${device_id}`, { method: 'POST', body: JSON.stringify({ char_id }) }) },
  removeWrong(device_id, char_id) { return request(`/learning?type=wrong&device_id=${device_id}`, { method: 'DELETE', body: JSON.stringify({ char_id }) }) },
  clearWrong(device_id) { return request(`/learning?type=wrong&device_id=${device_id}`, { method: 'DELETE', body: JSON.stringify({}) }) },
  getWrong(device_id) { return request(`/learning?type=wrong&device_id=${device_id}`) },
  saveGameScore(data) { return request(`/learning?type=game-score&device_id=${data.device_id}`, { method: 'POST', body: JSON.stringify(data) }) },
  reportDuration(device_id, seconds) { return request(`/learning?type=study-duration&device_id=${device_id}`, { method: 'POST', body: JSON.stringify({ seconds }) }) },
  getCheckin(device_id, params) {
    const q = new URLSearchParams(params).toString()
    return request(`/learning?type=checkin&device_id=${device_id}&${q}`)
  }
}

export const deviceAPI = {
  register(device_id) { return request('/device/register', { method: 'POST', body: JSON.stringify({ device_id }) }) }
}

export const statsAPI = {
  summary(device_id) { return request(`/stats?type=summary&device_id=${device_id}`) },
  daily(device_id, days = 7) { return request(`/stats?type=daily&device_id=${device_id}&days=${days}`) },
  wrongTop(device_id) { return request(`/stats?type=wrong-top&device_id=${device_id}`) }
}

export function getTTSUrl(text, speed = 1) {
  return `${BASE}/tts/synthesize?text=${encodeURIComponent(text)}&speed=${speed}`
}
