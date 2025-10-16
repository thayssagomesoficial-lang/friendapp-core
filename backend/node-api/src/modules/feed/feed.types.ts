import { z } from 'zod';

export const CreatePostSchema = z.object({
  content: z.string().min(1, 'Conteúdo não pode estar vazio').max(5000),
  mediaUrls: z.array(z.string().url()).optional(),
  sensorialTags: z.array(z.enum([
    'visual',
    'auditivo',
    'cinestesico',
    'olfativo',
    'gustativo',
    'energetico',
    'emocional',
  ])).optional(),
  emotionTone: z.enum([
    'alegria',
    'gratidao',
    'amor',
    'paz',
    'inspiracao',
    'reflexao',
    'curiosidade',
    'transformacao',
  ]).optional(),
  visibility: z.enum(['public', 'connections', 'private']).default('public'),
});

export const InteractPostSchema = z.object({
  interactionType: z.enum(['like', 'view', 'share', 'save']),
  durationSeconds: z.number().optional(),
  emotionReaction: z.string().optional(),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type InteractPostInput = z.infer<typeof InteractPostSchema>;

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePicture?: string;
  content: string;
  mediaUrls?: string[];
  sensorialTags?: string[];
  emotionTone?: string;
  frequencyLevel: number;
  visibility: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedItem extends Post {
  relevanceScore: number;
  reasonShown: string;
}
