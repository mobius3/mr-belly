import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InvoiceData, InvoiceDataSchema } from '@/features/invoices/InvoiceData'

const initialState: { [k: string]: InvoiceData } = {}

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    invoiceSaved: (state, action: PayloadAction<InvoiceData>) => ({
      ...state,
      [action.payload.id]: InvoiceDataSchema.parse(action.payload),
    }),
    invoiceRemoved: (state, action: PayloadAction<{ id: string }>) => {
      const { [action.payload.id]: _, ...newState } = state
      return newState
    },
  },
})

export default invoicesSlice.reducer
export const { invoiceSaved, invoiceRemoved } = invoicesSlice.actions
