import PostDetail from '@/components/blog/PostDetail';
import MainLayout from '@/components/layout/MainLayout';
import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: Locale; id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <MainLayout>
      <PostDetail postId={id} />
    </MainLayout>
  );
} 