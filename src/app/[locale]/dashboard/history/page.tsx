'use client'

import { useState, useEffect } from 'react'
import { getPostHistory, deletePost } from '@/app/actions/posts'
import { getChannels } from '@/app/actions/channels'
import { format } from 'date-fns'

const statusColors: Record<string, string> = {
  SENT: 'status-sent',
  FAILED: 'status-failed',
  SCHEDULED: 'status-scheduled',
  DRAFT: 'status-draft',
  SENDING: 'status-sending',
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [search, setSearch] = useState('')
  const [channelId, setChannelId] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    getChannels().then(setChannels)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts()
    }, 500)
    return () => clearTimeout(timer)
  }, [page, search, channelId, status, type])

  async function loadPosts() {
    setLoading(true)
    const filters: any = {}
    if (search) filters.search = search
    if (channelId) filters.channelId = channelId
    if (status) filters.status = status
    if (type) filters.type = type

    const data = await getPostHistory(page, 20, filters)
    setPosts(data.items)
    setTotal(data.totalPages)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post record?')) return
    await deletePost(id)
    loadPosts()
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Post History</h2>
          <p className="text-sm" style={{ color: 'hsl(215 15% 55%)' }}>View and manage past posts</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search text..."
              className="pl-8 py-1.5 text-sm w-40"
            />
          </div>
          
          <select value={channelId} onChange={(e) => setChannelId(e.target.value)} className="py-1.5 text-sm w-32">
            <option value="">All Channels</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="py-1.5 text-sm w-28">
            <option value="">All Status</option>
            <option value="SENT">Sent</option>
            <option value="FAILED">Failed</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading && posts.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: 'hsl(215 15% 55%)' }}>Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center text-sm" style={{ color: 'hsl(215 15% 55%)' }}>No posts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr style={{ background: 'hsl(224 20% 14%)', color: 'hsl(215 15% 55%)' }}>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Content</th>
                  <th className="px-4 py-3 font-medium">Channels</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'hsl(224 15% 20% / 0.5)' }}>
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded bg-white/5 text-xs">{post.type}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {post.text || 'Media/Poll post'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {post.channels.slice(0, 2).map((pc: any) => (
                          <span key={pc.channelId} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px]">
                            {pc.channel.title}
                          </span>
                        ))}
                        {post.channels.length > 2 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px]">+{post.channels.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusColors[post.status] || 'status-draft'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'hsl(215 15% 55%)' }}>
                      {format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(post.id)} className="text-xs hover:opacity-70" style={{ color: 'hsl(0 72% 60%)' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {total > 1 && (
          <div className="p-4 border-t flex items-center justify-between" style={{ borderColor: 'hsl(224 15% 20% / 0.5)' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 hover:bg-white/5"
            >
              Previous
            </button>
            <span className="text-sm" style={{ color: 'hsl(215 15% 55%)' }}>Page {page} of {total}</span>
            <button
              onClick={() => setPage(p => Math.min(total, p + 1))}
              disabled={page === total}
              className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 hover:bg-white/5"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
