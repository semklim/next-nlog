import { Button } from '@/components/ui/shadcn/button'
import { PenIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import LinkComponent from '../ui/LinkComponent'
import LocaleSwitcher from '../ui/LocaleSwitcher'

export default function Header() {
  const t = useTranslations('Navigation')
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <LinkComponent href="/" className="mr-auto text-2xl font-bold">
          {t('blog')}
        </LinkComponent>

        <LocaleSwitcher className='mr-4' />

        <Button asChild>
          <LinkComponent href="/create" className="flex items-center space-x-2" variant="clean">
            <PenIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{t('createPost')}</span>
            <span className="sm:hidden">{t('create')}</span>
          </LinkComponent>
        </Button>
      </nav>
    </header>
  )
} 