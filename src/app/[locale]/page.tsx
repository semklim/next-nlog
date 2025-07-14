import PostList from '@/components/blog/PostList/PostList';
import MainLayout from '@/components/layout/MainLayout';
import { postsService } from '@/lib/firebase/services';
import { generateBlogSchema } from '@/lib/seo/jsonld';
import { generateCategoryMetadata, generateHomeMetadata, generateSearchMetadata } from '@/lib/seo/metadata';
import { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category, search } = await searchParams;
  const t = await getTranslations({ locale });

  // Generate different metadata based on filters
  if (search) {
    return generateSearchMetadata(search, locale, t);
  }

  if (category && category !== 'all') {
    return generateCategoryMetadata(category, locale, t);
  }

  return generateHomeMetadata(locale, t);
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page = '1', category, search } = await searchParams;

  setRequestLocale(locale);

  // Get translations
  const t = await getTranslations();

  // Pagination settings
  const currentPage = parseInt(page) || 1;
  const postsPerPage = 9;

  // Fetch posts server-side with pagination and filters
  const result = await postsService.getPosts(postsPerPage, undefined, {
    category: category && category !== 'all' ? category : undefined,
    searchTerm: search,
  });

  // Generate JSON-LD schemas
  const blogSchema = generateBlogSchema(locale, result.posts);


  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <MainLayout>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('HomePage.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('HomePage.subtitle')}
            </p>
          </div>

          <PostList
            initialPosts={result.posts}
            currentPage={currentPage}
            hasNextPage={result.hasNextPage}
            initialFilters={{
              search: search || '',
              category: category || 'all'
            }}
          />
        </div>
      </MainLayout>
    </>
  );
}
