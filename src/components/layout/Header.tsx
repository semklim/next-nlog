import { Button } from '@/components/ui/shadcn/button'
import { HomeIcon, PenIcon } from 'lucide-react'
import LinkComponent from '../ui/LinkComponent'
import LocaleSwitcher from '../ui/LocaleSwitcher'

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <LinkComponent href="/" className="text-2xl font-bold">
          My Blog
        </LinkComponent>

        <nav className="hidden md:flex space-x-6">
          <LinkComponent href="/" className="flex items-center space-x-2">
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </LinkComponent>
          <LinkComponent href="/create" className="flex items-center space-x-2">
            <PenIcon className="h-4 w-4" />
            <span>Write</span>
          </LinkComponent>
        </nav>

        <LocaleSwitcher />

        <Button asChild>
          <LinkComponent href="/create" className="flex items-center space-x-2" variant="clean">
            <PenIcon className="h-4 w-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Write</span>
          </LinkComponent>
        </Button>
      </div>
    </header>
  )
} 