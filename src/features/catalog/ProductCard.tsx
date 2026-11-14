import { useState } from 'react'
import type { Product } from '../../api.ts'
import { QuantityStepper } from '../../components/QuantityStepper.tsx'
import { formatPrice } from '../../format.ts'
import { ProductPlaceholder } from './ProductPlaceholder.tsx'

const PLACEHOLDER_TONES = ['rose', 'blush', 'peach', 'mauve'] as const

function placeholderTone(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PLACEHOLDER_TONES[hash % PLACEHOLDER_TONES.length]
}

interface ProductCardProps {
  product: Product
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

export function ProductCard({
  product,
  quantity,
  onAdd,
  onRemove,
}: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = product.imageUrl && !imageFailed

  return (
    <article className={`product-card${quantity > 0 ? ' is-selected' : ''}`}>
      <div
        className="product-image"
        data-tone={showImage ? undefined : placeholderTone(product.id)}
      >
        {showImage ? (
          <img
            src={product.imageUrl!}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <ProductPlaceholder categoryKey={product.category.key} />
        )}
        {quantity > 0 && (
          <span className="product-badge" aria-hidden="true">
            ×{quantity}
          </span>
        )}
      </div>
      <div className="product-body">
        <h2>{product.name}</h2>
        {product.description && <p>{product.description}</p>}
        <div className="product-footer">
          <strong className="product-price">{formatPrice(product.price)}</strong>
          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              label={product.name}
              onIncrement={onAdd}
              onDecrement={onRemove}
            />
          ) : (
            <button type="button" className="add-button" onClick={onAdd}>
              <span aria-hidden="true">+</span> Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
