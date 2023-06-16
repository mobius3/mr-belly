import { Link } from 'react-router-dom'

type ButtonProps = {
  type?: 'button' | 'submit'
  className?: string
  children: any
  to?: any
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
  small: 'leading-4',
  normal: 'leading-6',
  big: 'leading-10',
}

const LinkButton = (props: ButtonProps) => {
  const color = props.color || 'gray'
  const type = props.type || 'button'
  const disabled = props.disabled || false
  const size = props.size || 'normal'
  const to = props.to
  return (
    <Link
      to={to}
      type={type}
      className={`${props.className || ''}
          block ${sizeMapping[size]}  w-40 rounded border p-2 text-xs font-medium
          transition-all duration-200
          disabled:cursor-not-allowed disabled:opacity-50 ${colorMapping[color]}`}
    >
      {props.children}
    </Link>
  )
}

export default LinkButton
