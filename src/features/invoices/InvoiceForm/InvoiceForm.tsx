import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import InvoiceCompanyForm, { emptyCompanyFormValues, InvoiceCompanyFormValues } from './parts/InvoiceCompanyForm'
import InvoiceItemForm, { emptyItemFormValues, InvoiceItemFormValues } from './parts/InvoiceItemForm'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faPrint, faRemove } from '@fortawesome/free-solid-svg-icons'
import Input from '@/shared/parts/Input'
import formatISO from 'date-fns/formatISO'
import Select from '@/shared/parts/Select'
import TextArea from '@/shared/parts/TextArea'
import CurrencyInput from '@/shared/parts/CurrencyInput'
import { preferredCurrency } from '@/shared/currency'
import NumericInput from '@/shared/parts/NumericInput'
import Button from '@/shared/parts/Button'
import { faSave } from '@fortawesome/free-regular-svg-icons'
import { InvoiceData, InvoiceDataSchema } from '@/features/invoices/InvoiceData'
import { nanoid } from '@reduxjs/toolkit'
import { invoiceSaved } from '@/features/invoices/invoicesSlice'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useNavigate, useParams } from 'react-router-dom'
import InvoiceNotFound from '@/features/invoices/InvoiceNotFound'
import { localeId } from '@/shared/locale'
import { CurrencyId, currencyIds, currencySymbols, LocaleId, localeIds, localeNames } from '@/shared/locale-data'
import PageHeader from '@/shared/parts/PageHeader'

const defaultGeneralInformationFormValues = () => ({
  date: formatISO(new Date(), { representation: 'date' }),
  due: formatISO(new Date(), { representation: 'date' }),
  currency: preferredCurrency as CurrencyId,
  numberLocale: localeId as LocaleId,
  number: '0001',
  signedBy: undefined as string | undefined,
  includeSigningFields: 'none' as InvoiceData['includeSigningFields'],
})

type GeneralInformationFormValues = ReturnType<typeof defaultGeneralInformationFormValues>

const defaultPaymentInformationFormValues = () => ({
  tax: 0,
  notes: '',
  discount: 0,
})

type PaymentInformationFormValues = ReturnType<typeof defaultPaymentInformationFormValues>

const emptyFormValues = {
  senderFormValues: emptyCompanyFormValues,
  receiverFormValues: emptyCompanyFormValues,
  items: [emptyItemFormValues],
  generalInformation: defaultGeneralInformationFormValues(),
  paymentInformation: defaultPaymentInformationFormValues(),
}

type FormValues = typeof emptyFormValues
const produceInitialFormValues = (invoiceData?: InvoiceData): FormValues => {
  if (!invoiceData) return emptyFormValues
  return {
    senderFormValues: invoiceData.sender,
    receiverFormValues: invoiceData.receiver,
    items: invoiceData.items,
    generalInformation: {
      date: invoiceData.date,
      due: invoiceData.due,
      currency: invoiceData.currency,
      number: invoiceData.number,
      numberLocale: invoiceData.numberLocale || localeId,
      signedBy: invoiceData.signedBy,
      includeSigningFields: invoiceData.includeSigningFields || 'none',
    },
    paymentInformation: {
      tax: invoiceData.tax,
      discount: invoiceData.discount,
      notes: invoiceData.notes,
    },
  }
}

const InvoiceForm = () => {
  const { invoiceId } = useParams()
  const savedInvoiceData = useAppSelector((state) => (invoiceId ? state.invoices[invoiceId] : undefined))
  const initialFormValues = useMemo(() => produceInitialFormValues(savedInvoiceData), [savedInvoiceData])
  const [senderFormValues, setSenderFormValues] = useState<InvoiceCompanyFormValues>(initialFormValues.senderFormValues)
  const [receiverFormValues, setReceiverFormValues] = useState<InvoiceCompanyFormValues>(initialFormValues.receiverFormValues)
  const [items, setItems] = useState<InvoiceItemFormValues[]>(initialFormValues.items)
  const [generalInformation, setGeneralInformation] = useState<GeneralInformationFormValues>(initialFormValues.generalInformation)
  const [paymentInformation, setPaymentInformation] = useState<PaymentInformationFormValues>(initialFormValues.paymentInformation)
  const navigate = useNavigate()

  if (invoiceId && savedInvoiceData === undefined) return <InvoiceNotFound />

  const addInvoiceItem = () => {
    setItems([...items, emptyItemFormValues])
  }

  const removeInvoiceItem = (indexToRemove: number) => {
    setItems(items.filter((_, index: number) => index != indexToRemove))
  }

  const makeItemRow = (item: InvoiceItemFormValues, index: number) => {
    const updateItemValue = (itemValue: InvoiceItemFormValues) => {
      const newItems = [...items]
      newItems[index] = itemValue
      setItems(newItems)
    }

    return (
      <div key={index} className={'mb-10 flex gap-3 sm:mb-0'}>
        <div className={'flex-grow'}>
          <InvoiceItemForm
            values={item}
            currency={generalInformation.currency}
            locale={generalInformation.numberLocale}
            onChange={updateItemValue}
          />
        </div>
        <div className={'flex flex-none flex-col justify-center'}>
          <button
            onClick={() => removeInvoiceItem(index)}
            type={'button'}
            className={'h-6 w-6 flex-none rounded-full bg-red-100 text-gray-900 transition-all duration-200 hover:bg-red-300'}
          >
            <FontAwesomeIcon icon={faRemove} />
          </button>
        </div>
      </div>
    )
  }

  const stateFieldSetter =
    <T,>(state: T, setter: Dispatch<SetStateAction<T>>) =>
    (field: keyof T, value: unknown) =>
      setter({
        ...state,
        [field]: value,
      })

  const setGeneralInformationField = stateFieldSetter(generalInformation, setGeneralInformation)
  const setPaymentInformationField = stateFieldSetter(paymentInformation, setPaymentInformation)

  const currencyOptions = currencyIds.map((currency) => (
    <option value={currency}>
      <>
        {currency} ({currencySymbols[currency]})
      </>
    </option>
  ))

  const numberLocaleOptions = localeIds.map((locale) => (
    <option value={locale}>
      <>
        {localeNames[locale]} ({locale})
      </>
    </option>
  ))

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = paymentInformation.discount || 0
  const tax = paymentInformation.tax || 0
  const total = (subtotal - discount) * (1 + tax / 100)

  const invoiceData: InvoiceData = {
    id: invoiceId || nanoid(),
    ...generalInformation,
    ...paymentInformation,
    sender: senderFormValues,
    receiver: receiverFormValues,
    items: items,
    subtotal,
    total,
  }

  const parsed = InvoiceDataSchema.safeParse(invoiceData)
  const valid = parsed.success

  const dispatch = useAppDispatch()

  const saveInvoiceClicked = () => {
    dispatch(invoiceSaved(invoiceData))
    navigate(-1)
  }

  return (
    <form className={'m-10 block px-4'}>
      <PageHeader>Invoice</PageHeader>
      <div className={'mb-5'}>
        {/*<h1 className={styles.header}>Invoice</h1>*/}
        <div className={'gap-3 p-3 md:flex'}>
          <Input
            label={'Number'}
            type={'text'}
            name={'number'}
            value={generalInformation.number}
            onValueChange={(e) => setGeneralInformationField('number', e.value)}
            extraClassName={'md:w-1/6'}
          />
          <Input
            label={'Date'}
            type={'date'}
            name={'date'}
            value={generalInformation.date}
            onValueChange={(e) => setGeneralInformationField('date', e.value)}
            extraClassName={'md:w-1/6'}
            // extraClassName={'md:pr-3'}
          />
          <Input
            label={'Due'}
            type={'date'}
            name={'due'}
            value={generalInformation.due}
            onValueChange={(e) => setGeneralInformationField('due', e.value)}
            extraClassName={'md:w-1/6'}

            // extraClassName={'md:pl-3'}
          />
          <Select
            label={'Currency'}
            name={'currency'}
            value={generalInformation.currency}
            onValueChange={(e) => setGeneralInformationField('currency', e.value)}
            extraClassName={'md:w-1/6'}
          >
            {...currencyOptions}
          </Select>
          <Select
            label={'Number format'}
            name={'number-format'}
            value={generalInformation.numberLocale}
            onValueChange={(e) => setGeneralInformationField('numberLocale', e.value)}
            extraClassName={'md:w-1/6'}
          >
            {...numberLocaleOptions}
          </Select>
          <Select
            label={'Include signature field'}
            name={'include-signature-field'}
            value={generalInformation.includeSigningFields}
            onValueChange={(e) => setGeneralInformationField('includeSigningFields', e.value)}
            extraClassName={'md:w-1/6'}
          >
            <option value={'noigned-byne'}>None</option>
            <option value={'signed-by'}>Signed by</option>
            <option value={'sgned-by-with-signature'}>Signed by with signature</option>
          </Select>
        </div>
      </div>

      <div className={'grid md:grid-cols-1 xl:grid-cols-2 xl:gap-3'}>
        <div className={'mb-5 border-gray-300'}>
          <h1 className={'mx-3 border-b border-solid border-gray-300 py-3 font-bold'}>From:</h1>
          <div className={'px-3'}>
            <InvoiceCompanyForm values={senderFormValues} onChange={setSenderFormValues} />
          </div>
        </div>

        <div className={'mb-5 border-gray-300'}>
          <h1 className={'mx-3 border-b border-solid border-gray-300 py-3 font-bold'}>To:</h1>
          <div className={'px-3'}>
            <InvoiceCompanyForm values={receiverFormValues} onChange={setReceiverFormValues} />
          </div>
        </div>
      </div>

      <div className={'mb-5'}>
        <div className={'mx-3 flex border-b border-solid border-gray-300 py-3 font-bold'}>
          <span className={'flex-grow'}>Items:</span>
          <button
            onClick={addInvoiceItem}
            type={'button'}
            className={'w-6 flex-none rounded-full bg-gray-100 text-gray-900 transition-all duration-200 hover:bg-green-300'}
          >
            <FontAwesomeIcon icon={faAdd} />
          </button>
        </div>

        <div className={'px-3 pt-5'}>
          <div className={'-mb-1 hidden gap-3 text-xs font-medium sm:flex'}>
            <div className={'flex-none sm:w-40'}>Name</div>
            <div className={'flex-grow'}>Description</div>
            <div className={'flex-none sm:w-20'}>Price</div>
            <div className={'flex-none sm:w-20'}>Quantity</div>
            <div className={'w-6 flex-none'}></div>
          </div>
          {items.map(makeItemRow)}
        </div>
      </div>

      <div className={'mb-5'}>
        <h1 className={'mx-3 border-b border-solid border-gray-300 py-3 font-bold'}>Payment:</h1>
        <div className={'gap-3 p-3 md:flex'}>
          <div className={'flex flex-grow flex-row'}>
            <TextArea
              label={'Notes'}
              name={'notes'}
              value={paymentInformation.notes}
              onValueChange={(e) => setPaymentInformationField('notes', e.value)}
            />
          </div>

          <div className={'flex gap-3 md:block md:w-1/6 md:flex-none'}>
            <CurrencyInput
              label={'Subtotal'}
              currency={generalInformation.currency}
              name={'total'}
              value={subtotal}
              locale={generalInformation.numberLocale}
              readonly
            />
            <CurrencyInput
              label={'Discount'}
              currency={generalInformation.currency}
              name={'discount'}
              value={paymentInformation.discount}
              onValueChange={(e) => setPaymentInformationField('discount', e.value)}
              extraInputClassName={'bg-red-100 focus:border-red-300 focus:bg-red-200'}
              locale={generalInformation.numberLocale}
            />
            <NumericInput
              label={'Tax'}
              name={'tax'}
              value={paymentInformation.tax}
              onValueChange={(e) => setPaymentInformationField('tax', e.value)}
              suffix={'%'}
            />
            <CurrencyInput
              label={'Total'}
              currency={generalInformation.currency}
              name={'total'}
              value={total}
              readonly
              extraInputClassName={'bg-green-100 read-only:focus:bg-green-100'}
              locale={generalInformation.numberLocale}
            />
          </div>
        </div>
      </div>

      {generalInformation.includeSigningFields != 'none' && (
        <div className={'mb-5'}>
          <div className={'justify-center gap-3 p-3 md:flex'}>
            <Input label={'Signed by'} name={'signed-by'} type={'text'} value={generalInformation.signedBy} />
          </div>
        </div>
      )}

      <div className={'mb-5'}>
        <div className={'flex justify-center gap-3 p-3'}>
          <Button color={'green'} onClick={saveInvoiceClicked} disabled={!valid}>
            <div className={'flex items-center justify-center gap-3'}>
              Save <FontAwesomeIcon icon={faSave} />
            </div>
          </Button>
          <Button disabled={!valid}>
            <div className={'flex items-center justify-center gap-3'}>
              Print <FontAwesomeIcon icon={faPrint} />
            </div>
          </Button>
        </div>
      </div>
    </form>
  )
}

export default InvoiceForm
