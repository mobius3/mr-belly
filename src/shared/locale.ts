import * as localeData from '@/shared/locale-data'

const defaultLocaleId = navigator.languages ? navigator.languages[0] : navigator.language

const localeNumberFormat = (locale: string) => {
  return localeData.localeNumberFormats[locale as (typeof localeData.localeIds)[number]]
}

export { defaultLocaleId as localeId, localeNumberFormat }
