import { Button } from "@/components/ui/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { ButtonLoader } from "@/components/ui/shadcn/loader";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { commentsService } from "@/lib/firebase/services";
import { createCommentSchema } from "@/lib/validations/schemas";
import type { Comment } from '@/types';
import { CreateCommentData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";

interface AddComentProps {
  className?: string;
  postId: string;
  setComments: Dispatch<SetStateAction<Comment[]>>;
}

export default function AddComent({ postId, setComments }: AddComentProps) {
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('Comments');
  const tValidationErrors = useTranslations('ValidationErrors');
  const schema = createCommentSchema(tValidationErrors);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateCommentData>({
    resolver: zodResolver(schema),
    defaultValues: {
      author: '',
      content: ''
    }
  })

  const onSubmit = async (data: CreateCommentData) => {
    try {
      const commentId = await commentsService.createComment({ ...data, postId })
      const newComment: Comment = {
        id: commentId,
        ...data,
        postId,
        createdAt: new Date().toISOString()
      }

      setComments(prev => [...prev, newComment])
      reset()
    } catch (error) {
      console.error('Failed to create comment:', error)
      setError('Failed to create comment. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          {t('addComment')}
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
              <Label htmlFor="comment-author">{t('authorPlaceholder')} *</Label>
              <Input
                id="comment-author"
                placeholder={t('authorPlaceholder')}
                {...register('author')}
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && (
                <p className="text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment-content">{t('commentPlaceholder')} *</Label>
            <Textarea
              id="comment-content"
              placeholder={t('commentPlaceholder')}
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
                {t('submitting')}
              </>
            ) : (
              t('submit')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
