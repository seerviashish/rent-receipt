import { Box } from '@mui/system'
import { useSearchParams } from 'react-router-dom'
import ReceiptView from '../../components/ReceiptView'

const Receipt: React.FC = () => {
  const [searchParam] = useSearchParams()
  const qrCode = searchParam.get('qr')

  return (
    <Box className="flex flex-col">
      <ReceiptView qrCode={qrCode} />
    </Box>
  )
}

export default Receipt
