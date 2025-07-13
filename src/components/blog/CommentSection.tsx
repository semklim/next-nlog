'use client'

import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Input } from '@/components/ui/shadcn/input'
import { Label } from '@/components/ui/shadcn/label'
import { ButtonLoader } from '@/components/ui/shadcn/loader'
import { Separator } from '@/components/ui/shadcn/separator'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { commentsService } from '@/lib/firebase/services'
import { getIsoDate } from '@/lib/firebase/utils/getIsoDate'
import { createCommentSchema, type CreateCommentData } from '@/lib/validations/schemas'
import type { Comment } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CalendarIcon, MessageCircle, UserIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateCommentData>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      author: '',
      content: ''
    }
  })

  const onSubmit = async (data: CreateCommentData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const commentId = await commentsService.createComment({ ...data, postId })
      const newComment: Comment = {
        id: commentId,
        ...data,
        postId,
        createdAt: getIsoDate()
      }

      setComments(prev => [...prev, newComment])
      reset()
    } catch (error) {
      console.error('Failed to create comment:', error)
      setError('Failed to create comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Add a Comment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center p-3 text-red-800 bg-red-50 rounded-lg">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comment-author">Your Name *</Label>
                <Input
                  id="comment-author"
                  placeholder="Enter your name..."
                  {...register('author')}
                  className={errors.author ? 'border-red-500' : ''}
                />
                {errors.author && (
                  <p className="text-sm text-red-600">{errors.author.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment-content">Comment *</Label>
              <Textarea
                id="comment-content"
                placeholder="Share your thoughts..."
                className={`min-h-[100px] ${errors.content ? 'border-red-500' : ''}`}
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <>
                  <ButtonLoader />
                  Posting Comment...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
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
                      {formatDate(comment.createdAt)}
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