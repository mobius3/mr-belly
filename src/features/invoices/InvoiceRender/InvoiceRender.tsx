import { useParams } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import InvoiceNotFound from '@/features/invoices/InvoiceNotFound'

type Props = {}
const InvoiceRender = (props: Props) => {
  const { invoiceId } = useParams()
  const invoice = useAppSelector((state) => (invoiceId ? state.invoices[invoiceId] : undefined))
  if (invoice === undefined) return <InvoiceNotFound />

  return (
    <div className={'m-auto h-[210mm] w-[210mm] bg-red-900'}>
      <h1>Invoice {invoice.number}</h1>
      <div className={'absolute bottom-0'}>Bolas</div>
    </div>
  )
}

export default InvoiceRender
