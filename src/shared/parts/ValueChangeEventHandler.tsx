import { ChangeEvent } from 'react'

type ValueChangeEventHandler<T = any> = (event: {
  name: string
  value: T
}) => void

const makeValueChangeEmitter =
  (name: string, handler?: ValueChangeEventHandler) =>
  (value: unknown | ChangeEvent) => {
    if (!handler) return
    if (
      typeof value === 'object' &&
      value != null &&
      'target' in value &&
      typeof value.target === 'object' &&
      value.target != null &&
      'value' in value.target
    ) {
      handler({ name, value: value.target.value })
    } else handler({ name, value })
  }

export default ValueChangeEventHandler
export { makeValueChangeEmitter }
