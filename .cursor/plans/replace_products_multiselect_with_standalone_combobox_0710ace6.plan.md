# Replace Products MultiSelect with Standalone Combobox and Product Objects

## Overview
Replace the `field.MultiSelect` component with a standalone `Combobox` from `@/components/ui/combobox` that allows adding products to the form as objects (not just IDs). Each product object contains `product_id`, `quantity`, and `order_date`. Display selected products in a separate box with editable quantity fields and remove buttons.

## Changes Required

### 1. Create Infinite Query for Products

**File**: `query/products/products-query.ts`

**Changes**:
- Import `InfiniteData`, `infiniteQueryOptions` from `@tanstack/react-query`
- Import `QueryKey` from `@/query-client/query`
- Create `getAllProductsInfiniteQuery` following the infinite query pattern:
  - Accept `params?: Omit<ProductsListParams, 'page' | 'per_page'>`
  - Use `infiniteQueryOptions` with 5 type parameters
  - `queryFn` uses `pageParam` and sets `per_page: 20`
  - `initialPageParam: 1`
  - `getNextPageParam` extracts pagination from `lastPage.data?.pagination`
  - `queryKey: ['products', 'infinite', params]`
- Export the new infinite query

**Reference**: Follow the pattern from `query/vendors/vendors-query.ts` (`getAllVendorsInfiniteQuery`)

### 2. Update Form Schema

**File**: `app/(Dashboard)/purchases/orders/_orders/form-options/orders-form-options.tsx`

**Changes**:
- Replace `product_ids: z.array(z.string())` with:
  ```typescript
  products: z.array(z.object({
    product_id: z.number(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    order_date: z.string()
  }))
  ```
- Update `OrdersFormOptions` to map from `order?.order_products`:
  ```typescript
  products: order?.order_products?.map((op) => ({
    product_id: op.product_id,
    quantity: op.quantity,
    order_date: op.order_date || new Date().toISOString()
  })) ?? []
  ```

### 3. Update Orders Form Component

**File**: `app/(Dashboard)/purchases/orders/_orders/forms/orders-form.tsx`

**Changes**:

**Imports**:
- Import `useField` from `@tanstack/react-form-nextjs`
- Import `Combobox` from `@/components/ui/combobox`
- Import `Button` from `@/components/ui/button`
- Import `PlusIcon` and `TrashIcon` from `lucide-react`
- Import `FormCard` from `@/components/custom/form-card`
- Import `FieldInfo` from `@/components/form/info-field`
- Import `isFieldInvalid` from `@/utils`
- Import `getAllProductsInfiniteQuery` from `@/query/products`
- Import `formatDate` from `@/utils/formatters` (for displaying order_date)

**Component Logic**:
- Use `useField` with `mode: 'array'` for `products` field:
  ```typescript
  const productsField = useField({ form, mode: 'array', name: 'products' })
  ```
- Create `isSelected` callback to check if product is already in the array
- When adding a product via `onSelectItem`:
  - Check if product is already selected (prevent duplicates)
  - If not selected, use `productsField.pushValue()` to add:
    ```typescript
    {
      product_id: product.id,
      quantity: 1, // Default quantity
      order_date: new Date().toISOString() // Current date/time
    }
    ```

**Replace Products Field**:
- Remove `form.AppField` with `field.MultiSelect`
- Add standalone `Combobox` component:
  - `infinite: true`
  - `queryOptions`: Use `getAllProductsInfiniteQuery` with search parameter
  - `labelKey: "name"`
  - `valueKey: "id"`
  - `closeOnSelect: false` (to allow adding multiple products)
  - `customTrigger`: Button with "Add Product" text and `PlusIcon`
  - `onSelectItem`: Callback that adds product object to form array
  - `renderOption`: Show product name and check if already selected (disable if selected)

**Selected Products Display**:
- Wrap in `FormCard` with title "Products"
- Use `form.AppField` with `mode="array"` and `name="products"`
- Map through products and render each product:
  - Product name (from product_id - may need to fetch or store product name)
  - Quantity input field using nested field: `products[${index}].quantity`
    - Use `form.AppField` with `name={`products[${index}].quantity`}`
    - Use `field.Input` with `type="number"`, `min={1}`, `required`
  - Order date display (read-only, formatted using `formatDate`)
  - Remove button that calls `field.removeValue(index)`
- Show empty state: "No products added yet. Click 'Add Product' to add one."
- Add `FieldInfo` component for validation errors

**Product Name Display**:
- Option 1: Store product name in the object when adding (simpler, but name won't update if product changes)
- Option 2: Fetch product details when displaying (more complex, but always up-to-date)
- **Recommendation**: Store product name when adding for simplicity:
  ```typescript
  {
    product_id: product.id,
    product_name: product.name, // Store name for display
    quantity: 1,
    order_date: new Date().toISOString()
  }
  ```
- Update schema to include `product_name?: z.string().optional()` (optional for backward compatibility)

### 4. Update Form Schema (Optional Enhancement)

**File**: `app/(Dashboard)/purchases/orders/_orders/form-options/orders-form-options.tsx`

**Optional**: Add `product_name` to schema for display purposes:
```typescript
products: z.array(z.object({
  product_id: z.number(),
  product_name: z.string().optional(), // For display only
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  order_date: z.string()
}))
```

## Implementation Details

### Product Object Structure
```typescript
{
  product_id: number,      // Required - product ID
  product_name?: string,   // Optional - for display (stored when adding)
  quantity: number,        // Required - default 1, min 1
  order_date: string       // Required - ISO date string (current date when adding)
}
```

### Add Product Flow
1. User clicks "Add Product" button
2. Combobox opens with infinite scroll product search
3. User selects a product
4. Check if product is already in array (by product_id)
5. If not selected, add product object with:
   - `product_id`: selected product's ID
   - `product_name`: selected product's name (for display)
   - `quantity`: 1 (default)
   - `order_date`: `new Date().toISOString()` (current date/time)
6. Combobox stays open (closeOnSelect: false) for adding more products

### Edit Quantity Flow
1. User changes quantity input field
2. Form validates quantity (min 1)
3. Value updates in form state automatically via nested field

### Remove Product Flow
1. User clicks remove button on a product
2. Product is removed from `products` array using `removeValue(index)`

### Selected Products Display
- Products displayed in a `FormCard` box
- Each product shows:
  - Product name (from `product_name` or fetched)
  - Editable quantity input (number, min 1)
  - Order date (formatted, read-only)
  - Remove button (trash icon)
- Empty state shows message when no products

## Files to Modify

1. `query/products/products-query.ts` - Add infinite query
2. `app/(Dashboard)/purchases/orders/_orders/form-options/orders-form-options.tsx` - Update schema and default values
3. `app/(Dashboard)/purchases/orders/_orders/forms/orders-form.tsx` - Replace MultiSelect with Combobox and product objects display

## Reference Implementation

- `query/vendors/vendors-query.ts` - Infinite query pattern
- `app/(Dashboard)/spaces/_spaces/forms/space-form/amenities-fields.tsx` - Combobox with array field pattern
- `app/(Dashboard)/spaces/_spaces/forms/space-form/doors-fields.tsx` - Similar pattern with remove functionality
- `app/(Dashboard)/spaces/_spaces/forms/space-form/rate-plans-fields.tsx` - Nested field access pattern (`pricing[${index}].rate`)
