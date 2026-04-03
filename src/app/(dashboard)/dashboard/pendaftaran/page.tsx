'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Check, X, Clock } from 'lucide-react'
import { RoleBadge } from '@/components/shared/role-badge'
import { BlockBadge } from '@/components/shared/block-badge'
import { UserStatusBadge } from '@/components/shared/status-badge'
import { formatDate } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getPendingUsersAction, approveUserAction, rejectUserAction } from '@/actions/profile.actions'
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

type PendingUser = {
  id: string
  namaLengkap: string
  nik: string
  email: string
  noTelepon: string
  blok: string
  nomorRumah: string
  role: string
  status: string
  jabatan: string
  createdAt: Date
}

export default function PendaftaranPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    async function loadPendingUsers() {
      if (user) {
        const result = await getPendingUsersAction(user as any)
        setPendingUsers(result as PendingUser[])
        setLoading(false)
      }
    }
    loadPendingUsers()
  }, [user])

  const handleApprove = async (userId: string) => {
    if (!user) return
    setProcessing(true)
    const result = await approveUserAction(userId, user as any)
    if (result.success) {
      toast.success(result.message)
      setPendingUsers(prev => prev.filter(u => u.id !== userId))
    } else {
      toast.error(result.message)
    }
    setProcessing(false)
  }

  const handleReject = async () => {
    if (!user || !selectedUser) return
    setProcessing(true)
    const result = await rejectUserAction(selectedUser.id, rejectReason, user as any)
    if (result.success) {
      toast.success(result.message)
      setPendingUsers(prev => prev.filter(u => u.id !== selectedUser.id))
      setShowRejectDialog(false)
      setSelectedUser(null)
      setRejectReason('')
    } else {
      toast.error(result.message)
    }
    setProcessing(false)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Persetujuan Pendaftaran</h1>
        <p className="text-muted-foreground">
          Kelola permintaan pendaftaran warga baru
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <CardTitle>Menunggu Persetujuan</CardTitle>
            <Badge variant="secondary">{pendingUsers.length}</Badge>
          </div>
          <CardDescription>
            Daftar warga yang mendaftar dan menunggu persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Blok</TableHead>
                  <TableHead>No. Rumah</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : pendingUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Clock className="h-8 w-8 text-muted-foreground opacity-50" />
                        <p className="text-muted-foreground">Tidak ada pendaftaran menunggu</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingUsers.map((pending) => (
                    <TableRow key={pending.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pending.namaLengkap}</p>
                          <p className="text-sm text-muted-foreground">{pending.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{pending.nik}</TableCell>
                      <TableCell>{pending.noTelepon}</TableCell>
                      <TableCell><BlockBadge blok={pending.blok} /></TableCell>
                      <TableCell>{pending.nomorRumah}</TableCell>
                      <TableCell>{formatDate(pending.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(pending.id)}
                            disabled={processing}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setSelectedUser(pending)
                              setShowRejectDialog(true)
                            }}
                            disabled={processing}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Tolak
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Pendaftaran</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menolak pendaftaran dari <strong>{selectedUser?.namaLengkap}</strong>.
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
              disabled={!rejectReason.trim() || processing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Tolak Pendaftaran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
