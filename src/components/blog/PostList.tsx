'use client'

import { Card, CardContent } from '@/components/ui/shadcn/card'
import { Input } from '@/components/ui/shadcn/input'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/shadcn/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select'
import type { Post } from '@/types'
import { Filter, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import PostCard from './PostCard'

interface PostListProps {
  initialPosts: Post[]
  currentPage: number
  hasNextPage: boolean
  nextCursor?: string
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'technology', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Health' },
  { value: 'business', label: 'Business' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' }
]

export default function PostList({ initialPosts, currentPage, hasNextPage, nextCursor }: PostListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

  const currentCategory = searchParams.get('category') || 'all'
  const currentSearch = searchParams.get('search') || ''

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    // Reset to page 1 and remove cursor when filtering
    if ('category' in updates || 'search' in updates) {
      params.delete('page')
      params.delete('cursor')
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams({ search: searchTerm || null })
  }

  const handleCategoryChange = (category: string) => {
    updateSearchParams({ category: category === 'all' ? null : category })
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)

    if (page === 1) {
      params.delete('page')
      params.delete('cursor')
    } else if (page > currentPage && nextCursor) {
      // Going to next page
      params.set('page', page.toString())
      params.set('cursor', nextCursor)
    } else if (page < currentPage) {
      // Going to previous page - we need to remove cursor and recalculate
      params.set('page', page.toString())
      params.delete('cursor')
    }

    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  if (initialPosts.length === 0) {
    return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <Select value={currentCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentSearch || currentCategory !== 'all' ? 'No Posts Found' : 'No Posts Yet'}
            </h3>
            <p className="text-gray-600">
              {currentSearch || currentCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Be the first to create a post!'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Posts Grid */}
      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${isPending ? 'opacity-50' : ''}`}>
        {initialPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {(currentPage > 1 || hasNextPage) && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, currentPage + (hasNextPage ? 1 : 0)) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i
                if (pageNum > currentPage + 2) return null

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageNum)}
                      isActive={pageNum === currentPage}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
} 