import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Target, TrendingUp, CheckCircle2, ListChecks } from "lucide-react"

import { DataTable } from "@/app/(Workspace)/workspace/tests/components/data-table"
import { columns } from "@/app/(Workspace)/workspace/tests/components/columns"
import { TestSchema, RawTestSchema, Test } from "@/app/(Workspace)/workspace/tests/components/schema"

// Add interface for user response
interface TestUserResponse {
    is_correct: boolean
}

export default async function TestsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await the searchParams
    const params = await searchParams
    const testId = params.test_id as string | undefined

    const supabase = await createClient()

    // Fetch user's tests with questions and responses
    const { data: testsData, error: testsError } = await supabase
        .from('test_prep_tests')
        .select(`
            *,
            test_prep_test_questions(
                question_id,
                test_prep_questions_2:question_id(
                    section_id,
                    test_prep_sections(name)
                )
            ),
            test_prep_user_responses(is_correct)
        `)
        .order('created_at', { ascending: false })

    if (testsError) {
        console.error('Error fetching tests:', testsError)
        return <div>Error loading tests</div>
    }

    // Calculate statistics
    const totalTests = testsData?.length || 0
    const completedTests = testsData?.filter(t => t.completed_at)?.length || 0
    const totalQuestions = testsData?.reduce((acc, test) => 
        acc + (test.test_prep_test_questions?.length || 0), 0) || 0
    const correctAnswers = testsData?.reduce((acc, test) => 
        acc + (test.test_prep_user_responses?.filter((r: TestUserResponse) => r.is_correct)?.length || 0), 0) || 0

    // Parse and transform the data using Zod, explicitly typing the result as Test[]
    const tests: Test[] = (testsData || []).map((rawTest) => {
        const validatedRawTest = RawTestSchema.parse(rawTest)
        const totalQuestions = validatedRawTest.test_prep_test_questions?.length || 0
        const responses = validatedRawTest.test_prep_user_responses || []
        const completedQuestions = responses.length
        const correctAnswers = responses.filter(r => r.is_correct).length
        const wrongAnswers = completedQuestions - correctAnswers

        return TestSchema.parse({
            ...validatedRawTest,
            total_questions: totalQuestions,
            completed_questions: completedQuestions,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
        })
    })

    return (
        <div className="space-y-6">
                        <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Practice Tests</h1>
            </div>
            {/* Performance Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                {[
                    {
                        title: "Total Tests",
                        value: totalTests,
                        icon: Target,
                    },
                    {
                        title: "Completed Tests",
                        value: completedTests,
                        icon: CheckCircle2,
                    },
                    {
                        title: "Total Questions",
                        value: totalQuestions,
                        icon: ListChecks,
                    },
                    {
                        title: "Correct Answers",
                        value: correctAnswers,
                        icon: TrendingUp,
                    },
                ].map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Test History Table*/}
            <DataTable 
                columns={columns} 
                data={tests} 
                initialFilters={[
                    ...(testId ? [{
                        id: 'id',
                        value: testId
                    }] : [])
                ]}
            />
        </div>
    )
}