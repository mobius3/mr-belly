import { nanoid } from '@reduxjs/toolkit'
import React from 'react'
import ValueChangeEventHandler, { makeValueChangeEmitter } from './ValueChangeEventHandler'

export type SelectProps = {
  id?: any
  label: string
  name: string
  value: any
  onValueChange?: ValueChangeEventHandler
  extraClassName?: string
  children?: any
}

const Select = (props: SelectProps) => {
  const { children, onValueChange, value, extraClassName, name, id, label } = props
  return (
    <label className={`${extraClassName || ''} inline-block w-full pt-1.5 pb-1.5 text-xs font-medium`}>
      {label}
      <select
        id={id || nanoid()}
        name={name}
        className={`
          block h-10 w-full rounded border
          border-transparent bg-gray-100 p-2
          text-sm font-medium outline-none
          transition-all duration-200 focus:border-gray-400 focus:bg-gray-200
        `}
        value={value}
        onChange={makeValueChangeEmitter(name, onValueChange)}
      >
        {children}
      </select>
    </label>
  )
}

export default Select
