'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { registerAction } from '@/actions/auth.actions'

export default function RegisterPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nik: '',
    email: '',
    noTelepon: '',
    blok: '',
    nomorRumah: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setMessage(null)
    setLoading(true)

    const result = await registerAction(formData)

    if (result.success) {
      setMessage(result.message)
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      if (result.errors) {
        setErrors(result.errors)
      }
      setMessage(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
              RT
            </div>
          </div>
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Isi formulir di bawah untuk mendaftar sebagai warga RT 011
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <Alert variant={errors && Object.keys(errors).length > 0 ? 'destructive' : 'default'}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
                <Input
                  id="namaLengkap"
                  name="namaLengkap"
                  placeholder="Nama lengkap sesuai KTP"
                  value={formData.namaLengkap}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.namaLengkap && (
                  <p className="text-xs text-destructive">{errors.namaLengkap[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit) *</Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="3171xxxxxxxxxxxx"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  required
                  disabled={loading}
                />
                {errors.nik && (
                  <p className="text-xs text-destructive">{errors.nik[0]}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="noTelepon">No. Telepon *</Label>
                <Input
                  id="noTelepon"
                  name="noTelepon"
                  placeholder="628xxxxxxxxxx"
                  value={formData.noTelepon}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.noTelepon && (
                  <p className="text-xs text-destructive">{errors.noTelepon[0]}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blok">Blok *</Label>
                <Select
                  value={formData.blok}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, blok: value }))}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih blok" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Blok A</SelectItem>
                    <SelectItem value="B">Blok B</SelectItem>
                  </SelectContent>
                </Select>
                {errors.blok && (
                  <p className="text-xs text-destructive">{errors.blok[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nomorRumah">Nomor Rumah *</Label>
                <Input
                  id="nomorRumah"
                  name="nomorRumah"
                  placeholder="Contoh: A-05"
                  value={formData.nomorRumah}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.nomorRumah && (
                  <p className="text-xs text-destructive">{errors.nomorRumah[0]}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password[0]}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword[0]}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Daftar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Masuk di sini
              </Link>
            </p>
          </div>

          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              * Pendaftaran memerlukan persetujuan admin RT sebelum dapat mengakses portal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
