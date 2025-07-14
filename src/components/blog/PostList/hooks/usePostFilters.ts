import {useAppDispatch} from '@/hooks/useAppDispatch';
import {filterPosts, setFilters} from '@/store/slices/postsSlice';
import {useRouter} from 'next/navigation';
import {useCallback, useEffect, useState} from 'react';

// Constants
export const DEBOUNCE_DELAY = 300;

export const usePostFilters = (initialFilters: {
  search: string;
  category: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters.category
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchInput);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Update URL
  const updateURL = useCallback(
    (search: string, category: string, page: number) => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'all') params.set('category', category);
      if (page > 1) params.set('page', page.toString());

      router.replace(`?${params.toString()}`, {scroll: false});
    },
    [router]
  );

  // Filter posts
  const filterPostsWithURL = useCallback(
    (search: string, category: string, page: number = 1) => {
      dispatch(setFilters({search, category}));
      dispatch(filterPosts({search, category, page}));
      updateURL(search, category, page);
    },
    [dispatch, updateURL]
  );

  // Handle search form submission
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      filterPostsWithURL(searchInput, selectedCategory, 1);
    },
    [searchInput, selectedCategory, filterPostsWithURL]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      filterPostsWithURL(debouncedSearch, category, 1);
    },
    [debouncedSearch, filterPostsWithURL]
  );

  // Handle debounced search changes
  useEffect(() => {
    if (debouncedSearch !== initialFilters.search) {
      filterPostsWithURL(debouncedSearch, selectedCategory, 1);
    }
  }, [
    debouncedSearch,
    initialFilters.search,
    selectedCategory,
    filterPostsWithURL
  ]);

  return {
    searchInput,
    setSearchInput,
    selectedCategory,
    handleSearchSubmit,
    handleCategoryChange,
    updateURL
  };
};
