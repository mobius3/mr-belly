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
  },
})

export default invoicesSlice.reducer
export const { invoiceSaved } = invoicesSlice.actions
