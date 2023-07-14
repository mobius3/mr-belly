import { nanoid } from '@reduxjs/toolkit'
import React from 'react'
import ValueChangeEventHandler, { makeValueChangeEmitter } from './ValueChangeEventHandler'

export type TextAreaProps = {
  id?: any
  label: string
  name: string
  value: any
  extraClassName?: string
  onValueChange?: ValueChangeEventHandler
}

const TextArea = (props: TextAreaProps) => {
  const { onValueChange, value, extraClassName, name, id, label } = props
  return (
    <div className={`flex h-full  w-full flex-col pt-1.5 pb-1.5`}>
      <label htmlFor={name} className={`${extraClassName || ''} inline-block w-full text-xs font-medium`}>
        {label}
      </label>
      <textarea
        id={id || nanoid()}
        name={name}
        className={`
          block h-full w-full rounded border
          border-transparent bg-gray-200 p-2
          text-sm font-medium outline-none
          transition-colors duration-200 focus:border-gray-400 focus:bg-gray-300
        `}
        value={value}
        onChange={makeValueChangeEmitter(name, onValueChange)}
      ></textarea>
    </div>
  )
}

export default TextArea
