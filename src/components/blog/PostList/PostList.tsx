'use client'

import { useAppSelector } from '@/hooks/useAppDispatch'
import type { Post } from '@/types'
import { PostCardSkeleton } from '../../ui/skeleton'
import PostCard from '../PostCard'
import { usePostFilters, usePostPagination, usePostsSync } from './hooks'
import { PostErrorMessage, PostListEmptyState, PostListFilters, PostListPagination } from './ui'

interface PostListProps {
  initialPosts: Post[]
  currentPage: number
  hasNextPage: boolean
  initialFilters: {
    search: string
    category: string
  }
}

export default function PostList({
  initialPosts,
  currentPage: initialCurrentPage,
  hasNextPage: initialHasNextPage,
  initialFilters
}: PostListProps) {

  // Redux state
  const { items: posts, currentPage, hasNextPage, filters, isLoading, error } = useAppSelector(state => state.posts)

  // Custom hooks
  usePostsSync({
    posts: initialPosts,
    currentPage: initialCurrentPage,
    hasNextPage: initialHasNextPage,
    filters: initialFilters
  })

  const {
    searchInput,
    setSearchInput,
    selectedCategory,
    handleSearchSubmit,
    handleCategoryChange,
    updateURL
  } = usePostFilters(initialFilters)

  const { handlePageChange } = usePostPagination(updateURL)

  // Empty state
  if (posts.length === 0 && !isLoading) {
    return (
      <div className="space-y-6">
        {error && <PostErrorMessage error={error} />}
        <PostListFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          selectedCategory={selectedCategory}
          handleSearchSubmit={handleSearchSubmit}
          handleCategoryChange={handleCategoryChange}
          isLoading={isLoading}
        />
        <PostListEmptyState filters={filters} />
      </div>
    )
  }

  // Main render
  return (
    <section className="space-y-6">
      {error && <PostErrorMessage error={error} />}

      <PostListFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        selectedCategory={selectedCategory}
        handleSearchSubmit={handleSearchSubmit}
        handleCategoryChange={handleCategoryChange}
        isLoading={isLoading}
      />

      <div className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${isLoading ? 'opacity-50' : ''}`}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <PostListPagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        handlePageChange={handlePageChange}
      />

      {isLoading && <PostCardSkeleton />}
    </section>
  )
} 