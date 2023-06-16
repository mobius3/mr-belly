import { z } from 'zod'
import { currencyList } from '@/shared/currency'
import { isValid, parseISO } from 'date-fns'

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
  numberLocale: z.string().nonempty(),
  total: z.number().positive(),
  notes: z.string(),
  due: z.string().refine((value) => isValid(parseISO(value)), 'Invalid date string'),
  subtotal: z.number().positive(),
  discount: z.number().gte(0),
  currency: z.string().refine((v) => currencyList.includes(v), 'Currency not supported'),
  tax: z.number().gte(0).lte(100),
  items: z.array(InvoiceItemSchema).min(1),
  sender: InvoiceCompanySchema,
  receiver: InvoiceCompanySchema,
})

type InvoiceData = z.infer<typeof InvoiceDataSchema>
export { InvoiceDataSchema, type InvoiceData }
