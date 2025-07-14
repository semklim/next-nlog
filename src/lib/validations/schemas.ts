/* eslint-disable @typescript-eslint/no-explicit-any */
import {z} from 'zod';

export const createPostSchema = (t: any) => {
  return z.object({
    title: z
      .string()
      .min(1, t('required'))
      .max(100, t('maxLength', {max: '100'})),
    content: z
      .string()
      .min(10, t('minLength', {min: '10'}))
      .max(5000, t('maxLength', {max: '5000'})),
    author: z
      .string()
      .min(1, t('required'))
      .max(50, t('maxLength', {max: '50'})),
    category: z.string().optional()
  });
};

export const createCommentSchema = (t: any) => {
  return z.object({
    author: z
      .string()
      .min(1, t('required'))
      .max(50, t('maxLength', {max: '50'})),
    content: z
      .string()
      .min(1, t('required'))
      .max(500, t('maxLength', {max: '500'}))
  });
};

export const searchSchema = (t: any) => {
  return z.object({
    query: z
      .string()
      .min(1, t('required'))
      .max(100, t('maxLength', {max: '100'})),
    category: z.string().optional()
  });
};

export type CreatePostData = z.infer<ReturnType<typeof createPostSchema>>;
export type CreateCommentData = z.infer<ReturnType<typeof createCommentSchema>>;
export type SearchData = z.infer<ReturnType<typeof searchSchema>>;
