'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/dashboard/stat-card'
import { Button } from '@/components/ui/button'
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CreditCard,
  ArrowRight,
  Bell,
} from 'lucide-react'
import { RoleBadge } from '@/components/shared/role-badge'
import { BlockBadge } from '@/components/shared/block-badge'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

// Mock data - will be replaced with real data from server
const mockStats = {
  totalWarga: 25,
  totalPemasukan: 12500000,
  totalPengeluaran: 8500000,
  saldoAkhir: 4000000,
}

const mockActivities = [
  {
    id: '1',
    title: 'Selamat Datang di Portal IWK-RT11',
    content: 'Portal ini adalah sistem informasi dan keuangan terpadu untuk warga RT 011.',
    createdAt: new Date(),
    isPinned: true,
    author: { namaLengkap: 'Administrator' },
  },
  {
    id: '2',
    title: 'Jadwal Kerja Bakti Blok A',
    content: 'Diberitahukan kepada seluruh warga Blok A bahwa akan diadakan kerja bakti.',
    createdAt: new Date(),
    isPinned: false,
    author: { namaLengkap: 'Siti Rahayu' },
  },
]

const mockPendingPayments = [
  {
    id: '1',
    totalAmount: 150000,
    createdAt: new Date(),
    profile: { namaLengkap: 'Gunawan Saputra', nomorRumah: 'A-05' },
  },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile

  if (!user) return null

  const isWarga = user.role === 'WARGA'
  const canViewFinance = ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'].includes(user.role)
  const canApprovePayments = ['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(user.role)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Selamat Datang, {user.namaLengkap}!
          </h1>
          <p className="text-muted-foreground">
            {user.jabatan} - Blok {user.blok}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RoleBadge role={user.role} />
          <BlockBadge blok={user.blok} />
        </div>
      </div>

      {/* Stats Grid */}
      {canViewFinance && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Warga"
            value={mockStats.totalWarga}
            description="Warga aktif"
            icon={Users}
          />
          <StatCard
            title="Total Pemasukan"
            value={<CurrencyDisplay amount={mockStats.totalPemasukan} type="income" />}
            description="Bulan ini"
            icon={TrendingUp}
          />
          <StatCard
            title="Total Pengeluaran"
            value={<CurrencyDisplay amount={mockStats.totalPengeluaran} type="expense" />}
            description="Bulan ini"
            icon={TrendingDown}
          />
          <StatCard
            title="Saldo Kas"
            value={<CurrencyDisplay amount={mockStats.saldoAkhir} />}
            description="Saat ini"
            icon={Wallet}
          />
        </div>
      )}

      {/* Quick Actions for Warga */}
      {isWarga && (
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Layanan yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Link href="/dashboard/finance/pembayaran">
                <Button className="w-full h-auto py-4 flex-col gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Bayar Iuran</span>
                </Button>
              </Link>
              <Link href="/dashboard/kegiatan">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Lihat Kegiatan</span>
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2">
                  <Wallet className="h-5 w-5" />
                  <span>Laporan Keuangan</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Kegiatan Terbaru</CardTitle>
              <CardDescription>Informasi dan pengumuman RT</CardDescription>
            </div>
            <Link href="/dashboard/kegiatan">
              <Button variant="ghost" size="sm">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{activity.title}</p>
                      {activity.isPinned && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Disematkan
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {activity.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Oleh {activity.author.namaLengkap} • {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments (for approvers) or My Payments (for warga) */}
        {canApprovePayments ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pembayaran Menunggu</CardTitle>
                <CardDescription>Permintaan pembayaran yang perlu diverifikasi</CardDescription>
              </div>
              <Link href="/dashboard/finance/pembayaran">
                <Button variant="ghost" size="sm">
                  Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {mockPendingPayments.length > 0 ? (
                <div className="space-y-4">
                  {mockPendingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{payment.profile.namaLengkap}</p>
                        <p className="text-sm text-muted-foreground">
                          Rumah {payment.profile.nomorRumah} • {formatDate(payment.createdAt)}
                        </p>
                      </div>
                      <CurrencyDisplay 
                        amount={payment.totalAmount} 
                        className="font-semibold"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Tidak ada pembayaran menunggu</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pembayaran Saya</CardTitle>
              <CardDescription>Status pembayaran iuran terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  Belum ada riwayat pembayaran
                </p>
                <Link href="/dashboard/finance/pembayaran">
                  <Button>Bayar Iuran Sekarang</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
