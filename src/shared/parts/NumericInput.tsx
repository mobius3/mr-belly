import { nanoid } from '@reduxjs/toolkit'
import ValueChangeEventHandler from './ValueChangeEventHandler'
import { NumericFormat } from 'react-number-format'
import { NumberFormatValues } from 'react-number-format/types/types'

export type NumberInputProps = {
  id?: any
  label: string
  name: string
  value: any

  readonly?: boolean | undefined
  onValueChange?: ValueChangeEventHandler<number | undefined>
  extraClassName?: string

  hideLabel?: boolean

  prefix?: string
  suffix?: string
}

const NumericInput = (props: NumberInputProps) => {
  const { hideLabel, readonly, onValueChange, value, extraClassName, name, id, label, prefix, suffix } = props

  const unwrapNumericValueAndCallHandler = (change: NumberFormatValues) =>
    onValueChange && onValueChange({ name, value: change.floatValue })

  return (
    <label className={`${extraClassName || ''} inline-block w-full pt-1.5 pb-1.5 text-xs font-medium`}>
      {hideLabel ? '' : label}
      <NumericFormat
        id={id || nanoid()}
        name={name}
        readOnly={readonly}
        className={`block h-10 w-full
         rounded border border-transparent bg-gray-100
          p-2 text-sm font-medium
          outline-none transition-all duration-200 read-only:border-none focus:border-gray-400 focus:bg-gray-200 read-only:focus:bg-gray-100
        `}
        value={value}
        onValueChange={unwrapNumericValueAndCallHandler}
        prefix={prefix}
        suffix={suffix}
      />
    </label>
  )
}

export default NumericInput
