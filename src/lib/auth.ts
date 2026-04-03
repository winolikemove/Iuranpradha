import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from './db'

// Auth configuration for IWK-RT11 Portal

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      profile?: {
        id: string
        namaLengkap: string
        blok: string
        role: string
        status: string
        jabatan: string
        nomorRumah: string
        noTelepon: string
        fotoProfil: string | null
        isSignatory: boolean
      }
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    profile?: {
      id: string
      namaLengkap: string
      blok: string
      role: string
      status: string
      jabatan: string
      nomorRumah: string
      noTelepon: string
      fotoProfil: string | null
      isSignatory: boolean
    }
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan password wajib diisi')
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { profile: true },
        })

        if (!user || !user.password) {
          throw new Error('Email atau password salah')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Email atau password salah')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          profile: user.profile ? {
            id: user.profile.id,
            namaLengkap: user.profile.namaLengkap,
            blok: user.profile.blok,
            role: user.profile.role,
            status: user.profile.status,
            jabatan: user.profile.jabatan,
            nomorRumah: user.profile.nomorRumah,
            noTelepon: user.profile.noTelepon,
            fotoProfil: user.profile.fotoProfil,
            isSignatory: user.profile.isSignatory,
          } : undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.profile = user.profile
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.profile = token.profile
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      // Update last login time or any other tracking
    },
  },
}

// Helper functions for authorization
export type CurrentUser = {
  id: string
  userId: string
  namaLengkap: string
  email: string
  blok: string
  role: string
  status: string
  jabatan: string
  nomorRumah: string
  noTelepon: string
  fotoProfil: string | null
  isSignatory: boolean
}

export async function getCurrentUserFromSession(session: any): Promise<CurrentUser | null> {
  if (!session?.user?.profile) return null
  
  return {
    id: session.user.profile.id,
    userId: session.user.id,
    namaLengkap: session.user.profile.namaLengkap,
    email: session.user.email,
    blok: session.user.profile.blok,
    role: session.user.profile.role,
    status: session.user.profile.status,
    jabatan: session.user.profile.jabatan,
    nomorRumah: session.user.profile.nomorRumah,
    noTelepon: session.user.profile.noTelepon,
    fotoProfil: session.user.profile.fotoProfil,
    isSignatory: session.user.profile.isSignatory,
  }
}

export function canAccessBlok(user: CurrentUser, targetBlok: string): boolean {
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

export function requireRole(user: CurrentUser, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role)
}
