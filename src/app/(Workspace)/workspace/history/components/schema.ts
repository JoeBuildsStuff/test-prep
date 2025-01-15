import { z } from "zod"

const SubsectionSchema = z.object({
  id: z.number(),
  name: z.string()
})

const SectionSchema = z.object({
  name: z.string()
})

const QuestionSchema = z.object({
  section: SectionSchema,
  subsection: SubsectionSchema,
  title_short: z.string()
})

export const UserResponseSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  question_id: z.string(),
  selected_answers: z.array(z.string()),
  is_correct: z.boolean(),
  attempt_number: z.number(),
  created_at: z.string(),
  test_id: z.string().nullable(),
  question: QuestionSchema,
  favorite: z.boolean()
})

export type UserResponse = z.infer<typeof UserResponseSchema>
