import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Blok } from '@prisma/client'

const blokConfig: Record<Blok, { className: string }> = {
  A: {
    className: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
  },
  B: {
    className: 'bg-violet-100 text-violet-800 hover:bg-violet-100',
  },
}

interface BlockBadgeProps {
  blok: Blok | string
}

export function BlockBadge({ blok }: BlockBadgeProps) {
  const config = blokConfig[blok as Blok] || blokConfig.A
  return (
    <Badge variant="secondary" className={cn('text-xs', config.className)}>
      Blok {blok}
    </Badge>
  )
}
