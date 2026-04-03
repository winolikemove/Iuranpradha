IWK-RT11 Digital Ecosystem — Complete Implementation Prompt
Project Overview

Build a production-ready fullstack application called IWK-RT11 Finance & Community Portal using Next.js 14+ (App Router), TypeScript, Prisma, and Supabase. This is a multi-tenant RT (neighborhood) management system with complete financial transparency, block-based data isolation, and community features.

Technology Stack

``
Framework: Next.js 14+ (App Router)
Language: TypeScript (strict mode)
Database: PostgreSQL via Supabase
ORM: Prisma
Auth: Supabase Auth
Storage: Supabase Storage
Styling: Tailwind CSS + shadcn/ui
State: Zustand
Forms: React Hook Form + Zod
Tables: TanStack Table v8
Charts: Recharts
PDF: @react-pdf/renderer
Dates: date-fns
Notifications: Sonner
`

Project Structure

`
iwk-rt11/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── pending-approval/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── warga/
│   │   │   ├── pendaftaran/
│   │   │   ├── kegiatan/
│   │   │   ├── finance/
│   │   │   │   ├── transaksi/
│   │   │   │   ├── kategori/
│   │   │   │   ├── rekening/
│   │   │   │   ├── pembayaran/
│   │   │   │   └── saldo-awal/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── payment-wizard/
│   │   ├── api/
│   │   │   └── [...routes]
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── mobile-nav.tsx
│   │   ├── dashboard/
│   │   │   ├── stat-card.tsx
│   │   │   ├── activity-card.tsx
│   │   │   ├── profile-card.tsx
│   │   │   └── finance-chart.tsx
│   │   ├── forms/
│   │   │   ├── login-form.tsx
│   │   │   ├── register-form.tsx
│   │   │   ├── transaction-form.tsx
│   │   │   └── category-form.tsx
│   │   ├── tables/
│   │   │   ├── data-table.tsx
│   │   │   ├── warga-table.tsx
│   │   │   ├── transaction-table.tsx
│   │   │   └── payment-table.tsx
│   │   ├── wizard/
│   │   │   ├── payment-wizard.tsx
│   │   │   ├── step-indicator.tsx
│   │   │   └── steps/
│   │   │       ├── step-1-confirm-data.tsx
│   │   │       ├── step-2-select-period.tsx
│   │   │       ├── step-3-calculation.tsx
│   │   │       ├── step-4-bank-info.tsx
│   │   │       ├── step-5-upload-proof.tsx
│   │   │       └── step-6-review.tsx
│   │   ├── pdf/
│   │   │   └── financial-report.tsx
│   │   └── shared/
│   │       ├── empty-state.tsx
│   │       ├── loading-state.tsx
│   │       ├── status-badge.tsx
│   │       ├── role-badge.tsx
│   │       ├── block-badge.tsx
│   │       ├── currency-display.tsx
│   │       └── upload-field.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   └── validations/
│   │       ├── auth.ts
│   │       ├── profile.ts
│   │       ├── transaction.ts
│   │       └── payment.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── profile.service.ts
│   │   ├── transaction.service.ts
│   │   ├── payment.service.ts
│   │   ├── activity.service.ts
│   │   ├── category.service.ts
│   │   ├── bank-account.service.ts
│   │   ├── config.service.ts
│   │   └── report.service.ts
│   ├── actions/
│   │   ├── auth.actions.ts
│   │   ├── profile.actions.ts
│   │   ├── transaction.actions.ts
│   │   ├── payment.actions.ts
│   │   ├── activity.actions.ts
│   │   ├── category.actions.ts
│   │   ├── bank-account.actions.ts
│   │   └── config.actions.ts
│   ├── hooks/
│   │   ├── use-current-user.ts
│   │   ├── use-block-data.ts
│   │   └── use-payment-wizard.ts
│   ├── stores/
│   │   ├── user-store.ts
│   │   └── wizard-store.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── database.ts
│   │   └── api.ts
│   └── middleware.ts
├── public/
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── components.json
`

Complete Prisma Schema

`prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASEURL")
  directUrl = env("DIRECTURL")
}

// ==================== ENUMS ====================

enum Role {
  SUPERADMIN
  ADMINBLOK
  BENDAHARA
  KETUART
  WARGA
}

enum UserStatus {
  PENDINGAPPROVAL
  ACTIVE
  REJECTED
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum PaymentStatus {
  PENDING
  APPROVED
  REJECTED
}

enum Blok {
  A
  B
}

// ==================== SYSTEM ====================

model SystemConfig {
  id        String   @id @default(uuid())
  key       String   @unique
  value     String   @db.Text
  label     String
  type      String   @default("text") // text, number, textarea, url
  group     String   @default("general") // general, contact, finance
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([group])
  @@index([key])
}

model InitialBalance {
  id        String   @id @default(uuid())
  blok      Blok
  year      Int
  amount    Decimal  @db.Decimal(15, 2)
  notes     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([blok, year])
  @@index([blok])
  @@index([year])
}

// ==================== USER & PROFILE ====================

model Profile {
  id           String     @id @default(uuid())
  userId       String     @unique // Supabase Auth UUID
  namaLengkap  String
  nik          String     @unique
  email        String     @unique
  noTelepon    String
  blok         Blok
  nomorRumah   String
  role         Role       @default(WARGA)
  status       UserStatus @default(PENDINGAPPROVAL)
  jabatan      String     @default("Warga")
  isSignatory  Boolean    @default(false)
  signatureUrl String?
  fotoProfil   String?
  rejectedAt   DateTime?
  rejectReason String?
  approvedAt   DateTime?
  approvedBy   String?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  // Relations
  paymentSubmissions PaymentSubmission[]
  transactions       Transaction[]       @relation("CreatedByProfile")
  activities         Activity[]          @relation("AuthorProfile")

  @@index([blok])
  @@index([role])
  @@index([status])
  @@index([blok, status])
  @@index([blok, role])
  @@index([userId])
}

// ==================== ACTIVITY / KEGIATAN ====================

model Activity {
  id        String   @id @default(uuid())
  blok      Blok?    // null means GENERAL (visible to all)
  title     String
  content   String   @db.Text
  imageUrl  String?
  authorId  String
  author    Profile  @relation("AuthorProfile", fields: [authorId], references: [id])
  isPinned  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([blok])
  @@index([createdAt(sort: Desc)])
  @@index([isPinned])
}

// ==================== FINANCE ====================

model FinancialCategory {
  id           String          @id @default(uuid())
  blok         Blok
  name         String
  type         TransactionType
  description  String?
  isActive     Boolean         @default(true)
  transactions Transaction[]
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt

  @@unique([blok, name, type])
  @@index([blok])
  @@index([blok, type])
  @@index([isActive])
}

model BankAccount {
  id            String   @id @default(uuid())
  blok          Blok
  bankName      String
  accountNumber String
  accountHolder String
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  paymentSubmissions PaymentSubmission[]

  @@index([blok])
  @@index([isActive])
}

model Transaction {
  id              String            @id @default(uuid())
  blok            Blok
  type            TransactionType
  categoryId      String
  category        FinancialCategory @relation(fields: [categoryId], references: [id])
  amount          Decimal           @db.Decimal(15, 2)
  description     String
  evidenceUrl     String?
  transactionDate DateTime          @default(now())
  createdById     String
  createdBy       Profile           @relation("CreatedByProfile", fields: [createdById], references: [id])
  
  // Reference to payment if this transaction was auto-created from payment approval
  paymentSubmissionId String?       @unique
  paymentSubmission   PaymentSubmission? @relation("PaymentTransaction")
  
  journalEntries JournalEntry[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([blok])
  @@index([categoryId])
  @@index([transactionDate])
  @@index([blok, type])
  @@index([blok, transactionDate])
}

model JournalEntry {
  id            String      @id @default(uuid())
  transactionId String
  transaction   Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  accountName   String
  debit         Decimal     @default(0) @db.Decimal(15, 2)
  credit        Decimal     @default(0) @db.Decimal(15, 2)
  createdAt     DateTime    @default(now())

  @@index([transactionId])
}

// ==================== PAYMENT (Multi-month support) ====================

model PaymentSubmission {
  id            String        @id @default(uuid())
  profileId     String
  profile       Profile       @relation(fields: [profileId], references: [id])
  blok          Blok
  totalAmount   Decimal       @db.Decimal(15, 2)
  status        PaymentStatus @default(PENDING)
  evidenceUrl   String
  bankAccountId String
  bankAccount   BankAccount   @relation(fields: [bankAccountId], references: [id])
  
  // Approval tracking
  processedAt   DateTime?
  processedById String?
  rejectReason  String?
  
  // Auto-created transaction when approved
  transaction   Transaction?  @relation("PaymentTransaction")
  
  items         PaymentItem[]
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([profileId])
  @@index([blok])
  @@index([status])
  @@index([createdAt(sort: Desc)])
  @@index([blok, status])
}

model PaymentItem {
  id           String            @id @default(uuid())
  submissionId String
  submission   PaymentSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  periodMonth  Int               // 1-12
  periodYear   Int
  amount       Decimal           @db.Decimal(15, 2)

  @@unique([submissionId, periodMonth, periodYear])
  @@index([periodYear, periodMonth])
}

// ==================== AUDIT LOG (Optional but recommended) ====================

model AuditLog {
  id         String   @id @default(uuid())
  userId     String
  action     String
  entityType String
  entityId   String
  oldData    Json?
  newData    Json?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([userId])
  @@index([entityType, entityId])
  @@index([createdAt(sort: Desc)])
}
`

Seed Data

`typescript
// prisma/seed.ts

import { PrismaClient, Role, UserStatus, TransactionType, Blok, PaymentStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ==================== SYSTEM CONFIG ====================
  const configs = [
    { key: 'APPNAME', value: 'IWK-RT11 Portal', label: 'Nama Aplikasi', type: 'text', group: 'general' },
    { key: 'RTNAME', value: 'RT 011 RW 005', label: 'Nama RT', type: 'text', group: 'general' },
    { key: 'RTADDRESS', value: 'Perumahan Indah Warga Kita, Kelurahan Sejahtera, Kecamatan Makmur, Jakarta Selatan', label: 'Alamat Sekretariat', type: 'textarea', group: 'contact' },
    { key: 'RTWHATSAPP', value: '6281234567890', label: 'WhatsApp RT', type: 'text', group: 'contact' },
    { key: 'TARIFIURAN', value: '50000', label: 'Tarif Iuran Bulanan (Rp)', type: 'number', group: 'finance' },
    { key: 'IURANCATEGORYNAME', value: 'Iuran Bulanan Warga', label: 'Nama Kategori Iuran', type: 'text', group: 'finance' },
  ]

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: config,
      create: config,
    })
  }
  console.log('✅ System configs seeded')

  // ==================== INITIAL BALANCE ====================
  const currentYear = new Date().getFullYear()
  
  await prisma.initialBalance.upsert({
    where: { blokyear: { blok: 'A', year: currentYear } },
    update: {},
    create: { blok: 'A', year: currentYear, amount: 5000000, notes: 'Saldo awal tahun ' + currentYear },
  })

  await prisma.initialBalance.upsert({
    where: { blokyear: { blok: 'B', year: currentYear } },
    update: {},
    create: { blok: 'B', year: currentYear, amount: 4500000, notes: 'Saldo awal tahun ' + currentYear },
  })
  console.log('✅ Initial balances seeded')

  // ==================== PROFILES ====================
  // Note: In real app, these would be created through Supabase Auth
  // For seed, we create profiles with dummy userIds
  
  const profiles = [
    // Super Admin
    {
      userId: 'superadmin-uuid-001',
      namaLengkap: 'Administrator Sistem',
      nik: '3171010101010001',
      email: 'superadmin@iwkrt11.id',
      noTelepon: '6281200000001',
      blok: 'A' as Blok,
      nomorRumah: '-',
      role: 'SUPERADMIN' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Super Administrator',
    },
    // Blok A Staff
    {
      userId: 'ketua-a-uuid-001',
      namaLengkap: 'Budi Santoso',
      nik: '3171010101010002',
      email: 'ketua.bloka@iwkrt11.id',
      noTelepon: '6281200000002',
      blok: 'A' as Blok,
      nomorRumah: 'A-01',
      role: 'KETUART' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Ketua RT Blok A',
      isSignatory: true,
    },
    {
      userId: 'admin-a-uuid-001',
      namaLengkap: 'Siti Rahayu',
      nik: '3171010101010003',
      email: 'admin.bloka@iwkrt11.id',
      noTelepon: '6281200000003',
      blok: 'A' as Blok,
      nomorRumah: 'A-02',
      role: 'ADMINBLOK' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Sekretaris Blok A',
      isSignatory: true,
    },
    {
      userId: 'bendahara-a-uuid-001',
      namaLengkap: 'Ahmad Wijaya',
      nik: '3171010101010004',
      email: 'bendahara.bloka@iwkrt11.id',
      noTelepon: '6281200000004',
      blok: 'A' as Blok,
      nomorRumah: 'A-03',
      role: 'BENDAHARA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Bendahara Blok A',
      isSignatory: true,
    },
    // Blok B Staff
    {
      userId: 'ketua-b-uuid-001',
      namaLengkap: 'Dewi Lestari',
      nik: '3171010101010005',
      email: 'ketua.blokb@iwkrt11.id',
      noTelepon: '6281200000005',
      blok: 'B' as Blok,
      nomorRumah: 'B-01',
      role: 'KETUART' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Ketua RT Blok B',
      isSignatory: true,
    },
    {
      userId: 'admin-b-uuid-001',
      namaLengkap: 'Eko Prasetyo',
      nik: '3171010101010006',
      email: 'admin.blokb@iwkrt11.id',
      noTelepon: '6281200000006',
      blok: 'B' as Blok,
      nomorRumah: 'B-02',
      role: 'ADMINBLOK' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Sekretaris Blok B',
      isSignatory: true,
    },
    {
      userId: 'bendahara-b-uuid-001',
      namaLengkap: 'Fitri Handayani',
      nik: '3171010101010007',
      email: 'bendahara.blokb@iwkrt11.id',
      noTelepon: '6281200000007',
      blok: 'B' as Blok,
      nomorRumah: 'B-03',
      role: 'BENDAHARA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Bendahara Blok B',
      isSignatory: true,
    },
    // Warga Blok A
    {
      userId: 'warga-a-uuid-001',
      namaLengkap: 'Gunawan Saputra',
      nik: '3171010101010008',
      email: 'gunawan@email.com',
      noTelepon: '6281300000001',
      blok: 'A' as Blok,
      nomorRumah: 'A-05',
      role: 'WARGA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Warga',
    },
    {
      userId: 'warga-a-uuid-002',
      namaLengkap: 'Heni Mulyani',
      nik: '3171010101010009',
      email: 'heni@email.com',
      noTelepon: '6281300000002',
      blok: 'A' as Blok,
      nomorRumah: 'A-06',
      role: 'WARGA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Warga',
    },
    {
      userId: 'warga-a-uuid-003',
      namaLengkap: 'Irfan Hakim',
      nik: '3171010101010010',
      email: 'irfan@email.com',
      noTelepon: '6281300000003',
      blok: 'A' as Blok,
      nomorRumah: 'A-07',
      role: 'WARGA' as Role,
      status: 'PENDINGAPPROVAL' as UserStatus,
      jabatan: 'Warga',
    },
    // Warga Blok B
    {
      userId: 'warga-b-uuid-001',
      namaLengkap: 'Joko Widodo',
      nik: '3171010101010011',
      email: 'joko@email.com',
      noTelepon: '6281300000004',
      blok: 'B' as Blok,
      nomorRumah: 'B-05',
      role: 'WARGA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Warga',
    },
    {
      userId: 'warga-b-uuid-002',
      namaLengkap: 'Kartini Sari',
      nik: '3171010101010012',
      email: 'kartini@email.com',
      noTelepon: '6281300000005',
      blok: 'B' as Blok,
      nomorRumah: 'B-06',
      role: 'WARGA' as Role,
      status: 'ACTIVE' as UserStatus,
      jabatan: 'Warga',
    },
    {
      userId: 'warga-b-uuid-003',
      namaLengkap: 'Lukman Hakim',
      nik: '3171010101010013',
      email: 'lukman@email.com',
      noTelepon: '6281300000006',
      blok: 'B' as Blok,
      nomorRumah: 'B-07',
      role: 'WARGA' as Role,
      status: 'PENDINGAPPROVAL' as UserStatus,
      jabatan: 'Warga',
    },
  ]

  for (const profile of profiles) {
    await prisma.profile.upsert({
      where: { nik: profile.nik },
      update: profile,
      create: profile,
    })
  }
  console.log('✅ Profiles seeded')

  // ==================== FINANCIAL CATEGORIES ====================
  const categories = [
    // Blok A - Income
    { blok: 'A' as Blok, name: 'Iuran Bulanan Warga', type: 'INCOME' as TransactionType, description: 'Iuran bulanan warga' },
    { blok: 'A' as Blok, name: 'Dana Sosial', type: 'INCOME' as TransactionType, description: 'Sumbangan sukarela warga' },
    { blok: 'A' as Blok, name: 'Pendapatan Lain-lain', type: 'INCOME' as TransactionType, description: 'Pendapatan tidak terkategorisasi' },
    // Blok A - Expense
    { blok: 'A' as Blok, name: 'Kebersihan & Sampah', type: 'EXPENSE' as TransactionType, description: 'Biaya petugas kebersihan dan pengangkutan sampah' },
    { blok: 'A' as Blok, name: 'Keamanan', type: 'EXPENSE' as TransactionType, description: 'Biaya satpam dan keamanan lingkungan' },
    { blok: 'A' as Blok, name: 'Perbaikan Fasilitas', type: 'EXPENSE' as TransactionType, description: 'Perbaikan jalan, lampu, taman, dll' },
    { blok: 'A' as Blok, name: 'Listrik & Air Fasum', type: 'EXPENSE' as TransactionType, description: 'Tagihan listrik dan air fasilitas umum' },
    { blok: 'A' as Blok, name: 'Kegiatan Sosial', type: 'EXPENSE' as TransactionType, description: 'Biaya kegiatan warga' },
    { blok: 'A' as Blok, name: 'Administrasi', type: 'EXPENSE' as TransactionType, description: 'ATK, cetak, dan keperluan kantor' },
    { blok: 'A' as Blok, name: 'Pengeluaran Lain-lain', type: 'EXPENSE' as TransactionType, description: 'Pengeluaran tidak terkategorisasi' },
    // Blok B - Income
    { blok: 'B' as Blok, name: 'Iuran Bulanan Warga', type: 'INCOME' as TransactionType, description: 'Iuran bulanan warga' },
    { blok: 'B' as Blok, name: 'Dana Sosial', type: 'INCOME' as TransactionType, description: 'Sumbangan sukarela warga' },
    { blok: 'B' as Blok, name: 'Pendapatan Lain-lain', type: 'INCOME' as TransactionType, description: 'Pendapatan tidak terkategorisasi' },
    // Blok B - Expense
    { blok: 'B' as Blok, name: 'Kebersihan & Sampah', type: 'EXPENSE' as TransactionType, description: 'Biaya petugas kebersihan dan pengangkutan sampah' },
    { blok: 'B' as Blok, name: 'Keamanan', type: 'EXPENSE' as TransactionType, description: 'Biaya satpam dan keamanan lingkungan' },
    { blok: 'B' as Blok, name: 'Perbaikan Fasilitas', type: 'EXPENSE' as TransactionType, description: 'Perbaikan jalan, lampu, taman, dll' },
    { blok: 'B' as Blok, name: 'Listrik & Air Fasum', type: 'EXPENSE' as TransactionType, description: 'Tagihan listrik dan air fasilitas umum' },
    { blok: 'B' as Blok, name: 'Kegiatan Sosial', type: 'EXPENSE' as TransactionType, description: 'Biaya kegiatan warga' },
    { blok: 'B' as Blok, name: 'Administrasi', type: 'EXPENSE' as TransactionType, description: 'ATK, cetak, dan keperluan kantor' },
    { blok: 'B' as Blok, name: 'Pengeluaran Lain-lain', type: 'EXPENSE' as TransactionType, description: 'Pengeluaran tidak terkategorisasi' },
  ]

  for (const cat of categories) {
    await prisma.financialCategory.upsert({
      where: { bloknametype: { blok: cat.blok, name: cat.name, type: cat.type } },
      update: cat,
      create: cat,
    })
  }
  console.log('✅ Financial categories seeded')

  // ==================== BANK ACCOUNTS ====================
  const bankAccounts = [
    { blok: 'A' as Blok, bankName: 'Bank BCA', accountNumber: '1234567890', accountHolder: 'RT 011 Blok A' },
    { blok: 'A' as Blok, bankName: 'Bank Mandiri', accountNumber: '0987654321', accountHolder: 'RT 011 Blok A' },
    { blok: 'B' as Blok, bankName: 'Bank BCA', accountNumber: '1122334455', accountHolder: 'RT 011 Blok B' },
    { blok: 'B' as Blok, bankName: 'Bank BRI', accountNumber: '5544332211', accountHolder: 'RT 011 Blok B' },
  ]

  const createdBanks = []
  for (const bank of bankAccounts) {
    const created = await prisma.bankAccount.create({ data: bank })
    createdBanks.push(created)
  }
  console.log('✅ Bank accounts seeded')

  // ==================== ACTIVITIES ====================
  const adminA = await prisma.profile.findFirst({ where: { email: 'admin.bloka@iwkrt11.id' } })
  const adminB = await prisma.profile.findFirst({ where: { email: 'admin.blokb@iwkrt11.id' } })
  const superAdmin = await prisma.profile.findFirst({ where: { email: 'superadmin@iwkrt11.id' } })

  if (adminA && adminB && superAdmin) {
    const activities = [
      {
        blok: null, // GENERAL
        title: 'Selamat Datang di Portal IWK-RT11',
        content: 'Portal ini adalah sistem informasi dan keuangan terpadu untuk warga RT 011. Melalui portal ini, warga dapat membayar iuran, melihat informasi kegiatan, dan memantau transparansi keuangan RT.',
        authorId: superAdmin.id,
        isPinned: true,
      },
      {
        blok: 'A' as Blok,
        title: 'Jadwal Kerja Bakti Blok A',
        content: 'Diberitahukan kepada seluruh warga Blok A bahwa akan diadakan kerja bakti pada hari Minggu, 15 Januari 2024 pukul 07.00 WIB. Kegiatan meliputi pembersihan selokan dan penanaman pohon. Harap membawa peralatan masing-masing.',
        authorId: adminA.id,
      },
      {
        blok: 'A' as Blok,
        title: 'Perbaikan Lampu Jalan',
        content: 'Telah dilakukan perbaikan lampu jalan di area RT Blok A pada tanggal 10 Januari 2024. Total 5 lampu telah diganti dengan yang baru.',
        authorId: adminA.id,
      },
      {
        blok: 'B' as Blok,
        title: 'Pengumuman Rapat Warga Blok B',
        content: 'Mengundang seluruh warga Blok B untuk menghadiri rapat bulanan yang akan dilaksanakan pada Sabtu, 20 Januari 2024 pukul 19.00 WIB di Pos Ronda. Agenda: evaluasi keamanan dan rencana kegiatan bulan depan.',
        authorId: adminB.id,
      },
      {
        blok: 'B' as Blok,
        title: 'Peringatan HUT RI ke-79',
        content: 'Blok B akan mengadakan berbagai lomba dalam rangka HUT RI. Pendaftaran lomba dibuka mulai tanggal 1 Agustus. Lomba meliputi: balap karung, makan kerupuk, panjat pinang, dan lomba masak untuk ibu-ibu.',
        authorId: adminB.id,
      },
    ]

    for (const activity of activities) {
      await prisma.activity.create({ data: activity })
    }
    console.log('✅ Activities seeded')
  }

  // ==================== SAMPLE TRANSACTIONS ====================
  const bendaharaA = await prisma.profile.findFirst({ where: { email: 'bendahara.bloka@iwkrt11.id' } })
  const bendaharaB = await prisma.profile.findFirst({ where: { email: 'bendahara.blokb@iwkrt11.id' } })
  
  const iuranCatA = await prisma.financialCategory.findFirst({ 
    where: { blok: 'A', name: 'Iuran Bulanan Warga', type: 'INCOME' } 
  })
  const kebersihanCatA = await prisma.financialCategory.findFirst({ 
    where: { blok: 'A', name: 'Kebersihan & Sampah', type: 'EXPENSE' } 
  })
  const keamananCatA = await prisma.financialCategory.findFirst({ 
    where: { blok: 'A', name: 'Keamanan', type: 'EXPENSE' } 
  })

  if (bendaharaA && iuranCatA && kebersihanCatA && keamananCatA) {
    // Sample transactions for Blok A
    const transactionsA = [
      {
        blok: 'A' as Blok,
        type: 'INCOME' as TransactionType,
        categoryId: iuranCatA.id,
        amount: 500000,
        description: 'Iuran bulanan 10 warga - Januari 2024',
        createdById: bendaharaA.id,
        transactionDate: new Date('2024-01-15'),
      },
      {
        blok: 'A' as Blok,
        type: 'EXPENSE' as TransactionType,
        categoryId: kebersihanCatA.id,
        amount: 300000,
        description: 'Pembayaran petugas kebersihan bulan Januari',
        createdById: bendaharaA.id,
        transactionDate: new Date('2024-01-20'),
      },
      {
        blok: 'A' as Blok,
        type: 'EXPENSE' as TransactionType,
        categoryId: keamananCatA.id,
        amount: 500000,
        description: 'Honor satpam bulan Januari',
        createdById: bendaharaA.id,
        transactionDate: new Date('2024-01-25'),
      },
    ]

    for (const tx of transactionsA) {
      const transaction = await prisma.transaction.create({ data: tx })
      
      // Create journal entries (double-entry bookkeeping)
      if (tx.type === 'INCOME') {
        await prisma.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: 'Kas RT Blok A', debit: tx.amount, credit: 0 },
            { transactionId: transaction.id, accountName: 'Pendapatan Iuran', debit: 0, credit: tx.amount },
          ]
        })
      } else {
        await prisma.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: tx.description.includes('kebersihan') ? 'Beban Kebersihan' : 'Beban Keamanan', debit: tx.amount, credit: 0 },
            { transactionId: transaction.id, accountName: 'Kas RT Blok A', debit: 0, credit: tx.amount },
          ]
        })
      }
    }
    console.log('✅ Transactions Blok A seeded')
  }

  // Similar for Blok B...
  const iuranCatB = await prisma.financialCategory.findFirst({ 
    where: { blok: 'B', name: 'Iuran Bulanan Warga', type: 'INCOME' } 
  })
  const kebersihanCatB = await prisma.financialCategory.findFirst({ 
    where: { blok: 'B', name: 'Kebersihan & Sampah', type: 'EXPENSE' } 
  })

  if (bendaharaB && iuranCatB && kebersihanCatB) {
    const transactionsB = [
      {
        blok: 'B' as Blok,
        type: 'INCOME' as TransactionType,
        categoryId: iuranCatB.id,
        amount: 450000,
        description: 'Iuran bulanan 9 warga - Januari 2024',
        createdById: bendaharaB.id,
        transactionDate: new Date('2024-01-15'),
      },
      {
        blok: 'B' as Blok,
        type: 'EXPENSE' as TransactionType,
        categoryId: kebersihanCatB.id,
        amount: 280000,
        description: 'Pembayaran petugas kebersihan bulan Januari',
        createdById: bendaharaB.id,
        transactionDate: new Date('2024-01-20'),
      },
    ]

    for (const tx of transactionsB) {
      const transaction = await prisma.transaction.create({ data: tx })
      
      if (tx.type === 'INCOME') {
        await prisma.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: 'Kas RT Blok B', debit: tx.amount, credit: 0 },
            { transactionId: transaction.id, accountName: 'Pendapatan Iuran', debit: 0, credit: tx.amount },
          ]
        })
      } else {
        await prisma.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: 'Beban Kebersihan', debit: tx.amount, credit: 0 },
            { transactionId: transaction.id, accountName: 'Kas RT Blok B', debit: 0, credit: tx.amount },
          ]
        })
      }
    }
    console.log('✅ Transactions Blok B seeded')
  }

  // ==================== SAMPLE PAYMENT SUBMISSIONS ====================
  const wargaA1 = await prisma.profile.findFirst({ where: { email: 'gunawan@email.com' } })
  const bankA = createdBanks.find(b => b.blok === 'A')

  if (wargaA1 && bankA) {
    await prisma.paymentSubmission.create({
      data: {
        profileId: wargaA1.id,
        blok: 'A',
        totalAmount: 150000,
        status: 'PENDING',
        evidenceUrl: '/uploads/payments/sample-bukti-1.jpg',
        bankAccountId: bankA.id,
        items: {
          create: [
            { periodMonth: 2, periodYear: 2024, amount: 50000 },
            { periodMonth: 3, periodYear: 2024, amount: 50000 },
            { periodMonth: 4, periodYear: 2024, amount: 50000 },
          ]
        }
      }
    })
    console.log('✅ Sample payment submission seeded')
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
`

Supabase RLS Policies

`sql
-- Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FinancialCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BankAccount" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JournalEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentSubmission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PaymentItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "InitialBalance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemConfig" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's profile
CREATE OR REPLACE FUNCTION getcurrentprofile()
RETURNS "Profile" AS $$
  SELECT  FROM "Profile" WHERE "userId" = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is superadmin
CREATE OR REPLACE FUNCTION issuperadmin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Profile" 
    WHERE "userId" = auth.uid() 
    AND role = 'SUPERADMIN' 
    AND status = 'ACTIVE'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get user's blok
CREATE OR REPLACE FUNCTION getuserblok()
RETURNS text AS $$
  SELECT blok::text FROM "Profile" WHERE "userId" = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION hasrole(requiredroles text[])
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Profile" 
    WHERE "userId" = auth.uid() 
    AND role::text = ANY(requiredroles)
    AND status = 'ACTIVE'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- ==================== PROFILE POLICIES ====================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON "Profile" FOR SELECT
USING (
  "userId" = auth.uid()
);

-- Users can view profiles in same blok (for contact info)
CREATE POLICY "Users can view same blok profiles"
ON "Profile" FOR SELECT
USING (
  blok = getuserblok():::"Blok"
  AND status = 'ACTIVE'
);

-- Superadmin can view all profiles
CREATE POLICY "Superadmin can view all profiles"
ON "Profile" FOR SELECT
USING (issuperadmin());

-- Admin/Bendahara can view pending approvals in their blok
CREATE POLICY "Admin can view pending in blok"
ON "Profile" FOR SELECT
USING (
  hasrole(ARRAY['ADMINBLOK', 'BENDAHARA', 'KETUART'])
  AND blok = getuserblok():::"Blok"
);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
ON "Profile" FOR UPDATE
USING ("userId" = auth.uid())
WITH CHECK ("userId" = auth.uid());

-- Superadmin can update any profile
CREATE POLICY "Superadmin can update any profile"
ON "Profile" FOR UPDATE
USING (issuperadmin());

-- Admin can update profiles in their blok
CREATE POLICY "Admin can update blok profiles"
ON "Profile" FOR UPDATE
USING (
  hasrole(ARRAY['ADMINBLOK'])
  AND blok = getuserblok():::"Blok"
);

-- ==================== ACTIVITY POLICIES ====================

-- Users can view general activities
CREATE POLICY "Users can view general activities"
ON "Activity" FOR SELECT
USING (blok IS NULL);

-- Users can view activities in their blok
CREATE POLICY "Users can view blok activities"
ON "Activity" FOR SELECT
USING (blok = getuserblok():::"Blok");

-- Superadmin can view all activities
CREATE POLICY "Superadmin can view all activities"
ON "Activity" FOR SELECT
USING (issuperadmin());

-- Admin can create activities for their blok
CREATE POLICY "Admin can create blok activities"
ON "Activity" FOR INSERT
WITH CHECK (
  hasrole(ARRAY['ADMINBLOK', 'KETUART'])
  AND (blok IS NULL OR blok = getuserblok():::"Blok")
);

-- Superadmin can create any activity
CREATE POLICY "Superadmin can create any activity"
ON "Activity" FOR INSERT
WITH CHECK (issuperadmin());

-- ==================== FINANCIAL CATEGORY POLICIES ====================

-- Users can view categories in their blok
CREATE POLICY "Users can view blok categories"
ON "FinancialCategory" FOR SELECT
USING (blok = getuserblok():::"Blok");

-- Superadmin can view all categories
CREATE POLICY "Superadmin can view all categories"
ON "FinancialCategory" FOR SELECT
USING (issuperadmin());

-- Bendahara/Admin can manage categories in their blok
CREATE POLICY "Bendahara can manage blok categories"
ON "FinancialCategory" FOR ALL
USING (
  hasrole(ARRAY['BENDAHARA', 'ADMINBLOK'])
  AND blok = getuserblok():::"Blok"
);

-- Superadmin can manage all categories
CREATE POLICY "Superadmin can manage all categories"
ON "FinancialCategory" FOR ALL
USING (issuperadmin());

-- ==================== BANK ACCOUNT POLICIES ====================

-- Users can view bank accounts in their blok
CREATE POLICY "Users can view blok bank accounts"
ON "BankAccount" FOR SELECT
USING (blok = getuserblok():::"Blok");

-- Superadmin can view all bank accounts
CREATE POLICY "Superadmin can view all bank accounts"
ON "BankAccount" FOR SELECT
USING (issuperadmin());

-- Bendahara/Admin can manage bank accounts in their blok
CREATE POLICY "Bendahara can manage blok bank accounts"
ON "BankAccount" FOR ALL
USING (
  hasrole(ARRAY['BENDAHARA', 'ADMINBLOK'])
  AND blok = getuserblok():::"Blok"
);

-- ==================== TRANSACTION POLICIES ====================

-- Users can view transactions in their blok
CREATE POLICY "Users can view blok transactions"
ON "Transaction" FOR SELECT
USING (blok = getuserblok():::"Blok");

-- Superadmin can view all transactions
CREATE POLICY "Superadmin can view all transactions"
ON "Transaction" FOR SELECT
USING (issuperadmin());

-- Bendahara can create transactions in their blok
CREATE POLICY "Bendahara can create blok transactions"
ON "Transaction" FOR INSERT
WITH CHECK (
  hasrole(ARRAY['BENDAHARA'])
  AND blok = getuserblok():::"Blok"
);

-- Bendahara can update transactions in their blok
CREATE POLICY "Bendahara can update blok transactions"
ON "Transaction" FOR UPDATE
USING (
  hasrole(ARRAY['BENDAHARA'])
  AND blok = getuserblok():::"Blok"
);

-- ==================== PAYMENT SUBMISSION POLICIES ====================

-- Users can view their own payment submissions
CREATE POLICY "Users can view own payments"
ON "PaymentSubmission" FOR SELECT
USING (
  profileId IN (SELECT id FROM "Profile" WHERE "userId" = auth.uid())
);

-- Bendahara/Admin can view payment submissions in their blok
CREATE POLICY "Bendahara can view blok payments"
ON "PaymentSubmission" FOR SELECT
USING (
  hasrole(ARRAY['BENDAHARA', 'ADMINBLOK'])
  AND blok = getuserblok():::"Blok"
);

-- Superadmin can view all payment submissions
CREATE POLICY "Superadmin can view all payments"
ON "PaymentSubmission" FOR SELECT
USING (issuperadmin());

-- Users can create their own payment submissions
CREATE POLICY "Users can create own payments"
ON "PaymentSubmission" FOR INSERT
WITH CHECK (
  profileId IN (SELECT id FROM "Profile" WHERE "userId" = auth.uid())
  AND blok = getuserblok():::"Blok"
);

-- Bendahara can update payment submissions in their blok
CREATE POLICY "Bendahara can update blok payments"
ON "PaymentSubmission" FOR UPDATE
USING (
  hasrole(ARRAY['BENDAHARA', 'ADMINBLOK'])
  AND blok = getuserblok():::"Blok"
);

-- ==================== PAYMENT ITEM POLICIES ====================

-- Payment items follow parent submission policies via foreign key
CREATE POLICY "Users can view own payment items"
ON "PaymentItem" FOR SELECT
USING (
  submissionId IN (
    SELECT id FROM "PaymentSubmission" 
    WHERE profileId IN (SELECT id FROM "Profile" WHERE "userId" = auth.uid())
  )
);

CREATE POLICY "Bendahara can view blok payment items"
ON "PaymentItem" FOR SELECT
USING (
  hasrole(ARRAY['BENDAHARA', 'ADMINBLOK'])
  AND submissionId IN (
    SELECT id FROM "PaymentSubmission" WHERE blok = getuserblok():::"Blok"
  )
);

-- ==================== INITIAL BALANCE POLICIES ====================

-- Users can view initial balance for their blok
CREATE POLICY "Users can view blok initial balance"
ON "InitialBalance" FOR SELECT
USING (blok = getuserblok():::"Blok");

-- Superadmin can manage all initial balances
CREATE POLICY "Superadmin can manage initial balances"
ON "InitialBalance" FOR ALL
USING (issuperadmin());

-- Bendahara can manage initial balance for their blok
CREATE POLICY "Bendahara can manage blok initial balance"
ON "InitialBalance" FOR ALL
USING (
  hasrole(ARRAY['BENDAHARA'])
  AND blok = getuserblok():::"Blok"
);

-- ==================== SYSTEM CONFIG POLICIES ====================

-- All authenticated users can read system config
CREATE POLICY "All users can read system config"
ON "SystemConfig" FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only superadmin can modify system config
CREATE POLICY "Superadmin can manage system config"
ON "SystemConfig" FOR ALL
USING (issuperadmin());

-- ==================== JOURNAL ENTRY POLICIES ====================

-- Journal entries follow transaction policies
CREATE POLICY "Users can view blok journal entries"
ON "JournalEntry" FOR SELECT
USING (
  transactionId IN (
    SELECT id FROM "Transaction" WHERE blok = getuserblok():::"Blok"
  )
);

CREATE POLICY "Superadmin can view all journal entries"
ON "JournalEntry" FOR SELECT
USING (issuperadmin());
`

Core Library Files
Prisma Client

`typescript
// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODEENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODEENV !== 'production') globalForPrisma.prisma = prisma
`

Supabase Server Client

`typescript
// src/lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXTPUBLICSUPABASEURL!,
    process.env.NEXTPUBLICSUPABASEANONKEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle cookie errors in Server Components
          }
        },
      },
    }
  )
}
`

Supabase Browser Client

`typescript
// src/lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXTPUBLICSUPABASEURL!,
    process.env.NEXTPUBLICSUPABASEANONKEY!
  )
}
`

Middleware

`typescript
// src/middleware.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXTPUBLICSUPABASEURL!,
    process.env.NEXTPUBLICSUPABASEANONKEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  const pathname = request.nextUrl.pathname

  // Public routes
  const publicRoutes = ['/login', '/register', '/']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Auth routes (login, register)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  // Protected routes
  const protectedRoutes = ['/dashboard']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Redirect logged-in users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect non-logged-in users to login
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!next/static|next/image|favicon.ico|.\\.(?:svg|png|jpg|jpeg|gif|webp)$).)',
  ],
}
`

Auth Helper

`typescript
// src/lib/auth.ts

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Role, UserStatus, Blok } from '@prisma/client'

export type CurrentUser = {
  id: string
  userId: string
  namaLengkap: string
  email: string
  blok: Blok
  role: Role
  status: UserStatus
  jabatan: string
  nomorRumah: string
  noTelepon: string
  fotoProfil: string | null
  isSignatory: boolean
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      userId: true,
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

  return profile
}

export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  return user
}

export async function requireActiveUser(): Promise<CurrentUser> {
  const user = await requireAuth()
  
  if (user.status === 'PENDINGAPPROVAL') {
    redirect('/pending-approval')
  }

  if (user.status === 'REJECTED') {
    redirect('/pending-approval?status=rejected')
  }

  return user
}

export async function requireRole(allowedRoles: Role[]): Promise<CurrentUser> {
  const user = await requireActiveUser()

  if (!allowedRoles.includes(user.role)) {
    redirect('/dashboard')
  }

  return user
}

export function canAccessBlok(user: CurrentUser, targetBlok: Blok): boolean {
  if (user.role === 'SUPERADMIN') return true
  return user.blok === targetBlok
}

export function isSuperAdmin(user: CurrentUser): boolean {
  return user.role === 'SUPERADMIN'
}

export function isAdmin(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'ADMINBLOK'].includes(user.role)
}

export function isBendahara(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'BENDAHARA'].includes(user.role)
}

export function isKetuaRT(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'KETUART'].includes(user.role)
}

export function canApprovePayments(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'].includes(user.role)
}

export function canManageTransactions(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'BENDAHARA'].includes(user.role)
}

export function canManageWarga(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'ADMINBLOK'].includes(user.role)
}

export function canManageActivities(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'ADMINBLOK', 'KETUART'].includes(user.role)
}

export function canViewReports(user: CurrentUser): boolean {
  return ['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'].includes(user.role)
}
`

Validation Schemas

`typescript
// src/lib/validations/auth.ts

import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

export const registerSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().length(16, 'NIK harus 16 digit'),
  email: z.string().email('Email tidak valid'),
  noTelepon: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9]+$/, 'Nomor telepon hanya angka'),
  blok: z.enum(['A', 'B'], { requirederror: 'Pilih blok' }),
  nomorRumah: z.string().min(1, 'Nomor rumah wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
`

`typescript
// src/lib/validations/transaction.ts

import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().uuid('Pilih kategori'),
  amount: z.number().positive('Nominal harus lebih dari 0'),
  description: z.string().min(3, 'Deskripsi minimal 3 karakter'),
  transactionDate: z.date(),
  evidenceUrl: z.string().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter'),
  type: z.enum(['INCOME', 'EXPENSE']),
  description: z.string().optional(),
})

export const bankAccountSchema = z.object({
  bankName: z.string().min(2, 'Nama bank minimal 2 karakter'),
  accountNumber: z.string().min(5, 'Nomor rekening minimal 5 digit'),
  accountHolder: z.string().min(3, 'Nama pemilik minimal 3 karakter'),
})

export const initialBalanceSchema = z.object({
  year: z.number().min(2020).max(2100),
  amount: z.number().min(0, 'Saldo tidak boleh negatif'),
  notes: z.string().optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BankAccountInput = z.infer<typeof bankAccountSchema>
export type InitialBalanceInput = z.infer<typeof initialBalanceSchema>
`

`typescript
// src/lib/validations/payment.ts

import { z } from 'zod'

export const paymentWizardSchema = z.object({
  // Step 1: Confirm data (just checkbox)
  dataConfirmed: z.boolean().refine(val => val === true, 'Konfirmasi data wajib dicentang'),
  
  // Step 2: Select periods
  periods: z.array(z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2020).max(2100),
  })).min(1, 'Pilih minimal 1 periode'),
  
  // Step 4: Select bank
  bankAccountId: z.string().uuid('Pilih rekening tujuan'),
  
  // Step 5: Upload proof
  evidenceUrl: z.string().min(1, 'Upload bukti transfer'),
})

export type PaymentWizardInput = z.infer<typeof paymentWizardSchema>
`

Constants

`typescript
// src/lib/constants.ts

export const ROLELABELS: Record<string, string> = {
  SUPERADMIN: 'Super Admin',
  ADMINBLOK: 'Admin Blok',
  BENDAHARA: 'Bendahara',
  KETUART: 'Ketua RT',
  WARGA: 'Warga',
}

export const STATUSLABELS: Record<string, string> = {
  PENDINGAPPROVAL: 'Menunggu Persetujuan',
  ACTIVE: 'Aktif',
  REJECTED: 'Ditolak',
}

export const PAYMENTSTATUSLABELS: Record<string, string> = {
  PENDING: 'Menunggu Verifikasi',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
}

export const TRANSACTIONTYPELABELS: Record<string, string> = {
  INCOME: 'Pemasukan',
  EXPENSE: 'Pengeluaran',
}

export const BLOKLABELS: Record<string, string> = {
  A: 'Blok A',
  B: 'Blok B',
}

export const MONTHNAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export const CONFIGKEYS = {
  APPNAME: 'APPNAME',
  RTNAME: 'RTNAME',
  RTADDRESS: 'RTADDRESS',
  RTWHATSAPP: 'RTWHATSAPP',
  TARIFIURAN: 'TARIFIURAN',
  IURANCATEGORYNAME: 'IURANCATEGORYNAME',
} as const
`

Utility Functions

`typescript
// src/lib/utils.ts

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

export function formatPeriod(month: number, year: number): string {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
  return ${monthNames[month - 1]} ${year}
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
  return https://wa.me/${formattedPhone}?text=${encodedMessage}
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
`

Server Actions
Auth Actions

`typescript
// src/actions/auth.actions.ts

'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validations/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string[]>
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  const validation = loginSchema.safeParse(input)
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) {
    return {
      success: false,
      message: error.message === 'Invalid login credentials' 
        ? 'Email atau password salah' 
        : error.message,
    }
  }

  revalidatePath('/', 'layout')
  return { success: true, message: 'Login berhasil' }
}

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  const validation = registerSchema.safeParse(input)
  
  if (!validation.success) {
    return {
      success: false,
      message: 'Validasi gagal',
      errors: validation.error.flatten().fieldErrors,
    }
  }

  // Check if NIK already exists
  const existingNIK = await prisma.profile.findUnique({
    where: { nik: input.nik },
  })

  if (existingNIK) {
    return {
      success: false,
      message: 'NIK sudah terdaftar',
      errors: { nik: ['NIK sudah terdaftar dalam sistem'] },
    }
  }

  // Check if email already exists in profile
  const existingEmail = await prisma.profile.findUnique({
    where: { email: input.email },
  })

  if (existingEmail) {
    return {
      success: false,
      message: 'Email sudah terdaftar',
      errors: { email: ['Email sudah terdaftar dalam sistem'] },
    }
  }

  const supabase = await createClient()

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        namalengkap: input.namaLengkap,
      },
    },
  })

  if (authError || !authData.user) {
    return {
      success: false,
      message: authError?.message || 'Gagal membuat akun',
    }
  }

  // Create profile
  try {
    await prisma.profile.create({
      data: {
        userId: authData.user.id,
        namaLengkap: input.namaLengkap,
        nik: input.nik,
        email: input.email,
        noTelepon: input.noTelepon,
        blok: input.blok,
        nomorRumah: input.nomorRumah,
        role: 'WARGA',
        status: 'PENDINGAPPROVAL',
        jabatan: 'Warga',
      },
    })
  } catch (error) {
    // Rollback: delete auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id)
    
    return {
      success: false,
      message: 'Gagal membuat profil',
    }
  }

  return {
    success: true,
    message: 'Pendaftaran berhasil. Silakan tunggu persetujuan admin.',
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
`

Profile Actions

`typescript
// src/actions/profile.actions.ts

'use server'

import { prisma } from '@/lib/prisma'
import { getCurrentUser, requireRole, canAccessBlok } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Blok, UserStatus, Role } from '@prisma/client'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

export async function approveUserAction(profileId: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK'])

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  // Check blok access
  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  if (profile.status !== 'PENDINGAPPROVAL') {
    return { success: false, message: 'Status user bukan pending approval' }
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      status: 'ACTIVE',
      approvedAt: new Date(),
      approvedBy: currentUser.id,
    },
  })

  revalidatePath('/dashboard/pendaftaran')
  return { success: true, message: 'User berhasil disetujui' }
}

export async function rejectUserAction(profileId: string, reason?: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK'])

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  if (profile.status !== 'PENDINGAPPROVAL') {
    return { success: false, message: 'Status user bukan pending approval' }
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      status: 'REJECTED',
      rejectedAt: new Date(),
      rejectReason: reason,
    },
  })

  revalidatePath('/dashboard/pendaftaran')
  return { success: true, message: 'User berhasil ditolak' }
}

export async function updateProfileRoleAction(
  profileId: string, 
  role: Role, 
  jabatan: string
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK'])

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  // Only SUPERADMIN can assign SUPERADMIN role
  if (role === 'SUPERADMIN' && currentUser.role !== 'SUPERADMIN') {
    return { success: false, message: 'Hanya Super Admin yang dapat menetapkan role Super Admin' }
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { role, jabatan },
  })

  revalidatePath('/dashboard/warga')
  return { success: true, message: 'Role berhasil diperbarui' }
}

export async function toggleSignatoryAction(profileId: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK'])

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile) {
    return { success: false, message: 'Profil tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, profile.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: { isSignatory: !profile.isSignatory },
  })

  revalidatePath('/dashboard/warga')
  return { success: true, message: 'Status penanda tangan berhasil diperbarui' }
}

export async function getPendingUsersAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK'])

  const where: any = {
    status: 'PENDINGAPPROVAL',
  }

  // Filter by blok unless superadmin
  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.profile.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getWargaListAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK', 'BENDAHARA', 'KETUART'])

  const where: any = {
    status: 'ACTIVE',
  }

  if (currentUser.role !== 'SUPERADMIN') {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.profile.findMany({
    where,
    orderBy: [
      { role: 'asc' },
      { namaLengkap: 'asc' },
    ],
  })
}

export async function getPengurusAction(blok: Blok) {
  return prisma.profile.findMany({
    where: {
      blok,
      status: 'ACTIVE',
      role: {
        in: ['KETUART', 'ADMINBLOK', 'BENDAHARA'],
      },
    },
    orderBy: {
      role: 'asc',
    },
  })
}
`

Transaction Actions

`typescript
// src/actions/transaction.actions.ts

'use server'

import { prisma } from '@/lib/prisma'
import { requireRole, canAccessBlok, isSuperAdmin } from '@/lib/auth'
import { transactionSchema, type TransactionInput } from '@/lib/validations/transaction'
import { revalidatePath } from 'next/cache'
import { Blok, TransactionType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

export async function createTransactionAction(
  input: TransactionInput & { blok: Blok }
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA'])

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Anda tidak memiliki akses ke blok ini' }
  }

  const validation = transactionSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  // Verify category belongs to the same blok
  const category = await prisma.financialCategory.findUnique({
    where: { id: input.categoryId },
  })

  if (!category || category.blok !== input.blok) {
    return { success: false, message: 'Kategori tidak valid untuk blok ini' }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          blok: input.blok,
          type: input.type,
          categoryId: input.categoryId,
          amount: input.amount,
          description: input.description,
          transactionDate: input.transactionDate,
          evidenceUrl: input.evidenceUrl,
          createdById: currentUser.id,
        },
      })

      // Create journal entries (double-entry bookkeeping)
      const kasAccount = Kas RT Blok ${input.blok}
      const categoryAccount = input.type === 'INCOME' 
        ? Pendapatan - ${category.name}
        : Beban - ${category.name}

      if (input.type === 'INCOME') {
        await tx.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: kasAccount, debit: input.amount, credit: 0 },
            { transactionId: transaction.id, accountName: categoryAccount, debit: 0, credit: input.amount },
          ],
        })
      } else {
        await tx.journalEntry.createMany({
          data: [
            { transactionId: transaction.id, accountName: categoryAccount, debit: input.amount, credit: 0 },
            { transactionId: transaction.id, accountName: kasAccount, debit: 0, credit: input.amount },
          ],
        })
      }
    })

    revalidatePath('/dashboard/finance/transaksi')
    return { success: true, message: 'Transaksi berhasil ditambahkan' }
  } catch (error) {
    console.error('Create transaction error:', error)
    return { success: false, message: 'Gagal menambahkan transaksi' }
  }
}

export async function getTransactionsAction(params: {
  blok?: Blok
  type?: TransactionType
  startDate?: Date
  endDate?: Date
  limit?: number
}) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'])

  const where: any = {}

  // Blok filter
  if (!isSuperAdmin(currentUser)) {
    where.blok = currentUser.blok
  } else if (params.blok) {
    where.blok = params.blok
  }

  // Type filter
  if (params.type) {
    where.type = params.type
  }

  // Date range filter
  if (params.startDate || params.endDate) {
    where.transactionDate = {}
    if (params.startDate) {
      where.transactionDate.gte = params.startDate
    }
    if (params.endDate) {
      where.transactionDate.lte = params.endDate
    }
  }

  return prisma.transaction.findMany({
    where,
    include: {
      category: true,
      createdBy: {
        select: {
          namaLengkap: true,
        },
      },
    },
    orderBy: { transactionDate: 'desc' },
    take: params.limit,
  })
}

export async function getFinancialSummaryAction(blok: Blok, year: number, month?: number) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK', 'WARGA'])

  if (!canAccessBlok(currentUser, blok)) {
    throw new Error('Akses ditolak')
  }

  // Get initial balance
  const initialBalance = await prisma.initialBalance.findUnique({
    where: { blokyear: { blok, year } },
  })

  // Build date range
  let startDate: Date
  let endDate: Date

  if (month) {
    startDate = new Date(year, month - 1, 1)
    endDate = new Date(year, month, 0, 23, 59, 59)
  } else {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 11, 31, 23, 59, 59)
  }

  // Get aggregated transactions
  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        blok,
        type: 'INCOME',
        transactionDate: { gte: startDate, lte: endDate },
      },
      sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        blok,
        type: 'EXPENSE',
        transactionDate: { gte: startDate, lte: endDate },
      },
      sum: { amount: true },
    }),
  ])

  const totalIncome = income.sum.amount?.toNumber() || 0
  const totalExpense = expense.sum.amount?.toNumber() || 0
  const startingBalance = initialBalance?.amount.toNumber() || 0
  const currentBalance = startingBalance + totalIncome - totalExpense

  return {
    initialBalance: startingBalance,
    totalIncome,
    totalExpense,
    currentBalance,
    period: { year, month },
  }
}
`

Payment Actions

`typescript
// src/actions/payment.actions.ts

'use server'

import { prisma } from '@/lib/prisma'
import { requireActiveUser, requireRole, canAccessBlok, isSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Blok, PaymentStatus } from '@prisma/client'
import { CONFIGKEYS } from '@/lib/constants'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

export type PaymentPeriod = {
  month: number
  year: number
}

export async function createPaymentSubmissionAction(input: {
  periods: PaymentPeriod[]
  bankAccountId: string
  evidenceUrl: string
}): Promise<ActionResult> {
  const currentUser = await requireActiveUser()

  // Get tarif iuran from config
  const tarifConfig = await prisma.systemConfig.findUnique({
    where: { key: CONFIGKEYS.TARIFIURAN },
  })

  const tarifIuran = tarifConfig ? parseFloat(tarifConfig.value) : 50000

  // Verify bank account belongs to user's blok
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { id: input.bankAccountId },
  })

  if (!bankAccount || bankAccount.blok !== currentUser.blok) {
    return { success: false, message: 'Rekening bank tidak valid' }
  }

  // Check for existing approved payments for the same periods
  for (const period of input.periods) {
    const existingApproved = await prisma.paymentItem.findFirst({
      where: {
        periodMonth: period.month,
        periodYear: period.year,
        submission: {
          profileId: currentUser.id,
          status: 'APPROVED',
        },
      },
    })

    if (existingApproved) {
      return { 
        success: false, 
        message: Periode ${period.month}/${period.year} sudah dibayar 
      }
    }
  }

  const totalAmount = input.periods.length  tarifIuran

  try {
    await prisma.paymentSubmission.create({
      data: {
        profileId: currentUser.id,
        blok: currentUser.blok,
        totalAmount,
        status: 'PENDING',
        evidenceUrl: input.evidenceUrl,
        bankAccountId: input.bankAccountId,
        items: {
          create: input.periods.map(period => ({
            periodMonth: period.month,
            periodYear: period.year,
            amount: tarifIuran,
          })),
        },
      },
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Pembayaran berhasil dikirim' }
  } catch (error) {
    console.error('Create payment error:', error)
    return { success: false, message: 'Gagal mengirim pembayaran' }
  }
}

export async function approvePaymentAction(submissionId: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  const submission = await prisma.paymentSubmission.findUnique({
    where: { id: submissionId },
    include: {
      profile: true,
      items: true,
    },
  })

  if (!submission) {
    return { success: false, message: 'Pembayaran tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, submission.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  if (submission.status !== 'PENDING') {
    return { success: false, message: 'Pembayaran sudah diproses' }
  }

  // Get iuran category for auto-creating transaction
  const iuranCategoryName = await prisma.systemConfig.findUnique({
    where: { key: CONFIGKEYS.IURANCATEGORYNAME },
  })

  const iuranCategory = await prisma.financialCategory.findFirst({
    where: {
      blok: submission.blok,
      name: iuranCategoryName?.value || 'Iuran Bulanan Warga',
      type: 'INCOME',
    },
  })

  if (!iuranCategory) {
    return { success: false, message: 'Kategori iuran tidak ditemukan' }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update submission status
      await tx.paymentSubmission.update({
        where: { id: submissionId },
        data: {
          status: 'APPROVED',
          processedAt: new Date(),
          processedById: currentUser.id,
        },
      })

      // Create income transaction
      const periodDesc = submission.items
        .map(i => ${i.periodMonth}/${i.periodYear})
        .join(', ')

      const transaction = await tx.transaction.create({
        data: {
          blok: submission.blok,
          type: 'INCOME',
          categoryId: iuranCategory.id,
          amount: submission.totalAmount,
          description: Iuran ${submission.profile.namaLengkap} - ${submission.profile.nomorRumah} (${periodDesc}),
          evidenceUrl: submission.evidenceUrl,
          transactionDate: new Date(),
          createdById: currentUser.id,
          paymentSubmissionId: submissionId,
        },
      })

      // Create journal entries
      const kasAccount = Kas RT Blok ${submission.blok}
      await tx.journalEntry.createMany({
        data: [
          { transactionId: transaction.id, accountName: kasAccount, debit: submission.totalAmount, credit: 0 },
          { transactionId: transaction.id, accountName: 'Pendapatan Iuran', debit: 0, credit: submission.totalAmount },
        ],
      })
    })

    revalidatePath('/dashboard/finance/pembayaran')
    return { success: true, message: 'Pembayaran berhasil disetujui' }
  } catch (error) {
    console.error('Approve payment error:', error)
    return { success: false, message: 'Gagal menyetujui pembayaran' }
  }
}

export async function rejectPaymentAction(
  submissionId: string, 
  reason: string
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  const submission = await prisma.paymentSubmission.findUnique({
    where: { id: submissionId },
  })

  if (!submission) {
    return { success: false, message: 'Pembayaran tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, submission.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  if (submission.status !== 'PENDING') {
    return { success: false, message: 'Pembayaran sudah diproses' }
  }

  await prisma.paymentSubmission.update({
    where: { id: submissionId },
    data: {
      status: 'REJECTED',
      processedAt: new Date(),
      processedById: currentUser.id,
      rejectReason: reason,
    },
  })

  revalidatePath('/dashboard/finance/pembayaran')
  return { success: true, message: 'Pembayaran berhasil ditolak' }
}

export async function getMyPaymentsAction() {
  const currentUser = await requireActiveUser()

  return prisma.paymentSubmission.findMany({
    where: { profileId: currentUser.id },
    include: {
      items: true,
      bankAccount: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPendingPaymentsAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  const where: any = {
    status: 'PENDING',
  }

  if (!isSuperAdmin(currentUser)) {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.paymentSubmission.findMany({
    where,
    include: {
      profile: {
        select: {
          namaLengkap: true,
          nomorRumah: true,
          blok: true,
        },
      },
      items: true,
      bankAccount: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getPaymentHistoryAction(blok: Blok, year: number) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'])

  if (!canAccessBlok(currentUser, blok)) {
    throw new Error('Akses ditolak')
  }

  return prisma.paymentSubmission.findMany({
    where: {
      blok,
      items: {
        some: {
          periodYear: year,
        },
      },
    },
    include: {
      profile: {
        select: {
          namaLengkap: true,
          nomorRumah: true,
        },
      },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPaidPeriodsAction(profileId: string) {
  return prisma.paymentItem.findMany({
    where: {
      submission: {
        profileId,
        status: 'APPROVED',
      },
    },
    select: {
      periodMonth: true,
      periodYear: true,
    },
  })
}
`

Config Actions

`typescript
// src/actions/config.actions.ts

'use server'

import { prisma } from '@/lib/prisma'
import { requireRole, canAccessBlok, isSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Blok } from '@prisma/client'
import { categorySchema, bankAccountSchema, initialBalanceSchema } from '@/lib/validations/transaction'
import type { CategoryInput, BankAccountInput, InitialBalanceInput } from '@/lib/validations/transaction'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

// ==================== SYSTEM CONFIG ====================

export async function getSystemConfigsAction() {
  return prisma.systemConfig.findMany({
    orderBy: [
      { group: 'asc' },
      { key: 'asc' },
    ],
  })
}

export async function getConfigValueAction(key: string): Promise<string | null> {
  const config = await prisma.systemConfig.findUnique({
    where: { key },
  })
  return config?.value ?? null
}

export async function updateSystemConfigAction(
  key: string, 
  value: string
): Promise<ActionResult> {
  await requireRole(['SUPERADMIN'])

  await prisma.systemConfig.update({
    where: { key },
    data: { value },
  })

  revalidatePath('/dashboard/settings')
  return { success: true, message: 'Konfigurasi berhasil diperbarui' }
}

export async function createSystemConfigAction(input: {
  key: string
  value: string
  label: string
  type?: string
  group?: string
}): Promise<ActionResult> {
  await requireRole(['SUPERADMIN'])

  const existing = await prisma.systemConfig.findUnique({
    where: { key: input.key },
  })

  if (existing) {
    return { success: false, message: 'Key sudah ada' }
  }

  await prisma.systemConfig.create({
    data: {
      key: input.key,
      value: input.value,
      label: input.label,
      type: input.type || 'text',
      group: input.group || 'general',
    },
  })

  revalidatePath('/dashboard/settings')
  return { success: true, message: 'Konfigurasi berhasil ditambahkan' }
}

// ==================== FINANCIAL CATEGORY ====================

export async function getCategoriesAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK', 'KETUART'])

  const where: any = {}

  if (!isSuperAdmin(currentUser)) {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.financialCategory.findMany({
    where,
    orderBy: [
      { type: 'asc' },
      { name: 'asc' },
    ],
  })
}

export async function createCategoryAction(
  input: CategoryInput & { blok: Blok }
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA'])

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = categorySchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  const existing = await prisma.financialCategory.findFirst({
    where: {
      blok: input.blok,
      name: input.name,
      type: input.type,
    },
  })

  if (existing) {
    return { success: false, message: 'Kategori dengan nama dan tipe yang sama sudah ada' }
  }

  await prisma.financialCategory.create({
    data: {
      blok: input.blok,
      name: input.name,
      type: input.type,
      description: input.description,
    },
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Kategori berhasil ditambahkan' }
}

export async function updateCategoryAction(
  id: string,
  input: Partial<CategoryInput>
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA'])

  const category = await prisma.financialCategory.findUnique({
    where: { id },
  })

  if (!category) {
    return { success: false, message: 'Kategori tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, category.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.financialCategory.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Kategori berhasil diperbarui' }
}

export async function toggleCategoryActiveAction(id: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA'])

  const category = await prisma.financialCategory.findUnique({
    where: { id },
  })

  if (!category) {
    return { success: false, message: 'Kategori tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, category.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.financialCategory.update({
    where: { id },
    data: { isActive: !category.isActive },
  })

  revalidatePath('/dashboard/finance/kategori')
  return { success: true, message: 'Status kategori berhasil diperbarui' }
}

// ==================== BANK ACCOUNT ====================

export async function getBankAccountsAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK', 'KETUART', 'WARGA'])

  const where: any = {}

  if (!isSuperAdmin(currentUser)) {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.bankAccount.findMany({
    where,
    orderBy: { bankName: 'asc' },
  })
}

export async function createBankAccountAction(
  input: BankAccountInput & { blok: Blok }
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = bankAccountSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  await prisma.bankAccount.create({
    data: {
      blok: input.blok,
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      accountHolder: input.accountHolder,
    },
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Rekening berhasil ditambahkan' }
}

export async function updateBankAccountAction(
  id: string,
  input: Partial<BankAccountInput>
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  const account = await prisma.bankAccount.findUnique({
    where: { id },
  })

  if (!account) {
    return { success: false, message: 'Rekening tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, account.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.bankAccount.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Rekening berhasil diperbarui' }
}

export async function toggleBankAccountActiveAction(id: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'ADMINBLOK'])

  const account = await prisma.bankAccount.findUnique({
    where: { id },
  })

  if (!account) {
    return { success: false, message: 'Rekening tidak ditemukan' }
  }

  if (!canAccessBlok(currentUser, account.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.bankAccount.update({
    where: { id },
    data: { isActive: !account.isActive },
  })

  revalidatePath('/dashboard/finance/rekening')
  return { success: true, message: 'Status rekening berhasil diperbarui' }
}

// ==================== INITIAL BALANCE ====================

export async function getInitialBalancesAction(blok?: Blok) {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA', 'KETUART', 'ADMINBLOK'])

  const where: any = {}

  if (!isSuperAdmin(currentUser)) {
    where.blok = currentUser.blok
  } else if (blok) {
    where.blok = blok
  }

  return prisma.initialBalance.findMany({
    where,
    orderBy: [
      { year: 'desc' },
      { blok: 'asc' },
    ],
  })
}

export async function upsertInitialBalanceAction(
  input: InitialBalanceInput & { blok: Blok }
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'BENDAHARA'])

  if (!canAccessBlok(currentUser, input.blok)) {
    return { success: false, message: 'Akses ditolak' }
  }

  const validation = initialBalanceSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  await prisma.initialBalance.upsert({
    where: {
      blokyear: {
        blok: input.blok,
        year: input.year,
      },
    },
    update: {
      amount: input.amount,
      notes: input.notes,
    },
    create: {
      blok: input.blok,
      year: input.year,
      amount: input.amount,
      notes: input.notes,
    },
  })

  revalidatePath('/dashboard/finance/saldo-awal')
  return { success: true, message: 'Saldo awal berhasil disimpan' }
}
`

Activity Actions

`typescript
// src/actions/activity.actions.ts

'use server'

import { prisma } from '@/lib/prisma'
import { requireActiveUser, requireRole, canAccessBlok, isSuperAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { Blok } from '@prisma/client'
import { z } from 'zod'

export type ActionResult<T = void> = {
  success: boolean
  message: string
  data?: T
}

const activitySchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  imageUrl: z.string().optional(),
  isPinned: z.boolean().optional(),
})

export async function getActivitiesAction(blok?: Blok, limit?: number) {
  const currentUser = await requireActiveUser()

  // Get activities for user's blok + general activities
  const activities = await prisma.activity.findMany({
    where: {
      OR: [
        { blok: null }, // General activities
        { blok: isSuperAdmin(currentUser) ? blok : currentUser.blok },
      ],
    },
    include: {
      author: {
        select: {
          namaLengkap: true,
          jabatan: true,
          fotoProfil: true,
        },
      },
    },
    orderBy: [
      { isPinned: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit,
  })

  return activities
}

export async function createActivityAction(input: {
  title: string
  content: string
  imageUrl?: string
  blok?: Blok | null
  isPinned?: boolean
}): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK', 'KETUART'])

  const validation = activitySchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: 'Data tidak valid' }
  }

  // Non-superadmin can only create for their own blok or general
  if (!isSuperAdmin(currentUser)) {
    if (input.blok && input.blok !== currentUser.blok) {
      return { success: false, message: 'Anda hanya dapat membuat kegiatan untuk blok Anda' }
    }
    // Set to user's blok if not specified
    if (input.blok === undefined) {
      input.blok = currentUser.blok
    }
  }

  await prisma.activity.create({
    data: {
      title: input.title,
      content: input.content,
      imageUrl: input.imageUrl,
      blok: input.blok,
      authorId: currentUser.id,
      isPinned: input.isPinned || false,
    },
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil ditambahkan' }
}

export async function updateActivityAction(
  id: string,
  input: {
    title?: string
    content?: string
    imageUrl?: string
    isPinned?: boolean
  }
): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK', 'KETUART'])

  const activity = await prisma.activity.findUnique({
    where: { id },
  })

  if (!activity) {
    return { success: false, message: 'Kegiatan tidak ditemukan' }
  }

  // Non-superadmin can only edit their blok's activities
  if (!isSuperAdmin(currentUser) && activity.blok && activity.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.activity.update({
    where: { id },
    data: input,
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil diperbarui' }
}

export async function deleteActivityAction(id: string): Promise<ActionResult> {
  const currentUser = await requireRole(['SUPERADMIN', 'ADMINBLOK', 'KETUART'])

  const activity = await prisma.activity.findUnique({
    where: { id },
  })

  if (!activity) {
    return { success: false, message: 'Kegiatan tidak ditemukan' }
  }

  if (!isSuperAdmin(currentUser) && activity.blok && activity.blok !== currentUser.blok) {
    return { success: false, message: 'Akses ditolak' }
  }

  await prisma.activity.delete({
    where: { id },
  })

  revalidatePath('/dashboard/kegiatan')
  revalidatePath('/dashboard')
  return { success: true, message: 'Kegiatan berhasil dihapus' }
}
`

Key UI Components
Stat Card

`typescript
// src/components/dashboard/stat-card.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground mt-1">
            {trend && (
              <span className={cn(
                'font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
            {trend && description && ' '}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
`

Status Badge

`typescript
// src/components/shared/status-badge.tsx

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { UserStatus, PaymentStatus } from '@prisma/client'

const userStatusConfig: Record<UserStatus, { label: string; className: string }> = {
  PENDINGAPPROVAL: {
    label: 'Menunggu',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  ACTIVE: {
    label: 'Aktif',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

const paymentStatusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Menunggu',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  APPROVED: {
    label: 'Disetujui',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  REJECTED: {
    label: 'Ditolak',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

interface UserStatusBadgeProps {
  status: UserStatus
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = userStatusConfig[status]
  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const config = paymentStatusConfig[status]
  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
`

Role Badge

`typescript
// src/components/shared/role-badge.tsx

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Role } from '@prisma/client'
import { ROLELABELS } from '@/lib/constants'

const roleConfig: Record<Role, { className: string }> = {
  SUPERADMIN: {
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  ADMINBLOK: {
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  BENDAHARA: {
    className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
  },
  KETUART: {
    className: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  },
  WARGA: {
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role]
  return (
    <Badge variant="secondary" className={cn(config.className)}>
      {ROLELABELS[role]}
    </Badge>
  )
}
`

Block Badge

`typescript
// src/components/shared/block-badge.tsx

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Blok } from '@prisma/client'

const blokConfig: Record<Blok, { className: string }> = {
  A: {
    className: 'bg-sky-100 text-sky-800 hover:bg-sky-100',
  },
  B: {
    className: 'bg-violet-100 text-violet-800 hover:bg-violet-100',
  },
}

interface BlockBadgeProps {
  blok: Blok
}

export function BlockBadge({ blok }: BlockBadgeProps) {
  const config = blokConfig[blok]
  return (
    <Badge variant="secondary" className={cn(config.className)}>
      Blok {blok}
    </Badge>
  )
}
`

Currency Display

`typescript
// src/components/shared/currency-display.tsx

import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface CurrencyDisplayProps {
  amount: number | string | null | undefined
  className?: string
  showSign?: boolean
  type?: 'income' | 'expense' | 'neutral'
}

export function CurrencyDisplay({
  amount,
  className,
  showSign = false,
  type = 'neutral',
}: CurrencyDisplayProps) {
  const num = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0)
  const formatted = formatCurrency(Math.abs(num))
  
  const colorClass = {
    income: 'text-green-600',
    expense: 'text-red-600',
    neutral: '',
  }[type]

  return (
    <span className={cn(colorClass, className)}>
      {showSign && type === 'income' && '+'}
      {showSign && type === 'expense' && '-'}
      {formatted}
    </span>
  )
}
`

Empty State

`typescript
// src/components/shared/empty-state.tsx

import { LucideIcon, FileQuestion } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      className
    )}>
      <div className="rounded-full bg-muted p-3 mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
`

Loading State

`typescript
// src/components/shared/loading-state.tsx

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingStateProps {
  text?: string
  className?: string
}

export function LoadingState({ text = 'Memuat...', className }: LoadingStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12',
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  )
}
`

Payment Wizard Store

`typescript
// src/stores/wizard-store.ts

import { create } from 'zustand'

export type PaymentPeriod = {
  month: number
  year: number
}

interface WizardState {
  currentStep: number
  dataConfirmed: boolean
  selectedPeriods: PaymentPeriod[]
  selectedBankId: string | null
  evidenceUrl: string | null
  
  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setDataConfirmed: (confirmed: boolean) => void
  togglePeriod: (period: PaymentPeriod) => void
  setSelectedPeriods: (periods: PaymentPeriod[]) => void
  setSelectedBank: (bankId: string) => void
  setEvidenceUrl: (url: string) => void
  reset: () => void
}

const initialState = {
  currentStep: 1,
  dataConfirmed: false,
  selectedPeriods: [],
  selectedBankId: null,
  evidenceUrl: null,
}

export const useWizardStore = create<WizardState>((set, get) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 6) 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),
  
  setDataConfirmed: (confirmed) => set({ dataConfirmed: confirmed }),
  
  togglePeriod: (period) => set((state) => {
    const exists = state.selectedPeriods.some(
      p => p.month === period.month && p.year === period.year
    )
    
    if (exists) {
      return {
        selectedPeriods: state.selectedPeriods.filter(
          p => !(p.month === period.month && p.year === period.year)
        )
      }
    }
    
    return {
      selectedPeriods: [...state.selectedPeriods, period]
    }
  }),
  
  setSelectedPeriods: (periods) => set({ selectedPeriods: periods }),
  
  setSelectedBank: (bankId) => set({ selectedBankId: bankId }),
  
  setEvidenceUrl: (url) => set({ evidenceUrl: url }),
  
  reset: () => set(initialState),
}))
`

Environment Variables

`bash
.env.example
Supabase
NEXTPUBLICSUPABASEURL=your-supabase-url
NEXTPUBLICSUPABASEANONKEY=your-supabase-anon-key

Database (Prisma)
DATABASEURL=postgresql://user:password@host:5432/database?pgbouncer=true
DIRECTURL=postgresql://user:password@host:5432/database

App
NEXTPUBLICAPPURL=http://localhost:3000
`

Setup Instructions

`bash
Clone and install dependencies
npm install

Copy environment variables
cp .env.example .env.local
Fill in your Supabase credentials
Generate Prisma client
npx prisma generate

Push schema to database
npx prisma db push

Run seed
npx prisma db seed

Apply RLS policies in Supabase SQL Editor
Copy the RLS SQL from above and execute in Supabase Dashboard
Create storage buckets in Supabase
• payments (for payment evidence)
• profiles (for profile photos and signatures)
• activities (for activity images)
Start development server
npm run dev
``

Implementation Phases

Phase 1 — Foundation
• Project setup, Prisma schema, Supabase integration
• Auth flow (login, register, logout)
• Middleware and role guards
• Profile creation on registration

Phase 2 — Registration Approval
• Pending approval page
• Admin approval dashboard
• Approve/reject actions
• Status-based access control

Phase 3 — Dynamic Configuration
• System config CRUD
• Initial balance management
• Financial categories CRUD
• Bank accounts CRUD

Phase 4 — Finance Core
• Transaction creation with journal entries
• Transaction listing with filters
• Payment submission workflow
• Payment approval with auto-transaction

Phase 5 — Warga Experience
• Role-based dashboard
• Activity feed
• Pengurus contact cards
• 6-step payment wizard

Phase 6 — Transparency & Reports
• Financial summary charts
• PDF report generation
• Digital signatures on reports
• Period-based filtering

Phase 7 — Polish
• Loading states everywhere
• Empty states with actions
• Form validation messages
• Mobile responsiveness
• Error boundaries

Critical Rules
Block isolation is absolute — Every query for sensitive data must filter by blok, except for SUPERADMIN
Payment periods are unique — No duplicate approved payments for the same month/year
Approved payments create transactions — Auto-generate income transaction and journal entries
Status gates access — PENDINGAPPROVAL and REJECTED users cannot access dashboard
Double-entry bookkeeping — Every transaction must have balanced journal entries
Dynamic config drives behavior — Tarif iuran, app name, contacts come from SystemConfig
RLS is the final guard — Server actions validate, but RLS enforces at database level