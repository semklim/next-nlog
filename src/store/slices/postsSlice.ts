import type {Post} from '@/types';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface PostsState {
  items: Post[];
  currentPage: number;
  hasNextPage: boolean;
  filters: {
    search: string;
    category: string;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  currentPage: 1,
  hasNextPage: false,
  filters: {
    search: '',
    category: 'all'
  },
  isLoading: true,
  error: null
};

// Async thunk for filtering posts
export const filterPosts = createAsyncThunk(
  'posts/filter',
  async (params: {search: string; category: string; page: number}) => {
    const {filterPostsAction} = await import('@/lib/actions/postsActions');
    return await filterPostsAction(params.search, params.category, params.page);
  }
);

// Async thunk for pagination
export const paginatePosts = createAsyncThunk(
  'posts/paginate',
  async (page: number, {getState}) => {
    const state = getState() as {posts: PostsState};
    const {search, category} = state.posts.filters;
    const {filterPostsAction} = await import('@/lib/actions/postsActions');
    return await filterPostsAction(search, category, page);
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setInitialData: (
      state,
      action: PayloadAction<{
        posts: Post[];
        currentPage: number;
        hasNextPage: boolean;
        filters: {search: string; category: string};
      }>
    ) => {
      state.items = action.payload.posts;
      state.currentPage = action.payload.currentPage;
      state.hasNextPage = action.payload.hasNextPage;
      state.filters = action.payload.filters;
      state.isLoading = false;
      state.error = null;
    },
    setFilters: (
      state,
      action: PayloadAction<{search: string; category: string}>
    ) => {
      state.filters = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Filter posts
      .addCase(filterPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(filterPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.posts;
        state.currentPage = action.payload.currentPage;
        state.hasNextPage = action.payload.hasNextPage;
        state.filters = action.payload.filters;
      })
      .addCase(filterPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to filter posts';
      })
      // Paginate posts
      .addCase(paginatePosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(paginatePosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.posts;
        state.currentPage = action.payload.currentPage;
        state.hasNextPage = action.payload.hasNextPage;
      })
      .addCase(paginatePosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to paginate posts';
      });
  }
});

export const {setInitialData, setFilters, setLoading, clearError} =
  postsSlice.actions;
export default postsSlice.reducer;
