'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Search, MoreHorizontal, Edit, UserCog, PenTool } from 'lucide-react'
import { RoleBadge } from '@/components/shared/role-badge'
import { BlockBadge } from '@/components/shared/block-badge'
import { UserStatusBadge } from '@/components/shared/status-badge'
import { useState, useEffect } from 'react'
import { getWargaListAction } from '@/actions/profile.actions'

type Warga = {
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
  isSignatory: boolean
}

export default function WargaPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [warga, setWarga] = useState<Warga[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWarga() {
      if (user) {
        const result = await getWargaListAction(user as any)
        setWarga(result as Warga[])
        setLoading(false)
      }
    }
    loadWarga()
  }, [user])

  const filteredWarga = warga.filter(w =>
    w.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    w.nomorRumah.toLowerCase().includes(search.toLowerCase()) ||
    w.email.toLowerCase().includes(search.toLowerCase())
  )

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daftar Warga</h1>
          <p className="text-muted-foreground">
            Kelola data warga RT 011
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama, rumah, atau email..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Rumah</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Blok</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : filteredWarga.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Tidak ada data warga
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredWarga.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{w.namaLengkap}</p>
                          <p className="text-sm text-muted-foreground">{w.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{w.nomorRumah}</TableCell>
                      <TableCell>{w.noTelepon}</TableCell>
                      <TableCell>
                        <RoleBadge role={w.role} />
                        {w.isSignatory && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            <PenTool className="h-3 w-3 mr-1" />
                            Penandatangan
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell><BlockBadge blok={w.blok} /></TableCell>
                      <TableCell><UserStatusBadge status={w.status} /></TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Ubah Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
