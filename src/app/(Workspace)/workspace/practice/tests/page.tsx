import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { Target, TrendingUp, History, CheckCircle2, ListChecks } from "lucide-react"
import { createNewTest } from '@/actions/test'
import { redirect } from 'next/navigation'

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

export default async function TestsPage() {
    const supabase = await createClient()

    // Fetch user's tests with questions and responses
    const { data: tests, error: testsError } = await supabase
        .from('test_prep_tests')
        .select(`
            *,
            test_prep_test_questions(
                question_id,
                test_prep_questions(section)
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

            {/* Available Tests */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Available Tests</CardTitle>
                        <form action={handleCreateTest}>
                            <Button type="submit" size="sm" variant="secondary">
                                Create New Test
                            </Button>
                        </form>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {tests?.filter(t => !t.completed_at).map((test) => (
                            <Link 
                                key={test.id} 
                                href={`/workspace/practice/tests/${test.id}`}
    
                            >
                                <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50">
                                    <div className="space-y-1">
                                        <div className="font-medium">
                                            Practice Test
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {test.test_prep_test_questions.length} Questions
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        Continue
                                    </Button>
                                </div>
                            </Link>
                        ))}
                        {(!tests || tests.filter(t => !t.completed_at).length === 0) && (
                            <div className="text-center text-muted-foreground">
                                No available tests
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tests?.filter(t => t.completed_at)
                            .slice(0, 5)
                            .map((test) => {
                                const correctAnswers = test.test_prep_user_responses
                                    ?.filter((r: TestUserResponse) => r.is_correct)?.length || 0
                                const totalQuestions = test.test_prep_test_questions?.length || 0
                                const score = ((correctAnswers / totalQuestions) * 100).toFixed(0)
                                
                                return (
                                    <Link 
                                        key={test.id}
                                        href={`/workspace/practice/tests/${test.id}`}
                                    >
                                        <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent">
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    Completed Test
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(test.completed_at!).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Badge>
                                                {score}%
                                            </Badge>
                                        </div>
                                    </Link>
                                )
                            })}
                        {(!tests || tests.filter(t => t.completed_at).length === 0) && (
                            <div className="text-center text-muted-foreground">
                                No completed tests
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Test History */}
            <Card>
                <CardHeader>
                    <CardTitle>Complete Test History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tests?.map((test) => {
                            const correctAnswers = test.test_prep_user_responses
                                ?.filter((r: TestUserResponse) => r.is_correct)?.length || 0
                            const totalQuestions = test.test_prep_test_questions?.length || 0
                            const score = ((correctAnswers / totalQuestions) * 100).toFixed(0)
                            
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