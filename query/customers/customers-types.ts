export interface Customer {
  id: string
  name: string
  phone: string | null
  address: string | null
  tax_number: string | null
  notes: string | null
  created_at: string
}

export interface CustomersListParams {
  page?: number
  per_page?: number
  search?: string
}

export type CreateCustomerPayload = Omit<Customer, 'id' | 'created_at'>
export type UpdateCustomerPayload = Partial<CreateCustomerPayload>
