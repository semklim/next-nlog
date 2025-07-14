'use client'

import { Card, CardContent } from '@/components/ui/shadcn/card'
import { Separator } from '@/components/ui/shadcn/separator'
import type { Comment } from '@/types'
import { format } from 'date-fns'
import { enUS, uk } from 'date-fns/locale'
import { CalendarIcon, MessageCircle, UserIcon } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import AddComent from './AddComent'

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const t = useTranslations('Comments');
  const locale = useLocale()
  const fnsLocale = locale === 'uk' ? uk : enUS;
  const [comments, setComments] = useState<Comment[]>(initialComments)


  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <AddComent postId={postId} setComments={setComments} />

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{t('noComments')}</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{comment.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {format(comment.createdAt, 'MMM d, yyyy, HH:mm', { locale: fnsLocale })}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </CardContent>
              </Card>
              {index < comments.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 