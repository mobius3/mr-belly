import '@formatjs/intl-locale/polyfill'
import { getCurrency } from 'locale-currency'
import { localeId } from './locale'
import { CurrencyId } from '@/shared/locale-data'

const preferredCurrency: CurrencyId = getCurrency(localeId) as CurrencyId

export { preferredCurrency }
