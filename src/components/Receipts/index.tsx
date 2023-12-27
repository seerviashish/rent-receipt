import { Box, Typography } from '@mui/material'
import React from 'react'
import { ToWords } from 'to-words'
import { Receipt } from '../../types'
interface IReceipts {
  receipts: Receipt[]
}
const Receipts: React.FC<IReceipts> = ({ receipts }) => {
  const toWords = new ToWords({
    localeCode: 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        name: 'Rupee',
        plural: 'Rupees',
        symbol: '₹',
        fractionalUnit: {
          name: 'Paisa',
          plural: 'Paise',
          symbol: '',
        },
      },
    },
  })
  return (
    <Box className="flex flex-col gap-8 p-4">
      {receipts.map((receipt) => (
        <React.Fragment key={receipt.id}>
          <Box className="flex flex-col gap-1 bg-blue-200 p-2 text-center">
            <Typography variant="h4" className="uppercase">
              {'Receipt of House Rent'}
            </Typography>
            <Typography variant="subtitle1" className="capitalize">
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
                {` (${toWords.convert(receipt.tenant.rentPerMonth)}) `}
              </Typography>
              <Typography component={'span'}>{'from the occupant'}</Typography>
              <Typography component={'strong'} className="!font-bold">
                {` ${receipt.tenant.name} `}
              </Typography>
              <Typography component={'span'}>{'via (payment mode)'}</Typography>
              <Typography component={'strong'} className="!font-bold">
                {` ${receipt.paymentMode} `}
              </Typography>
              <Typography component={'span'}>{'on (payment date)'}</Typography>
              <Typography component={'strong'} className="!font-bold">
                {` ${receipt.rentCollectedOn.format('DD MMM, YYYY')} `}
              </Typography>
              <Typography component={'span'}>{'towards the rent @'}</Typography>
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
                {'for the house/apartment/accommodation/property situated at'}
              </Typography>
              <Typography component={'strong'} className="!font-bold">
                {` ${receipt.tenant.address.replace('\n', ' ')}.`}
              </Typography>
            </Typography>
          </Box>
          <Box className="flex flex-row items-end justify-between">
            <Box className="flex flex-col gap-2">
              <Typography component={'p'} className=" !font-bold">
                <Typography component={'p'}>{'Name of Owner'}</Typography>
                {receipt.landLord.name}
              </Typography>
              <Typography component={'pre'} className=" !font-bold">
                <Typography component={'p'}>{'Owner`s Address'}</Typography>
                {receipt.landLord.address}
              </Typography>
            </Box>
            <Box className="flex flex-col items-center gap-2">
              <Box className=" flex h-36 w-28 items-center border border-dashed border-blue-500 p-1 text-center">
                <Typography component={'span'}>
                  {'Affix Revenue Stamp of Re.1/)'}
                </Typography>
              </Box>
              <Box className="flex flex-col items-center gap-2">
                <Typography component={'p'}>
                  {'Signature of House Owner'}
                </Typography>
                <Box className="h-14 w-64 border border-blue-500"></Box>
              </Box>
            </Box>
          </Box>
        </React.Fragment>
      ))}
    </Box>
  )
}
export default Receipts
