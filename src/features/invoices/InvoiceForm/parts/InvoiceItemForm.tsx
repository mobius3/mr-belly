import Input from '@/shared/parts/Input'
import { useEffect, useState } from 'react'
import CurrencyInput from '@/shared/parts/CurrencyInput'
import { CurrencyId, LocaleId } from '@/shared/locale-data'

export type Props = {
  values: FormValues
  onChange: (values: FormValues) => void
  currency: CurrencyId
  locale: LocaleId

  extraClassName?: string
}

const emptyValues = {
  name: '',
  description: '',
  price: 0,
  quantity: 1,
}

type FormValues = typeof emptyValues

const InvoiceItemForm = (props: Props) => {
  const { values, onChange, extraClassName, currency, locale } = props
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    window.addEventListener('resize', () => setWidth(window.innerWidth))
  }, [])

  const hideLabels = width > 640

  const setFormValue = (key: string, value: any) => {
    const newFormValues = { ...values, [key]: value }
    onChange(newFormValues)
  }

  return (
    <div className={`${extraClassName || ''} gap-3 sm:flex`}>
      <Input
        label={'Name'}
        type={'text'}
        name={'name'}
        value={values.name}
        onValueChange={(e) => setFormValue('name', e.value)}
        extraClassName={'flex-none sm:w-40'}
        hideLabel={hideLabels}
      />
      <Input
        label={'Description'}
        type={'text'}
        name={'description'}
        value={values.description}
        onValueChange={(e) => setFormValue('description', e.value)}
        hideLabel={hideLabels}
      />
      <CurrencyInput
        label={'Price'}
        currency={currency}
        name={'price'}
        value={values.price}
        onValueChange={(e) => setFormValue('price', e.value)}
        extraClassName={'flex-none sm:w-40'}
        hideLabel={hideLabels}
        locale={locale}
      />
      <Input
        label={'Quantity'}
        type={'number'}
        name={'quantity'}
        value={values.quantity}
        onValueChange={(e) => setFormValue('quantity', parseInt(e.value))}
        extraClassName={'flex-none sm:w-20'}
        hideLabel={hideLabels}
      />
    </div>
  )
}

export { type FormValues as InvoiceItemFormValues, emptyValues as emptyItemFormValues }
export default InvoiceItemForm
