import { Moment } from 'moment'

export enum PaymentMode {
  UPI = 'UPI',
  CASH = 'CASH',
  NET_BANKING = 'NET_BANKING',
  ONLINE_TRANSFER = 'ONLINE_TRANSFER',
  CHEQUE_OR_DEMAND_DRAFT = 'CHEQUE_OR_DEMAND_DRAFT',
}

export type Receipt = {
  id: string
  tenant: {
    name: string
    rentPerMonth: number
    email: string
    address: string
    panNo: string
    currency: string
  }
  landLord: {
    name: string
    panNo: string
    address: string
  }
  rentFrom: Moment
  rentUpto: Moment
  rentCollectedOn: Moment
  paymentMode: `${PaymentMode}`
  signature?: string
}

export type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>
