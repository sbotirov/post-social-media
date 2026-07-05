'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', icon: '📊', label: 'Home' },
  { href: '/dashboard/compose', icon: '✏️', label: 'Post' },
  { href: '/dashboard/channels', icon: '📢', label: 'Channels' },
  { href: '/dashboard/scheduled', icon: '⏰', label: 'Schedule' },
  { href: '/dashboard/history', icon: '📜', label: 'History' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t flex justify-around py-2" style={{ borderColor: 'hsl(224 15% 20% / 0.5)' }}>
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors"
            style={{ color: isActive ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)' }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <div className="w-1 h-1 rounded-full" style={{ background: 'hsl(250 85% 65%)' }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
