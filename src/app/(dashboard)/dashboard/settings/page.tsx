'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Settings, Save, Building, Phone, DollarSign } from 'lucide-react'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { getSystemConfigsAction, updateSystemConfigAction } from '@/actions/config.actions'

type Config = {
  id: string
  key: string
  value: string
  label: string
  type: string
  group: string
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [configs, setConfigs] = useState<Config[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    async function loadConfigs() {
      const result = await getSystemConfigsAction()
      setConfigs(result as Config[])
      setLoading(false)
    }
    loadConfigs()
  }, [])

  const handleChange = (key: string, value: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c))
  }

  const handleSave = async (key: string) => {
    if (!user) return
    const config = configs.find(c => c.key === key)
    if (!config) return
    
    setSaving(key)
    const result = await updateSystemConfigAction(key, config.value, user as any)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
    setSaving(null)
  }

  const generalConfigs = configs.filter(c => c.group === 'general')
  const contactConfigs = configs.filter(c => c.group === 'contact')
  const financeConfigs = configs.filter(c => c.group === 'finance')

  if (!user || user.role !== 'SUPERADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Anda tidak memiliki akses ke halaman ini
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Konfigurasi sistem portal IWK-RT11
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8 text-center">Memuat data...</CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle>Pengaturan Umum</CardTitle>
              </div>
              <CardDescription>
                Informasi dasar tentang RT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generalConfigs.map((config) => (
                <div key={config.key} className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor={config.key}>{config.label}</Label>
                    <Input
                      id={config.key}
                      value={config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      placeholder={config.label}
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(config.key)}
                    disabled={saving === config.key}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <CardTitle>Kontak</CardTitle>
              </div>
              <CardDescription>
                Informasi kontak RT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactConfigs.map((config) => (
                <div key={config.key} className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor={config.key}>{config.label}</Label>
                    <Input
                      id={config.key}
                      value={config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      placeholder={config.label}
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(config.key)}
                    disabled={saving === config.key}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Finance Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <CardTitle>Keuangan</CardTitle>
              </div>
              <CardDescription>
                Pengaturan terkait keuangan RT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {financeConfigs.map((config) => (
                <div key={config.key} className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor={config.key}>{config.label}</Label>
                    <Input
                      id={config.key}
                      type={config.type === 'number' ? 'number' : 'text'}
                      value={config.value}
                      onChange={(e) => handleChange(config.key, e.target.value)}
                      placeholder={config.label}
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(config.key)}
                    disabled={saving === config.key}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
