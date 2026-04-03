// Constants for IWK-RT11 Digital Ecosystem

export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  ADMINBLOK: 'Admin Blok',
  BENDAHARA: 'Bendahara',
  KETUART: 'Ketua RT',
  WARGA: 'Warga',
}

export const STATUS_LABELS: Record<string, string> = {
  PENDINGAPPROVAL: 'Menunggu Persetujuan',
  ACTIVE: 'Aktif',
  REJECTED: 'Ditolak',
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Menunggu Verifikasi',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
}

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  INCOME: 'Pemasukan',
  EXPENSE: 'Pengeluaran',
}

export const BLOK_LABELS: Record<string, string> = {
  A: 'Blok A',
  B: 'Blok B',
}

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export const CONFIG_KEYS = {
  APP_NAME: 'APP_NAME',
  RT_NAME: 'RT_NAME',
  RT_ADDRESS: 'RT_ADDRESS',
  RT_WHATSAPP: 'RT_WHATSAPP',
  TARIF_IURAN: 'TARIF_IURAN',
  IURAN_CATEGORY_NAME: 'IURAN_CATEGORY_NAME',
} as const

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'Home' },
  { href: '/dashboard/warga', label: 'Warga', icon: 'Users', roles: ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'] },
  { href: '/dashboard/pendaftaran', label: 'Pendaftaran', icon: 'UserPlus', roles: ['SUPERADMIN', 'ADMINBLOK'] },
  { href: '/dashboard/kegiatan', label: 'Kegiatan', icon: 'Calendar' },
  { href: '/dashboard/finance/transaksi', label: 'Keuangan', icon: 'Wallet', roles: ['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'] },
  { href: '/dashboard/finance/pembayaran', label: 'Pembayaran', icon: 'CreditCard' },
  { href: '/dashboard/reports', label: 'Laporan', icon: 'FileText', roles: ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'] },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: 'Settings', roles: ['SUPERADMIN'] },
] as const
