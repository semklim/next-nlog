'use client'

import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Separator } from '@/components/ui/shadcn/separator'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { fetchComments } from '@/store/slices/commentsSlice'
import { fetchPostById } from '@/store/slices/postsSlice'
import { getTime } from '@/utils/dateHelper'
import { AlertCircle, ArrowLeft, CalendarIcon, Loader2, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import CommentSection from './CommentSection'

interface PostDetailProps {
  postId: string
}

export default function PostDetail({ postId }: PostDetailProps) {
  const dispatch = useAppDispatch()
  const { currentPost, loading, error } = useAppSelector(state => state.posts)
  const comments = useAppSelector(state => state.comments.byPostId[postId] || [])

  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId))
      dispatch(fetchComments(postId))
    }
  }, [dispatch, postId])

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateObj)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading post...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Post</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchPostById(postId))}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentPost) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Post Not Found</h3>
            <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>
      </Button>

      {/* Post Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {currentPost.category && (
                <Badge variant="secondary">
                  {currentPost.category}
                </Badge>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <CalendarIcon className="h-4 w-4 mr-1" />
                {formatDate(currentPost.createdAt)}
              </div>
            </div>
            {getTime(currentPost.updatedAt) !== getTime(currentPost.createdAt) && (
              <div className="text-sm text-gray-500">
                Updated: {formatDate(currentPost.updatedAt)}
              </div>
            )}
          </div>

          <CardTitle className="text-3xl md:text-4xl leading-tight">
            {currentPost.title}
          </CardTitle>

          <div className="flex items-center text-gray-600 mt-4">
            <UserIcon className="h-4 w-4 mr-2" />
            <span>by {currentPost.author}</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-gray max-w-none">
            {currentPost.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Comments Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Comments ({comments.length})
          </h2>
        </div>

        <CommentSection postId={postId} />
      </div>
    </div>
  )
} 