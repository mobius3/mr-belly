import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import invoicesReducer from '@/features/invoices/invoicesSlice'
import { compress, decompress } from 'lz-string'

const storageKey = '__mr_belly_state__' as const

const saveState = (state: RootState) => {
  const stringified = JSON.stringify(state)
  const compressed = compress(stringified)
  localStorage.setItem(storageKey, compressed)
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
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
