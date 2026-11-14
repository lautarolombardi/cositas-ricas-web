import { useEffect, useReducer } from 'react'
import type { Product } from './api.ts'

export interface CartItem {
  product: Product
  quantity: number
}

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'remove'; productId: string }
  | { type: 'clear' }

const STORAGE_KEY = 'cositas-ricas:cart'

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'add': {
      const existing = items.find((item) => item.product.id === action.product.id)
      if (!existing) {
        return [...items, { product: action.product, quantity: 1 }]
      }
      return items.map((item) =>
        item === existing ? { ...item, quantity: item.quantity + 1 } : item,
      )
    }
    case 'remove':
      return items
        .map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0)
    case 'clear':
      return []
  }
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export function useCart() {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  return {
    items,
    totalQuantity,
    totalPrice,
    quantityOf: (productId: string) =>
      items.find((item) => item.product.id === productId)?.quantity ?? 0,
    add: (product: Product) => dispatch({ type: 'add', product }),
    remove: (productId: string) => dispatch({ type: 'remove', productId }),
    clear: () => dispatch({ type: 'clear' }),
  }
}
