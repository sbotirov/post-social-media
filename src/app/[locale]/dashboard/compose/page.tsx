import PostComposer from '@/components/compose/PostComposer'
import { prisma } from '@/lib/db/prisma'

export default async function ComposePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const draftId = searchParams.draftId as string | undefined
  let draft = null

  if (draftId) {
    draft = await prisma.post.findUnique({
      where: { id: draftId },
      include: {
        channels: true,
        mediaFiles: { orderBy: { sortOrder: 'asc' } },
        poll: true,
      },
    })
  }

  return <PostComposer draft={draft} />
}
