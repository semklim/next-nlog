import PostDetail from '@/components/blog/PostDetail';
import MainLayout from '@/components/layout/MainLayout';
import { commentsService, postsService } from '@/lib/firebase/services';
import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // Fetch post and comments server-side
  const [post, comments] = await Promise.all([
    postsService.getPostById(id),
    commentsService.getCommentsByPostId(id)
  ]);

  if (!post) {
    notFound();
  }

  return (
    <MainLayout>
      <PostDetail post={post} initialComments={comments} locale={locale} />
    </MainLayout>
  );
} 