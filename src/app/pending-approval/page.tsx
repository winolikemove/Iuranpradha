import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function PendingApprovalPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const session = await getServerSession(authOptions)
  
  let profile = null
  let rejectReason = null
  
  if (session?.user?.id) {
    profile = await db.profile.findUnique({
      where: { userId: session.user.id },
    })
    rejectReason = profile?.rejectReason
  }

  const isRejected = searchParams.status === 'rejected' || profile?.status === 'REJECTED'

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isRejected ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isRejected ? 'Pendaftaran Ditolak' : 'Menunggu Persetujuan'}
          </CardTitle>
          <CardDescription>
            {isRejected
              ? 'Mohon maaf, pendaftaran Anda tidak dapat disetujui'
              : 'Pendaftaran Anda sedang dalam proses verifikasi'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {isRejected ? (
            <div className="space-y-4">
              {rejectReason && (
                <div className="p-4 bg-red-50 rounded-lg text-sm text-left">
                  <p className="font-medium text-red-800 mb-1">Alasan Penolakan:</p>
                  <p className="text-red-600">{rejectReason}</p>
                </div>
              )}
              <p className="text-muted-foreground">
                Silakan hubungi pengurus RT untuk informasi lebih lanjut atau daftar ulang dengan data yang benar.
              </p>
              <Link href="/register">
                <Button className="w-full">Daftar Ulang</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg text-sm">
                <p className="text-yellow-800">
                  Pendaftaran Anda sedang ditinjau oleh admin RT. 
                  Anda akan dapat mengakses portal setelah pendaftaran disetujui.
                </p>
              </div>
              <p className="text-muted-foreground">
                Proses verifikasi biasanya memakan waktu 1-2 hari kerja. 
                Silakan cek kembali nanti.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Kembali ke Halaman Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
