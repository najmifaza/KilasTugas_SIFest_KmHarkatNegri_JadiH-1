// IndexedDB Offline Storage & Mutation Queue for KilasTugas (LWW Offline Engine)

const DB_NAME = 'kilastugas_offline_db'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      resolve(null)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (e) => {
      const db = e.target.result

      // Store: tasks
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id' })
      }

      // Store: subtasks
      if (!db.objectStoreNames.contains('subtasks')) {
        const subStore = db.createObjectStore('subtasks', { keyPath: 'id' })
        subStore.createIndex('by_task_id', 'task_id', { unique: false })
      }

      // Store: mutation_queue
      if (!db.objectStoreNames.contains('mutation_queue')) {
        db.createObjectStore('mutation_queue', { keyPath: 'id' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// ── Tasks Cache ──────────────────────────────────────────
export async function cacheTasks(tasks) {
  try {
    const db = await openDB()
    if (!db) return
    return new Promise((resolve) => {
      const tx = db.transaction('tasks', 'readwrite')
      const store = tx.objectStore('tasks')
      for (const t of tasks) {
        store.put(t)
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch (err) {
    console.warn('Gagal menyimpan cache tugas:', err)
  }
}

export async function getCachedTasks() {
  try {
    const db = await openDB()
    if (!db) return []
    const pending = await getPendingMutations()
    const taskMutations = {}
    for (const m of pending) {
      if (m.entity_type === 'task') {
        taskMutations[m.entity_id] = { ...(taskMutations[m.entity_id] || {}), ...m.data }
      }
    }

    return new Promise((resolve) => {
      const tx = db.transaction('tasks', 'readonly')
      const store = tx.objectStore('tasks')
      const req = store.getAll()
      req.onsuccess = () => {
        let items = req.result || []
        items = items.map((t) => {
          if (taskMutations[t.id]) {
            return { ...t, ...taskMutations[t.id] }
          }
          return t
        })
        resolve(items)
      }
      req.onerror = () => resolve([])
    })
  } catch (err) {
    return []
  }
}

// ── Subtasks Cache ───────────────────────────────────────
export async function cacheSubtasks(taskId, subtasks) {
  try {
    const db = await openDB()
    if (!db) return
    return new Promise((resolve) => {
      const tx = db.transaction('subtasks', 'readwrite')
      const store = tx.objectStore('subtasks')
      for (const s of subtasks) {
        store.put({ ...s, task_id: taskId })
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
    })
  } catch (err) {
    console.warn('Gagal menyimpan cache sub-tugas:', err)
  }
}

export async function getCachedSubtasks(taskId) {
  try {
    const db = await openDB()
    if (!db) return []
    const pending = await getPendingMutations()
    const subtaskMutations = {}
    for (const m of pending) {
      if (m.entity_type === 'subtask') {
        subtaskMutations[m.entity_id] = { ...(subtaskMutations[m.entity_id] || {}), ...m.data }
      }
    }

    return new Promise((resolve) => {
      const tx = db.transaction('subtasks', 'readonly')
      const store = tx.objectStore('subtasks')
      const index = store.index('by_task_id')
      const req = index.getAll(taskId)
      req.onsuccess = () => {
        let items = req.result || []
        items = items.map((s) => {
          if (subtaskMutations[s.id]) {
            return { ...s, ...subtaskMutations[s.id] }
          }
          return s
        })
        const sorted = items.sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
        resolve(sorted)
      }
      req.onerror = () => resolve([])
    })
  } catch (err) {
    return []
  }
}

// ── Mutation Queue (Last-Write-Wins) ────────────────────
export async function enqueueMutation({ entity_type, entity_id, action = 'patch', data }) {
  try {
    const db = await openDB()
    if (!db) return null
    const id = (crypto?.randomUUID ? crypto.randomUUID() : 'mut-' + Math.random().toString(36).substring(2))
    const item = {
      id,
      entity_type,
      entity_id,
      action,
      data,
      client_timestamp: new Date().toISOString(),
    }
    const tx = db.transaction('mutation_queue', 'readwrite')
    tx.objectStore('mutation_queue').put(item)
    return item
  } catch (err) {
    console.warn('Gagal mencatat mutasi offline:', err)
    return null
  }
}

export async function getPendingMutations() {
  try {
    const db = await openDB()
    if (!db) return []
    return new Promise((resolve) => {
      const tx = db.transaction('mutation_queue', 'readonly')
      const req = tx.objectStore('mutation_queue').getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => resolve([])
    })
  } catch (err) {
    return []
  }
}

export async function removeMutations(processedIds) {
  if (!processedIds || processedIds.length === 0) return
  try {
    const db = await openDB()
    if (!db) return
    const tx = db.transaction('mutation_queue', 'readwrite')
    const store = tx.objectStore('mutation_queue')
    for (const id of processedIds) {
      store.delete(id)
    }
  } catch (err) {
    console.warn('Gagal membersihkan mutasi selesai:', err)
  }
}
