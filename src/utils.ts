import { ToWords } from 'to-words'

export const round = (n: number, p: number = 2) =>
  ((e) => Math.round(n * e) / e)(Math.pow(10, p))

export const toWordsINR = new ToWords({
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

export const toWordsUSD = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: 'Dollar',
      plural: 'Dollars',
      symbol: '$',
      fractionalUnit: {
        name: 'Cent',
        plural: 'Cents',
        symbol: '¢',
      },
    },
  },
})

export const toWordsEURO = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: 'Pound',
      plural: 'Pounds',
      symbol: '£',
      fractionalUnit: {
        name: 'Penny',
        plural: 'Pence',
        symbol: 'p',
      },
    },
  },
})

export const toWordsBTC = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
  },
})
