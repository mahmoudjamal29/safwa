'use client'

import type { ChipProps } from '@/components/ui/chip'

import {
  BookingStatusEnum,
  ContractStatusEnum,
  InvoiceStatusEnum,
  OfferStatusEnum,
  OrderStatusEnum,
  PaymentGatewayEnum,
  RequestStatusEnum,
  SupportStatusEnum,
  TransactionStatusEnum,
  ZeroOrOneEnum
} from '@/types/enums'

export const getZeroOrOneStatusVariant = (
  value: null | undefined | ZeroOrOneEnum,
  options?: {
    oneVariant?: ChipProps['variant']
    zeroVariant?: ChipProps['variant']
  }
): ChipProps['variant'] => {
  const oneVariant = options?.oneVariant ?? 'success'
  const zeroVariant = options?.zeroVariant ?? 'destructive'

  return value === ZeroOrOneEnum.ONE ? oneVariant : zeroVariant
}

export const getRequestStatusVariant = (
  value: null | RequestStatusEnum | undefined
): ChipProps['variant'] => {
  switch (value) {
    case RequestStatusEnum.CLOSED:
      return 'destructive'
    case RequestStatusEnum.NEW:
      return 'success'
    case RequestStatusEnum.CONTACTED:
    default:
      return 'default'
  }
}

export const getOfferStatusVariant = (
  value: null | OfferStatusEnum | undefined
): ChipProps['variant'] => {
  switch (value) {
    case OfferStatusEnum.ACCEPTED:
      return 'success'
    case OfferStatusEnum.DECLINED:
      return 'destructive'
    case OfferStatusEnum.SENT:
    default:
      return 'default'
  }
}

export const getContractStatusVariant = (
  value: ContractStatusEnum | null | undefined
): ChipProps['variant'] => {
  switch (value) {
    case ContractStatusEnum.ACTIVE:
      return 'success'
    case ContractStatusEnum.EXPIRED:
      return 'destructive'
    case ContractStatusEnum.DRAFT:
    default:
      return 'default'
  }
}

export const getBookingStatusVariant = (
  value: BookingStatusEnum | null | undefined
): ChipProps['variant'] => {
  switch (value) {
    case BookingStatusEnum.CANCELLED:
      return 'destructive'
    case BookingStatusEnum.CONFIRMED:
      return 'success'
    case BookingStatusEnum.TEMP:
      return 'warning'
    case BookingStatusEnum.PENDING:
    default:
      return 'default'
  }
}

export const getInvoiceStatusLabel = (
  value: InvoiceStatusEnum | null | number | undefined,
  tInvoiceStatus?: Translations<'enums.invoice_status.enum'>
): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  const status =
    typeof value === 'number' ? (value as InvoiceStatusEnum) : value

  if (tInvoiceStatus) {
    switch (status) {
      case InvoiceStatusEnum.CANCELLED:
      case InvoiceStatusEnum.PAID:
      case InvoiceStatusEnum.PARTIALLY_PAID:
      case InvoiceStatusEnum.PARTIALLY_REFUNDED:
      case InvoiceStatusEnum.PENDING:
      case InvoiceStatusEnum.REFUNDED:
        return tInvoiceStatus(`${status}`)
      default:
        break
    }
  }

  switch (status) {
    case InvoiceStatusEnum.CANCELLED:
      return 'Cancelled'
    case InvoiceStatusEnum.PAID:
      return 'Paid'
    case InvoiceStatusEnum.PARTIALLY_PAID:
      return 'Partially Paid'
    case InvoiceStatusEnum.PARTIALLY_REFUNDED:
      return 'Partially Refunded'
    case InvoiceStatusEnum.PENDING:
      return 'Pending'
    case InvoiceStatusEnum.REFUNDED:
      return 'Refunded'
    default:
      return 'Unknown'
  }
}

export const getInvoiceStatusVariant = (
  value: InvoiceStatusEnum | null | undefined
): ChipProps['variant'] => {
  switch (value) {
    case InvoiceStatusEnum.CANCELLED:
    case InvoiceStatusEnum.PARTIALLY_REFUNDED:
    case InvoiceStatusEnum.REFUNDED:
      return 'destructive'
    case InvoiceStatusEnum.PAID:
      return 'success'
    case InvoiceStatusEnum.PARTIALLY_PAID:
      return 'warning'
    case InvoiceStatusEnum.PENDING:
      return 'default'

    default:
      return 'default'
  }
}

export const getSupportStatusVariant = (
  value: null | SupportStatusEnum | undefined
): ChipProps['variant'] => {
  switch (value) {
    case SupportStatusEnum.SOLVED:
      return 'success'
    case SupportStatusEnum.OPEN:
    default:
      return 'destructive'
  }
}

export const getOrderStatusLabel = (
  value: null | number | OrderStatusEnum | undefined,
  tOrderStatus?: Translations<'enums.order_status.enum'>
): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  const status = typeof value === 'number' ? (value as OrderStatusEnum) : value

  if (tOrderStatus) {
    switch (status) {
      case OrderStatusEnum.CANCELLED:
      case OrderStatusEnum.COMPLETED:
      case OrderStatusEnum.CONFIRMED:
      case OrderStatusEnum.PENDING:
      case OrderStatusEnum.PROCESSING:
      case OrderStatusEnum.REFUNDED:
        return tOrderStatus(`${status}`)
      default:
        break
    }
  }

  switch (status) {
    case OrderStatusEnum.CANCELLED:
      return 'Cancelled'
    case OrderStatusEnum.COMPLETED:
      return 'Completed'
    case OrderStatusEnum.CONFIRMED:
      return 'Confirmed'
    case OrderStatusEnum.PENDING:
      return 'Pending'
    case OrderStatusEnum.PROCESSING:
      return 'Processing'
    case OrderStatusEnum.REFUNDED:
      return 'Refunded'
    default:
      return 'Unknown'
  }
}

export const getOrderStatusVariant = (
  value: null | OrderStatusEnum | undefined
): ChipProps['variant'] => {
  switch (value) {
    case OrderStatusEnum.CANCELLED:
    case OrderStatusEnum.REFUNDED:
      return 'destructive'
    case OrderStatusEnum.COMPLETED:
    case OrderStatusEnum.CONFIRMED:
      return 'success'
    case OrderStatusEnum.PROCESSING:
      return 'warning'
    case OrderStatusEnum.PENDING:
    default:
      return 'default'
  }
}

export const getTransactionStatusLabel = (
  value: null | number | TransactionStatusEnum | undefined,
  tTransactionStatus?: Translations<'enums.transaction_status.enum'>
): string => {
  if (value === null || value === undefined) {
    return '-'
  }

  const status =
    typeof value === 'number' ? (value as TransactionStatusEnum) : value

  if (tTransactionStatus) {
    switch (status) {
      case TransactionStatusEnum.CANCELLED:
      case TransactionStatusEnum.COMPLETED:
      case TransactionStatusEnum.FAILED:
      case TransactionStatusEnum.PARTIALLY_REFUNDED:
      case TransactionStatusEnum.PENDING:
      case TransactionStatusEnum.PENDING_APPROVAL:
      case TransactionStatusEnum.PROCESSING:
      case TransactionStatusEnum.REFUNDED:
      case TransactionStatusEnum.WAITING_FOR_PAYMENT_PROOF:
        return tTransactionStatus(`${status}`)
      default:
        break
    }
  }

  switch (status) {
    case TransactionStatusEnum.CANCELLED:
      return 'Cancelled'
    case TransactionStatusEnum.COMPLETED:
      return 'Completed'
    case TransactionStatusEnum.FAILED:
      return 'Failed'
    case TransactionStatusEnum.PARTIALLY_REFUNDED:
      return 'Partially Refunded'
    case TransactionStatusEnum.PENDING:
      return 'Pending'
    case TransactionStatusEnum.PENDING_APPROVAL:
      return 'Pending Approval'
    case TransactionStatusEnum.PROCESSING:
      return 'Processing'
    case TransactionStatusEnum.REFUNDED:
      return 'Refunded'
    case TransactionStatusEnum.WAITING_FOR_PAYMENT_PROOF:
      return 'Waiting for Payment Proof'
    default:
      return 'Unknown'
  }
}

export const getTransactionStatusVariant = (
  value: null | number | undefined
): ChipProps['variant'] => {
  switch (value) {
    case TransactionStatusEnum.CANCELLED:
    case TransactionStatusEnum.FAILED:
    case TransactionStatusEnum.PARTIALLY_REFUNDED:
    case TransactionStatusEnum.REFUNDED:
      return 'destructive'
    case TransactionStatusEnum.COMPLETED:
      return 'success'
    case TransactionStatusEnum.PROCESSING:
      return 'warning'
    case TransactionStatusEnum.PENDING:
    case TransactionStatusEnum.PENDING_APPROVAL:
    case TransactionStatusEnum.WAITING_FOR_PAYMENT_PROOF:
    default:
      return 'default'
  }
}

export const getPaymentGatewayLabel = (
  value: null | string | undefined,
  tPaymentGateway?: Translations<'enums.payment_gateway.enum'>
): string => {
  if (value === null || value === undefined) return '-'

  if (tPaymentGateway) {
    switch (value) {
      case PaymentGatewayEnum.BANK_TRANSFER:
      case PaymentGatewayEnum.QNB:
        return tPaymentGateway(value)
      default:
        break
    }
  }

  switch (value) {
    case PaymentGatewayEnum.BANK_TRANSFER:
      return 'Bank Transfer'
    case PaymentGatewayEnum.QNB:
      return 'QNB'
    default:
      return value
  }
}
