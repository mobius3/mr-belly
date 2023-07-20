import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { copyInvoice, InvoiceData, printInvoice } from '@/features/invoices/InvoiceData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAdd,
  faCopy,
  faEdit,
  faFileExport,
  faFileImport,
  faPrint,
  faRemove,
  faRotateLeft,
  faWarning,
} from '@fortawesome/free-solid-svg-icons'
import Button from '@/shared/parts/Button'
import { Link, useNavigate } from 'react-router-dom'
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons'
import { Formatter } from '@/shared/formatters'
import { dateFormat } from '@/shared/date'
import PageHeader from '@/shared/parts/PageHeader'
import { invoiceRemoved, invoiceSaved } from '@/features/invoices/invoicesSlice'
import { exportState, importState } from '@/app/store'
import { useMemo, useState } from 'react'

const InvoiceElement = (props: { invoice: InvoiceData }) => {
  const { invoice } = props
  const [askIfSureToDelete, setAskIfSureToDelete] = useState(false)

  const editUrl = `/invoices/${invoice.id}/edit`

  const dispatch = useAppDispatch()
  const renderInvoiceClicked = () => printInvoice(invoice)
  const copyInvoiceClicked = () => dispatch(invoiceSaved(copyInvoice(invoice)))
  const removeInvoiceClicked = () => dispatch(invoiceRemoved(invoice))

  const currencyFormatter = Formatter.currency(invoice.numberLocale, invoice.currency)

  const deleteButton = useMemo(() => {
    if (askIfSureToDelete)
      return (
        <div className={'flex w-1/4 gap-1'}>
          <button onClick={removeInvoiceClicked} className={'group block flex-grow text-xs'}>
            <div className={'flex items-center justify-center rounded bg-red-600 text-white'}>
              <span className={'hidden flex-grow px-1 text-right sm:block'}>Yes!</span>
              <FontAwesomeIcon icon={faWarning} className={'text-white-300 w-4'} />
            </div>
          </button>
          <button onClick={() => setAskIfSureToDelete(false)} className={'group block flex-grow text-xs'}>
            <div className={'flex items-center justify-center rounded bg-green-600 text-white'}>
              <span className={'hidden flex-grow px-1 text-right sm:block'}>No...</span>
              <FontAwesomeIcon icon={faRotateLeft} className={'text-white-300 w-4'} />
            </div>
          </button>
        </div>
      )
    else
      return (
        <button onClick={() => setAskIfSureToDelete(true)} className={'group block w-1/4 text-xs sm:w-auto'}>
          <div className={'flex items-center justify-center gap-1 hover:text-gray-600 sm:text-transparent'}>
            <span className={'text-gray-300 group-hover:text-gray-600 sm:flex-grow sm:text-right sm:text-transparent'}>
              Remove
            </span>
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
        <button onClick={renderInvoiceClicked} className={'group block w-1/4 text-xs sm:w-auto'}>
          <div className={'flex items-center justify-center gap-1'}>
            <span className={'text-right text-gray-300 group-hover:text-gray-600 sm:flex-grow sm:text-transparent'}>Print</span>
            <FontAwesomeIcon icon={faPrint} className={'w-4 text-gray-300 group-hover:text-gray-600'} />
          </div>
        </button>

        <Link to={editUrl} className={'group inline-block w-1/4 text-xs sm:w-auto'}>
          <div className={'flex h-full items-center justify-center gap-1 align-middle'}>
            <span className={'text-right text-gray-300 group-hover:text-gray-600 sm:flex-grow sm:text-transparent'}>Edit</span>
            <FontAwesomeIcon icon={faEdit} className={'w-4 text-gray-300 group-hover:text-gray-600'} />
          </div>
        </Link>

        <button onClick={copyInvoiceClicked} className={'group block w-1/4 text-xs sm:w-auto'}>
          <div className={'flex items-center justify-center gap-1'}>
            <span className={'text-right text-gray-300 group-hover:text-gray-600 sm:flex-grow sm:text-transparent'}>Copy</span>
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

  const exportInvoicesClicked = () => exportState()
  const importInvoicesClicked = () => importState()

  return (
    <div className={'m-10 flex flex-col px-4'}>
      <PageHeader
        right={[
          <Button className={'flex h-6 w-6 items-center justify-center rounded-full'} onClick={() => navigate('/invoices/new')}>
            <FontAwesomeIcon icon={faAdd} />
          </Button>,
          <Button className={'flex h-6 w-6 items-center justify-center rounded-full'} onClick={exportInvoicesClicked}>
            <FontAwesomeIcon icon={faFileExport} />
          </Button>,
          <Button className={'flex h-6 w-6 items-center justify-center rounded-full'} onClick={importInvoicesClicked}>
            <FontAwesomeIcon icon={faFileImport} />
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
