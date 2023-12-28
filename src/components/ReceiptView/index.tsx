import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Button,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'
import CryptoJS from 'crypto-js'
import moment from 'moment'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router'
import {
  FormValue,
  PaymentMode,
  Receipt,
  ReceiptAsJson,
  Verification,
} from '../../types'
import { toWordsBTC, toWordsEURO, toWordsINR, toWordsUSD } from '../../utils'

interface IReceiptView {
  qrCode?: string | null
}

const ReceiptView: React.FC<IReceiptView> = ({ qrCode }) => {
  const navigate = useNavigate()
  const [secretPhrase, setSecretPhrase] = useState<FormValue<string>>()
  const [showSecret, setShowSecret] = useState<boolean>(false)
  const [receipt, setReceipt] = useState<
    Receipt & { verification: Verification }
  >()

  useEffect(() => {
    if (qrCode == null || (qrCode ?? '').trim().length == 0) {
      return
    }
    const decodedQrCode = decodeURIComponent(qrCode)
    const parsedQrCode = JSON.parse(decodedQrCode) as ReceiptAsJson
    const receipt: Receipt & { verification: Verification } = {
      id: parsedQrCode.id,
      tenant: { ...parsedQrCode.tenant },
      landLord: { ...parsedQrCode.landLord },
      signature: parsedQrCode?.signature,
      verification: Verification.PENDING,
      rentCollectedOn: moment(new Date(parsedQrCode.rentCollectedOn)),
      rentFrom: moment(new Date(parsedQrCode.rentFrom)),
      rentUpto: moment(new Date(parsedQrCode.rentUpto)),
      paymentMode: parsedQrCode.paymentMode as `${PaymentMode}`,
    }
    setReceipt(receipt)
  }, [qrCode, setReceipt])

  const handleMouseDownSecret = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }

  const handleOnVerify = () => {
    if (secretPhrase?.data == null) {
      setSecretPhrase({
        ...secretPhrase,
        isError: true,
        error: 'Please enter secret phrase before verify receipt.',
      })
      return
    }
    const secret = secretPhrase.data
    if (qrCode == null || (qrCode ?? '').trim().length == 0) {
      return
    }
    const decodedQrCode = decodeURIComponent(qrCode)
    const parsedQrCode = JSON.parse(decodedQrCode) as ReceiptAsJson
    const decryptedSignature = CryptoJS.AES.decrypt(
      parsedQrCode?.signature ?? '',
      secret
    ).toString(CryptoJS.enc.Utf8)
    const verification =
      decryptedSignature === parsedQrCode.id
        ? Verification.SUCCESS
        : Verification.FAILED
    const receipt: Receipt & { verification: Verification } = {
      id: parsedQrCode.id,
      tenant: { ...parsedQrCode.tenant },
      landLord: { ...parsedQrCode.landLord },
      signature: parsedQrCode?.signature,
      verification,
      rentCollectedOn: moment(new Date(parsedQrCode.rentCollectedOn)),
      rentFrom: moment(new Date(parsedQrCode.rentFrom)),
      rentUpto: moment(new Date(parsedQrCode.rentUpto)),
      paymentMode: parsedQrCode.paymentMode as `${PaymentMode}`,
    }
    setReceipt(receipt)
  }

  return (
    <Box className="flex flex-col gap-2">
      <Box className="flex flex-col gap-8 p-2">
        {(receipt ? [receipt] : []).map((receipt) => {
          return (
            <Box
              key={receipt?.id}
              className="m-0 flex flex-col gap-2 border-0 border-b-2 border-dashed border-blue-100 pb-5 md:m-2"
            >
              <Box className="flex flex-col gap-1 bg-blue-200 p-1 text-center">
                <Typography variant="h6" className="uppercase">
                  {'Receipt of House Rent'}
                </Typography>
                <Typography variant="subtitle2" className="capitalize">
                  {'(Under Section 10(13A) of Income Tax Act)'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  component={'p'}
                  className="hyphens-auto"
                >
                  {'Received a sum of'}
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.tenant?.currency ?? ''} ${
                      receipt?.tenant?.rentPerMonth?.toFixed(2) ?? ''
                    } /- `}
                  </Typography>
                  <Typography component={'span'}>{'in words'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` (${(receipt?.tenant?.currency === 'INR'
                      ? toWordsINR
                      : receipt?.tenant?.currency === 'USD'
                        ? toWordsUSD
                        : receipt?.tenant?.currency === 'EUR'
                          ? toWordsEURO
                          : toWordsBTC
                    ).convert(receipt?.tenant?.rentPerMonth ?? 0)} ${
                      receipt?.tenant?.currency === 'BTC' ? ' Bitcoin' : ''
                    }) `}
                  </Typography>
                  <Typography component={'span'}>
                    {'from the occupant'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.tenant?.name ?? ''} `}
                  </Typography>
                  <Typography component={'span'}>{'(PAN number:'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.tenant?.panNo ?? ''}) `}
                  </Typography>
                  <Typography component={'span'}>
                    {'via (payment mode)'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.paymentMode ?? ''} `}
                  </Typography>
                  <Typography component={'span'}>
                    {'on (payment date)'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${
                      receipt?.rentCollectedOn?.format('DD MMM, YYYY') ?? ''
                    } `}
                  </Typography>
                  <Typography component={'span'}>
                    {'towards the rent @'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.tenant?.currency ?? ''} ${
                      receipt?.tenant?.rentPerMonth?.toFixed(2) ?? ''
                    } /- `}
                  </Typography>
                  <Typography component={'span'}>{'per month from'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.rentFrom?.format('DD MMM, YYYY')} `}
                  </Typography>
                  <Typography component={'span'}>{'to'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.rentUpto?.format('DD MMM, YYYY')} `}
                  </Typography>
                  <Typography component={'span'}>
                    {
                      'for the house/apartment/accommodation/property situated at'
                    }
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt?.tenant?.address?.replace('\n', ' ') ?? ''}.`}
                  </Typography>
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between gap-7 sm:gap-2 print:gap-2">
                <Box className="flex flex-col gap-2">
                  <Typography component={'p'} className=" !font-bold">
                    <Typography component={'span'} className="block">
                      {'Name of Owner'}
                    </Typography>
                    {receipt?.landLord?.name ?? ''}
                  </Typography>
                  <Typography component={'p'} className=" !font-bold">
                    <Typography component={'span'} className="block">
                      {'Owner`s PAN number'}
                    </Typography>
                    {receipt?.landLord?.panNo ?? ''}
                  </Typography>
                  <Typography component={'pre'} className=" !font-bold">
                    <Typography component={'p'}>{'Owner`s Address'}</Typography>
                    {receipt?.landLord?.address ?? ''}
                  </Typography>
                </Box>
                <Box className="flex h-36 w-36 min-w-36 flex-col items-center gap-2 md:h-56 md:w-56 print:h-56 print:w-56">
                  {receipt.signature && receipt.signature?.length > 0 && (
                    <QRCode
                      size={256}
                      style={{
                        height: 'auto',
                        maxWidth: '100%',
                        width: '100%',
                      }}
                      value={`https://seerviashish.github.io/rent-receipt/receipt?qr=${encodeURIComponent(
                        JSON.stringify(receipt)
                      )}`}
                      viewBox={`0 0 256 256`}
                      level="H"
                      bgColor={'#ffffff00'}
                      fgColor={'#00000090'}
                    />
                  )}
                </Box>
                <Box className="flex flex-1 flex-col items-end justify-between gap-2 sm:flex-grow-0 sm:items-center print:flex-grow-0">
                  <Box className="flex flex-col items-center gap-2">
                    <Chip
                      label={
                        receipt.verification === Verification.FAILED
                          ? 'Verification Failed'
                          : receipt.verification === Verification.SUCCESS
                            ? 'Verified Successfully'
                            : 'Verification Pending'
                      }
                      color={
                        receipt.verification === Verification.FAILED
                          ? 'error'
                          : receipt.verification === Verification.SUCCESS
                            ? 'success'
                            : 'warning'
                      }
                      variant="outlined"
                    />
                    <Box className=" flex h-36 w-28 items-center border border-dashed border-blue-500 p-1 text-center">
                      <Typography component={'span'} className="text-slate-400">
                        {'Affix Revenue Stamp of Re.1/)'}
                      </Typography>
                    </Box>
                    <Box className="flex flex-col items-center gap-2">
                      <Box className="h-12 w-36 border border-blue-500 md:h-14 md:w-64 print:h-14"></Box>
                      <Typography
                        component={'p'}
                        className=" w-40 text-center md:w-full print:w-full"
                      >
                        {'Signature of House Owner'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        })}
      </Box>

      <Box
        component={'form'}
        className="flex w-full flex-col items-center gap-8 p-2"
        noValidate
        autoComplete="off"
      >
        <Box className="flex w-full flex-col gap-4">
          <TextField
            onChange={(e) => {
              setSecretPhrase({
                data: e.target.value,
                isError: false,
                error: '',
              })
            }}
            type={showSecret ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle secret visibility"
                    onClick={() => {
                      setShowSecret((showSecret) => !showSecret)
                    }}
                    onMouseDown={handleMouseDownSecret}
                    edge="end"
                  >
                    {showSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={secretPhrase?.data ?? ''}
            error={secretPhrase?.isError}
            helperText={
              secretPhrase?.isError
                ? secretPhrase?.error
                : 'Enter your secret phrase for ownership/verification of rent receipts.'
            }
            id="secretPhrase"
            label="Enter secret phrase"
            className="flex w-full whitespace-pre-wrap md:w-1/2"
          />
          <Box className="flex w-full flex-col gap-4 sm:flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row">
            <Button variant="outlined" onClick={handleOnVerify}>
              {'Verify Receipt'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                navigate('/')
              }}
            >
              {'Generate Rent Receipt'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ReceiptView
