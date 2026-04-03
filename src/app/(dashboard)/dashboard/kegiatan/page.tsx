'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  Plus, 
  Pin, 
  PinOff, 
  Edit, 
  Trash2,
  ArrowLeft
} from 'lucide-react'
import { RoleBadge } from '@/components/shared/role-badge'
import { BlockBadge } from '@/components/shared/block-badge'
import { formatDate } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { getActivitiesAction, deleteActivityAction, toggleActivityPinAction } from '@/actions/activity.actions'
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
import Link from 'next/link'

type Activity = {
  id: string
  title: string
  content: string
  imageUrl: string | null
  blok: string | null
  isPinned: boolean
  createdAt: Date
  author: {
    namaLengkap: string
    jabatan: string
    fotoProfil: string | null
  }
}

export default function KegiatanPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    async function loadActivities() {
      if (user) {
        const result = await getActivitiesAction(user as any)
        setActivities(result as Activity[])
        setLoading(false)
      }
    }
    loadActivities()
  }, [user])

  const handleDelete = async () => {
    if (!user || !deleteId) return
    const result = await deleteActivityAction(deleteId, user as any)
    if (result.success) {
      toast.success(result.message)
      setActivities(prev => prev.filter(a => a.id !== deleteId))
    } else {
      toast.error(result.message)
    }
    setDeleteId(null)
  }

  const handleTogglePin = async (id: string) => {
    if (!user) return
    const result = await toggleActivityPinAction(id, user as any)
    if (result.success) {
      toast.success(result.message)
      setActivities(prev => prev.map(a => 
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      ))
    } else {
      toast.error(result.message)
    }
  }

  const canManage = user && ['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(user.role)

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Kegiatan & Informasi</h1>
          <p className="text-muted-foreground">
            Informasi dan pengumuman untuk warga RT 011
          </p>
        </div>
        {canManage && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kegiatan
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">
              Memuat data...
            </CardContent>
          </Card>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Belum ada kegiatan atau informasi</p>
            </CardContent>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className={activity.isPinned ? 'border-primary/50 bg-primary/5' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle>{activity.title}</CardTitle>
                      {activity.isPinned && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <Pin className="h-3 w-3 mr-1" />
                          Disematkan
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <span>Oleh {activity.author.namaLengkap}</span>
                      <span>•</span>
                      <span>{formatDate(activity.createdAt)}</span>
                      {activity.blok && (
                        <>
                          <span>•</span>
                          <BlockBadge blok={activity.blok} />
                        </>
                      )}
                    </CardDescription>
                  </div>
                  {canManage && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleTogglePin(activity.id)}
                      >
                        {activity.isPinned ? (
                          <PinOff className="h-4 w-4" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(activity.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{activity.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kegiatan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
