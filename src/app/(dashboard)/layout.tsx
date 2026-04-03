import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AppShell } from '@/components/layout/app-shell'
import { db } from '@/lib/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  // Get the profile from database
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      namaLengkap: true,
      email: true,
      blok: true,
      role: true,
      status: true,
      jabatan: true,
      nomorRumah: true,
      noTelepon: true,
      fotoProfil: true,
      isSignatory: true,
    },
  })

  // Check if user is pending or rejected
  if (profile?.status === 'PENDINGAPPROVAL') {
    redirect('/pending-approval')
  }

  if (profile?.status === 'REJECTED') {
    redirect('/pending-approval?status=rejected')
  }

  const user = profile ? {
    id: profile.id,
    namaLengkap: profile.namaLengkap,
    email: profile.email,
    blok: profile.blok,
    role: profile.role,
    jabatan: profile.jabatan,
  } : null

  return (
    <AppShell user={user}>
      {children}
    </AppShell>
  )
}
