import { z } from 'zod';

export const loginSchema = z.object({
  name: z.string().nonempty({ message: 'Nome é obrigatório' }),
  password: z.string().nonempty({ message: 'Senha é obrigatória' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;