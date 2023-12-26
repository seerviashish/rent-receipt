import { useState } from 'react'
import Form from './components/Form'
import Receipts from './components/Receipts'
import { Receipt } from './types'

const App: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([])

  return (
    <>
      <Form setReceipts={setReceipts} />
      <Receipts receipts={receipts} />
    </>
  )
}

export default App
