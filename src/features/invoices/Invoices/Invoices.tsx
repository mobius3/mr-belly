import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { copyInvoice, InvoiceData } from '@/features/invoices/InvoiceData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faCopy, faEdit, faPrint, faRemove, faRotateLeft, faWarning } from '@fortawesome/free-solid-svg-icons'
import Button from '@/shared/parts/Button'
import { Link, useNavigate } from 'react-router-dom'
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons'
import { Formatter } from '@/shared/formatters'
import { dateFormat } from '@/shared/date'
import mrBellyInvoiceTemplate from '@/features/invoices/templates/mr-belly-invoice-template'
import PageHeader from '@/shared/parts/PageHeader'
import { invoiceRemoved, invoiceSaved } from '@/features/invoices/invoicesSlice'
import { useMemo, useState } from 'react'

const InvoiceElement = (props: { invoice: InvoiceData }) => {
  const { invoice } = props
  const [askIfSureToDelete, setAskIfSureToDelete] = useState(false)

  const editUrl = `/invoices/${invoice.id}/edit`

  const dispatch = useAppDispatch()

  const renderInvoiceClicked = async () => {
    const data = mrBellyInvoiceTemplate(invoice)
    const w = window.open()
    if (!w) return
    w.document.write(data)
  }

  const copyInvoiceClicked = async () => {
    dispatch(invoiceSaved(copyInvoice(invoice)))
  }

  const removeInvoiceClicked = async () => {
    dispatch(invoiceRemoved(invoice))
  }

  const currencyFormatter = Formatter.currency(invoice.numberLocale, invoice.currency)

  const deleteButton = useMemo(() => {
    if (askIfSureToDelete)
      return (
        <div className={'flex gap-3'}>
          <span className={'text-xs'}>Really? This cannot be undone.</span>
          <button onClick={removeInvoiceClicked} className={'group block text-xs'}>
            <div className={'flex items-center gap-3 rounded bg-red-600 text-white'}>
              <span className={'flex-grow px-1 text-right'}>I'm sure.</span>
              <FontAwesomeIcon icon={faWarning} className={'text-white-300 w-4'} />
            </div>
          </button>
          <button onClick={() => setAskIfSureToDelete(false)} className={'group block text-xs'}>
            <div className={'flex items-center gap-3 rounded bg-green-600 text-white'}>
              <span className={'flex-grow px-1 text-right'}>Not really.</span>
              <FontAwesomeIcon icon={faRotateLeft} className={'text-white-300 w-4'} />
            </div>
          </button>
        </div>
      )
    else
      return (
        <button onClick={() => setAskIfSureToDelete(true)} className={'group block text-xs'}>
          <div className={'flex items-center gap-3 text-transparent hover:text-gray-600'}>
            <span className={'flex-grow text-right text-transparent group-hover:text-gray-600'}>Remove</span>
            <FontAwesomeIcon icon={faRemove} className={'w-4 text-red-300 group-hover:text-red-600'} />
          </div>
        </button>
      )
  }, [askIfSureToDelete])

  return (
    <li key={invoice.id} className={'h-30 flex flex-col rounded border border-gray-200 p-3 sm:flex-row'}>
      <div className={'flex flex-grow flex-col content-between gap-3'}>
        <div>
          <span className={'font-bold'}>
            {invoice.number}: From {invoice.sender.name} to {invoice.receiver.name}
          </span>
        </div>
        <ul className={'w-40 text-sm'}>
          <li>
            <span className={'inline-block w-10 font-semibold'}>Total:</span> {currencyFormatter.format(invoice.total)}
          </li>
          <li>
            <span className={'inline-block w-10 font-semibold'}>Due:</span> {dateFormat(invoice.due)}
          </li>
          <li>
            <span className={'inline-block w-10 font-semibold'}>Date:</span> {dateFormat(invoice.date)}
          </li>
        </ul>
      </div>

      <div className={'flex flex-row justify-evenly gap-3 pt-3 sm:flex-col sm:pt-0'}>
        <button onClick={renderInvoiceClicked} className={'group block text-xs'}>
          <div className={'flex items-center gap-3'}>
            <span className={'flex-grow text-right text-transparent group-hover:text-gray-600'}>Print</span>
            <FontAwesomeIcon icon={faPrint} className={'w-4 text-gray-300 group-hover:text-gray-600'} />
          </div>
        </button>

        <Link to={editUrl} className={'group block text-xs'}>
          <div className={'flex items-center gap-3'}>
            <span className={'flex-grow text-right text-transparent group-hover:text-gray-600'}>Edit</span>
            <FontAwesomeIcon icon={faEdit} className={'w-4 text-gray-300 group-hover:text-gray-600'} />
          </div>
        </Link>

        <button onClick={copyInvoiceClicked} className={'group block text-xs'}>
          <div className={'flex items-center gap-3'}>
            <span className={'flex-grow text-right text-transparent group-hover:text-gray-600'}>Copy</span>
            <FontAwesomeIcon icon={faCopy} className={'w-4 text-gray-300 group-hover:text-gray-600'} />
          </div>
        </button>

        {deleteButton}
      </div>
    </li>
  )
}

const Invoices = () => {
  const invoices: InvoiceData[] = useAppSelector((state) =>
    Object.values(state.invoices).sort((a, b) => a.date.localeCompare(b.date))
  )
  const invoiceElements = useMemo(
    () =>
      invoices
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((invoice) => <InvoiceElement invoice={invoice} key={invoice.id} />),
    [invoices]
  )

  const navigate = useNavigate()

  let invoiceBlock = (
    <div className={'flex h-40 flex-col items-center justify-center gap-5'}>
      <span>
        No invoices yet <FontAwesomeIcon icon={faFaceSadTear}></FontAwesomeIcon>
      </span>
      <Button onClick={() => navigate('invoices/new')}>Add invoice</Button>
    </div>
  )
  if (invoices.length > 0) {
    invoiceBlock = <ul className={'space-y-3'}>{invoiceElements}</ul>
  }

  return (
    <div className={'m-10 flex flex-col px-4'}>
      <PageHeader
        right={[
          <Button className={'flex h-6 w-6 items-center justify-center rounded-full'} onClick={() => navigate('/invoices/new')}>
            <FontAwesomeIcon icon={faAdd} />
          </Button>,
        ]}
      >
        Invoices
      </PageHeader>
      <div className={'mx-3 block flex-grow py-3 text-sm font-medium'}>{invoiceBlock}</div>
    </div>
  )
}

export default Invoices
