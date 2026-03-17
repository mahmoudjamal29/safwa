export type MovementType = 'وارد' | 'صادر' | 'تسوية' | 'تالف'

export interface InventoryMovement {
  id: string
  product_id: string | null
  product_name: string
  type: MovementType
  qty: number
  note: string | null
  created_at: string
}

export interface InventoryListParams {
  page?: number
  per_page?: number
  search?: string
  type?: MovementType
}

export type CreateMovementPayload = Omit<InventoryMovement, 'id' | 'created_at'>
