export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
  category?: string;
}

export interface CreateCommentData {
  author: string;
  content: string;
}

export interface PostsState {
  items: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    searchTerm: string;
  };
}

export interface CommentsState {
  byPostId: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}
