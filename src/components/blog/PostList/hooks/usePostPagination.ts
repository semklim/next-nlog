import {useAppDispatch, useAppSelector} from '@/hooks/useAppDispatch';
import {paginatePosts} from '@/store/slices/postsSlice';
import {useCallback} from 'react';

export const usePostPagination = (
  updateURL: (search: string, category: string, page: number) => void
) => {
  const dispatch = useAppDispatch();
  const {filters} = useAppSelector((state) => state.posts);

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(paginatePosts(page));
      updateURL(filters.search, filters.category, page);
    },
    [dispatch, filters, updateURL]
  );

  return {handlePageChange};
};
