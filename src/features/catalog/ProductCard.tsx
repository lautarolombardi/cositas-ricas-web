import { useEffect, useRef, useState } from 'react'
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
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const imageUrl = product.images[0]?.url ?? null
  const showImage = Boolean(imageUrl && !imageFailed)

  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog) return
    if (lightboxOpen && !dialog.open) dialog.showModal()
    if (!lightboxOpen && dialog.open) dialog.close()
  }, [lightboxOpen])

  return (
    <article className={`product-card${quantity > 0 ? ' is-selected' : ''}`}>
      <div
        className="product-image"
        data-tone={showImage ? undefined : placeholderTone(product.id)}
      >
        {showImage ? (
          <button
            type="button"
            className="product-image-button"
            aria-label={`Ampliar imagen de ${product.name}`}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={imageUrl!}
              alt={product.name}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          </button>
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

      {showImage && (
        <dialog
          ref={lightboxRef}
          className="product-lightbox"
          aria-label={product.name}
          onClose={() => setLightboxOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setLightboxOpen(false)
          }}
        >
          <div className="product-lightbox-content">
            <button
              type="button"
              className="icon-button product-lightbox-close"
              aria-label="Cerrar imagen"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <img src={imageUrl!} alt={product.name} />
            <p className="product-lightbox-caption">{product.name}</p>
          </div>
        </dialog>
      )}
    </article>
  )
}
