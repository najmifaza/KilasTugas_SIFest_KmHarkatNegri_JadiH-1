import axios from 'axios'
import { enqueueMutation } from './offlineStore'

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
  try {
    const res = await apiClient.patch(`/api/subtasks/${subtaskId}`, updates)
    return res.data
  } catch (err) {
    if (!navigator.onLine || err?.code === 'ERR_NETWORK' || !err?.response) {
      try {
        await enqueueMutation({
          entity_type: 'subtask',
          entity_id: subtaskId,
          action: 'patch',
          data: updates,
        })
        return { success: true, offline: true }
      } catch (e) {
        console.warn('Gagal mencatat mutasi offline:', e)
      }
    }
    throw err
  }
}

export const createSubtask = async (taskId, subtaskData) => {
  const res = await apiClient.post(`/api/tasks/${taskId}/subtasks`, subtaskData)
  return res.data
}

export const deleteSubtask = async (subtaskId) => {
  const res = await apiClient.delete(`/api/subtasks/${subtaskId}`)
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

export const getBlueprint = async (taskId) => {
  const res = await apiClient.get(`/api/blueprint/${taskId}`)
  return res.data
}

export const cloneBlueprint = async (taskId, sessionId, targetDeadline = null) => {
  const res = await apiClient.post(`/api/blueprint/${taskId}/clone`, {
    session_id: sessionId,
    target_deadline: targetDeadline,
  })
  return res.data
}

export const extractSyllabus = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await apiClient.post('/api/extract-syllabus', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}

export const rebalanceTaskPacing = async (taskId) => {
  const res = await apiClient.post(`/api/tasks/${taskId}/rebalance`)
  return res.data
}

export const syncBatchMutations = async (sessionId, mutations) => {
  const res = await apiClient.post('/api/tasks/sync-batch', {
    session_id: sessionId,
    mutations,
  })
  return res.data
}



