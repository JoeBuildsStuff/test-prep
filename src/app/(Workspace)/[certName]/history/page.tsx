import { createClient } from '@/utils/supabase/server'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { UserResponse } from './components/schema'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { notFound } from 'next/navigation'

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

export default async function HistoryPage({
    params,
    searchParams: searchParamsPromise
}: {
    params: Promise<{ certName: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { certName } = await params
    const searchParams = await searchParamsPromise
    
    const section = searchParams.section as string | undefined
    const subsection = searchParams.subsection as string | undefined
    const testId = searchParams.test_id as string | undefined
    const isCorrect = searchParams.is_correct as string | undefined
    const questionId = searchParams.question_id as string | undefined

    // Get certification
    const certification = await getCertificationByCertName(certName)
    
    if (!certification) {
        notFound()
    }

    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
        return <div>Error: User not authenticated</div>
    }

    const { data: userResponses, error } = await supabase
    .schema('test_prep')
    .from('user_responses')
    .select(`
        id,
        user_id,
        question_id,
        selected_answers,
        is_correct,
        attempt_number,
        created_at,
        test_id,
        question:questions!inner (
            title_short,
            certification_id,
            section:sections(name),
            subsection:subsections(id, name)
        )
    `)
    .eq('user_id', user.id)
    .eq('question.certification_id', certification.id)
    .order('id', { ascending: true })
    .returns<Array<UserResponse>>();
  
    if (error) {
        console.error('Error fetching questions:', error)
        return <div>Error fetching questions</div>
    }

    if (!userResponses) {
        return <div>No user responses found</div>
    }

    // Get favorites in a separate query
    //TODO: Is there a way to get the favorites in the same query as the user responses?
    const { data: favorites } = await supabase
    .schema('test_prep')
    .from('user_favorites')
    .select('question_id')
    .eq('user_id', user.id);

    // Combine the data
    const userResponsesWithFavorites = userResponses?.map(response => ({
    ...response,
    favorite: favorites?.some(f => f.question_id === response.question_id) ?? false
    }));

    // Calculate statistics
    const totalResponses = userResponsesWithFavorites?.length || 0
    const correctResponses = userResponsesWithFavorites?.filter(r => r.is_correct).length || 0
    const accuracy = totalResponses ? Math.round((correctResponses / totalResponses) * 100) : 0
    const uniqueQuestions = new Set(userResponsesWithFavorites?.map(r => r.question_id)).size

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Response History</h1>
                <div className="text-sm text-muted-foreground">
                    {certification.provider} - {certification.name}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">Total Responses</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                        <div className="text-2xl font-bold">{totalResponses}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">Unique Questions</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                        <div className="text-2xl font-bold">{uniqueQuestions}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">Correct Answers</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                        <div className="text-2xl font-bold">{correctResponses}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm text-muted-foreground">Accuracy Rate</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 px-4 pb-4">
                        <div className="text-2xl font-bold">{accuracy}%</div>
                    </CardContent>
                </Card>
            </div>

            <DataTable 
                data={userResponsesWithFavorites} 
                columns={columns} 
                initialFilters={[
                    ...(section ? [{
                        id: 'question.section.name',
                        value: [section]
                    }] : []),
                    ...(subsection ? [{
                        id: 'question.subsection.name',
                        value: [subsection]
                    }] : []),
                    ...(testId ? [{
                        id: 'test_id',
                        value: [testId]
                    }] : []),
                    ...(isCorrect ? [{
                        id: 'is_correct',
                        value: [isCorrect === 'true' ? 'true' : 'false']
                    }] : []),
                    ...(questionId ? [{
                        id: 'question_id',
                        value: [questionId]
                    }] : []),
                    ...(searchParams.favorite ? [{
                        id: 'favorite',
                        value: [searchParams.favorite === 'true' ? 'true' : 'false']
                    }] : [])
                ]}
            />
        </div>
    )
}