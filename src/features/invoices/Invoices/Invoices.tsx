import { useAppSelector } from '@/app/hooks'
import { InvoiceData } from '@/features/invoices/InvoiceData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faEdit, faPrint } from '@fortawesome/free-solid-svg-icons'
import Button from '@/shared/parts/Button'
import { useNavigate } from 'react-router-dom'
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons'
import { Formatter } from '@/shared/formatters'
import { dateFormat } from '@/shared/date'
import LinkButton from '@/shared/parts/LinkButton'
import mrBellyInvoiceTemplate from '@/features/invoices/templates/mr-belly-invoice-template'
import PageHeader from '@/shared/parts/PageHeader'

const InvoiceElement = (props: { invoice: InvoiceData }) => {
  const { invoice } = props

  const editUrl = `/invoices/${invoice.id}/edit`

  const renderInvoiceClicked = async () => {
    const data = mrBellyInvoiceTemplate(invoice)
    const w = window.open()
    if (!w) return
    w.document.write(data)
  }

  const currencyFormatter = Formatter.currency(invoice.numberLocale, invoice.currency)

  return (
    <li key={invoice.id} className={'h-30 flex flex-col rounded border border-gray-200 p-3 sm:flex-row'}>
      <div className={'flex flex-grow flex-col content-between gap-3'}>
        <div>
          <span className={'font-bold'}>
            From {invoice.sender.name} to {invoice.receiver.name}
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
        <Button onClick={renderInvoiceClicked}>
          <div className={'flex items-center justify-between gap-3'}>
            <span className={'flex-grow text-center'}>Print</span>
            <FontAwesomeIcon icon={faPrint} />
          </div>
        </Button>
        <LinkButton to={editUrl}>
          <div className={'flex items-center justify-between gap-3'}>
            <span className={'flex-grow text-center'}>Edit</span>
            <FontAwesomeIcon icon={faEdit} />
          </div>
        </LinkButton>
      </div>
    </li>
  )
}

const Invoices = () => {
  const invoices: InvoiceData[] = useAppSelector((state) =>
    Object.values(state.invoices).sort((a, b) => a.date.localeCompare(b.date))
  )
  const invoiceElements = invoices.map((invoice) => <InvoiceElement invoice={invoice} key={invoice.id} />)

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
