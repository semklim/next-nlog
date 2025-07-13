import {z} from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be less than 5000 characters'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(50, 'Author name must be less than 50 characters'),
  category: z.string().optional()
});

export const createCommentSchema = z.object({
  author: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment must be less than 500 characters')
});

export const editPostSchema = createPostSchema.partial().extend({
  id: z.string().min(1, 'Post ID is required')
});

export const searchSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters'),
  category: z.string().optional()
});

export type CreatePostData = z.infer<typeof createPostSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;
export type EditPostData = z.infer<typeof editPostSchema>;
export type SearchData = z.infer<typeof searchSchema>;
