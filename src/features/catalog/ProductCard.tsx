import { useEffect, useRef, useState } from 'react'
import type { Product, ProductImage } from '../../api.ts'
import { QuantityStepper } from '../../components/QuantityStepper.tsx'
import { formatPrice } from '../../format.ts'
import { ProductPlaceholder } from './ProductPlaceholder.tsx'

const PLACEHOLDER_TONES = ['rose', 'blush', 'peach', 'mauve'] as const

function placeholderTone(seed: string) {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return PLACEHOLDER_TONES[hash % PLACEHOLDER_TONES.length]
}

function visibleImages(images: ProductImage[], failedIds: ReadonlySet<string>) {
  return images
    .filter((image) => image.url && !failedIds.has(image.id))
    .toSorted((a, b) => a.position - b.position)
}

function wrapIndex(index: number, count: number) {
  if (count === 0) return 0
  return ((index % count) + count) % count
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
  const [failedIds, setFailedIds] = useState<ReadonlySet<string>>(() => new Set())
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const lightboxRef = useRef<HTMLDialogElement>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const images = visibleImages(product.images, failedIds)
  const index = images.length === 0 ? 0 : Math.min(activeIndex, images.length - 1)
  const currentImage = images[index]
  const showImage = currentImage != null
  const hasGallery = images.length > 1

  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog) return
    if (lightboxOpen && !dialog.open) dialog.showModal()
    if (!lightboxOpen && dialog.open) dialog.close()
  }, [lightboxOpen])

  useEffect(() => {
    if (!lightboxOpen || !hasGallery) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      const step = event.key === 'ArrowRight' ? 1 : -1
      setActiveIndex((current) => {
        const safe = Math.min(current, images.length - 1)
        return wrapIndex(safe + step, images.length)
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, hasGallery, images.length])

  useEffect(() => {
    if (!lightboxOpen || !hasGallery) return
    const container = thumbsRef.current
    const thumb = container?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!container || !thumb) return
    const left = thumb.offsetLeft - (container.clientWidth - thumb.clientWidth) / 2
    container.scrollTo({ left })
  }, [lightboxOpen, hasGallery, index])

  function markFailed(id: string) {
    setFailedIds((current) => {
      if (current.has(id)) return current
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  function showImageAt(nextIndex: number) {
    setActiveIndex(wrapIndex(nextIndex, images.length))
  }

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
            aria-label={
              hasGallery
                ? `Ver las ${images.length} fotos de ${product.name}`
                : `Ampliar imagen de ${product.name}`
            }
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={currentImage.url}
              alt={
                hasGallery
                  ? `${product.name}, foto ${index + 1} de ${images.length}`
                  : product.name
              }
              loading="lazy"
              onError={() => markFailed(currentImage.id)}
            />
          </button>
        ) : (
          <ProductPlaceholder categoryKey={product.category.key} />
        )}
        {hasGallery && (
          <span className="product-image-count">{images.length} fotos</span>
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
          aria-label={
            hasGallery
              ? `${product.name}, foto ${index + 1} de ${images.length}`
              : product.name
          }
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
            <div className="product-lightbox-stage">
              {hasGallery && (
                <button
                  type="button"
                  className="icon-button product-lightbox-nav is-prev"
                  aria-label="Foto anterior"
                  onClick={() => showImageAt(index - 1)}
                >
                  ‹
                </button>
              )}
              <img
                src={currentImage.url}
                alt={
                  hasGallery
                    ? `${product.name}, foto ${index + 1} de ${images.length}`
                    : product.name
                }
                onError={() => markFailed(currentImage.id)}
              />
              {hasGallery && (
                <button
                  type="button"
                  className="icon-button product-lightbox-nav is-next"
                  aria-label="Foto siguiente"
                  onClick={() => showImageAt(index + 1)}
                >
                  ›
                </button>
              )}
            </div>
            {hasGallery && (
              <div
                ref={thumbsRef}
                className="product-lightbox-thumbs"
                role="group"
                aria-label="Elegir foto"
              >
                {images.map((image, imageIndex) => (
                  <button
                    key={image.id}
                    type="button"
                    className="product-lightbox-thumb"
                    aria-label={`Ver foto ${imageIndex + 1} de ${images.length}`}
                    aria-current={imageIndex === index ? 'true' : undefined}
                    onClick={() => showImageAt(imageIndex)}
                  >
                    <img
                      src={image.url}
                      alt=""
                      onError={() => markFailed(image.id)}
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="product-lightbox-caption">
              {product.name}
              {hasGallery && (
                <span>
                  {index + 1} de {images.length}
                </span>
              )}
            </p>
          </div>
        </dialog>
      )}
    </article>
  )
}
