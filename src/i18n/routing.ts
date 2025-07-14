import {defineRouting} from 'next-intl/routing';
import {pathnames} from './pathnames';

export const routing = defineRouting({
  locales: ['en', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: pathnames
});
