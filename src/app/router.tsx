import { createBrowserRouter } from 'react-router-dom'
import Index from '@/features/index/Index'
import invoicesRoutes from '@/features/invoices/routes'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
    children: [...invoicesRoutes],
  },
])

export default router
