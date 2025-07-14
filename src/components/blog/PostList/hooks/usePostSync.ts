import {useAppDispatch} from '@/hooks/useAppDispatch';
import {setInitialData} from '@/store/slices/postsSlice';
import {Post} from '@/types';
import {useEffect} from 'react';

export const usePostsSync = (initialData: {
  posts: Post[];
  currentPage: number;
  hasNextPage: boolean;
  filters: {search: string; category: string};
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setInitialData(initialData));
  }, [dispatch, initialData]);
};
