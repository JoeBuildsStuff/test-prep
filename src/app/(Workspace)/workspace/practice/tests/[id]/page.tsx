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
    type: string
    section: string | null
    subsection: string | null
    test_prep_user_responses: Array<{
        selected_answers: string[]
        is_correct: boolean
    }>
}

interface Test {
    id: string
    score: number
    test_prep_test_questions: Array<{
        order: number
        question_id: string
        test_prep_questions: TestQuestion & {
            test_prep_user_responses: Array<{
                selected_answers: string[]
                is_correct: boolean
            }>
        }
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
        .from('test_prep_tests')
        .select(`
            id,
            score,
            test_prep_test_questions(
                order, 
                question_id, 
                test_prep_questions(*,
                    test_prep_user_responses(
                        selected_answers, 
                        is_correct
                    )
                )
            )
        `)
        .eq('id', id)
        .single() as { data: Test | null, error: PostgrestError | null }

    if (testError || !test) {
        console.error('Error fetching test:', testError)
        return notFound()
    }

    // Sort questions by order
    const questions = test.test_prep_test_questions
        .sort((a, b) => a.order - b.order)
        .map(q => ({
            ...q.test_prep_questions,
            test_prep_user_responses: q.test_prep_questions.test_prep_user_responses || []
        }))

    // Calculate attempted count
    const attemptedCount = questions.filter(q => q.test_prep_user_responses.length > 0).length

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
                            previousResponse={question.test_prep_user_responses[0]}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}