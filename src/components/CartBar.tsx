import { formatPrice } from '../format.ts'

interface CartBarProps {
  totalQuantity: number
  totalPrice: number
  onOpen: () => void
}

export function CartBar({ totalQuantity, totalPrice, onOpen }: CartBarProps) {
  return (
    <div className="cart-bar">
      <button type="button" onClick={onOpen}>
        <span className="cart-bar-count">{totalQuantity}</span>
        <span className="cart-bar-label">Ver mi pedido</span>
        <span className="cart-bar-total">{formatPrice(totalPrice)}</span>
      </button>
    </div>
  )
}
