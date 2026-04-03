import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number | string | null | undefined
  className?: string
  showSign?: boolean
  type?: 'income' | 'expense' | 'neutral'
}

export function CurrencyDisplay({
  amount,
  className,
  showSign = false,
  type = 'neutral',
}: CurrencyDisplayProps) {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  const formatted = formatCurrency(Math.abs(num))
  
  const colorClass = {
    income: 'text-green-600',
    expense: 'text-red-600',
    neutral: '',
  }[type]

  return (
    <span className={cn(colorClass, className)}>
      {showSign && type === 'income' && '+'}
      {showSign && type === 'expense' && '-'}
      {formatted}
    </span>
  )
}
