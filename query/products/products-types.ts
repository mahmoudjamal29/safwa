export interface Product {
  id: string
  name: string
  sku: string | null
  category: string | null
  unit: string
  price: number
  cost: number | null
  pieces_per_unit: number | null
  piece_price: number | null
  qty: number
  min_qty: number | null
  max_qty: number | null
  created_at: string
}

export interface ProductsListParams {
  page?: number
  per_page?: number
  search?: string
  category?: string
}

export type CreateProductPayload = Omit<Product, 'id' | 'created_at'>
export type UpdateProductPayload = Partial<CreateProductPayload>
