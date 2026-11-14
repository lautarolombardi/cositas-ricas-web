import { useEffect, useState } from 'react'
import { getCategories, getProducts } from './api.ts'
import type { Category, Product } from './api.ts'
import { useCart } from './cart.ts'
import { CartBar } from './components/CartBar.tsx'
import { CartSheet } from './components/CartSheet.tsx'
import { CategoryFilter } from './components/CategoryFilter.tsx'
import { ProductCard } from './components/ProductCard.tsx'
import './App.css'

const DEFAULT_CATEGORY = 'sweet'

type ProductsResult =
  | { query: string; status: 'error' }
  | { query: string; status: 'success'; products: Product[] }

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY)
  const [reloadKey, setReloadKey] = useState(0)
  const [productsResult, setProductsResult] = useState<ProductsResult>()
  const query = `${selectedCategory}:${reloadKey}`
  const productsState =
    productsResult?.query === query
      ? productsResult
      : ({ status: 'loading' } as const)
  const [cartOpen, setCartOpen] = useState(false)
  const cart = useCart()
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
      <header className="masthead">
        <div className="masthead-inner">
          <p className="masthead-eyebrow">Cocina casera · Pedidos por WhatsApp</p>
          <h1>
            Cositas <em>Ricas</em>
          </h1>
          <p className="masthead-tagline">hecho con amor, como en casa</p>
        </div>
      </header>

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
                    quantity={cart.quantityOf(product.id)}
                    onAdd={() => cart.add(product)}
                    onRemove={() => cart.remove(product.id)}
                  />
                </li>
              ))}
            </ul>
          ))}
      </main>

      {cart.totalQuantity > 0 && (
        <CartBar
          totalQuantity={cart.totalQuantity}
          totalPrice={cart.totalPrice}
          onOpen={() => setCartOpen(true)}
        />
      )}

      <CartSheet
        open={cartOpen}
        items={cart.items}
        totalPrice={cart.totalPrice}
        onClose={() => setCartOpen(false)}
        onAdd={cart.add}
        onRemove={cart.remove}
        onClear={cart.clear}
      />
    </>
  )
}

export default App
