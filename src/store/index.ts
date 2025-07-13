import {configureStore} from '@reduxjs/toolkit';
import commentsSlice from './slices/commentsSlice';
import postsSlice from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    posts: postsSlice,
    comments: commentsSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
