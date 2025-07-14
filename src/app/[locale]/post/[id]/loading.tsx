import MainLayout from '@/components/layout/MainLayout'
import { CommentSkeleton, PostDetailSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <MainLayout>
      <PostDetailSkeleton />
      <CommentSkeleton />
    </MainLayout>
  )
}
