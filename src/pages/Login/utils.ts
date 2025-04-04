import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>; 