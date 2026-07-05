import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const username = credentials?.username as string
        const password = credentials?.password as string

        if (!username || !password) return null

        const adminUsername = process.env.ADMIN_USERNAME || 'admin'
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminPasswordHash) {
          // First-time setup: if no hash set, accept 'admin' as default
          if (username === adminUsername && password === 'admin') {
            return { id: '1', name: adminUsername, email: 'admin@telepost.local' }
          }
          return null
        }

        if (username !== adminUsername) return null

        const isValid = await bcryptjs.compare(password, adminPasswordHash)
        if (!isValid) return null

        return { id: '1', name: adminUsername, email: 'admin@telepost.local' }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'telepost-dev-secret-change-in-production',
}
