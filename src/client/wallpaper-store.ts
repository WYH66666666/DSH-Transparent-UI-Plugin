/**
 * Large wallpaper storage: videos too big for localStorage (its ~5MB quota)
 * go into IndexedDB as raw blobs, while the setting keeps a tiny `idb:<id>`
 * marker. On boot the layer loads the blob, wraps it in an object URL and
 * hands it to the <video> element — no quota trouble, survives restarts.
 */

const DB_NAME = 'dsh-aqua-media'
const STORE = 'wallpaper'
const DB_VERSION = 1

/** Fixed key holding the File System Access handle (the browser's remembered
 *  file authorization — the closest the web allows to "remember the path"). */
const HANDLE_KEY = 'videoHandle'

declare global {
  interface Window {
    /** Chromium-only File System Access picker (absent elsewhere). */
    showOpenFilePicker?: (options?: {
      multiple?: boolean
      types?: Array<{ description?: string, accept: Record<string, string[]> }>
    }) => Promise<FileSystemFileHandle[]>
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => { resolve(request.result) }
    request.onerror = () => { reject(request.error ?? new Error('indexedDB open failed')) }
  })
}

function tx(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return db.transaction(STORE, mode).objectStore(STORE)
}

/** Store a blob and return its `idb:<id>` marker ('' on failure → caller
 *  falls back to the data-URL path). */
export async function saveVideoBlob(blob: Blob): Promise<string> {
  try {
    const db = await openDb()
    const id = `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
    await new Promise<void>((resolve, reject) => {
      const request = tx(db, 'readwrite').put(blob, id)
      request.onsuccess = () => { resolve() }
      request.onerror = () => { reject(request.error ?? new Error('blob put failed')) }
    })
    db.close()
    return `idb:${id}`
  } catch {
    return ''
  }
}

/** Load a stored blob by id (null when absent). */
export async function loadVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDb()
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const request = tx(db, 'readonly').get(id) as IDBRequest<Blob | undefined>
      request.onsuccess = () => { resolve(request.result) }
      request.onerror = () => { reject(request.error ?? new Error('blob get failed')) }
    })
    db.close()
    return blob ?? null
  } catch {
    return null
  }
}

/** Drop a stored blob (ignores failures). */
export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve) => {
      const request = tx(db, 'readwrite').delete(id)
      request.onsuccess = () => { resolve() }
      request.onerror = () => { resolve() }
    })
    db.close()
  } catch {
    /* nothing to clean */
  }
}

/** Persist a File System Access handle so the next visit can re-read the
 *  ORIGINAL file without the user picking it again. */
export async function saveVideoHandle(handle: FileSystemFileHandle): Promise<boolean> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const request = tx(db, 'readwrite').put(handle, HANDLE_KEY)
      request.onsuccess = () => { resolve() }
      request.onerror = () => { reject(request.error ?? new Error('handle put failed')) }
    })
    db.close()
    return true
  } catch {
    return false
  }
}

/** Load the remembered file handle (null when absent or storage fails). */
export async function loadVideoHandle(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openDb()
    const handle = await new Promise<FileSystemFileHandle | undefined>((resolve, reject) => {
      const request = tx(db, 'readonly').get(HANDLE_KEY) as IDBRequest<FileSystemFileHandle | undefined>
      request.onsuccess = () => { resolve(request.result) }
      request.onerror = () => { reject(request.error ?? new Error('handle get failed')) }
    })
    db.close()
    return handle ?? null
  } catch {
    return null
  }
}
