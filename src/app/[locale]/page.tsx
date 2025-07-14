import PostList from '@/components/blog/PostList';
import MainLayout from '@/components/layout/MainLayout';
import { postsService } from '@/lib/firebase/services';
import { Locale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    cursor?: string; // Add cursor for pagination
  }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page = '1', category, search, cursor } = await searchParams;

  setRequestLocale(locale);

  // Pagination settings
  const currentPage = parseInt(page) || 1;
  const postsPerPage = 9;

  // Decode cursor if present (base64 encoded timestamp)
  let lastDocCursor;
  if (cursor && currentPage > 1) {
    try {
      const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');
      lastDocCursor = new Date(decodedCursor);
    } catch (error) {
      console.error('Invalid cursor:', error);
    }
  }

  // Fetch posts server-side with pagination and filters
  const result = await postsService.getPosts(postsPerPage, undefined, {
    category: category && category !== 'all' ? category : undefined,
    searchTerm: search,
    afterTimestamp: lastDocCursor
  });

  // Create cursor for next page
  let nextCursor;
  if (result.hasNextPage && result.posts.length > 0) {
    const lastPost = result.posts[result.posts.length - 1];
    nextCursor = Buffer.from(lastPost.createdAt).toString('base64');
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to My Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories, insights, and ideas from our community of writers
          </p>
        </div>

        <PostList
          initialPosts={result.posts}
          currentPage={currentPage}
          hasNextPage={result.hasNextPage}
          nextCursor={nextCursor}
        />
      </div>
    </MainLayout>
  );
}
