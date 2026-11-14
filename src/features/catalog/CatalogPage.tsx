import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '../../api.ts'
import type { Category, Product } from '../../api.ts'
import { CategoryFilter } from './CategoryFilter.tsx'
import { ProductCard } from './ProductCard.tsx'

const DEFAULT_CATEGORY = 'sweet'

type ProductsResult =
  | { query: string; status: 'error' }
  | { query: string; status: 'success'; products: Product[] }

interface CatalogPageProps {
  quantityOf: (productId: string) => number
  onAdd: (product: Product) => void
  onRemove: (productId: string) => void
}

export function CatalogPage({ quantityOf, onAdd, onRemove }: CatalogPageProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [reloadKey, setReloadKey] = useState(0)
  const [productsResult, setProductsResult] = useState<ProductsResult>()
  const query = `${selectedCategory}:${reloadKey}`
  const productsState =
    productsResult?.query === query
      ? productsResult
      : ({ status: 'loading' } as const)
  const selectedCategoryName = categories.find(
    (category) => category.key === selectedCategory,
  )?.name

  useEffect(() => {
    const controller = new AbortController()
    getCategories(controller.signal)
      .then(setCategories)
      .catch(() => {})
    return () => controller.abort()
  }, [reloadKey])

  useEffect(() => {
    const controller = new AbortController()
    getProducts(selectedCategory, controller.signal)
      .then((products) =>
        setProductsResult({ query, status: 'success', products }),
      )
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(error)
          setProductsResult({ query, status: 'error' })
        }
      })
    return () => controller.abort()
  }, [selectedCategory, query])

  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedKey={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="app-main">
        {selectedCategoryName && (
          <div className="section-heading">
            <h2>{selectedCategoryName}</h2>
            {productsState.status === 'success' &&
              productsState.products.length > 0 && (
                <span>
                  {productsState.products.length}{' '}
                  {productsState.products.length === 1 ? 'opción' : 'opciones'}
                </span>
              )}
          </div>
        )}

        {productsState.status === 'loading' && (
          <ul className="product-list" aria-busy="true" aria-label="Cargando">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className="product-skeleton" />
            ))}
          </ul>
        )}

        {productsState.status === 'error' && (
          <div className="status-message">
            <p>No pudimos cargar los productos.</p>
            <button
              type="button"
              className="add-button"
              onClick={() => setReloadKey((key) => key + 1)}
            >
              Reintentar
            </button>
          </div>
        )}

        {productsState.status === 'success' &&
          (productsState.products.length === 0 ? (
            <p className="status-message">
              No hay productos en esta categoría por ahora.
            </p>
          ) : (
            <ul className="product-list">
              {productsState.products.map((product) => (
                <li key={product.id}>
                  <ProductCard
                    product={product}
                    quantity={quantityOf(product.id)}
                    onAdd={() => onAdd(product)}
                    onRemove={() => onRemove(product.id)}
                  />
                </li>
              ))}
            </ul>
          ))}
      </main>
    </>
  )
}
