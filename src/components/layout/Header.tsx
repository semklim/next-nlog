import { Button } from '@/components/ui/shadcn/button'
import { HomeIcon, PenIcon } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          My Blog
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
            <HomeIcon className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/create" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
            <PenIcon className="h-4 w-4" />
            <span>Write</span>
          </Link>
        </nav>

        <Button asChild>
          <Link href="/create" className="flex items-center space-x-2">
            <PenIcon className="h-4 w-4" />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">Write</span>
          </Link>
        </Button>
      </div>
    </header>
  )
} 