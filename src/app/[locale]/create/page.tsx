'use client'

import PostForm from '@/components/blog/PostForm'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CreatePostPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/')
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Posts
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Post</CardTitle>
            <p className="text-gray-600">
              Share your thoughts and ideas with the community
            </p>
          </CardHeader>
          <CardContent>
            <PostForm onSuccess={handleSuccess} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
} 