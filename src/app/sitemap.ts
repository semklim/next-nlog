import {AppPathnames} from '@/i18n/pathnames';
import {routing} from '@/i18n/routing';
import {getI18nPath} from '@/utils/Helpers';
import {MetadataRoute} from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [...getEntries('/')];
}

function getEntries(href: AppPathnames) {
  return routing.locales.map((locale) => ({
    url: getI18nPath(href, locale),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getI18nPath(href, cur)])
      )
    }
  }));
}
