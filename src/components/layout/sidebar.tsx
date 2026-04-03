'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  Wallet,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'
import { RoleBadge } from '@/components/shared/role-badge'
import { BlockBadge } from '@/components/shared/block-badge'

interface SidebarProps {
  user: {
    id: string
    namaLengkap: string
    email: string
    blok: string
    role: string
    jabatan: string
  } | null
  onLogout: () => void
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/warga', label: 'Warga', icon: Users, roles: ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'] },
  { href: '/dashboard/pendaftaran', label: 'Pendaftaran', icon: UserPlus, roles: ['SUPERADMIN', 'ADMINBLOK'] },
  { href: '/dashboard/kegiatan', label: 'Kegiatan', icon: Calendar },
  { href: '/dashboard/finance/transaksi', label: 'Keuangan', icon: Wallet, roles: ['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'] },
  { href: '/dashboard/finance/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/dashboard/reports', label: 'Laporan', icon: FileText, roles: ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'] },
  { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings, roles: ['SUPERADMIN'] },
]

export function Sidebar({ user, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true
    return user && item.roles.includes(user.role)
  })

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-lg text-primary">IWK-RT11</span>
            <span className="text-xs text-muted-foreground">Portal Warga</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Profile */}
      {user && (
        <div className="border-t p-4">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {user.namaLengkap.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.namaLengkap}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RoleBadge role={user.role as any} />
                <BlockBadge blok={user.blok as any} />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                {user.namaLengkap.charAt(0).toUpperCase()}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
