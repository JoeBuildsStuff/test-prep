import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { QuestionAttempt } from '../../questions/[id]/question-attempt'

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
}

interface TestQuestionRelation {
    order: number
    question_id: string
    test_prep_questions: TestQuestion
}

export default async function TestPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Fetch test and its questions
    const { data: test, error: testError } = await supabase
        .from('test_prep_tests')
        .select(`
            *,
            test_prep_test_questions!inner(
                order,
                question_id,
                test_prep_questions(
                    id,
                    question,
                    options,
                    correctanswer,
                    explanation,
                    type,
                    section,
                    subsection
                )
            )
        `)
        .eq('id', params.id)
        .single()

    if (testError || !test) {
        console.error('Error fetching test:', testError)
        return notFound()
    }

    // Sort questions by order
    const questions = test.test_prep_test_questions
        .sort((a: TestQuestionRelation, b: TestQuestionRelation) => a.order - b.order)
        .map((q: TestQuestionRelation) => q.test_prep_questions)

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="grid gap-8">
                {questions.map((question: TestQuestion, index: number) => (
                    <div key={question.id} className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">
                                Question {index + 1} of {questions.length}
                            </h2>
                        </div>
                        <QuestionAttempt question={question} />
                    </div>
                ))}
            </div>
        </div>
    )
}