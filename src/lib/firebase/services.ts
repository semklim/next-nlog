import type {Comment, CreateCommentData, CreatePostData, Post} from '@/types';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where
} from 'firebase/firestore';
import {db} from './config';

// Posts Service
export const postsService = {
  async createPost(postData: CreatePostData): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        excerpt:
          postData.content.substring(0, 150) +
          (postData.content.length > 150 ? '...' : ''),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post');
    }
  },

  async getPosts(
    limitCount: number = 9,
    lastDoc?: DocumentSnapshot,
    filters?: {
      category?: string;
      searchTerm?: string;
      afterTimestamp?: Date;
    }
  ): Promise<{
    posts: Post[];
    hasNextPage: boolean;
    lastDoc?: DocumentSnapshot;
  }> {
    try {
      // Fetch one extra document to check if there's a next page
      const fetchLimit = limitCount + 1;

      let q = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(fetchLimit)
      );

      // Add category filter
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }

      // Add cursor for pagination using timestamp
      if (filters?.afterTimestamp) {
        q = query(q, where('createdAt', '<', filters.afterTimestamp));
      } else if (lastDoc) {
        // Fallback to document cursor if provided
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      let posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
          }) as Post
      );

      // Apply search filter client-side (since Firestore doesn't have full-text search)
      if (filters?.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        posts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower) ||
            post.author.toLowerCase().includes(searchLower)
        );
      }

      // Check if there's a next page
      const hasNextPage = posts.length > limitCount;

      // Remove the extra document if we have one
      if (hasNextPage) {
        posts = posts.slice(0, limitCount);
      }

      // Get the last document for the next page cursor
      const lastDocument =
        posts.length > 0 ? snapshot.docs[posts.length - 1] : undefined;

      return {
        posts,
        hasNextPage,
        lastDoc: lastDocument
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  },

  async getPostById(id: string): Promise<Post | null> {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate().toISOString(),
          updatedAt: data.updatedAt.toDate().toISOString()
        } as Post;
      }
      return null;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  },

  async updatePost(
    id: string,
    postData: Partial<CreatePostData>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'posts', id);
      const updateData: Partial<CreateCommentData> & {
        updatedAt: Date;
        excerpt?: string;
      } = {
        ...postData,
        updatedAt: new Date()
      };

      if (postData.content) {
        updateData.excerpt =
          postData.content.substring(0, 150) +
          (postData.content.length > 150 ? '...' : '');
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  },

  async deletePost(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error('Failed to delete post');
    }
  },

  async searchPosts(searchTerm: string, category?: string): Promise<Post[]> {
    try {
      let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

      if (category && category !== 'all') {
        q = query(q, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString()
          }) as Post
      );

      // Client-side filtering for search term (Firestore doesn't support full-text search)
      if (searchTerm) {
        return posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return posts;
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }
};

// Comments Service
export const commentsService = {
  async createComment(
    commentData: CreateCommentData & {postId: string}
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...commentData,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  },

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString()
          }) as Comment
      );
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  },

  async deleteComment(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'comments', id));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }
};
