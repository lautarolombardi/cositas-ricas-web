import type { CartItem } from './cart.ts'
import { formatPrice } from './format.ts'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

export function buildOrderMessage(
  items: CartItem[],
  totalPrice: number,
  customerName: string,
  notes: string,
) {
  const lines = [
    '¡Hola! Quiero hacer el siguiente pedido:',
    '',
    ...items.map(
      ({ product, quantity }) =>
        `• ${quantity} x ${product.name} — ${formatPrice(product.price * quantity)}`,
    ),
    '',
    `*Total: ${formatPrice(totalPrice)}*`,
  ]

  if (customerName.trim()) {
    lines.push('', `Nombre: ${customerName.trim()}`)
  }
  if (notes.trim()) {
    lines.push('', `Aclaraciones: ${notes.trim()}`)
  }

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
