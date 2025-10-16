import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato: YYYY-MM-DD)'),
  gender: z.string().optional(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  locationCountry: z.string().default('Brasil'),
  bio: z.string().max(500, 'Bio não pode ter mais de 500 caracteres').optional(),
  consciousIntention: z.string().min(10, 'Descreva sua intenção consciente com pelo menos 10 caracteres'),
  seekingConnections: z.array(z.enum([
    'romantic',
    'friendship',
    'professional',
    'spiritual',
    'creative',
    'learning'
  ])).min(1, 'Selecione pelo menos um tipo de conexão'),
});

export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  consciousIntention: z.string().optional(),
  seekingConnections: z.array(z.string()).optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: string;
  gender?: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  bio?: string;
  profilePictureUrl?: string;
  consciousIntention: string;
  seekingConnections: string[];
  frequencyVector?: any;
  personalityType?: string;
  energyProfile?: any;
  trustScore: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
