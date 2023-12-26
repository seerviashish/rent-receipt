/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Moment } from 'moment'
import ordinal from 'ordinal'
import React, { useState } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { v4 as uuidV4 } from 'uuid'
import { IntRange, PaymentMode, Receipt } from '../../types'

interface IForm {
  setReceipts: (receipts: Receipt[]) => void
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
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props

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
        prefix="₹ "
      />
    )
  }
)

const Form: React.FC<IForm> = ({ setReceipts }) => {
  const [formData, setFormData] = useState<Partial<FormData>>()
  const handleOnChange =
    (of: keyof Omit<FormData, 'rentFrom' | 'rentUpto'>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [of]: {
          data: e.target.value,
          error: '',
          isError: false,
        },
      })
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
      console.log(
        'validation failed ===',
        (validatedFormData?.rentFrom?.data as Moment).format('DD MMM, YYYY'),
        (validatedFormData?.rentUpto?.data as Moment).format('DD MMM, YYYY')
      )
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
    const days = parseInt(rentCollectedOn)
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
        formData?.landLordPanNo?.data != null
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
    console.log(
      'duration ==> ',
      duration.map((d) => ({
        s: d.from.format('DD MMM, YYYY'),
        e: d.end.format('DD MMM, YYYY'),
      }))
    )
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
    console.log(
      'total12MonthDays => ',
      total12MonthDays,
      (formData.rentFrom.data as Moment).clone().format('DD MMM, YYYY'),
      (formData.rentFrom.data as Moment)
        .clone()
        .add(12, 'M')
        .format('DD MMM, YYYY')
    )
    const paymentMode = formData.paymentMode.data
    const rentPerDay = (formData.monthlyRent.data * 12) / total12MonthDays
    console.log('rentPerDay ==> ', rentPerDay)
    const includeRentUptoDate = formData?.includeRentUptoDate?.data ?? false
    duration.forEach((timeSlot) => {
      const noOfDays =
        Math.abs(timeSlot.end.diff(timeSlot.from, 'days')) +
        (includeRentUptoDate ? 1 : 0)
      console.log('noOfDays ==> ', noOfDays)

      receipts.push({
        tenant: {
          name: yourName,
          email: emailAddress,
          rentPerMonth:
            noOfDays < timeSlot.from.daysInMonth()
              ? noOfDays * rentPerDay
              : rentPerMonth,
          address: houseAddress,
          panNo: yourPanNo,
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
    console.log('isFormDataValid => ', isFormDataValid)
    if (isFormDataValid) {
      const receipts: Receipt[] = generateReceiptData()
      console.log('receipts ===> ', receipts)
      setReceipts(receipts)
    }
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
        <TextField
          required
          InputProps={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            inputComponent: NumericFormatCustom as any,
          }}
          onChange={handleOnChange('monthlyRent')}
          value={formData?.monthlyRent?.data ?? ''}
          error={formData?.monthlyRent?.isError}
          helperText={
            formData?.monthlyRent?.isError
              ? formData?.monthlyRent?.error
              : 'Enter monthly rent amount. i.e 15000'
          }
          id="monthlyRent"
          label="Enter monthly rent"
          className="flex w-full md:w-full"
        />
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
                ? (newDate as Moment).isBefore(formData.rentUpto.data as Moment)
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
                    'aria-label': 'Include rent upto date for rent calculation',
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
      <Box className="flex w-full flex-col gap-8 sm:flex-col md:flex-col lg:flex-row xl:flex-row 2xl:flex-row">
        <Button variant="outlined" onClick={() => setFormData({})}>
          Reset
        </Button>
        <Button variant="contained" onClick={handleGenerateReceipts}>
          Generate Receipts
        </Button>
      </Box>
    </Box>
  )
}
export default Form
