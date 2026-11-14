import { useState } from 'react'
import { CartBar } from './features/cart/CartBar.tsx'
import { CartSheet } from './features/cart/CartSheet.tsx'
import { useCart } from './features/cart/useCart.ts'
import { CatalogPage } from './features/catalog/CatalogPage.tsx'
import './App.css'

function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const cart = useCart()

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

      <CatalogPage
        quantityOf={cart.quantityOf}
        onAdd={cart.add}
        onRemove={cart.remove}
      />

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
