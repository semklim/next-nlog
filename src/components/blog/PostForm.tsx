'use client'

import { Button } from '@/components/ui/shadcn/button'
import { Input } from '@/components/ui/shadcn/input'
import { Label } from '@/components/ui/shadcn/label'
import { ButtonLoader } from '@/components/ui/shadcn/loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select'
import { Textarea } from '@/components/ui/shadcn/textarea'
import { postsService } from '@/lib/firebase/services'
import { createPostSchema, type CreatePostData } from '@/lib/validations/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

interface PostFormProps {
  onSuccess?: () => void
}

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Health' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' }
]

export default function PostForm({ onSuccess }: PostFormProps) {
  const t = useTranslations('ValidationErrors');
  const schema = createPostSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isLoading },
    reset,
    setValue,
    watch
  } = useForm<CreatePostData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      author: '',
      category: ''
    }
  })

  const selectedCategory = watch('category')

  const onSubmit = async (data: CreatePostData) => {
    try {
      await postsService.createPost(data)
      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* {errors && (
        <div className="flex items-center p-4 text-red-800 bg-red-50 rounded-lg">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errors.root?.message}</span>
        </div>
      )} */}

      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="Enter an engaging title for your post..."
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author *</Label>
        <Input
          id="author"
          placeholder="Your name..."
          {...register('author')}
          className={errors.author ? 'border-red-500' : ''}
        />
        {errors.author && (
          <p className="text-sm text-red-600">{errors.author.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category (optional)" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          placeholder="Write your blog post content here..."
          className={`min-h-[200px] ${errors.content ? 'border-red-500' : ''}`}
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-red-600">{errors.content.message}</p>
        )}
        <p className="text-sm text-gray-500">
          Minimum 10 characters required
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <ButtonLoader />
              Creating Post...
            </>
          ) : (
            'Create Post'
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting || isLoading}
          className="w-full sm:w-auto"
        >
          Clear Form
        </Button>
      </div>
    </form>
  )
} 