import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  section: z.string(),
  subsection: z.string(),
  tags: z.string(),
  attempts: z.number(),
  accuracy: z.number(),
})

export type Question = z.infer<typeof QuestionSchema>
