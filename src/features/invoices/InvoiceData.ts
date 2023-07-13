import { z } from 'zod'
import { isValid, parseISO } from 'date-fns'
import { currencyIds, localeIds } from '@/shared/locale-data'
import { nanoid } from '@reduxjs/toolkit'
import formatISO from 'date-fns/formatISO'

const InvoiceItemSchema = z.object({
  quantity: z.number().positive(),
  price: z.number().positive(),
  name: z.string(),
  description: z.string(),
})

const InvoiceCompanySchema = z.object({
  zip: z.string(),
  country: z.string(),
  city: z.string(),
  name: z.string().nonempty(),
  addressLine1: z.string().nonempty(),
  addressLine2: z.string(),
  state: z.string(),
  legalIdentifier: z.string(),
  email: z.string().email().nonempty(),
})

const InvoiceDataSchema = z.object({
  id: z.string().nonempty(),
  date: z.string().refine((value) => isValid(parseISO(value)), 'Invalid date string'),
  number: z.string().nonempty(),
  numberLocale: z.enum(localeIds),
  total: z.number().positive(),
  notes: z.string(),
  due: z.string().refine((value) => isValid(parseISO(value)), 'Invalid date string'),
  subtotal: z.number().positive(),
  discount: z.number().gte(0),
  currency: z.enum(currencyIds),
  tax: z.number().gte(0).lte(100),
  items: z.array(InvoiceItemSchema).min(1),
  sender: InvoiceCompanySchema,
  receiver: InvoiceCompanySchema,
  includeSigningFields: z.enum(['none', 'signed-by', 'signed-by-with-signature']).default('none'),
  signedBy: z.string().optional(),
})

type InvoiceData = z.infer<typeof InvoiceDataSchema>

const copy = (previous: InvoiceData): InvoiceData => {
  return {
    ...previous,
    id: nanoid(),
    number: `Copy of ${previous.number}`,
    date: formatISO(new Date(), { representation: 'date' }),
  }
}

export { InvoiceDataSchema, type InvoiceData, copy as copyInvoice }
