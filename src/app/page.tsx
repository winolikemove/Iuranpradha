import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  Users, 
  Wallet, 
  Calendar, 
  Shield, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const features = [
    {
      icon: Wallet,
      title: 'Transparansi Keuangan',
      description: 'Pantau pemasukan dan pengeluaran RT secara real-time dengan laporan yang jelas dan terperinci.',
    },
    {
      icon: Calendar,
      title: 'Informasi Kegiatan',
      description: 'Dapatkan informasi terbaru tentang kegiatan dan acara RT yang akan datang.',
    },
    {
      icon: Users,
      title: 'Manajemen Warga',
      description: 'Database warga yang terorganisir dengan baik untuk memudahkan koordinasi.',
    },
    {
      icon: Shield,
      title: 'Akses Aman',
      description: 'Setiap warga memiliki akun sendiri dengan hak akses sesuai perannya.',
    },
    {
      icon: TrendingUp,
      title: 'Laporan Keuangan',
      description: 'Laporan keuangan bulanan dan tahunan yang dapat diakses kapan saja.',
    },
    {
      icon: Home,
      title: 'Portal Warga',
      description: 'Satu portal untuk semua kebutuhan administrasi dan informasi RT.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              RT
            </div>
            <div>
              <h1 className="font-bold text-lg">IWK-RT11 Portal</h1>
              <p className="text-xs text-muted-foreground">RT 011 RW 005</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Portal Warga{' '}
            <span className="text-primary">IWK-RT11</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sistem informasi dan keuangan terpadu untuk warga RT 011 RW 005 Perumahan Indah Warga Kita. 
            Transparansi, efisiensi, dan kemudahan dalam satu portal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sudah Punya Akun?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Fitur Utama</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Berbagai fitur yang dirancang untuk memudahkan pengelolaan RT dan meningkatkan transparansi.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Mengapa Menggunakan IWK-RT11 Portal?
              </h2>
              <ul className="space-y-4">
                {[
                  'Transparansi keuangan 100% - setiap transaksi tercatat dan dapat diakses',
                  'Pembayaran iuran online - tidak perlu datang ke rumah bendahara',
                  'Informasi real-time - kegiatan dan pengumuman langsung ke smartphone',
                  'Akses multi-blok - pengelolaan terpisah untuk Blok A dan Blok B',
                  'Laporan otomatis - laporan keuangan dibuat secara otomatis',
                  'Keamanan data - setiap data warga terlindungi dengan baik',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-xl">
              <h3 className="font-semibold mb-4">Statistik RT 011</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">2</p>
                  <p className="text-sm text-muted-foreground">Blok</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">50+</p>
                  <p className="text-sm text-muted-foreground">Kepala Keluarga</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">Rp 50K</p>
                  <p className="text-sm text-muted-foreground">Iuran/Bulan</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">Akses Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Siap Bergabung dengan Portal Warga?
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Daftarkan diri Anda sekarang dan nikmati kemudahan akses informasi dan layanan RT 011.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-sm font-bold">
                RT
              </div>
              <div>
                <p className="font-semibold">IWK-RT11 Portal</p>
                <p className="text-xs text-muted-foreground">RT 011 RW 005</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} IWK-RT11. Hak Cipta Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
