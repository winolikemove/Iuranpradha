import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { UserStatus, PaymentStatus } from '@prisma/client'
import { STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants'

const userStatusConfig: Record<UserStatus, { className: string }> = {
  PENDINGAPPROVAL: {
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  ACTIVE: {
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

const paymentStatusConfig: Record<PaymentStatus, { className: string }> = {
  PENDING: {
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  APPROVED: {
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

interface UserStatusBadgeProps {
  status: UserStatus | string
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = userStatusConfig[status as UserStatus] || userStatusConfig.PENDINGAPPROVAL
  return (
    <Badge variant="secondary" className={cn('text-xs', config.className)}>
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status as PaymentStatus] || paymentStatusConfig.PENDING
  return (
    <Badge variant="secondary" className={cn('text-xs', config.className)}>
      {PAYMENT_STATUS_LABELS[status] || status}
    </Badge>
  )
}
