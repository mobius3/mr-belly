import { nanoid } from '@reduxjs/toolkit'
import ValueChangeEventHandler, { makeValueChangeEmitter } from './ValueChangeEventHandler'

export type InputProps = {
  id?: any
  label: string
  type: 'text' | 'number' | 'date'
  name: string
  value: any

  readonly?: boolean | undefined
  onValueChange?: ValueChangeEventHandler
  extraClassName?: string

  hideLabel?: boolean
}

const Input = (props: InputProps) => {
  const { type, hideLabel, readonly, onValueChange, value, extraClassName, name, id, label } = props

  return (
    <label className={`${extraClassName || ''} inline-block w-full pt-1.5 pb-1.5 text-xs font-medium`}>
      {hideLabel ? '' : label}
      <input
        id={id || nanoid()}
        type={type}
        name={name}
        readOnly={readonly}
        className={`block h-10 w-full
         rounded border border-transparent bg-gray-200
          p-2 text-sm font-medium
          outline-none transition-all duration-200 read-only:border-none focus:border-gray-400 focus:bg-gray-300 read-only:focus:bg-gray-200
        `}
        value={value}
        onChange={makeValueChangeEmitter(name, onValueChange)}
      ></input>
    </label>
  )
}

export default Input
