import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from '@/app/router'
import CurrencyList from 'currency-list'
;(window as any)['CL'] = CurrencyList

function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

export default App
