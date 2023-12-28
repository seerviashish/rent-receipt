/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Form from '../../components/Form'
import Receipts from '../../components/Receipts'
import { Receipt } from '../../types'

const Home: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [searchParam] = useSearchParams()
  const qrCode = searchParam.get('qr')
  const navigate = useNavigate()
  useEffect(() => {
    if (qrCode == null || (qrCode ?? '')?.trim().length == 0) {
      return
    }
    navigate(`/rent-receipt/receipt?qr=${qrCode}`)
  }, [navigate, qrCode])

  return (
    <>
      <Form setReceipts={setReceipts} receipts={receipts} />
      <Receipts receipts={receipts} />
    </>
  )
}

export default Home
