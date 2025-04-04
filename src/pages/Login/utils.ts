import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().nonempty({ message: 'Nome é obrigatório' }),
  password: z.string().nonempty({ message: 'Senha é obrigatória' }).min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;  