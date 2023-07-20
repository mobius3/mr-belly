import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import invoicesReducer from '@/features/invoices/invoicesSlice'
import { compress, decompress } from 'lz-string'
import { saveAs } from 'file-saver'
import formatISO from 'date-fns/formatISO'
import { pickFile } from '@/shared/file'

const storageKey = '__mr_belly_state__' as const
const metaVersion = 1 as const
const emptyMeta = {
  state: { invoices: {} },
  version: metaVersion,
} as const

const applyStateMigrations = (meta: any): MetaState => {
  // case: no meta state at all.
  if (meta === undefined || meta === null || typeof meta !== 'object') {
    return { ...emptyMeta }
  }

  // first migration: no version/raw state
  if (!meta.hasOwnProperty('version')) {
    meta = {
      state: meta as RootState,
      version: 1,
    }
  }

  return meta as MetaState
}

const saveState = (state: RootState) => {
  const metaState = { state, version: metaVersion }
  const stringified = JSON.stringify(metaState)
  const compressed = compress(stringified)
  localStorage.setItem(storageKey, compressed)
}

const exportState = () => {
  const metaState = { state: store.getState(), version: metaVersion }
  const stringified = JSON.stringify(metaState)
  const now = formatISO(new Date(), { format: 'basic' })
  saveAs(new Blob([stringified], { type: 'application/json' }), `mr-belly-v${metaVersion}-${now}.json`)
}

const loadState = () => {
  const compressed = localStorage.getItem(storageKey) || ''
  const stringified = decompress(compressed)
  const metaState = JSON.parse(stringified)
  const migratedState = applyStateMigrations(metaState)
  return migratedState.state
}

const importState = async () => {
  const file = await pickFile()
  if (file.type != 'application/json') return
  const buffer = await file.arrayBuffer()
  const stringified = new TextDecoder().decode(buffer)
  const metaState = JSON.parse(stringified)
  saveState(metaState)
  window.location.reload()
}

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
  },
  preloadedState: loadState(),
})

store.subscribe(() => saveState(store.getState()))

type MetaState = { version: number; state: any }
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
export { exportState, importState }
