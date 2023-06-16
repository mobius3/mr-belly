import Input from '@/shared/parts/Input'

type Props = {
  values: FormValues
  onChange: (values: FormValues) => void
}

const emptyValues = {
  name: '',
  email: '',
  legalIdentifier: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  country: '',
  zip: '',
  state: '',
}

type FormValues = typeof emptyValues

const InvoiceCompanyForm = (props: Props) => {
  const formValues = props.values

  const setFormValue = (key: string, value: string) => {
    const newFormValues = { ...formValues, [key]: value }
    props.onChange(newFormValues)
  }

  return (
    <div>
      <div className={'py-5 md:grid md:grid-cols-2 md:gap-3'}>
        <Input
          label={'Name'}
          type={'text'}
          name={'name'}
          value={props.values.name}
          onValueChange={(e) => setFormValue('name', e.value)}
          extraClassName={'col-span-2'}
        />
        <Input
          label={'E-mail'}
          type={'text'}
          name={'email'}
          value={props.values.email}
          onValueChange={(e) => setFormValue('email', e.value)}
        />
        <Input
          label={'Legal identifier (eg, CNPJ or p.IVA)'}
          type={'text'}
          name={'legalIdentifier'}
          value={props.values.legalIdentifier}
          onValueChange={(e) => setFormValue('legalIdentifier', e.value)}
        />
      </div>

      <div className={'gap-3 border-t border-dashed border-gray-300 py-5 md:grid md:grid-cols-2'}>
        <Input
          label={'Address Line 1'}
          type={'text'}
          name={'addressLine1'}
          value={props.values.addressLine1}
          onValueChange={(e) => setFormValue('addressLine1', e.value)}
        />
        <Input
          label={'Address Line 2'}
          type={'text'}
          name={'addressLine2'}
          value={props.values.addressLine2}
          onValueChange={(e) => setFormValue('addressLine2', e.value)}
        />
        <Input
          label={'City'}
          type={'text'}
          name={'city'}
          value={props.values.city}
          onValueChange={(e) => setFormValue('city', e.value)}
        />
        <Input
          label={'State'}
          type={'text'}
          name={'state'}
          value={props.values.state}
          onValueChange={(e) => setFormValue('state', e.value)}
        />
        <Input
          label={'Country'}
          type={'text'}
          name={'country'}
          value={props.values.country}
          onValueChange={(e) => setFormValue('country', e.value)}
        />
        <Input
          label={'Postal code'}
          type={'text'}
          name={'zip'}
          value={props.values.zip}
          onValueChange={(e) => setFormValue('zip', e.value)}
        />
      </div>
    </div>
  )
}

export default InvoiceCompanyForm
export { type FormValues as InvoiceCompanyFormValues, emptyValues as emptyCompanyFormValues }
