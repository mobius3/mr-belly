import '@formatjs/intl-locale/polyfill'
import { getCurrency } from 'locale-currency'
import { localeId } from './locale'

type CurrencyData = {
  thousands: string
  decimal: string
  symbol: string
  maximumFractionDigits: number
}
type CurrencyDataMap = { [k: string]: CurrencyData }

const preferredCurrency = getCurrency(localeId)

const currencyList = Intl.supportedValuesOf('currency').filter((currency) => {
  const opts = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).resolvedOptions()
  return opts.maximumFractionDigits > 0
})

const currencyData: CurrencyDataMap = currencyList.reduce((info, currency) => {
  const formatter = Intl.NumberFormat(localeId, { style: 'currency', currency })
  const parts = formatter.formatToParts(1000.5)
  const options = formatter.resolvedOptions()
  const symbol = formatter.format(0).replace(/[0-9\s.\uFEFF\xA0]/g, '')
  const currencyInfo = {
    thousands: parts.find((part) => part.type == 'group')!.value,
    decimal: parts.find((part) => part.type == 'decimal')!.value,
    symbol: parts.find((part) => part.type == 'currency')!.value,
    maximumFractionDigits: options.maximumFractionDigits,
  }

  return {
    ...info,
    [currency]: currencyInfo,
  }
}, {} as CurrencyDataMap)

const numberFormat = (value: number, opts?: { locale?: string }) => {
  opts ??= {
    locale: localeId,
  }

  opts.locale ??= localeId
  const formatter = Intl.NumberFormat(opts.locale)
  return formatter.format(value)
}

const currencyFormat = (value: number, opts?: { currency?: string; locale?: string }) => {
  opts ??= {
    currency: preferredCurrency,
    locale: localeId,
  }

  opts.locale ??= localeId
  opts.currency ??= preferredCurrency
  const formatter = Intl.NumberFormat(opts.locale, { style: 'currency', currency: opts.currency,  })
  return formatter.format(value)
}

export { currencyList, currencyData, preferredCurrency, currencyFormat, numberFormat }
