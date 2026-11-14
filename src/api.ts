export interface Category {
  id: string
  key: string
  name: string
}

export interface Product {
  id: string
  name: string
  imageUrl: string | null
  description: string | null
  price: number
  category: Category
}

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  throw new Error('VITE_API_URL is not set')
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, { signal })
  if (!response.ok) {
    throw new Error(`GET ${path} failed with status ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function getCategories(signal?: AbortSignal) {
  return get<Category[]>('/categories', signal)
}

export function getProducts(categoryKey: string, signal?: AbortSignal) {
  return get<Product[]>(
    `/products?category=${encodeURIComponent(categoryKey)}`,
    signal,
  )
}
