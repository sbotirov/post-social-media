import { getDashboardStats, getRecentPosts } from '@/app/actions/posts'
import { formatDistanceToNow } from 'date-fns'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  SENT: 'status-sent',
  FAILED: 'status-failed',
  SCHEDULED: 'status-scheduled',
  DRAFT: 'status-draft',
  SENDING: 'status-sending',
}

const typeIcons: Record<string, string> = {
  TEXT: '📝', PHOTO: '🖼️', AUDIO: '🎵', VIDEO: '🎬',
  DOCUMENT: '📄', MEDIA_GROUP: '🖼️', POLL: '📊', TTS: '🔊',
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  const recentPosts = await getRecentPosts(10)
  const t = await getTranslations('Dashboard')

  const statCards = [
    { icon: '📢', label: 'TotalChannels', value: stats.totalChannels, color: 'hsl(210 85% 60%)' },
    { icon: '📝', label: 'PostsToday', value: stats.postsToday, color: 'hsl(145 65% 50%)' },
    { icon: '⏰', label: 'Scheduled', value: stats.scheduledPosts, color: 'hsl(38 95% 55%)' },
    { icon: '📊', label: 'TotalPosts', value: stats.totalPosts, color: 'hsl(250 85% 65%)' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{card.icon}</div>
              <div>
                <p className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</p>
                <p className="text-sm" style={{ color: 'hsl(215 15% 55%)' }}>{t(card.label)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">{t('RecentActivity')}</h3>
        {recentPosts.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'hsl(215 15% 55%)' }}>
            <div className="text-4xl mb-3">📭</div>
            <p>{t('NoPostsYet')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-xl">{typeIcons[post.type] || '📝'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{post.text || `${post.type} post`}</p>
                  <p className="text-xs" style={{ color: 'hsl(215 15% 55%)' }}>
                    {post.channels.map((pc) => pc.channel.title).join(', ')} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[post.status] || 'status-draft'}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
