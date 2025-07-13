import { Badge } from '@/components/ui/shadcn/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import type { Post } from '@/types'
import { CalendarIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(dateObj)
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <Link href={`/post/${post.id}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            {post.category && (
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {formatDate(post.createdAt)}
            </div>
          </div>
          <CardTitle className="text-xl line-clamp-2 hover:text-blue-600 transition-colors">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <UserIcon className="h-3 w-3 mr-1" />
            <span>by {post.author}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
} 