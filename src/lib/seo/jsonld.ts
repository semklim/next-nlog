import type {Post} from '@/types';
import {getBaseUrl} from '@/utils/Helpers';

// Website JSON-LD Schema
export function generateWebsiteSchema(locale: string) {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
    description:
      locale === 'uk'
        ? 'Відкрийте дивовижні історії, ідеї та думки від нашої спільноти письменників.'
        : 'Discover amazing stories, insights, and ideas from our community of writers.',
    url: `${baseUrl}/${locale}`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/${locale}?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    inLanguage: locale === 'uk' ? 'uk-UA' : 'en-US'
  };
}

// Blog JSON-LD Schema
export function generateBlogSchema(locale: string, posts: Post[]) {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
    description:
      locale === 'uk'
        ? 'Колекція блог постів про технології, стиль життя, подорожі та багато іншого.'
        : 'A collection of blog posts about technology, lifestyle, travel, and more.',
    url: `${baseUrl}/${locale}`,
    publisher: {
      '@type': 'Organization',
      name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
      url: baseUrl
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${baseUrl}/${locale}/post/${post.id}`,
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      author: {
        '@type': 'Person',
        name: post.author
      },
      publisher: {
        '@type': 'Organization',
        name: locale === 'uk' ? 'Блог Додаток' : 'Blog App'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/${locale}/post/${post.id}`
      }
    })),
    inLanguage: locale === 'uk' ? 'uk-UA' : 'en-US'
  };
}

// Article JSON-LD Schema
export function generateArticleSchema(post: Post, locale: string) {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [`${baseUrl}/default-post-image.jpg`],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: post.author,
    publisher: {
      '@type': 'Organization',
      name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/${locale}/post/${post.id}`
    },
    articleSection: post.category,
    keywords: post.category,
    wordCount: post.content.split(' ').length,
    articleBody: post.content,
    url: `${baseUrl}/${locale}/post/${post.id}`,
    inLanguage: locale === 'uk' ? 'uk-UA' : 'en-US'
  };
}

// Organization JSON-LD Schema
export function generateOrganizationSchema(locale: string) {
  const baseUrl = getBaseUrl();

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: locale === 'uk' ? 'Блог Додаток' : 'Blog App',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      locale === 'uk'
        ? 'Платформа для обміну історіями, ідеями та думками.'
        : 'A platform for sharing stories, insights, and ideas.',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@blog-app.com'
    },
    sameAs: [
      'https://twitter.com/blogapp',
      'https://facebook.com/blogapp',
      'https://instagram.com/blogapp'
    ]
  };
}
