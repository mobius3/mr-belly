import { nanoid } from '@reduxjs/toolkit'
import { NumericFormat } from 'react-number-format'
import ValueChangeEventHandler from './ValueChangeEventHandler'
import { NumberFormatValues } from 'react-number-format/types/types'
import { localeNumberFormat } from '@/shared/locale'
import { CurrencyId, currencySymbols, LocaleId } from '@/shared/locale-data'

export type InputProps = {
  id?: any
  label: string
  currency: CurrencyId
  locale: LocaleId
  name: string
  value: any

  readonly?: boolean | undefined
  onValueChange?: ValueChangeEventHandler<number | undefined>
  extraClassName?: string
  extraInputClassName?: string

  hideLabel?: boolean
}

const CurrencyInput = (props: InputProps) => {
  const { extraInputClassName, currency, hideLabel, readonly, onValueChange, value, extraClassName, name, id, label, locale } =
    props

  const unwrapCurrencyValueAndCallHandler = (change: NumberFormatValues) =>
    onValueChange && onValueChange({ name, value: change.floatValue })

  const currencyInfo = localeNumberFormat(locale)

  console.log(currencyInfo)
  if (!currencyInfo) {
  }

  return (
    <label className={`${extraClassName || ''} inline-block w-full pt-1.5 pb-1.5 text-xs font-medium`}>
      {hideLabel ? '' : label}
      <NumericFormat
        id={id || nanoid()}
        name={name}
        readOnly={readonly}
        thousandSeparator={currencyInfo.thousands}
        decimalSeparator={currencyInfo.decimal}
        prefix={currencySymbols[currency] + ' '}
        decimalScale={currencyInfo.maximumFractionDigits}
        fixedDecimalScale={readonly}
        className={`block h-10 w-full
         rounded border border-transparent bg-gray-200
          p-2 text-sm font-medium
          outline-none transition-all duration-200 read-only:border-none focus:border-gray-400 focus:bg-gray-300 read-only:focus:bg-gray-200
          ${extraInputClassName}
        `}
        value={value}
        onValueChange={unwrapCurrencyValueAndCallHandler}
      />
    </label>
  )
}

export default CurrencyInput
