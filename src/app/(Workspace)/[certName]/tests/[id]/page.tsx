import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { QuestionAttempt } from '../../questions/[id]/question-attempt'
import { TestProgress } from './test-progress'
import { PostgrestError } from '@supabase/supabase-js'

// Add interface definitions
interface TestQuestion {
    id: string
    question: string
    options: Record<string, string>
    correctanswer: string
    explanation: string
    markdown_explanation: string
    type: string
    section: string | null
    subsection: string | null
    tags: string[]
    user_responses: Array<{
        selected_answers: string[]
        is_correct: boolean
    }>
    is_favorited: boolean
}

// Add interface for raw data from Supabase
interface RawTestQuestion {
    id: string
    question: string
    options: Record<string, string>
    correctanswer: string
    explanation: string
    markdown_explanation: string
    type: string
    section: { name: string } | null
    subsection: { name: string } | null
    tags: Array<{ tag: { name: string } }>
    user_responses: Array<{
        selected_answers: string[]
        is_correct: boolean
    }>
    user_favorites: Array<{
        id: string
    }>
}

interface Test {
    id: string
    score: number
        test_questions: Array<{
        order: number
        question_id: string
        questions: RawTestQuestion
    }>
}

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: test, error: testError } = await supabase
    .schema('test_prep')
    .from('tests')
    .select(`
        id,
        score,
        test_questions(
            order, 
            question_id, 
            questions(
                *,
                section:sections(name),
                subsection:subsections(name),
                tags:question_tags(
                    tag:tags(name)
                ),
                user_responses(
                    selected_answers, 
                    is_correct
                ),
                user_favorites(id)
            )
        )
    `)
    .eq('id', id)
    .eq('test_questions.questions.user_responses.test_id', id)
    .single() as { data: Test | null, error: PostgrestError | null }


    if (testError || !test) {
        console.error('Error fetching test:', testError)
        return notFound()
    }

    // Sort questions by order
    const questions = test.test_questions
        .sort((a, b) => a.order - b.order)
        .map(q => {
            const rawQuestion = q.questions as RawTestQuestion
            const question: TestQuestion = {
                ...rawQuestion,
                section: rawQuestion.section?.name || null,
                subsection: rawQuestion.subsection?.name || null,
                tags: rawQuestion.tags?.map(({ tag }) => tag.name) || [],
                user_responses: rawQuestion.user_responses || [],
                is_favorited: (rawQuestion.user_favorites?.length ?? 0) > 0
            }
            return question
        })

    // Calculate attempted count
    const attemptedCount = questions.filter(q => q.user_responses.length > 0).length

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="sticky top-0 bg-background py-4 z-10">
                <TestProgress 
                    totalQuestions={questions.length}
                    attemptedQuestions={attemptedCount}
                    currentScore={test.score}
                />
            </div>
            <div className="grid gap-8">
                {questions.map((question: TestQuestion, index: number) => (
                    <div key={question.id} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Question {index + 1} of {questions.length}
                            </h2>
                        </div>
                        <QuestionAttempt 
                            question={question} 
                            testId={id}
                            previousResponse={question.user_responses[0]}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}