import MainLayout from '@/components/layout/MainLayout'
import { Card } from '@/components/ui/shadcn/card'
import { PostCardSkeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-80 mx-auto animate-pulse" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <PostCardSkeleton />
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
