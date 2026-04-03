import { PrismaClient, Role, UserStatus, TransactionType, Blok, PaymentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // ==================== SYSTEM CONFIG ====================
  const configs = [
    { key: 'APP_NAME', value: 'IWK-RT11 Portal', label: 'Nama Aplikasi', type: 'text', group: 'general' },
    { key: 'RT_NAME', value: 'RT 011 RW 005', label: 'Nama RT', type: 'text', group: 'general' },
    { key: 'RT_ADDRESS', value: 'Perumahan Indah Warga Kita, Kelurahan Sejahtera, Kecamatan Makmur, Jakarta Selatan', label: 'Alamat Sekretariat', type: 'textarea', group: 'contact' },
    { key: 'RT_WHATSAPP', value: '6281234567890', label: 'WhatsApp RT', type: 'text', group: 'contact' },
    { key: 'TARIF_IURAN', value: '50000', label: 'Tarif Iuran Bulanan (Rp)', type: 'number', group: 'finance' },
    { key: 'IURAN_CATEGORY_NAME', value: 'Iuran Bulanan Warga', label: 'Nama Kategori Iuran', type: 'text', group: 'finance' },
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
    where: { blok_year: { blok: 'A', year: currentYear } },
    update: {},
    create: { blok: 'A', year: currentYear, amount: 5000000, notes: `Saldo awal tahun ${currentYear}` },
  })

  await prisma.initialBalance.upsert({
    where: { blok_year: { blok: 'B', year: currentYear } },
    update: {},
    create: { blok: 'B', year: currentYear, amount: 4500000, notes: `Saldo awal tahun ${currentYear}` },
  })
  console.log('✅ Initial balances seeded')

  // ==================== USERS & PROFILES ====================
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const users = [
    // Super Admin
    {
      email: 'superadmin@iwkrt11.id',
      name: 'Administrator Sistem',
      password: hashedPassword,
      profile: {
        nik: '3171010101010001',
        namaLengkap: 'Administrator Sistem',
        noTelepon: '6281200000001',
        blok: 'A' as Blok,
        nomorRumah: '-',
        role: 'SUPERADMIN' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Super Administrator',
      },
    },
    // Blok A Staff
    {
      email: 'ketua.bloka@iwkrt11.id',
      name: 'Budi Santoso',
      password: hashedPassword,
      profile: {
        nik: '3171010101010002',
        namaLengkap: 'Budi Santoso',
        noTelepon: '6281200000002',
        blok: 'A' as Blok,
        nomorRumah: 'A-01',
        role: 'KETUART' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Ketua RT Blok A',
        isSignatory: true,
      },
    },
    {
      email: 'admin.bloka@iwkrt11.id',
      name: 'Siti Rahayu',
      password: hashedPassword,
      profile: {
        nik: '3171010101010003',
        namaLengkap: 'Siti Rahayu',
        noTelepon: '6281200000003',
        blok: 'A' as Blok,
        nomorRumah: 'A-02',
        role: 'ADMINBLOK' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Sekretaris Blok A',
        isSignatory: true,
      },
    },
    {
      email: 'bendahara.bloka@iwkrt11.id',
      name: 'Ahmad Wijaya',
      password: hashedPassword,
      profile: {
        nik: '3171010101010004',
        namaLengkap: 'Ahmad Wijaya',
        noTelepon: '6281200000004',
        blok: 'A' as Blok,
        nomorRumah: 'A-03',
        role: 'BENDAHARA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Bendahara Blok A',
        isSignatory: true,
      },
    },
    // Blok B Staff
    {
      email: 'ketua.blokb@iwkrt11.id',
      name: 'Dewi Lestari',
      password: hashedPassword,
      profile: {
        nik: '3171010101010005',
        namaLengkap: 'Dewi Lestari',
        noTelepon: '6281200000005',
        blok: 'B' as Blok,
        nomorRumah: 'B-01',
        role: 'KETUART' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Ketua RT Blok B',
        isSignatory: true,
      },
    },
    {
      email: 'admin.blokb@iwkrt11.id',
      name: 'Eko Prasetyo',
      password: hashedPassword,
      profile: {
        nik: '3171010101010006',
        namaLengkap: 'Eko Prasetyo',
        noTelepon: '6281200000006',
        blok: 'B' as Blok,
        nomorRumah: 'B-02',
        role: 'ADMINBLOK' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Sekretaris Blok B',
        isSignatory: true,
      },
    },
    {
      email: 'bendahara.blokb@iwkrt11.id',
      name: 'Fitri Handayani',
      password: hashedPassword,
      profile: {
        nik: '3171010101010007',
        namaLengkap: 'Fitri Handayani',
        noTelepon: '6281200000007',
        blok: 'B' as Blok,
        nomorRumah: 'B-03',
        role: 'BENDAHARA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Bendahara Blok B',
        isSignatory: true,
      },
    },
    // Warga Blok A
    {
      email: 'gunawan@email.com',
      name: 'Gunawan Saputra',
      password: hashedPassword,
      profile: {
        nik: '3171010101010008',
        namaLengkap: 'Gunawan Saputra',
        noTelepon: '6281300000001',
        blok: 'A' as Blok,
        nomorRumah: 'A-05',
        role: 'WARGA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Warga',
      },
    },
    {
      email: 'heni@email.com',
      name: 'Heni Mulyani',
      password: hashedPassword,
      profile: {
        nik: '3171010101010009',
        namaLengkap: 'Heni Mulyani',
        noTelepon: '6281300000002',
        blok: 'A' as Blok,
        nomorRumah: 'A-06',
        role: 'WARGA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Warga',
      },
    },
    {
      email: 'irfan@email.com',
      name: 'Irfan Hakim',
      password: hashedPassword,
      profile: {
        nik: '3171010101010010',
        namaLengkap: 'Irfan Hakim',
        noTelepon: '6281300000003',
        blok: 'A' as Blok,
        nomorRumah: 'A-07',
        role: 'WARGA' as Role,
        status: 'PENDINGAPPROVAL' as UserStatus,
        jabatan: 'Warga',
      },
    },
    // Warga Blok B
    {
      email: 'joko@email.com',
      name: 'Joko Widodo',
      password: hashedPassword,
      profile: {
        nik: '3171010101010011',
        namaLengkap: 'Joko Widodo',
        noTelepon: '6281300000004',
        blok: 'B' as Blok,
        nomorRumah: 'B-05',
        role: 'WARGA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Warga',
      },
    },
    {
      email: 'kartini@email.com',
      name: 'Kartini Sari',
      password: hashedPassword,
      profile: {
        nik: '3171010101010012',
        namaLengkap: 'Kartini Sari',
        noTelepon: '6281300000005',
        blok: 'B' as Blok,
        nomorRumah: 'B-06',
        role: 'WARGA' as Role,
        status: 'ACTIVE' as UserStatus,
        jabatan: 'Warga',
      },
    },
    {
      email: 'lukman@email.com',
      name: 'Lukman Hakim',
      password: hashedPassword,
      profile: {
        nik: '3171010101010013',
        namaLengkap: 'Lukman Hakim',
        noTelepon: '6281300000006',
        blok: 'B' as Blok,
        nomorRumah: 'B-07',
        role: 'WARGA' as Role,
        status: 'PENDINGAPPROVAL' as UserStatus,
        jabatan: 'Warga',
      },
    },
  ]

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        password: userData.password,
      },
    })

    // Include email in profile data
    const profileData = { ...userData.profile, email: userData.email, userId: user.id }
    
    await prisma.profile.upsert({
      where: { nik: userData.profile.nik },
      update: profileData,
      create: profileData,
    })
  }
  console.log('✅ Users and profiles seeded')

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
      where: { blok_name_type: { blok: cat.blok, name: cat.name, type: cat.type } },
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

  for (const bank of bankAccounts) {
    await prisma.bankAccount.create({ data: bank })
  }
  console.log('✅ Bank accounts seeded')

  // ==================== ACTIVITIES ====================
  const superAdmin = await prisma.profile.findFirst({ where: { email: 'superadmin@iwkrt11.id' } })
  const adminA = await prisma.profile.findFirst({ where: { email: 'admin.bloka@iwkrt11.id' } })
  const adminB = await prisma.profile.findFirst({ where: { email: 'admin.blokb@iwkrt11.id' } })

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

  console.log('🎉 Seed completed successfully!')
  console.log('\n📋 Test Accounts (password: password123):')
  console.log('  - superadmin@iwkrt11.id (Super Admin)')
  console.log('  - admin.bloka@iwkrt11.id (Admin Blok A)')
  console.log('  - bendahara.bloka@iwkrt11.id (Bendahara Blok A)')
  console.log('  - gunawan@email.com (Warga Blok A)')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
