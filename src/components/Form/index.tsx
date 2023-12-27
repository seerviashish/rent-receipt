/* eslint-disable @typescript-eslint/no-explicit-any */
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import {
  Alert,
  AlertColor,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CryptoJS from 'crypto-js'
import cryptoRandomString from 'crypto-random-string'
import moment, { Moment } from 'moment'
import ordinal from 'ordinal'
import React, { useRef, useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { v4 as uuidV4 } from 'uuid'
import { IntRange, PaymentMode, Receipt } from '../../types'
import { round } from '../../utils'

interface IForm {
  setReceipts: (receipts: Receipt[]) => void
  receipts: Receipt[]
}

type FormValue<T> = {
  data?: T
  isError?: boolean
  error?: string
}

type RentCollectedOnData = `${IntRange<1, 29> | 'endOfMonth'}`
type RentCollectedOnMonth = 'current' | 'next'
type FormData = {
  yourName: FormValue<string>
  landLordName: FormValue<string>
  yourPanNo: FormValue<string>
  landLordPanNo: FormValue<string>
  landLordAddress: FormValue<string>
  monthlyRent: FormValue<number>
  yourEmail: FormValue<string>
  houseAddress: FormValue<string>
  rentFrom: FormValue<string | Moment | null>
  rentUpto: FormValue<string | Moment | null>
  rentCollectedOn: FormValue<RentCollectedOnData>
  rentCollectedOnMonth: FormValue<RentCollectedOnMonth>
  paymentMode: FormValue<`${PaymentMode}`>
  includeRentUptoDate: FormValue<boolean>
  currencySymbol: FormValue<string>
  secretPhrase: FormValue<string>
}

const rentCollectedOnMonthValues: {
  value: RentCollectedOnMonth
  label: string
}[] = [
  {
    value: 'current',
    label: 'Current Month',
  },
  {
    value: 'next',
    label: 'Next Month',
  },
]

const currencies: { value: string; label: string }[] = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'INR',
    label: '₹',
  },
]

const paymentModeValues: { value: `${PaymentMode}`; label: string }[] = [
  {
    value: 'CASH',
    label: 'Cash',
  },
  { value: 'CHEQUE_OR_DEMAND_DRAFT', label: 'Cheque/Demand Draft' },
  {
    value: 'NET_BANKING',
    label: 'Net Banking',
  },
  {
    value: 'UPI',
    label: 'UPI',
  },
  { value: 'ONLINE_TRANSFER', label: 'Online transfer' },
]

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
  prefix?: string
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, prefix, ...other } = props
    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          })
        }}
        thousandSeparator
        valueIsNumericString
        prefix={prefix ? `${prefix} ` : ''}
      />
    )
  }
)

const Form: React.FC<IForm> = ({ setReceipts, receipts }) => {
  const [formData, setFormData] = useState<Partial<FormData>>()
  const [showSecret, setShowSecret] = useState<boolean>(false)
  const [warn, setWarn] = useState<{
    open: boolean
    message?: string
    type?: AlertColor
  }>({ open: false })
  const secretPhraseRef = useRef<HTMLInputElement>(null)

  const handleShowSecret = () => {
    setShowSecret((showSecret) => !showSecret)
  }
  const handleMouseDownSecret = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }
  const handleOnChange =
    (of: keyof Omit<FormData, 'rentFrom' | 'rentUpto' | 'monthlyRent'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (of === 'secretPhrase') {
        const secret = e.target.value
        let isError = false
        let error = ''
        if (secret.length > 0 && secret.trim().length == 0) {
          isError = true
          error = 'Should not contains only blank spaces!'
        } else if (
          secret.length > 0 &&
          secret.trim().length > 0 &&
          !secret.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,40}$/
          )
        ) {
          isError = true
          error =
            '1. Secret should contains minimum 8 and maximum 40 characters.\n2. Secret should contains at least one uppercase English letter.\n3. Secret should contains at least one lowercase English letter.\n4. Secret should contain at least one digit.\n5. Secret should contain at least one special character.'
        }
        setFormData({
          ...formData,
          [of]: {
            data: e.target.value,
            error,
            isError,
          },
        })
      } else {
        setFormData({
          ...formData,
          [of]: {
            data: e.target.value,
            error: '',
            isError: false,
          },
        })
      }
    }

  const validateFormData = (): boolean => {
    const validatedFormData = { ...formData }
    let isValid = true
    if ((validatedFormData?.yourName?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.yourName = {
        ...validatedFormData.yourName,
        isError: true,
        error: 'Please enter your name.',
      }
    }
    if ((validatedFormData?.yourPanNo?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.yourPanNo = {
        ...validatedFormData.yourPanNo,
        isError: true,
        error: 'Please enter your PAN number.',
      }
    }
    if ((validatedFormData?.landLordPanNo?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.landLordPanNo = {
        ...validatedFormData.landLordPanNo,
        isError: true,
        error: 'Please enter landlord`s PAN number.',
      }
    }
    if ((validatedFormData?.landLordName?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.landLordName = {
        ...validatedFormData.landLordName,
        isError: true,
        error: 'Please enter landlord`s name.',
      }
    }
    if ((validatedFormData?.houseAddress?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.houseAddress = {
        ...validatedFormData.houseAddress,
        isError: true,
        error: 'Please enter your rental house address.',
      }
    }
    if ((validatedFormData?.currencySymbol?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.currencySymbol = {
        ...validatedFormData.currencySymbol,
        isError: true,
        error: 'Please select currency symbol.',
      }
    }
    if ((validatedFormData?.landLordAddress?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.landLordAddress = {
        ...validatedFormData.landLordAddress,
        isError: true,
        error: 'Please enter your landlord`s house address.',
      }
    }

    if ((validatedFormData?.yourEmail?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.yourEmail = {
        ...validatedFormData.yourEmail,
        isError: true,
        error: 'Please enter your email address.',
      }
    }
    if (
      (validatedFormData?.yourEmail?.data ?? '').trim().length != 0 &&
      !String(validatedFormData?.yourEmail?.data ?? '')
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      isValid = false
      validatedFormData.yourEmail = {
        ...validatedFormData.yourEmail,
        isError: true,
        error: 'Please enter valid email address.',
      }
    }
    if ((validatedFormData?.monthlyRent?.data ?? 0) == 0) {
      isValid = false
      validatedFormData.monthlyRent = {
        ...validatedFormData.monthlyRent,
        isError: true,
        error:
          formData?.monthlyRent?.data == null
            ? 'Please enter monthly rent amount.'
            : 'Please enter correct monthly rent amount. It should not be zero.',
      }
    }
    if (validatedFormData?.rentFrom?.data == null) {
      isValid = false
      validatedFormData.rentFrom = {
        ...validatedFormData.rentFrom,
        isError: true,
        error: 'Please select rent starting date.',
      }
    }
    if (validatedFormData?.rentUpto?.data == null) {
      isValid = false
      validatedFormData.rentUpto = {
        ...validatedFormData.rentUpto,
        isError: true,
        error: 'Please select rent upto date.',
      }
    }
    if (
      validatedFormData?.rentFrom?.data != null &&
      validatedFormData?.rentUpto?.data != null &&
      (validatedFormData?.rentFrom?.data as Moment).isSameOrAfter(
        validatedFormData?.rentUpto?.data as Moment
      )
    ) {
      isValid = false
      validatedFormData.rentFrom = {
        ...validatedFormData.rentFrom,
        isError: true,
        error:
          'Please select correct rent from/rent upto date. Rent from date should be before than rent end date.',
      }
      validatedFormData.rentUpto = {
        ...validatedFormData.rentUpto,
        isError: true,
        error: '',
      }
    }
    if ((validatedFormData?.rentCollectedOn?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.rentCollectedOn = {
        ...validatedFormData.rentCollectedOn,
        isError: true,
        error: 'Please select the day on which rent is collected.',
      }
    }
    if (
      (validatedFormData?.rentCollectedOnMonth?.data ?? '').trim().length == 0
    ) {
      isValid = false
      validatedFormData.rentCollectedOnMonth = {
        ...validatedFormData.rentCollectedOnMonth,
        isError: true,
        error: 'Please select the month in which rent is collected.',
      }
    }
    if ((validatedFormData?.paymentMode?.data ?? '').trim().length == 0) {
      isValid = false
      validatedFormData.paymentMode = {
        ...validatedFormData.paymentMode,
        isError: true,
        error: 'Please select the payment mode.',
      }
    }
    setFormData(validatedFormData)
    return isValid
  }

  const getRentCollectedOnDate = (
    rentCollectedOn: RentCollectedOnData,
    rentCollectedOnMonth: RentCollectedOnMonth,
    startDate: Moment,
    endDate: Moment
  ): Moment => {
    if (rentCollectedOn === 'endOfMonth') {
      const endOfCurrentMonth = startDate.endOf('M')
      const endOfNextMonth = startDate.clone().add(1, 'M')
      const rentCollectedOnDate =
        rentCollectedOnMonth === 'current'
          ? endOfCurrentMonth.isAfter(endDate)
            ? endDate
            : endOfCurrentMonth
          : endOfNextMonth

      return rentCollectedOnDate
    }
    const days = parseInt(rentCollectedOn) - 1
    const startOfCurrentMonth = startDate.startOf('M')
    const rentDateOfCurrentMonth = startDate.clone().startOf('M').add(days, 'd')
    const rentDateOfNextMonth = startDate
      .clone()
      .add(1, 'M')
      .startOf('M')
      .add(days, 'd')
    const rentCollectedOnDate =
      rentCollectedOnMonth === 'current'
        ? startOfCurrentMonth.isBefore(startDate)
          ? startDate
          : rentDateOfCurrentMonth
        : rentDateOfNextMonth

    return rentCollectedOnDate
  }

  const generateReceiptData = () => {
    if (
      !(
        formData?.houseAddress?.data != null &&
        formData?.landLordName?.data != null &&
        formData?.monthlyRent?.data != null &&
        formData?.paymentMode?.data != null &&
        formData?.rentCollectedOn?.data != null &&
        formData?.rentCollectedOnMonth?.data != null &&
        formData?.rentFrom?.data != null &&
        formData?.rentUpto?.data != null &&
        formData?.yourEmail?.data != null &&
        formData?.yourName?.data != null &&
        formData?.landLordAddress?.data != null &&
        formData?.yourPanNo?.data != null &&
        formData?.landLordPanNo?.data != null &&
        formData?.currencySymbol?.data != null
      )
    ) {
      throw new Error('FormData Null')
    }
    const receipts: Receipt[] = []
    let startDate = (formData.rentFrom.data as Moment).clone()
    const endDate = (formData.rentUpto.data as Moment).clone()
    const duration: { from: Moment; end: Moment }[] = []
    for (
      ;
      startDate.isBefore(endDate);
      startDate = startDate.add(1, 'M').startOf('M')
    ) {
      duration.push({
        from: startDate.clone(),
        end: startDate.endOf('M').isAfter(endDate)
          ? endDate.clone()
          : startDate.endOf('M').clone(),
      })
    }

    const yourName = formData.yourName.data
    const emailAddress = formData.yourEmail.data
    const rentPerMonth = formData.monthlyRent.data
    const houseAddress = formData.houseAddress.data
    const yourPanNo = formData.yourPanNo.data
    const landLoadName = formData.landLordName.data
    const landLordsAddress = formData.landLordAddress.data
    const landLordsPanNo = formData.landLordPanNo.data
    const rentCollectedOn = formData.rentCollectedOn.data
    const rentCollectedOnMonth = formData.rentCollectedOnMonth.data
    const total12MonthDays = (formData.rentFrom.data as Moment)
      .clone()
      .add(12, 'M')
      .diff((formData.rentFrom.data as Moment).clone(), 'days')
    const paymentMode = formData.paymentMode.data
    const currency = formData.currencySymbol.data
    const rentPerDay = (formData.monthlyRent.data * 12) / total12MonthDays
    const includeRentUptoDate = formData?.includeRentUptoDate?.data ?? false
    duration.forEach((timeSlot, index) => {
      const noOfDays =
        Math.abs(timeSlot.end.diff(timeSlot.from, 'days')) +
        (index < duration.length - 1 ? 1 : 0) +
        (index == duration.length - 1 && includeRentUptoDate ? 1 : 0)

      receipts.push({
        tenant: {
          name: yourName,
          email: emailAddress,
          rentPerMonth: round(
            noOfDays < timeSlot.from.daysInMonth()
              ? noOfDays * rentPerDay
              : rentPerMonth
          ),
          address: houseAddress,
          panNo: yourPanNo,
          currency,
        },
        landLord: {
          name: landLoadName,
          address: landLordsAddress,
          panNo: landLordsPanNo,
        },
        rentCollectedOn: getRentCollectedOnDate(
          rentCollectedOn,
          rentCollectedOnMonth,
          timeSlot.from,
          timeSlot.end
        ),
        paymentMode,
        rentFrom: timeSlot.from,
        rentUpto: timeSlot.end,
        id: uuidV4(),
      })
    })
    return receipts
  }

  const handleGenerateReceipts = () => {
    const isFormDataValid = validateFormData()
    if (isFormDataValid) {
      const receipts: Receipt[] = generateReceiptData()
      setReceipts(receipts)
    }
  }

  const handleSignReceipt = () => {
    if (formData?.secretPhrase?.data == null) {
      setFormData({
        ...formData,
        secretPhrase: {
          ...formData?.secretPhrase,
          isError: true,
          error: 'Please enter secret phrase before signing receipts.',
        },
      })
      return
    }
    if (receipts?.length == 0) {
      setWarn({
        open: true,
        type: 'warning',
        message: 'Receipts are not generated!',
      })
      return
    }
    const secret = formData.secretPhrase.data
    const updatedReceipts = receipts.map((receipt) => {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(receipt),
        secret
      ).toString()
      receipt.signature = `https://seerviashish.github.io/rent-receipt/view?qr=${encodeURIComponent(
        encrypted
      )}`
      return receipt
    })
    setReceipts(updatedReceipts)
  }
  const handleOnGenerateSecret = () => {
    const secret = cryptoRandomString({
      length: 40,
      characters:
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#?!@$%^&*-',
    })
    setFormData({
      ...formData,
      secretPhrase: {
        data: secret,
        isError: false,
        error: '',
      },
    })
  }
  const handleMockData = () => {
    setFormData({
      ...formData,
      yourName: {
        data: 'John Wick',
        isError: false,
        error: '',
      },
      currencySymbol: {
        data: 'INR',
        isError: false,
        error: '',
      },
      landLordName: {
        data: 'James Bond',
        isError: false,
        error: '',
      },
      yourEmail: {
        data: 'john.wick@gmail.com',
        isError: false,
        error: '',
      },
      yourPanNo: {
        data: 'DAFA2345RE',
        isError: false,
        error: '',
      },
      landLordPanNo: {
        data: 'RWQFA3422F',
        isError: false,
        error: '',
      },
      landLordAddress: {
        data: '548 Denisha Drive,\nEast Rhett,\nMT 06410-7603',
        isError: false,
        error: '',
      },
      houseAddress: {
        data: 'Apt. 874 740 Russel Inlet,\nWest Allene,\nME 71454',
        isError: false,
        error: '',
      },
      monthlyRent: {
        data: 20000,
        isError: false,
        error: '',
      },
      rentFrom: {
        data: moment().subtract(2, 'M').startOf('M').add(2, 'd'),
        isError: false,
        error: '',
      },
      rentUpto: {
        data: moment().add(3, 'M').endOf('M').subtract(9, 'd'),
        isError: false,
        error: '',
      },
      rentCollectedOn: {
        data: '2',
        isError: false,
        error: '',
      },
      rentCollectedOnMonth: {
        data: 'next',
        isError: false,
        error: '',
      },
      includeRentUptoDate: {
        data: true,
        isError: false,
        error: '',
      },
      paymentMode: {
        data: 'UPI',
        isError: false,
        error: '',
      },
    })
  }

  const rentCollectedOnValues: { value: RentCollectedOnData; label: string }[] =
    React.useMemo(() => {
      const values: { value: RentCollectedOnData; label: string }[] = []
      const days = Array.from({ length: 28 }, (_, a) => a + 1)
      days.forEach((day) =>
        values.push({
          label: ordinal(day),
          value: `${day}` as RentCollectedOnData,
        })
      )
      values.push({
        label: 'End of month',
        value: 'endOfMonth',
      })
      return values
    }, [])

  return (
    <>
      <Box
        component={'form'}
        className="flex w-full flex-col items-center gap-8 p-2"
        noValidate
        autoComplete="off"
      >
        <Box className="flex justify-center gap-2">
          <Typography>Generate Rent Receipt</Typography>
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            id="yourName"
            label="Your name"
            onChange={handleOnChange('yourName')}
            value={formData?.yourName?.data ?? ''}
            error={formData?.yourName?.isError}
            helperText={
              formData?.yourName?.isError
                ? formData?.yourName?.error
                : 'Enter your name.'
            }
            className="flex w-full md:w-full"
          />
          <TextField
            required
            id="landLoadName"
            onChange={handleOnChange('landLordName')}
            value={formData?.landLordName?.data ?? ''}
            error={formData?.landLordName?.isError}
            helperText={
              formData?.landLordName?.isError
                ? formData?.landLordName?.error
                : 'Enter landlord`s name.'
            }
            label="Landlord's name"
            className="flex w-full md:w-full"
          />
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            id="yourPanNo"
            label="Your PAN number"
            onChange={handleOnChange('yourPanNo')}
            value={formData?.yourPanNo?.data ?? ''}
            error={formData?.yourPanNo?.isError}
            helperText={
              formData?.yourPanNo?.isError
                ? formData?.yourPanNo?.error
                : 'Enter your PAN number.'
            }
            className="flex w-full md:w-full"
          />
          <TextField
            required
            id="landLordPanNo"
            onChange={handleOnChange('landLordPanNo')}
            value={formData?.landLordPanNo?.data ?? ''}
            error={formData?.landLordPanNo?.isError}
            helperText={
              formData?.landLordPanNo?.isError
                ? formData?.landLordPanNo?.error
                : 'Enter landlord`s PAN number.'
            }
            label="Landlord's PAN number"
            className="flex w-full md:w-full"
          />
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <Box className="flex w-full gap-2 md:w-full">
            <TextField
              className=" order-none w-1/3 md:w-1/4"
              id="currencySymbol"
              select
              label="Currency"
              onChange={handleOnChange('currencySymbol')}
              value={formData?.currencySymbol?.data ?? ''}
              error={formData?.currencySymbol?.isError}
              helperText={
                formData?.currencySymbol?.isError
                  ? formData?.currencySymbol?.error
                  : 'Select your currency'
              }
            >
              {currencies.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              className=" order-none w-2/3 md:w-3/4"
              required
              InputProps={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                inputComponent: NumericFormatCustom as any,
                inputProps: {
                  prefix: currencies.find(
                    (currency) =>
                      currency.value === formData?.currencySymbol?.data
                  )?.label,
                },
              }}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  monthlyRent: {
                    data: isNaN(parseFloat(e.target.value))
                      ? undefined
                      : parseFloat(e.target.value),
                    isError: false,
                    error: '',
                  },
                })
              }}
              value={formData?.monthlyRent?.data ?? ''}
              error={formData?.monthlyRent?.isError}
              helperText={
                formData?.monthlyRent?.isError
                  ? formData?.monthlyRent?.error
                  : 'Enter monthly rent amount. i.e 15000'
              }
              id="monthlyRent"
              label="Enter monthly rent"
            />
          </Box>
          <TextField
            required
            onChange={handleOnChange('yourEmail')}
            value={formData?.yourEmail?.data ?? ''}
            error={formData?.yourEmail?.isError}
            helperText={
              formData?.yourEmail?.isError
                ? formData?.yourEmail?.error
                : 'Enter your email address.'
            }
            type="email"
            id="yourEmail"
            label="Your email"
            className="flex w-full md:w-full"
          />
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            onChange={handleOnChange('houseAddress')}
            value={formData?.houseAddress?.data ?? ''}
            error={formData?.houseAddress?.isError}
            helperText={
              formData?.houseAddress?.isError
                ? formData?.houseAddress?.error
                : 'Enter your rental house address.'
            }
            id="houseAddress"
            label="Your house address"
            multiline
            rows={5}
            className="flex w-full md:w-full"
          />
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            onChange={handleOnChange('landLordAddress')}
            value={formData?.landLordAddress?.data ?? ''}
            error={formData?.landLordAddress?.isError}
            helperText={
              formData?.landLordAddress?.isError
                ? formData?.landLordAddress?.error
                : 'Enter landlord`s house address.'
            }
            id="landLordAddress"
            label="Landlord's house address"
            multiline
            rows={5}
            className="flex w-full md:w-full"
          />
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <DatePicker
            value={formData?.rentFrom?.data ?? null}
            onChange={(newDate) => {
              const newDateCheck: 'true' | 'false' | 'no-check-required' =
                formData?.rentUpto?.data
                  ? (newDate as Moment).isBefore(
                      formData.rentUpto.data as Moment
                    )
                    ? 'true'
                    : 'false'
                  : 'no-check-required'
              setFormData({
                ...formData,
                rentFrom: {
                  data: newDate as Moment,
                  error: '',
                  isError: false,
                },
                rentUpto: {
                  ...(newDateCheck === 'true'
                    ? {
                        ...formData?.rentUpto,
                        isError: false,
                        error: '',
                      }
                    : newDateCheck === 'false'
                      ? {
                          ...formData?.rentUpto,
                          isError: true,
                          error:
                            'Please select rent upto date after than rent from date.',
                        }
                      : { ...formData?.rentUpto }),
                },
              })
            }}
            slotProps={{
              textField: {
                helperText: formData?.rentFrom?.isError
                  ? formData?.rentFrom?.error ?? ''
                  : 'Select rent starting date.',
                error: formData?.rentFrom?.isError ?? false,
              },
            }}
            format="DD MMMM, YYYY"
            label="Rent from"
            className="flex w-full md:w-full"
          />
          <Box className="flex w-full flex-col items-start md:w-full">
            <DatePicker
              value={formData?.rentUpto?.data ?? null}
              onChange={(newDate) => {
                setFormData({
                  ...formData,
                  rentUpto: {
                    data: newDate as Moment,
                    error: '',
                    isError: false,
                  },
                })
              }}
              slotProps={{
                textField: {
                  helperText: formData?.rentUpto?.isError
                    ? formData?.rentUpto?.error ?? ''
                    : 'Select rent upto date.',
                  error: formData?.rentUpto?.isError ?? false,
                },
              }}
              format="DD MMMM, YYYY"
              label="Rent upto"
              className="flex w-full md:w-full"
            />
            <FormControl component="fieldset" variant="standard">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData?.includeRentUptoDate?.data ?? false}
                    inputProps={{
                      'aria-label':
                        'Include rent upto date for rent calculation',
                    }}
                    onChange={(event) => {
                      setFormData({
                        ...formData,
                        includeRentUptoDate: {
                          data: event.target.checked,
                          isError: false,
                          error: '',
                        },
                      })
                    }}
                  />
                }
                label="Include rent upto date for rent calculation"
              />
            </FormControl>
          </Box>
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            select
            onChange={handleOnChange('rentCollectedOn')}
            value={formData?.rentCollectedOn?.data ?? ''}
            error={formData?.rentCollectedOn?.isError}
            helperText={
              formData?.rentCollectedOn?.isError
                ? formData?.rentCollectedOn?.error
                : ''
            }
            id="rentCollectedOn"
            label="Rent collected on"
            className="flex w-full md:w-full"
          >
            {rentCollectedOnValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            select
            onChange={handleOnChange('rentCollectedOnMonth')}
            value={formData?.rentCollectedOnMonth?.data ?? ''}
            error={formData?.rentCollectedOnMonth?.isError}
            helperText={
              formData?.rentCollectedOnMonth?.isError
                ? formData?.rentCollectedOnMonth?.error
                : ''
            }
            id="rentCollectedOnMonth"
            label="Rent collection month"
            className="flex w-full md:w-full"
          >
            {rentCollectedOnMonthValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <TextField
            required
            select
            onChange={handleOnChange('paymentMode')}
            value={formData?.paymentMode?.data ?? ''}
            error={formData?.paymentMode?.isError}
            helperText={
              formData?.paymentMode?.isError ? formData?.paymentMode?.error : ''
            }
            id="paymentMode"
            label="Payment mode"
            className="flex w-full md:w-1/3"
          >
            {paymentModeValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className="flex w-full flex-col gap-4">
          <TextField
            ref={secretPhraseRef}
            onChange={handleOnChange('secretPhrase')}
            type={showSecret ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle secret visibility"
                    onClick={handleShowSecret}
                    onMouseDown={handleMouseDownSecret}
                    edge="end"
                  >
                    {showSecret ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={formData?.secretPhrase?.data ?? ''}
            error={formData?.secretPhrase?.isError}
            helperText={
              formData?.secretPhrase?.isError
                ? formData?.secretPhrase?.error
                : '1. Enter secret phrase for ownership/verification of rent receipts.\n2. Store this secret phase and never share with anyone.\n3. Once you lost the secret can`t be retrieved.\n4. Secret should have max length upto 40 characters.'
            }
            id="secretPhrase"
            label="Enter secret phrase"
            className="flex w-full whitespace-pre-wrap md:w-1/2"
          />
          <Box className="flex w-full flex-col gap-4 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
            <Button variant="outlined" onClick={handleOnGenerateSecret}>
              {'Generate Strong Secret'}
            </Button>
            <Button variant="contained" onClick={handleSignReceipt}>
              {'Sign Receipts'}
            </Button>
          </Box>
        </Box>
        <Box className="flex w-full flex-col gap-4 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
          <Button
            variant="outlined"
            onClick={() => {
              setFormData({})
              setReceipts([])
            }}
          >
            {'Reset'}
          </Button>
          <Button variant="contained" onClick={handleGenerateReceipts}>
            {'Generate Receipts'}
          </Button>
          <Button variant="contained" onClick={handleMockData}>
            {'Fill Mock Data'}
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={warn.open}
        autoHideDuration={6000}
        onClose={() => {
          setWarn({ open: false })
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Alert
          onClose={() => {
            setWarn({ open: false })
          }}
          severity={warn?.type ?? 'info'}
          sx={{ width: '100%' }}
        >
          {warn?.message ?? ''}
        </Alert>
      </Snackbar>
    </>
  )
}
export default Form
