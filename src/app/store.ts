import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import invoicesReducer from '@/features/invoices/invoicesSlice'
import { compress, decompress } from 'lz-string'
import { saveAs } from 'file-saver'
import formatISO from 'date-fns/formatISO'

const storageKey = '__mr_belly_state__' as const

const saveState = (state: RootState) => {
  const stringified = JSON.stringify(state)
  const compressed = compress(stringified)
  localStorage.setItem(storageKey, compressed)
}

const exportState = () => {
  const stringified = JSON.stringify(store.getState())
  const now = formatISO(new Date(), { format: 'basic' })
  saveAs(new Blob([stringified], { type: 'application/json' }), `mr-belly-${document.location.hostname}-${now}.json`)
}

const loadState = () => {
  const compressed = localStorage.getItem(storageKey)
  if (!compressed) return undefined
  const stringified = decompress(compressed)
  return JSON.parse(stringified)
}

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
  },
  preloadedState: loadState(),
})

store.subscribe(() => saveState(store.getState()))

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
export { exportState }
