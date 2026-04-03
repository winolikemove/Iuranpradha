'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  Plus, 
  Check, 
  X, 
  Clock,
  ChevronRight,
  History
} from 'lucide-react'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { PaymentStatusBadge } from '@/components/shared/status-badge'
import { BlockBadge } from '@/components/shared/block-badge'
import { formatDate, formatPeriod } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getMyPaymentsAction, getPendingPaymentsAction, approvePaymentAction, rejectPaymentAction } from '@/actions/payment.actions'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'

type PaymentItem = {
  id: string
  periodMonth: number
  periodYear: number
  amount: number
}

type Payment = {
  id: string
  totalAmount: number
  status: string
  evidenceUrl: string
  createdAt: Date
  items: PaymentItem[]
  bankAccount: {
    bankName: string
    accountNumber: string
    accountHolder: string
  }
  profile?: {
    namaLengkap: string
    nomorRumah: string
    blok: string
  }
}

export default function PembayaranPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [payments, setPayments] = useState<Payment[]>([])
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'my' | 'pending'>('my')
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    async function loadData() {
      if (user) {
        const [myPayments, pendingList] = await Promise.all([
          getMyPaymentsAction(user as any),
          canApprove ? getPendingPaymentsAction(user as any) : Promise.resolve([]),
        ])
        setPayments(myPayments as Payment[])
        setPendingPayments(pendingList as Payment[])
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const canApprove = user && ['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(user.role)
  const isWarga = user?.role === 'WARGA'

  const handleApprove = async (paymentId: string) => {
    if (!user) return
    const result = await approvePaymentAction(paymentId, user as any)
    if (result.success) {
      toast.success(result.message)
      setPendingPayments(prev => prev.filter(p => p.id !== paymentId))
    } else {
      toast.error(result.message)
    }
  }

  const handleReject = async () => {
    if (!user || !rejectId) return
    const result = await rejectPaymentAction(rejectId, rejectReason, user as any)
    if (result.success) {
      toast.success(result.message)
      setPendingPayments(prev => prev.filter(p => p.id !== rejectId))
      setRejectId(null)
      setRejectReason('')
    } else {
      toast.error(result.message)
    }
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pembayaran Iuran</h1>
          <p className="text-muted-foreground">
            {isWarga ? 'Kelola pembayaran iuran Anda' : 'Kelola pembayaran iuran warga'}
          </p>
        </div>
        {isWarga && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Bayar Iuran
          </Button>
        )}
      </div>

      {/* Tabs */}
      {canApprove && (
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'my' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my')}
          >
            <History className="h-4 w-4 mr-2" />
            Riwayat Saya
          </Button>
          <Button
            variant={activeTab === 'pending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('pending')}
          >
            <Clock className="h-4 w-4 mr-2" />
            Menunggu Verifikasi
            {pendingPayments.length > 0 && (
              <Badge className="ml-2" variant="secondary">{pendingPayments.length}</Badge>
            )}
          </Button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'pending' && canApprove ? (
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center">Memuat data...</CardContent>
            </Card>
          ) : pendingPayments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Check className="h-12 w-12 mx-auto mb-4 text-green-600 opacity-50" />
                <p className="text-muted-foreground">Tidak ada pembayaran menunggu verifikasi</p>
              </CardContent>
            </Card>
          ) : (
            pendingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {payment.profile?.namaLengkap}
                        <BlockBadge blok={payment.profile?.blok || ''} />
                      </CardTitle>
                      <CardDescription>
                        Rumah {payment.profile?.nomorRumah} • {formatDate(payment.createdAt)}
                      </CardDescription>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Periode Pembayaran:</p>
                      <div className="flex flex-wrap gap-2">
                        {payment.items.map((item) => (
                          <Badge key={item.id} variant="outline">
                            {formatPeriod(item.periodMonth, item.periodYear)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Rekening Tujuan:</p>
                      <p className="font-medium">{payment.bankAccount.bankName}</p>
                      <p className="text-sm">{payment.bankAccount.accountNumber}</p>
                      <p className="text-sm text-muted-foreground">{payment.bankAccount.accountHolder}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <CurrencyDisplay amount={payment.totalAmount} className="text-xl font-bold" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setRejectId(payment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Tolak
                      </Button>
                      <Button
                        className="text-white bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(payment.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Setujui
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center">Memuat data...</CardContent>
            </Card>
          ) : payments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">Belum ada riwayat pembayaran</p>
                {isWarga && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Bayar Iuran Sekarang
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Pembayaran Iuran
                      </CardTitle>
                      <CardDescription>
                        {formatDate(payment.createdAt)}
                      </CardDescription>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {payment.items.map((item) => (
                      <Badge key={item.id} variant="outline">
                        {formatPeriod(item.periodMonth, item.periodYear)}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <CurrencyDisplay amount={payment.totalAmount} className="text-xl font-bold" />
                    </div>
                    {payment.status === 'PENDING' && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Menunggu Verifikasi
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Reject Dialog */}
      <AlertDialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Pembayaran</AlertDialogTitle>
            <AlertDialogDescription>
              Berikan alasan penolakan:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Alasan penolakan..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason('')}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Tolak Pembayaran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
