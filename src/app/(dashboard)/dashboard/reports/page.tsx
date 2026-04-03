'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Calendar
} from 'lucide-react'
import { CurrencyDisplay } from '@/components/shared/currency-display'
import { useState, useEffect } from 'react'
import { getFinancialSummaryAction } from '@/actions/transaction.actions'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function ReportsPage() {
  const { data: session } = useSession()
  const user = session?.user?.profile
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [selectedBlok, setSelectedBlok] = useState(user?.blok || 'A')
  const [summary, setSummary] = useState({
    initialBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    currentBalance: 0,
  })

  useEffect(() => {
    async function loadSummary() {
      if (user) {
        const result = await getFinancialSummaryAction(
          selectedBlok as any,
          parseInt(selectedYear),
          undefined,
          user as any
        )
        setSummary(result)
      }
    }
    loadSummary()
  }, [selectedYear, selectedBlok, user])

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ]

  // Mock monthly data for chart
  const monthlyData = months.map((month, index) => ({
    name: month,
    pemasukan: Math.floor(Math.random() * 5000000) + 1000000,
    pengeluaran: Math.floor(Math.random() * 3000000) + 500000,
  }))

  const years = []
  for (let y = new Date().getFullYear(); y >= 2020; y--) {
    years.push(y.toString())
  }

  const canViewReports = user && ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'].includes(user.role)

  if (!canViewReports) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Anda tidak memiliki akses ke halaman ini
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Laporan keuangan RT 011
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {user?.role === 'SUPERADMIN' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Blok</label>
                <Select value={selectedBlok} onValueChange={setSelectedBlok}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Blok A</SelectItem>
                    <SelectItem value="B">Blok B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Saldo Awal</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencyDisplay amount={summary.initialBalance} className="text-2xl font-bold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={summary.totalIncome} 
              type="income"
              className="text-2xl font-bold" 
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={summary.totalExpense} 
              type="expense"
              className="text-2xl font-bold" 
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Akhir</CardTitle>
            <Wallet className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <CurrencyDisplay 
              amount={summary.currentBalance}
              className="text-2xl font-bold" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grafik Keuangan Bulanan</CardTitle>
          <CardDescription>
            Perbandingan pemasukan dan pengeluaran per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(value),
                    ''
                  ]}
                />
                <Legend />
                <Bar 
                  dataKey="pemasukan" 
                  name="Pemasukan" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="pengeluaran" 
                  name="Pengeluaran" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Tahun {selectedYear}</CardTitle>
          <CardDescription>
            Laporan keuangan tahunan Blok {selectedBlok}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Saldo Awal Tahun</span>
              <CurrencyDisplay amount={summary.initialBalance} className="font-semibold" />
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Total Pemasukan</span>
              <CurrencyDisplay amount={summary.totalIncome} type="income" className="font-semibold" />
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Total Pengeluaran</span>
              <CurrencyDisplay amount={summary.totalExpense} type="expense" className="font-semibold" />
            </div>
            <div className="flex justify-between items-center py-2 bg-muted/50 rounded-lg px-4">
              <span className="font-semibold">Saldo Akhir Tahun</span>
              <CurrencyDisplay amount={summary.currentBalance} className="text-xl font-bold" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
