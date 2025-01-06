import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Target, TrendingUp, History, CheckCircle2, ListChecks } from "lucide-react"
import { createNewTest } from '@/actions/test'
import { redirect } from 'next/navigation'
import { DeleteButton } from "./delete-button"

// Modify the form action to handle the response
const handleCreateTest = async () => {
    'use server'
    const result = await createNewTest()
    if (result.error) {
        throw new Error(result.error)
    }
    if (result.redirect) {
        redirect(result.redirect)
    }
}

// Add interface for user response
interface TestUserResponse {
    is_correct: boolean
}

// Add interface for Test type
interface Test {
    id: string;
    completed_at: string | null;
    created_at: string;
    test_prep_test_questions: Array<{
        question_id: string;
        test_prep_questions_2: {
            section_id: string;
            test_prep_sections: {
                name: string;
            };
        };
    }>;
    test_prep_user_responses: Array<TestUserResponse>;
}

// Update helper function with proper typing
const calculateProgress = (test: Test) => {
    const totalQuestions = test.test_prep_test_questions?.length || 0
    const attemptedQuestions = test.test_prep_user_responses?.length || 0
    const correctAnswers = test.test_prep_user_responses?.filter((r: TestUserResponse) => r.is_correct)?.length || 0
    const accuracy = attemptedQuestions > 0 ? ((correctAnswers / attemptedQuestions) * 100).toFixed(1) : null

    return {
        totalQuestions,
        attemptedQuestions,
        accuracy
    }
}

export default async function TestsPage() {
    const supabase = await createClient()

    // Fetch user's tests with questions and responses
    const { data: tests, error: testsError } = await supabase
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
    const totalTests = tests?.length || 0
    const completedTests = tests?.filter(t => t.completed_at)?.length || 0
    const totalQuestions = tests?.reduce((acc, test) => 
        acc + (test.test_prep_test_questions?.length || 0), 0) || 0
    const correctAnswers = tests?.reduce((acc, test) => 
        acc + (test.test_prep_user_responses?.filter((r: TestUserResponse) => r.is_correct)?.length || 0), 0) || 0

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Practice Tests</h1>
                <form action={handleCreateTest}>
                    <Button type="submit" size="sm" variant="secondary">
                        Create New Test
                    </Button>
                </form>
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



            {/* Test History */}
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Complete Test History</CardTitle>
                    <form action={handleCreateTest}>
                        <Button type="submit" size="sm" variant="secondary">
                            Create New Test
                            </Button>
                        </form>
                    </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tests?.map((test) => {
                            const { totalQuestions, attemptedQuestions, accuracy } = calculateProgress(test)
                            const score = test.completed_at ? ((correctAnswers / totalQuestions) * 100).toFixed(0) : null
                            
                            return (
                                <div
                                    key={test.id}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            {test.completed_at ? 'Completed Test' : 'In Progress'}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <History className="h-4 w-4" />
                                            {new Date(test.created_at).toLocaleDateString()}
                                        </div>
                                        {!test.completed_at && (
                                            <div className="text-sm text-muted-foreground">
                                                Progress: {attemptedQuestions}/{totalQuestions} questions
                                                {accuracy && ` • Accuracy: ${accuracy}%`}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {test.completed_at && (
                                            <Badge>
                                                {score}%
                                            </Badge>
                                        )}
                                        <Link href={`/workspace/practice/tests/${test.id}`}>
                                            <Button variant="outline" size="sm">
                                                {test.completed_at ? 'Review' : 'Continue'}
                                            </Button>
                                        </Link>
                                        <DeleteButton testId={test.id} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}