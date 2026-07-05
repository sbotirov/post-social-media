'use server'

import { signIn } from '@/lib/auth/auth'
import { logAudit } from '@/lib/security/audit'
import { loginLimiter } from '@/lib/security/rate-limiter'

export async function loginAction(
  prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string }> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  // Rate limiting
  const rateCheck = loginLimiter.check(username)
  if (!rateCheck.allowed) {
    await logAudit('auth.rate_limited', { username })
    return { error: 'Too many login attempts. Please try again later.' }
  }

  try {
    await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    await logAudit('auth.login', { username })
    return {}
  } catch {
    await logAudit('auth.login_failed', { username })
    return { error: 'Invalid username or password' }
  }
}
