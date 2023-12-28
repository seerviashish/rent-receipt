import PrintIcon from '@mui/icons-material/Print'
import { Box, Button, Typography } from '@mui/material'
import React, { useRef } from 'react'
import QRCode from 'react-qr-code'
import ReactToPrint from 'react-to-print'
import { Receipt } from '../../types'
import { toWordsBTC, toWordsEURO, toWordsINR, toWordsUSD } from '../../utils'
import { MUIBox } from './styled'
interface IReceipts {
  receipts: Receipt[]
}

const Receipts: React.FC<IReceipts> = ({ receipts }) => {
  const receiptsRef = useRef<HTMLDivElement>(null)
  return (
    <>
      {receipts.length > 0 && (
        <Box className="flex flex-row gap-8 p-2">
          <ReactToPrint
            trigger={() => {
              return (
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<PrintIcon />}
                >
                  {'Print Receipts'}
                </Button>
              )
            }}
            content={() => receiptsRef.current}
          />
        </Box>
      )}
      <Box className="flex flex-col gap-8 p-4" ref={receiptsRef}>
        {receipts.map((receipt, index) => {
          return (
            <MUIBox
              key={receipt.id}
              isPageBreak={index < receipts.length - 1 && index % 2 == 1}
              className="m-0 flex flex-col gap-2 border-0 border-b-2 border-dashed border-blue-100 pb-5 md:m-4"
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
                <Typography variant="body1" component={'p'}>
                  {'Received a sum of'}
                  <Typography component={'strong'} className="!font-bold">
                    {` ${
                      receipt.tenant.currency
                    } ${receipt.tenant.rentPerMonth.toFixed(2)} /- `}
                  </Typography>
                  <Typography component={'span'}>{'in words'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` (${(receipt.tenant.currency === 'INR'
                      ? toWordsINR
                      : receipt.tenant.currency === 'USD'
                        ? toWordsUSD
                        : receipt.tenant.currency === 'EUR'
                          ? toWordsEURO
                          : toWordsBTC
                    ).convert(receipt.tenant.rentPerMonth)} ${
                      receipt.tenant.currency === 'BTC' ? ' Bitcoin' : ''
                    }) `}
                  </Typography>
                  <Typography component={'span'}>
                    {'from the occupant'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.tenant.name} `}
                  </Typography>
                  <Typography component={'span'}>{'(PAN number:'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.tenant.panNo}) `}
                  </Typography>
                  <Typography component={'span'}>
                    {'via (payment mode)'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.paymentMode} `}
                  </Typography>
                  <Typography component={'span'}>
                    {'on (payment date)'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.rentCollectedOn.format('DD MMM, YYYY')} `}
                  </Typography>
                  <Typography component={'span'}>
                    {'towards the rent @'}
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${
                      receipt.tenant.currency
                    } ${receipt.tenant.rentPerMonth.toFixed(2)} /- `}
                  </Typography>
                  <Typography component={'span'}>{'per month from'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.rentFrom.format('DD MMM, YYYY')} `}
                  </Typography>
                  <Typography component={'span'}>{'to'}</Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.rentUpto.format('DD MMM, YYYY')} `}
                  </Typography>
                  <Typography component={'span'}>
                    {
                      'for the house/apartment/accommodation/property situated at'
                    }
                  </Typography>
                  <Typography component={'strong'} className="!font-bold">
                    {` ${receipt.tenant.address.replace('\n', ' ')}.`}
                  </Typography>
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between gap-7 sm:gap-2 print:gap-2">
                <Box className="flex flex-col gap-2">
                  <Typography component={'p'} className=" !font-bold">
                    <Typography component={'span'} className="block">
                      {'Name of Owner'}
                    </Typography>
                    {receipt.landLord.name}
                  </Typography>
                  <Typography component={'p'} className=" !font-bold">
                    <Typography component={'span'} className="block">
                      {'Owner`s PAN number'}
                    </Typography>
                    {receipt.landLord.panNo}
                  </Typography>
                  <Typography component={'pre'} className=" !font-bold">
                    <Typography component={'p'}>{'Owner`s Address'}</Typography>
                    {receipt.landLord.address}
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
                      value={`${
                        import.meta.env.MODE === 'production'
                          ? 'https://seerviashish.github.io/rent-receipt/'
                          : window.location.href
                      }receipt?qr=${encodeURIComponent(
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
            </MUIBox>
          )
        })}
      </Box>
    </>
  )
}
export default Receipts
