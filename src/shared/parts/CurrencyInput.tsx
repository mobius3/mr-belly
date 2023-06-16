import { nanoid } from '@reduxjs/toolkit'
import { ChangeEvent, ChangeEventHandler } from 'react'
import {
  NumericFormat,
  OnValueChange as CurrencyOnValueChange,
} from 'react-number-format'
import ValueChangeEventHandler, {
  makeValueChangeEmitter,
} from './ValueChangeEventHandler'
import { NumberFormatValues } from 'react-number-format/types/types'
import { currencyData } from '../currency'

export type InputProps = {
  id?: any
  label: string
  currency: string
  name: string
  value: any

  readonly?: boolean | undefined
  onValueChange?: ValueChangeEventHandler<number | undefined>
  extraClassName?: string
  extraInputClassName?: string

  hideLabel?: boolean
}

const CurrencyInput = (props: InputProps) => {
  const {
    extraInputClassName,
    currency,
    hideLabel,
    readonly,
    onValueChange,
    value,
    extraClassName,
    name,
    id,
    label,
  } = props

  const unwrapCurrencyValueAndCallHandler = (change: NumberFormatValues) =>
    onValueChange && onValueChange({ name, value: change.floatValue })

  const currencyInfo = currencyData[currency]

  return (
    <label
      className={`${
        extraClassName || ''
      } inline-block w-full pt-1.5 pb-1.5 text-xs font-medium`}
    >
      {hideLabel ? '' : label}
      <NumericFormat
        id={id || nanoid()}
        name={name}
        readOnly={readonly}
        thousandSeparator={currencyInfo.thousands}
        decimalSeparator={currencyInfo.decimal}
        prefix={currencyInfo.symbol + ' '}
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
