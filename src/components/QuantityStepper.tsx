interface QuantityStepperProps {
  quantity: number
  label: string
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantityStepper({
  quantity,
  label,
  onIncrement,
  onDecrement,
}: QuantityStepperProps) {
  return (
    <div className="stepper" role="group" aria-label={`Cantidad de ${label}`}>
      <button
        type="button"
        aria-label={`Quitar un ${label}`}
        onClick={onDecrement}
      >
        −
      </button>
      <output aria-live="polite">{quantity}</output>
      <button
        type="button"
        aria-label={`Agregar un ${label}`}
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  )
}
