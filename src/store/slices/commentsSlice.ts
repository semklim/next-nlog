import {commentsService} from '@/lib/firebase/services';
import {getIsoDate} from '@/lib/firebase/utils/getIsoDate';
import type {Comment, CommentsState, CreateCommentData} from '@/types';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId: string, {rejectWithValue}) => {
    try {
      const comments = await commentsService.getCommentsByPostId(postId);
      return {postId, comments};
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch comments'
      );
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (
    commentData: CreateCommentData & {postId: string},
    {rejectWithValue}
  ) => {
    try {
      const id = await commentsService.createComment(commentData);
      return {
        id,
        ...commentData,
        createdAt: getIsoDate()
      } as Comment;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create comment'
      );
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({id, postId}: {id: string; postId: string}, {rejectWithValue}) => {
    try {
      await commentsService.deleteComment(id);
      return {id, postId};
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete comment'
      );
    }
  }
);

const initialState: CommentsState = {
  byPostId: {},
  loading: false,
  error: null
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCommentsByPostId: (state, action) => {
      delete state.byPostId[action.payload];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.byPostId[action.payload.postId] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const {postId} = action.payload;
        if (!state.byPostId[postId]) {
          state.byPostId[postId] = [];
        }
        state.byPostId[postId].unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        const {id, postId} = action.payload;
        if (state.byPostId[postId]) {
          state.byPostId[postId] = state.byPostId[postId].filter(
            (comment) => comment.id !== id
          );
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const {clearError, clearCommentsByPostId} = commentsSlice.actions;
export default commentsSlice.reducer;
