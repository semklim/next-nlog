/* eslint-disable @typescript-eslint/no-explicit-any */
import type {Post} from '@/types';
import {getBaseUrl} from '@/utils/Helpers';
import type {Metadata} from 'next';

const baseUrl = getBaseUrl();

// Generate homepage metadata
export function generateHomeMetadata(locale: string, t: any): Metadata {
  const title = t('HomePage.meta.title');
  const description = t('HomePage.meta.description');
  const siteName = t('SEO.siteName');

  return {
    title,
    description,
    keywords: t('SEO.keywords'),
    authors: [{name: t('SEO.author')}],
    creator: t('SEO.author'),
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        uk: `${baseUrl}/uk`
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@blogapp',
      images: [`${baseUrl}/og-image.jpg`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Generate post detail metadata
export function generatePostMetadata(
  post: Post,
  locale: string,
  t: any
): Metadata {
  const title = t('PostDetail.meta.title', {title: post.title});
  const description =
    post.excerpt || t('PostDetail.meta.description', {excerpt: post.excerpt});
  const siteName = t('SEO.siteName');
  const postUrl = `${baseUrl}/${locale}/post/${post.id}`;

  return {
    title,
    description,
    authors: [{name: post.author}],
    creator: post.author,
    publisher: siteName,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: postUrl,
      languages: {
        en: `${baseUrl}/en/post/${post.id}`,
        uk: `${baseUrl}/uk/post/${post.id}`
      }
    },
    openGraph: {
      title,
      description,
      url: postUrl,
      siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      images: [
        {
          url: `${baseUrl}/default-post-image.jpg`,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@blogapp',
      images: [`${baseUrl}/default-post-image.jpg`]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Generate create post metadata
export function generateCreatePostMetadata(locale: string, t: any): Metadata {
  const title = t('CreatePost.meta.title');
  const description = t('CreatePost.meta.description');
  const siteName = t('SEO.siteName');

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/create`,
      languages: {
        en: `${baseUrl}/en/create`,
        uk: `${baseUrl}/uk/create`
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/create`,
      siteName,
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website'
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

// Generate category page metadata
export function generateCategoryMetadata(
  category: string,
  locale: string,
  t: any,
  postCount?: number
): Metadata {
  const categoryName = t(`PostList.categories.${category}`);
  const title = `${categoryName} - ${t('SEO.siteName')}`;
  const description = t('PostList.categoryResults', {
    count: postCount || 0,
    category: categoryName
  });

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}?category=${category}`,
      languages: {
        en: `${baseUrl}/en?category=${category}`,
        uk: `${baseUrl}/uk?category=${category}`
      }
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}?category=${category}`,
      siteName: t('SEO.siteName'),
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'website'
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

// Generate search results metadata
export function generateSearchMetadata(
  searchTerm: string,
  locale: string,
  t: any,
  resultCount?: number
): Metadata {
  const title = `"${searchTerm}" - ${t('SEO.siteName')}`;
  const description = t('PostList.filteredResults', {
    count: resultCount || 0,
    total: resultCount || 0,
    search: searchTerm
  });

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}?search=${encodeURIComponent(searchTerm)}`
    },
    robots: {
      index: false, // Don't index search results
      follow: true
    }
  };
}

// Generate author page metadata
export function generateAuthorMetadata(
  authorName: string,
  locale: string,
  t: any,
  postCount?: number
): Metadata {
  const title = `${authorName} - ${t('SEO.siteName')}`;
  const description = `${t('PostCard.by')} ${authorName}. ${postCount || 0} ${t('PostList.showingResults', {count: postCount || 0})}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}/author/${encodeURIComponent(authorName.toLowerCase().replace(/\s+/g, '-'))}`
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/author/${encodeURIComponent(authorName.toLowerCase().replace(/\s+/g, '-'))}`,
      siteName: t('SEO.siteName'),
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      type: 'profile'
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
