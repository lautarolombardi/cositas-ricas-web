import type { Category } from '../api.ts'

interface CategoryFilterProps {
  categories: Category[]
  selectedKey: string
  onSelect: (key: string) => void
}

export function CategoryFilter({
  categories,
  selectedKey,
  onSelect,
}: CategoryFilterProps) {
  return (
    <nav className="category-filter" aria-label="Categorías">
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className="category-chip"
              aria-pressed={category.key === selectedKey}
              onClick={() => onSelect(category.key)}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
