'use client'

import { Badge } from '@/components/ui/shadcn/badge'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { Separator } from '@/components/ui/shadcn/separator'
import type { Comment, Post } from '@/types'
import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import CommentSection from './CommentSection'

interface PostDetailProps {
  post: Post
  initialComments: Comment[]
}

export default function PostDetail({ post, initialComments }: PostDetailProps) {

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/" className="flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>
      </Button>

      {/* Post Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{post.author}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <CalendarIcon className="h-3 w-3 mr-1" />
              {format(post.createdAt, 'MMM d, yyyy, HH:mm')}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 mt-4">
            {post.title}
          </CardTitle>
          {post.category && (
            <Badge variant="secondary" className="w-fit">
              {post.category}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
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
            Comments ({initialComments.length})
          </h2>
        </div>

        <CommentSection postId={post.id} initialComments={initialComments} />
      </div>
    </div>
  )
} 