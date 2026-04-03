import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Role } from '@prisma/client'
import { ROLE_LABELS } from '@/lib/constants'

const roleConfig: Record<Role, { className: string }> = {
  SUPERADMIN: {
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  ADMINBLOK: {
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  BENDAHARA: {
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  KETUART: {
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  WARGA: {
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

interface RoleBadgeProps {
  role: Role | string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role as Role] || roleConfig.WARGA
  return (
    <Badge variant="secondary" className={cn('text-xs', config.className)}>
      {ROLE_LABELS[role] || role}
    </Badge>
  )
}
