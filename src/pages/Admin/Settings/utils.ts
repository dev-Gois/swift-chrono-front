import * as z from "zod"

export const tournamentFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
})

export type TournamentFormValues = z.infer<typeof tournamentFormSchema>