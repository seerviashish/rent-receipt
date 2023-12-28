import { Box, Link, Typography } from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ReceiptView from '../../components/ReceiptView'

const Receipt: React.FC = () => {
  const [searchParam] = useSearchParams()
  const navigate = useNavigate()
  const qrCode = searchParam.get('qr')

  return (
    <Box className="flex flex-col">
      {qrCode && qrCode?.trim().length > 0 ? (
        <ReceiptView qrCode={qrCode} />
      ) : (
        <Box className="flex flex-col items-center gap-2">
          <Typography variant="h4" className=" text-center">
            {'No receipt QR code found. Please scan QR code on receipt.'}
          </Typography>
          <Link
            component="button"
            variant="h4"
            onClick={() => {
              navigate('/rent-receipt/')
            }}
          >
            Navigate to Generate Rent Receipt
          </Link>
        </Box>
      )}
    </Box>
  )
}

export default Receipt
