import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from 'next/navigation'

import { Target, TrendingUp, CheckCircle2, ListChecks } from "lucide-react"

import { DataTable } from "@/app/(Workspace)/[certName]/tests/components/data-table"
import { columns } from "@/app/(Workspace)/[certName]/tests/components/columns"
import { TestSchema, RawTestSchema, Test } from "@/app/(Workspace)/[certName]/tests/components/schema"

// Add interface for user response
interface TestUserResponse {
    is_correct: boolean
}

// Add function to get certification by certName
async function getCertificationByCertName(certName: string) {
  const supabase = await createClient()
  
  // Map certName to certification code
  const certNameToCode: Record<string, string> = {
    'ml-engineer': 'MLA-C01',
    'cloud-practitioner': 'CLF-C02',
    // Add more mappings as needed
  }
  
  const certCode = certNameToCode[certName]
  
  if (!certCode) {
    return null
  }
  
  const { data: certification, error } = await supabase
    .schema('test_prep')
    .from('certifications')
    .select('*')
    .eq('code', certCode)
    .single()
    
  if (error || !certification) {
    return null
  }
  
  return certification
}

export default async function TestsPage({
    params,
    searchParams: searchParamsPromise
}: {
    params: Promise<{ certName: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Await the params and searchParams
    const { certName } = await params
    const searchParams = await searchParamsPromise
    const testId = searchParams.test_id as string | undefined

    // Get certification
    const certification = await getCertificationByCertName(certName)
    
    if (!certification) {
        notFound()
    }

    const supabase = await createClient()

    // Fetch user's tests with questions and responses for the specific certification
    const { data: testsData, error: testsError } = await supabase
        .schema('test_prep')
        .from('tests')
        .select(`
            *,
            test_questions(
                question_id,
                questions_2:question_id(
                    section_id,
                    sections(name)
                )
            ),
            user_responses(is_correct)
        `)
        .eq('certification_id', certification.id)
        .order('created_at', { ascending: false })

    if (testsError) {
        console.error('Error fetching tests:', testsError)
        return <div>Error loading tests</div>
    }

    // Calculate statistics
    const totalTests = testsData?.length || 0
    const completedTests = testsData?.filter(t => t.completed_at)?.length || 0
    const totalQuestions = testsData?.reduce((acc, test) => 
        acc + (test.test_questions?.length || 0), 0) || 0
    const correctAnswers = testsData?.reduce((acc, test) => 
        acc + (test.user_responses?.filter((r: TestUserResponse) => r.is_correct)?.length || 0), 0) || 0

    // Parse and transform the data using Zod, explicitly typing the result as Test[]
    const tests: Test[] = (testsData || []).map((rawTest) => {
        const validatedRawTest = RawTestSchema.parse(rawTest)
        const totalQuestions = validatedRawTest.test_questions?.length || 0
        const responses = validatedRawTest.user_responses || []
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
                <div className="text-sm text-muted-foreground">
                    {certification.provider} - {certification.name}
                </div>
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