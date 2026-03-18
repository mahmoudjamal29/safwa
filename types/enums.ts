export enum AttachmentTypeEnum {
  IMAGE = 'image',
  PDF = 'pdf'
}

export enum BillingChargeBasisEnum {
  PER_AREA = 2,
  PER_PERSON = 1
}

export enum BillingTermEnum {
  LONG_TERM = 2,
  SHORT_TERM = 1
}

export enum BlackoutReasonEnum {
  CLEANING = 2,
  MAINTENANCE = 1,
  OTHER = 3
}

export enum BookingRoleEnum {
  CHILD = 2,
  PARENT = 1,
  STANDALONE = 0
}

export enum BookingStatusEnum {
  CANCELLED = 2,
  CONFIRMED = 1,
  PENDING = 0,
  TEMP = 3
}

export enum BookingTypeEnum {
  LONG_TERM = 1,
  SHORT_TERM = 0
}

export enum ContractStatusEnum {
  ACTIVE = 3,
  DRAFT = 1,
  EXPIRED = 2
}

export enum DaysEnum {
  Friday = 6,
  Monday = 2,
  Saturday = 7,
  Sunday = 1,
  Thursday = 5,
  Tuesday = 3,
  Wednesday = 4
}

export enum DiscountTypeEnum {
  FIXED = 2,
  PERCENTAGE = 1
}

export enum DocumentTypeEnum {
  IMAGE = 1,
  PDF = 2
}

export enum DoorTypeEnum {
  ELEVATOR_ACCESS = 4,
  ENTRANCE_ACCESS = 3,
  FLOOR_ACCESS = 2,
  OTHER_ACCESS = 5,
  SPACE_ACCESS = 1
}

export enum DurationPeriodEnum {
  DAILY = 2,
  HOURLY = 1,
  MONTHLY = 3,
  YEARLY = 4
}

export enum GenderEnum {
  FEMALE = 2,
  MALE = 1
}

export enum IdentifierIdTypeEnum {
  NATIONAL_ID = 1,
  PASSPORT = 2
}

export enum InvoiceStatusEnum {
  CANCELLED = 4,
  PAID = 2,
  PARTIALLY_PAID = 3,
  PARTIALLY_REFUNDED = 6,
  PENDING = 1, // Awaiting payment (QNB or bank_transfer proof). Drives booking PENDING until paid.
  REFUNDED = 5
}

export enum MemberPermissionEnum {
  CREATE_BOOKING = 2,
  MANAGE_ALL = 1,
  MANAGE_BOOKINGS = 3,
  MANAGE_COMPANY = 5,
  MANAGE_INVOICES = 6,
  MANAGE_MEMBERS = 4,
  MANAGE_SUBSCRIPTIONS = 7
}

export enum NotificationTypes {
  Booking = 1,
  Company = 5,
  Invoice = 3,
  Payment = 2,
  System = 4
}

export enum OfferStatusEnum {
  ACCEPTED = 3,
  DECLINED = 2,
  SENT = 1
}

export enum OrderStatusEnum {
  CANCELLED = 5,
  COMPLETED = 4,
  CONFIRMED = 2,
  PENDING = 1,
  PROCESSING = 3,
  REFUNDED = 6
}

export enum ParticipantTypeEnum {
  USER = 1,
  VISITOR = 0
}

export enum PaymentGatewayEnum {
  BANK_TRANSFER = 'bank_transfer',
  QNB = 'qnb'
}

export enum PaymentStatusEnum {
  CANCELLED = 6,
  COMPLETED = 4,
  FAILED = 5,
  PARTIALLY_REFUNDED = 8,
  PENDING = 0,
  PENDING_APPROVAL = 2,
  PROCESSING = 3,
  REFUNDED = 7,
  WAITING_FOR_PAYMENT_PROOF = 1
}

export enum PeriodEnum {
  DAILY = 2,
  HOURLY = 1
}

export enum PriceTypeEnum {
  DAY = 2,
  HOUR = 1,
  MONTH = 3,
  YEAR = 4
}

export enum ProductTypeEnum {
  RENTING = 2,
  SELLING = 1
}
export enum RequestStatusEnum {
  CLOSED = 2, // Destructive Variant
  CONTACTED = 3, // Success Variant
  NEW = 1 // Default Variant
}

export enum StatusEnum {
  ACTIVE = 1,
  INACTIVE = 0
}

export enum SupportStatusEnum {
  OPEN = 2,
  SOLVED = 1
}

export enum SupportTicketStatusEnum {
  REJECTED = 4,
  RESOLVED = 3,
  REVIEWING = 2,
  SUBMITTED = 1
}

export enum SupportTicketTypeEnum {
  AUTHENTICATION = 3,
  BILLING = 2,
  OTHER = 5,
  RESERVATION = 1,
  TECHNICAL = 4
}
export enum TransactionStatusEnum {
  CANCELLED = 6,
  COMPLETED = 4,
  FAILED = 5,
  PARTIALLY_REFUNDED = 8,
  PENDING = 0,
  PENDING_APPROVAL = 2,
  PROCESSING = 3,
  REFUNDED = 7,
  WAITING_FOR_PAYMENT_PROOF = 1
}
export enum UserRequestStatusEnum {
  APPROVED = 1,
  PENDING = 0,
  REJECTED = 2
}

export enum UserRequestTypeEnum {
  INVITE_REQUEST = 2,
  JOIN_REQUEST = 1
}

export enum UserTypeEnum {
  COMPANY = 2,
  INDIVIDUAL = 1
}

export enum ZeroOrOneEnum {
  ONE = 1,
  ZERO = 0
}
