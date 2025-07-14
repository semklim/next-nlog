'use client'

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Locale, useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './shadcn/select';

interface LocaleSwitcherProps {
  className?: string;
}

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(value: string) {
    const nextLocale = value as Locale;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });
  }

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange} disabled={isPending}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={t('label')} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((cur) => (
          <SelectItem value={cur} key={cur}>
            {t('locale', { locale: cur })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  // return (
  //   <LocaleSwitcherSelect defaultValue={locale} label={t('label')} className={className}>
  //     {routing.locales.map((cur) => (
  //       <option key={cur} value={cur}>
  //         {t('locale', { locale: cur })}
  //       </option>
  //     ))}
  //   </LocaleSwitcherSelect>
  // );
}
