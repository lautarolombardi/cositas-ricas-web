import { useEffect, useRef, useState } from 'react'
import type { Product } from '../../api.ts'
import { formatPrice } from '../../format.ts'
import { QuantityStepper } from '../../components/QuantityStepper.tsx'
import type { CartItem } from './useCart.ts'
import { buildOrderMessage, buildWhatsAppUrl } from './whatsapp.ts'

interface CartSheetProps {
  open: boolean
  items: CartItem[]
  totalPrice: number
  onClose: () => void
  onAdd: (product: Product) => void
  onRemove: (productId: string) => void
  onClear: () => void
}

export function CartSheet({
  open,
  items,
  totalPrice,
  onClose,
  onAdd,
  onRemove,
  onClear,
}: CartSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [customerName, setCustomerName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const whatsAppUrl = buildWhatsAppUrl(
    buildOrderMessage(items, totalPrice, customerName, notes),
  )

  return (
    <dialog
      ref={dialogRef}
      className="cart-sheet"
      aria-labelledby="cart-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="cart-sheet-content">
        <header className="cart-sheet-header">
          <h2 id="cart-title">Tu pedido</h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Cerrar"
            onClick={onClose}
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <p className="cart-empty">Todavía no agregaste productos.</p>
        ) : (
          <>
            <ul className="cart-items">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="cart-item">
                  <div>
                    <p className="cart-item-name">{product.name}</p>
                    <p className="cart-item-price">
                      {formatPrice(product.price * quantity)}
                    </p>
                  </div>
                  <QuantityStepper
                    quantity={quantity}
                    label={product.name}
                    onIncrement={() => onAdd(product)}
                    onDecrement={() => onRemove(product.id)}
                  />
                </li>
              ))}
            </ul>

            <button type="button" className="link-button" onClick={onClear}>
              Vaciar pedido
            </button>

            <div className="cart-fields">
              <label>
                <span>
                  Tu nombre <small>(opcional)</small>
                </span>
                <input
                  type="text"
                  autoComplete="name"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                />
              </label>
              <label>
                <span>
                  Aclaraciones <small>(opcional)</small>
                </span>
                <textarea
                  rows={2}
                  placeholder="Ej: sin cebolla, retiro a las 20 hs"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>

            <footer className="cart-sheet-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
              <a
                className="whatsapp-button"
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar pedido por WhatsApp
              </a>
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
}
