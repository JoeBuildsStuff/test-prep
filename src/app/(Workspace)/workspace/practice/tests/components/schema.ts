import { z } from "zod"

export const TestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().nullable().default(null),
  attempt_num: z.number().int().default(1).nullable(),
  completed_at: z.string().nullable().default(null),
  score: z.number().min(0).max(999.99).nullable(),
  total_questions: z.number().int().min(0).default(0),
  completed_questions: z.number().int().min(0).default(0),
  correct_answers: z.number().int().min(0).default(0),
  wrong_answers: z.number().int().min(0).default(0),
})

export type Test = z.infer<typeof TestSchema>

export const RawTestSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  created_at: z.string().nullable().default(null),
  attempt_num: z.number().int().default(1).nullable(),
  completed_at: z.string().nullable().default(null),
  score: z.number().min(0).max(999.99).nullable(),
  test_prep_test_questions: z.array(z.object({
    question_id: z.string(),
    test_prep_questions_2: z.object({
      section_id: z.number(),
      test_prep_sections: z.object({
        name: z.string()
      })
    })
  })).optional(),
  test_prep_user_responses: z.array(z.object({
    is_correct: z.boolean()
  })).optional(),
})

export type RawTest = z.infer<typeof RawTestSchema>