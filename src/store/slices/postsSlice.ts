import {postsService} from '@/lib/firebase/services';
import type {CreatePostData, Post, PostsState} from '@/types';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, {rejectWithValue}) => {
    try {
      return await postsService.getPosts();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch posts'
      );
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id: string, {rejectWithValue}) => {
    try {
      const post = await postsService.getPostById(id);
      if (!post) {
        return rejectWithValue('Post not found');
      }
      return post;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch post'
      );
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData: CreatePostData, {rejectWithValue}) => {
    try {
      const id = await postsService.createPost(postData);
      return {
        id,
        ...postData,
        excerpt:
          postData.content.substring(0, 150) +
          (postData.content.length > 150 ? '...' : ''),
        createdAt: new Date(),
        updatedAt: new Date()
      } as Post;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create post'
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (
    {id, postData}: {id: string; postData: Partial<CreatePostData>},
    {rejectWithValue}
  ) => {
    try {
      await postsService.updatePost(id, postData);
      return {id, ...postData};
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update post'
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, {rejectWithValue}) => {
    try {
      await postsService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete post'
      );
    }
  }
);

export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async (
    {searchTerm, category}: {searchTerm: string; category?: string},
    {rejectWithValue}
  ) => {
    try {
      return await postsService.searchPosts(searchTerm, category);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to search posts'
      );
    }
  }
);

const initialState: PostsState = {
  items: [],
  currentPost: null,
  loading: false,
  error: null,
  filters: {
    category: 'all',
    searchTerm: ''
  }
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = {...state.filters, ...action.payload};
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
            updatedAt: new Date()
          };
        }
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = {
            ...state.currentPost,
            ...action.payload,
            updatedAt: new Date()
          };
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((post) => post.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Search posts
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {setCurrentPost, setFilters, clearError, clearCurrentPost} =
  postsSlice.actions;
export default postsSlice.reducer;
