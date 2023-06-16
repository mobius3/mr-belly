import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSadTear } from '@fortawesome/free-regular-svg-icons'

const InvoiceNotFound = () => {
  return (
    <div className={'m-10 flex flex-col items-center justify-center gap-5'}>
      <FontAwesomeIcon icon={faFaceSadTear} className={'h-20 w-20'}></FontAwesomeIcon>
      <div>Invoice not found</div>
    </div>
  )
}

export default InvoiceNotFound
