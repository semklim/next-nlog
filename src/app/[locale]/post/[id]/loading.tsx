import MainLayout from '@/components/layout/MainLayout'
import { PostDetailSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <MainLayout>
      <PostDetailSkeleton />
    </MainLayout>
  )
}
