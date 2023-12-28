import { useState } from 'react'
import Form from '../../components/Form'
import Receipts from '../../components/Receipts'
import { Receipt } from '../../types'

const Home: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])

  return (
    <>
      <Form setReceipts={setReceipts} receipts={receipts} />
      <Receipts receipts={receipts} />
    </>
  )
}

export default Home
