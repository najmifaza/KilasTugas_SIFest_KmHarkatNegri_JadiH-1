import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'https://api-kilastugas.najmifaza.my.id'

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Guest Session helper
export const getSessionId = () => {
  let sid = localStorage.getItem('kilastugas_session_id')
  if (!sid) {
    sid = crypto.randomUUID ? crypto.randomUUID() : 'guest-' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('kilastugas_session_id', sid)
  }
  return sid
}

export const checkHealth = async () => {
  const res = await apiClient.get('/health')
  return res.data
}

export const initSession = async () => {
  const sid = getSessionId()
  try {
    await apiClient.post('/api/session', { session_id: sid, user_agent: navigator.userAgent })
  } catch (err) {
    console.warn('Backend session init offline/skipped:', err?.message)
  }
  return sid
}

export const createTask = async (taskData) => {
  const res = await apiClient.post('/api/tasks', taskData)
  return res.data
}

export const getTasks = async (sessionId) => {
  const res = await apiClient.get(`/api/tasks/${sessionId}`)
  return res.data
}

export const getSubtasks = async (taskId) => {
  const res = await apiClient.get(`/api/tasks/${taskId}/subtasks`)
  return res.data
}

export const patchSubtask = async (subtaskId, updates) => {
  const res = await apiClient.patch(`/api/subtasks/${subtaskId}`, updates)
  return res.data
}

export const deleteTask = async (taskId) => {
  const res = await apiClient.delete(`/api/tasks/${taskId}`)
  return res.data
}

export const triggerBreakdown = async (payload) => {
  const res = await apiClient.post('/api/breakdown', payload)
  return res.data
}
