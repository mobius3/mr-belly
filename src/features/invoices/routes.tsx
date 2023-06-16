import Invoices from '@/features/invoices/Invoices/Invoices'
import InvoiceForm from '@/features/invoices/InvoiceForm/InvoiceForm'
import InvoiceRender from '@/features/invoices/InvoiceRender/InvoiceRender'

const invoicesRoutes = [
  {
    path: '',
    element: <Invoices />,
  },
  {
    path: 'invoices/:invoiceId/edit',
    element: <InvoiceForm />,
  },
  {
    path: 'invoices/:invoiceId/render',
    element: <InvoiceRender />,
  },
  {
    path: 'invoices/new',
    element: <InvoiceForm />,
  },
]

export default invoicesRoutes
