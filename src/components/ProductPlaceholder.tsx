import type { ReactNode } from 'react'

const DRAWINGS: Record<string, ReactNode> = {
  sweet: (
    <>
      <path d="M18 34c-4 0-5-6-1-8-1-6 5-9 9-6 2-6 10-6 12 0 4-3 10 0 9 6 4 2 3 8-1 8Z" />
      <path d="M19 34l3 20h20l3-20M27 34l1.5 20M37 34l-1.5 20M32 34v20" />
      <circle cx="32" cy="14" r="3" />
      <path d="M33 11c1-3 3-5 6-5" />
    </>
  ),
  salty: (
    <>
      <path d="M8 44a24 24 0 0 1 48 0Z" />
      <path d="M13 44a19 19 0 0 1 38 0" strokeDasharray="3 4" />
      <path d="M26 14c-2-3 2-5 0-8M38 14c-2-3 2-5 0-8" opacity="0.6" />
    </>
  ),
  chocolate: (
    <>
      <path d="M16 37V11a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v26M32 8v29M16 22h32" />
      <path d="M14 40l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3v18H14Z" />
    </>
  ),
}

const DEFAULT_DRAWING = (
  <>
    <circle cx="32" cy="32" r="15" />
    <circle cx="32" cy="32" r="9" opacity="0.5" />
    <path d="M8 12v10a3 3 0 0 0 6 0V12M11 12v40" />
    <path d="M56 52V12c-4 2-6 8-6 16v6h6" />
  </>
)

export function ProductPlaceholder({ categoryKey }: { categoryKey: string }) {
  return (
    <svg
      className="product-placeholder"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {DRAWINGS[categoryKey] ?? DEFAULT_DRAWING}
    </svg>
  )
}
