import { routing } from '@/i18n/routing';
import { generateOrganizationSchema, generateWebsiteSchema } from '@/lib/seo/jsonld';
import StoreProvider from '@/store/StoreProvider';
import type { Metadata } from 'next';
import { Locale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './styles.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations('SEO');

  return {
    title: {
      template: `%s | ${t('siteName')}`,
      default: t('defaultTitle'),
    },
    description: t('defaultDescription'),
    keywords: t('keywords'),
    authors: [{ name: t('author') }],
    creator: t('author'),
    publisher: t('siteName'),
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://blog-app.com'),
    alternates: {
      canonical: '/',
      languages: {
        'en': '/en',
        'uk': '/uk',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      siteName: t('siteName'),
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@blogapp',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // Generate JSON-LD schemas
  const websiteSchema = generateWebsiteSchema(locale);
  const organizationSchema = generateOrganizationSchema(locale);

  return (
    <html lang={locale}>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
