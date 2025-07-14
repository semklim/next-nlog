'use server';

import {postsService} from '@/lib/firebase/services';
import type {Post} from '@/types';
import {POSTS_PER_PAGE} from '../firebase/config';

export async function filterPostsAction(
  search: string = '',
  category: string = 'all',
  page: number = 1
): Promise<{
  posts: Post[];
  currentPage: number;
  hasNextPage: boolean;
  filters: {search: string; category: string};
}> {
  try {
    // For pagination, we need to calculate the offset
    // Since Firestore doesn't support offset-based pagination efficiently,
    // we'll use cursor-based pagination with timestamp filtering

    // Prepare filters for Firestore query
    const filters: {
      category?: string;
      searchTerm?: string;
      afterTimestamp?: Date;
    } = {};

    // Add category filter (server-side)
    if (category !== 'all') {
      filters.category = category;
    }

    // Add search filter (will be applied client-side in service)
    if (search.trim()) {
      filters.searchTerm = search.trim();
    }

    // For pagination beyond page 1, we need to get posts from previous pages
    // to find the correct starting point
    let allPosts: Post[] = [];
    let hasNextPage = false;

    if (page === 1) {
      // First page - direct query
      const result = await postsService.getPosts(
        POSTS_PER_PAGE,
        undefined,
        filters
      );
      allPosts = result.posts;
      hasNextPage = result.hasNextPage;
    } else {
      // For subsequent pages, we need to fetch more posts to get the correct page
      // This is a limitation of Firestore's pagination model
      const totalNeeded = page * POSTS_PER_PAGE;
      const result = await postsService.getPosts(
        totalNeeded + 1,
        undefined,
        filters
      );

      // Calculate the start index for the current page
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;

      allPosts = result.posts.slice(startIndex, endIndex);
      hasNextPage = result.posts.length > endIndex;
    }

    return {
      posts: allPosts,
      currentPage: page,
      hasNextPage,
      filters: {search, category}
    };
  } catch (error) {
    console.error('Error filtering posts:', error);
    throw new Error('Failed to filter posts');
  }
}
