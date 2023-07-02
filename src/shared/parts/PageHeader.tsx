import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '@/shared/parts/Button'
import { ReactElement } from 'react'

const PageHeader = (props: {
  forceBackButton?: boolean
  onBackClicked?: () => void
  left?: ReactElement[]
  right?: ReactElement[]
  children: any
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const onBackClicked = props.onBackClicked || (() => navigate(-1))
  const left = props.left || []
  const right = props.right || []
  const hasBackButton = props.forceBackButton || location.key !== 'default'
  if (hasBackButton) {
    left.unshift(
      <Button className={'flex h-6 w-6 items-center justify-center rounded-full'} onClick={onBackClicked}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
    )
  }
  return (
    <div className={'mx-3 flex border-b border-solid border-gray-300 py-3 font-bold'}>
      <div className={'flex w-1/6 justify-start text-left'}>{...left}</div>
      <div className={'flex-grow justify-center text-center'}>{props.children}</div>
      <div className={'flex w-1/6 justify-end text-right'}>{...right}</div>
    </div>
  )
}

export default PageHeader
