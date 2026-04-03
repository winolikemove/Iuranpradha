import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0'
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy', { locale: id })
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd MMMM yyyy, HH:mm', { locale: id })
}

export function formatShortDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'dd/MM/yyyy')
}

export function formatPeriod(month: number, year: number): string {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return `${monthNames[month - 1]} ${year}`
}

export function formatWhatsAppNumber(number: string): string {
  // Remove non-digits
  const cleaned = number.replace(/\D/g, '')
  
  // Ensure starts with country code
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1)
  }
  if (!cleaned.startsWith('62')) {
    return '62' + cleaned
  }
  return cleaned
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone)
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function generateNIK(): string {
  // Generate a random NIK-like number (16 digits)
  const prefix = '317101' // Jakarta Selatan prefix
  const random = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')
  return prefix + random
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function getMonthsInYear(): { value: number; label: string }[] {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return months.map((label, index) => ({ value: index + 1, label }))
}

export function getYearsList(fromYear: number = 2020, toYear?: number): { value: number; label: string }[] {
  const endYear = toYear || getCurrentYear() + 1
  const years = []
  for (let year = endYear; year >= fromYear; year--) {
    years.push({ value: year, label: year.toString() })
  }
  return years
}

export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize)
}

export function paginate<T>(array: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return array.slice(start, start + pageSize)
}
