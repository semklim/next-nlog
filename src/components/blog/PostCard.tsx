'use client'

import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/shadcn/card'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { enUS, uk } from 'date-fns/locale'
import { Calendar, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import messages from '../../../messages/en.json'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const t = useTranslations()
  const locale = useLocale()

  // Format date with appropriate locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const dateLocale = locale === 'uk' ? uk : enUS
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: dateLocale
    })
  }

  // Estimate reading time (average 200 words per minute)
  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {post.category && t(`PostList.categories.${post.category as keyof typeof messages.PostList.categories}`)}
          </Badge>
          <span className="text-xs text-gray-500">
            {t('PostCard.estimatedRead', { minutes: estimateReadingTime(post.content).toString() })}
          </span>
        </div>
        <h3 className="text-lg font-semibold line-clamp-2 hover:text-blue-600 transition-colors">
          <Link href={{
            pathname: '/post/[id]',
            params: {
              id: post.id
            }
          }}>
            {post.title}
          </Link>
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{t('PostCard.by')} {post.author}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={{
            pathname: '/post/[id]',
            params: {
              id: post.id
            }
          }}>
            {t('PostCard.readMore')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 