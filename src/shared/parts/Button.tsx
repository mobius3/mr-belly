import { MouseEventHandler } from 'react'

type ButtonProps = {
  type?: 'button' | 'submit'
  className?: string
  children: any
  onClick?: MouseEventHandler
  color?: 'red' | 'green' | 'gray'
  disabled?: boolean
  size?: 'small' | 'normal' | 'big'
}

const colorMapping = {
  red: `border-red-200 hover:border-red-300 hover:bg-red-200 disabled:hover:bg-red-100`,
  green: `border-green-200 hover:border-green-300 hover:bg-green-200 disabled:hover:bg-green-100`,
  gray: `border-gray-200 hover:border-gray-300 hover:bg-gray-200 disabled:hover:bg-gray-100`,
} as const

const sizeMapping = {
  small: 'h-8',
  normal: 'h-10',
  big: 'h-12',
}

const Button = (props: ButtonProps) => {
  const color = props.color || 'gray'
  const type = props.type || 'button'
  const disabled = props.disabled || false
  const size = props.size || 'normal'
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${props.className || ''}
          block ${sizeMapping[size]} w-40 rounded border p-2 text-xs font-medium
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50 ${colorMapping[color]}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}

export default Button
